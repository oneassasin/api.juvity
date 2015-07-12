const squel = require('squel');
const escaper = require('../libs/escaper');

module.exports.getSemesters = function(req, res, next) {
  const skipInt = parseInt(req.sanitize('skip').escape() || 0);
  var countInt = parseInt(req.sanitize('count').escape() || 25);
  if (countInt > 25)
    countInt = 25;
  const query = squel.select()
    .from('juvity.semesters')
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

module.exports.createSemester = function(req, res, next) {
  req.assert('semesterStart', 'semester_start_required').notEmpty();
  req.assert('semesterEnd', 'semester_end_required').notEmpty();
  if (req.validationErrors()) {
    req.closeClient();
    return res.status(400).end();
  }

  const values = {
    semester_start: req.sanitize('semesterStart').escape(),
    semester_end: req.sanitize('semesterEnd').escape()
  };
  const query = squel.insert()
    .into('juvity.semesters')
    .setFields(values)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(201).end();
    })
    .fail(function(err) {
      if (err.code === '23505') {
        err = new Error('Duplicate semester');
        err.status = 403;
      }

      next(err);
    })
    .fin(req.closeClient)
};

module.exports.updateSemester = function(req, res, next) {
  const semesterID = req.sanitize('semesterID').escape();
  const values = {
    semester_start: req.sanitize('semesterStart').escape(),
    semester_end: req.sanitize('semesterEnd').escape()
  };
  escaper.sanitize(values)
    .then(function(results) {
      const query = squel.update()
        .table('juvity.semesters')
        .setFields(results)
        .where('id = ?', semesterID)
        .toString();
      return req.pgClient.promiseQuery(query);
    })
    .then(function(results) {
      res.status(200).end();
    })
    .fail(next)
    .fin(req.closeClient);
};

module.exports.deleteSemester = function(req, res, next) {
  const semesterID = req.sanitize('semesterID').escape();
  const query = squel.delete()
    .from('juvity.semesters')
    .where('id = ?', semesterID)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(200).end();
    })
    .fail(function(err) {
      if (err.code === '23503') {
        err = new Error('Semester already in use!');
        err.status = 403;
      }

      next(err);
    })
    .fin(req.closeClient);
};
