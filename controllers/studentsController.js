const squel = require('squel');
const escaper = require('../libs/escaper');

module.exports.getStudents = function(req, res, next) {
  req.assert('name', 'name_required').notEmpty();
  req.assert('surname', 'surname_required').notEmpty();
  req.assert('patronymic', 'patronymic_required').notEmpty();
  if (req.validationErrors()) {
    req.closeClient();
    return res.status(400).end();
  }

  const query = squel.select()
    .from('juvity.students')
    .where('name = ?', req.sanitize('name').escape())
    .where('surname = ?', req.sanitize('surname').escape())
    .where('patronymic = ?', req.sanitize('patronymic').escape())
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(200).send(results.rows).end();
    })
    .fail(next)
    .fin(req.closeClient);
};

module.exports.createStudent = function(req, res, next) {
  req.assert('name', 'name_required').notEmpty();
  req.assert('surname', 'surname_required').notEmpty();
  req.assert('patronymic', 'patronymic_required').notEmpty();
  req.assert('bornDay', 'born_day_required').notEmpty();
  if (req.validationErrors()) {
    req.closeClient();
    return res.status(400).end();
  }

  const values = {
    name: req.sanitize('name').escape(),
    surname: req.sanitize('surname').escape(),
    patronymic: req.sanitize('patronymic').escape(),
    born_day: req.sanitize('bornDay').escape()
  };
  const query = squel.insert()
    .into('juvity.students')
    .setFields(values)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(201).end();
    })
    .fail(function(err) {
      if (err.code === '23505') {
        err = new Error('Duplicate student');
        err.status = 403;
      }

      next(err);
    })
    .fin(req.closeClient)
};

module.exports.updateStudent = function(req, res, next) {
  const studentID = req.sanitize('studentID').escape();
  const values = {
    name: req.sanitize('name').escape(),
    surname: req.sanitize('surname').escape(),
    patronymic: req.sanitize('patronymic').escape(),
    born_day: req.sanitize('bornDay').escape()
  };
  escaper.sanitize(values)
    .then(function(results) {
      const query = squel.update()
        .table('juvity.students')
        .setFields(results)
        .where('id = ?', studentID)
        .toString();
      return req.pgClient.promiseQuery(query);
    })
    .then(function(results) {
      res.status(200).end();
    })
    .fail(next)
    .fin(req.closeClient);
};

module.exports.deleteStudent = function(req, res, next) {
  const studentID = req.sanitize('studentID').escape();
  const query = squel.delete()
    .from('juvity.students')
    .where('id = ?', studentID)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(200).end();
    })
    .fail(function(err) {
      if (err.code === '23503') {
        err = new Error('Student already in use!');
        err.status = 403;
      }

      next(err);
    })
    .fin(req.closeClient);
};

