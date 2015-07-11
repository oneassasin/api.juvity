const squel = require('squel');
const escaper = require('../libs/escaper');

module.exports.getFacultiesList = function(req, res, next) {
  const instituteID = req.sanitize('instituteID').escape();
  const skipInt = parseInt(req.sanitize('skip').escape() || 0);
  var countInt = parseInt(req.sanitize('count').escape() || 25);
  if (countInt > 25)
    countInt = 25;
  const query = squel.select()
    .from('juvity.faculties')
    .limit(countInt)
    .offset(skipInt)
    .where('institute_id = ?', instituteID)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(200).send(results.rows).end();
    })
    .fail(next)
    .fin(req.closeClient);
};

module.exports.createFaculty = function(req, res, next) {
  req.assert('name', 'name_required').notEmpty();
  if (req.validationErrors()) {
    req.closeClient();
    return res.status(400).end();
  }

  const instituteId = req.sanitize('instituteID').escape();
  const values = {
    name: req.sanitize('name').escape(),
    name_abbr: req.sanitize('nameAbbr').escape(),
    institute_id: instituteId
  };
  escaper.sanitize(values)
    .then(function(results) {
      const query = squel.insert()
        .into('juvity.faculties')
        .setFields(results)
        .toString();
      return req.pgClient.promiseQuery(query);
    })
    .then(function(results) {
      res.status(201).end();
    })
    .fail(function(err) {
      if (err.code === '23505') {
        err = new Error('Duplicate faculty');
        err.status = 403;
      }

      next(err);
    })
    .fin(req.closeClient);
};

module.exports.updateFaculty = function(req, res, next) {
  const instituteID = req.sanitize('instituteID').escape();
  const facultyID = req.sanitize('facultyID').escape();
  const values = {
    name: req.sanitize('name').escape(),
    name_abbr: req.sanitize('nameAbbr').escape()
  };
  escaper.sanitize(values)
    .then(function(results) {
      const query = squel.update()
        .table('juvity.faculties')
        .setFields(results)
        .where('id = ?', facultyID)
        .where('institute_id = ?', instituteID)
        .toString();
      return req.pgClient.promiseQuery(query);
    })
    .then(function(results) {
      res.status(200).end();
    })
    .fail(next)
    .fin(req.closeClient);
};

module.exports.deleteFaculty = function(req, res, next) {
  const instituteID = req.sanitize('instituteID').escape();
  const facultyID = req.sanitize('facultyID').escape();
  const query = squel.delete()
    .from('juvity.faculties')
    .where('id = ?', facultyID)
    .where('institute_id = ?', instituteID)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(200).end();
    })
    .fail(function(err) {
      if (err.code === '23503') {
        err = new Error('Faculty already in use!');
        err.status = 403;
      }

      next(err);
    })
    .fin(req.closeClient);
};
