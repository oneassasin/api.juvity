const squel = require('squel');
const escaper = require('../libs/escaper');
const pointer = require('../libs/pointer');

module.exports.getInstitutions = function(req, res, next) {
  const universityID = req.sanitize('universityID').escape();
  const skipInt = parseInt(req.sanitize('skip').escape() || 0);
  var countInt = parseInt(req.sanitize('count').escape() || 25);
  if (countInt > 25)
    countInt = 25;
  const query = squel.select()
    .from('juvity.institutions')
    .limit(countInt)
    .offset(skipInt)
    .where('university_id = ?', universityID)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(200).send(results.rows).end();
    })
    .fail(next)
    .fin(req.closeClient);
};

module.exports.createInstitute = function(req, res, next) {
  const universityID = req.session.universityID;
  req.assert('longitude', 'longitude_required').notEmpty();
  req.assert('latitude', 'latitude_required').notEmpty();
  req.assert('name', 'name_required').notEmpty();
  if (req.validationErrors()) {
    req.closeClient();
    return res.status(400).end();
  }

  const values = {
    name: req.sanitize('name').escape(),
    name_abbr: req.sanitize('nameAbbr').escape(),
    university_id: universityID
  };
  escaper.sanitize(values)
    .then(function(results) {
      const coordinate = pointer.format(req.sanitize('latitude').escape(), req.sanitize('longitude').escape());
      const query = squel.insert()
        .into('juvity.institutions')
        .set('coordinate', coordinate, {
          dontQuote: true
        })
        .setFields(results)
        .toString();
      return req.pgClient.promiseQuery(query);
    })
    .then(function(results) {
      res.status(201).end();
    })
    .fail(function(err) {
      if (err.code === '23505') {
        err = new Error('Duplicate institute');
        err.status = 403;
      }

      next(err);
    })
    .fin(req.closeClient);
};

module.exports.updateInstitute = function(req, res, next) {
  const universityID = req.sanitize('universityID').escape();
  const instituteID = req.sanitize('instituteID').escape();
  const values = {
    name: req.sanitize('name').escape(),
    name_abbr: req.sanitize('nameAbbr').escape()
  };
  escaper.sanitize(values)
    .then(function(results) {
      const coordinate = pointer.format(req.sanitize('latitude').escape(), req.sanitize('longitude').escape());
      const query = squel.update()
        .table('juvity.institutions')
        .set('coordinate', coordinate, {
          dontQuote: true
        })
        .setFields(results)
        .where('id = ?', instituteID)
        .where('university_id = ?', universityID)
        .toString();
      return req.pgClient.promiseQuery(query);
    })
    .then(function(results) {
      res.status(200).end();
    })
    .fail(next)
    .fin(req.closeClient);
};

module.exports.deleteInstitute = function(req, res, next) {
  const universityID = req.sanitize('universityID').escape();
  const instituteID = req.sanitize('instituteID').escape();
  const query = squel.delete()
    .from('juvity.institutions')
    .where('id = ?', instituteID)
    .where('university_id = ?', universityID)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(200).end();
    })
    .fail(function(err) {
      if (err.code === '23503') {
        err = new Error('Institute already in use!');
        err.status = 403;
      }

      next(err);
    })
    .fin(req.closeClient);
};
