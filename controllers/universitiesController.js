const squel = require('squel');
const escaper = require('../libs/escaper');

module.exports.getUniversities = function(req, res, next) {
  const skipInt = parseInt(req.sanitize('skip').escape() || 0);
  var countInt = parseInt(req.sanitize('count').escape() || 25);
  if (countInt > 25)
    countInt = 25;
  const query = squel.select()
    .from('juvity.universities')
    .limit(countInt)
    .offset(skipInt)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(200).send(results.rows).end();
    })
    .fail(next)
    .fin(req.closeClient);
};

module.exports.createUniversity = function(req, res, next) {
  req.assert('name', 'name_required').notEmpty();
  req.assert('country', 'country_required').notEmpty();
  req.assert('city', 'city_required').notEmpty();
  if (req.validationErrors()) {
    req.closeClient();
    return res.status(400).end();
  }

  const values = {
    name: req.sanitize('name').escape(),
    name_abbr: req.sanitize('nameAbbr').escape(),
    country: req.sanitize('country').escape(),
    city: req.sanitize('city').escape()
  };
  escaper.sanitize(values)
    .then(function(results) {
      const query = squel.insert()
        .into('juvity.universities')
        .setFields(results)
        .toString();
      return req.pgClient.promiseQuery(query);
    })
    .then(function(results) {
      res.status(201).end();
    })
    .fail(function(err) {
      if (err.code === '23505') {
        err = new Error('Duplicate university');
        err.status = 403;
      }

      next(err);
    })
    .fin(req.closeClient);
};

module.exports.updateUniversity = function(req, res, next) {
  const universityId = req.sanitize('universityID').escape();
  const values = {
    name: req.sanitize('name').escape(),
    name_abbr: req.sanitize('nameAbbr').escape(),
    country: req.sanitize('country').escape(),
    city: req.sanitize('city').escape()
  };
  escaper.sanitize(values)
    .then(function(results) {
      const query = squel.update()
        .table('juvity.universities')
        .setFields(results)
        .where('id = ?', universityId)
        .toString();
      return req.pgClient.promiseQuery(query);
    })
    .then(function(results) {
      res.status(200).end();
    })
    .fail(next)
    .fin(req.closeClient);
};

module.exports.deleteUniversity = function(req, res, next) {
  const universityId = req.sanitize('universityID').escape();
  const query = squel.delete()
    .from('juvity.universities')
    .where('id = ?', universityId)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(200).end();
    })
    .fail(function(err) {
      if (err.code === '23503') {
        err = new Error('University already in use!');
        err.status = 403;
      }

      next(err);
    })
    .fin(req.closeClient);
};
