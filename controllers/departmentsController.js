const squel = require('squel');
const escaper = require('../libs/escaper');

module.exports.getDepartmentsList = function(req, res, next) {
  const departmentID = req.sanitize('departmentID').escape();
  const skipInt = parseInt(req.sanitize('skip').escape() || 0);
  var countInt = parseInt(req.sanitize('count').escape() || 25);
  if (countInt > 25)
    countInt = 25;
  const query = squel.select()
    .from('juvity.departments')
    .limit(countInt)
    .offset(skipInt)
    .where('faculty_id = ?', departmentID)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(200).send(results.rows).end();
    })
    .fail(next)
    .fin(req.closeClient);
};

module.exports.createDepartment = function(req, res, next) {
  req.assert('name', 'name_required').notEmpty();
  if (req.validationErrors()) {
    req.closeClient();
    return res.status(400).end();
  }

  const facultyId = req.session.facultyID;
  const values = {
    name: req.sanitize('name').escape(),
    name_abbr: req.sanitize('nameAbbr').escape(),
    faculty_id: facultyId
  };
  escaper.sanitize(values)
    .then(function(results) {
      const query = squel.insert()
        .into('juvity.departments')
        .setFields(results)
        .toString();
      return req.pgClient.promiseQuery(query);
    })
    .then(function(results) {
      res.status(201).end();
    })
    .fail(function(err) {
      if (err.code === '23505') {
        err = new Error('Duplicate department');
        err.status = 403;
      }

      next(err);
    })
    .fin(req.closeClient);
};

module.exports.updateDepartment = function(req, res, next) {
  const facultyID = req.sanitize('facultyID').escape();
  const departmentID = req.sanitize('departmentID').escape();
  const values = {
    name: req.sanitize('name').escape(),
    name_abbr: req.sanitize('nameAbbr').escape()
  };
  escaper.sanitize(values)
    .then(function(results) {
      const query = squel.update()
        .table('juvity.departments')
        .setFields(results)
        .where('id = ?', departmentID)
        .where('institute_id = ?', facultyID)
        .toString();
      return req.pgClient.promiseQuery(query);
    })
    .then(function(results) {
      res.status(200).end();
    })
    .fail(next)
    .fin(req.closeClient);
};

module.exports.deleteDepartment = function(req, res, next) {
  const facultyID = req.sanitize('facultyID').escape();
  const departmentID = req.sanitize('departmentID').escape();
  const query = squel.delete()
    .from('juvity.faculties')
    .where('id = ?', departmentID)
    .where('institute_id = ?', facultyID)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(200).end();
    })
    .fail(function(err) {
      if (err.code === '23503') {
        err = new Error('Department already in use!');
        err.status = 403;
      }

      next(err);
    })
    .fin(req.closeClient);
};
