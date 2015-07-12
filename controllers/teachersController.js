const squel = require('squel');
const escaper = require('../libs/escaper');

module.exports.getTeachersList = function(req, res, next) {
  const departmentID = req.sanitize('departmentID').escape();
  const skipInt = parseInt(req.sanitize('skip').escape() || 0);
  var countInt = parseInt(req.sanitize('count').escape() || 25);
  if (countInt > 25)
    countInt = 25;
  const query = squel.select()
    .from('juvity.teachers')
    .limit(countInt)
    .offset(skipInt)
    .where('department_id = ?', departmentID)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(200).send(results.rows).end();
    })
    .fail(next)
    .fin(req.closeClient);
};

module.exports.createTeacher = function(req, res, next) {
  req.assert('name', 'name_required').notEmpty();
  req.assert('name', 'name_required').notEmpty();
  req.assert('patronymic', 'patronymic_required').notEmpty();
  req.assert('surname', 'surname_required').notEmpty();
  if (req.validationErrors()) {
    req.closeClient();
    return res.status(400).end();
  }

  const departmentId = req.session.departmentID;
  const values = {
    name: req.sanitize('name').escape(),
    surname: req.sanitize('surname').escape(),
    patronymic: req.sanitize('patronymic').escape(),
    rank_id: req.sanitize('rankID').escape(),
    department_id: departmentId
  };
  escaper.sanitize(values)
    .then(function(results) {
      const query = squel.insert()
        .into('juvity.teachers')
        .setFields(results)
        .toString();
      return req.pgClient.promiseQuery(query);
    })
    .then(function(results) {
      res.status(201).end();
    })
    .fail(function(err) {
      if (err.code === '23505') {
        err = new Error('Duplicate teacher');
        err.status = 403;
      }

      next(err);
    })
    .fin(req.closeClient);
};

module.exports.updateTeacher = function(req, res, next) {
  const departmentIDQuery = req.sanitizeQuery('departmentID').escape();
  const teacherID = req.sanitize('teacherID').escape();
  const values = {
    name: req.sanitize('name').escape(),
    surname: req.sanitize('surname').escape(),
    patronymic: req.sanitize('patronymic').escape(),
    rank_id: req.sanitize('rankID').escape(),
    department_id: req.sanitizeBody('departmentID').escape()
  };
  escaper.sanitize(values)
    .then(function(results) {
      const query = squel.update()
        .table('juvity.teachers')
        .setFields(results)
        .where('id = ?', teacherID)
        .where('department_id = ?', departmentIDQuery)
        .toString();
      return req.pgClient.promiseQuery(query);
    })
    .then(function(results) {
      res.status(200).end();
    })
    .fail(next)
    .fin(req.closeClient);
};

module.exports.deleteTeacher = function(req, res, next) {
  const departmentID = req.sanitize('departmentID').escape();
  const teacherID = req.sanitize('teacherID').escape();
  const query = squel.delete()
    .from('juvity.teachers')
    .where('id = ?', teacherID)
    .where('department_id = ?', departmentID)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(200).end();
    })
    .fail(function(err) {
      if (err.code === '23503') {
        err = new Error('Teacher already in use!');
        err.status = 403;
      }

      next(err);
    })
    .fin(req.closeClient);
};
