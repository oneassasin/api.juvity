const squel = require('squel');
const escaper = require('../libs/escaper');

module.exports.getGroupsList = function(req, res, next) {
  const departmentID = req.sanitize('departmentID').escape();
  const skipInt = parseInt(req.sanitize('skip').escape() || 0);
  var countInt = parseInt(req.sanitize('count').escape() || 25);
  if (countInt > 25)
    countInt = 25;
  const query = squel.select()
    .from('juvity.groups')
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

module.exports.createGroup = function(req, res, next) {
  req.assert('name', 'name_required').notEmpty();
  req.assert('stream_number', 'stream_number_required').notEmpty();
  req.assert('acquisition_year', 'acquisition_year_required').notEmpty();
  if (req.validationErrors()) {
    req.closeClient();
    return res.status(400).end();
  }

  const departmentId = req.session.departmentID;
  const values = {
    name: req.sanitize('name').escape(),
    name_abbr: req.sanitize('nameAbbr').escape(),
    stream_number: req.sanitize('streamNumber').escape(),
    acquisition_year: req.sanitize('acquisitionYear').escape(),
    department_id: departmentId
  };
  escaper.sanitize(values)
    .then(function(results) {
      const query = squel.insert()
        .into('juvity.groups')
        .setFields(results)
        .toString();
      return req.pgClient.promiseQuery(query);
    })
    .then(function(results) {
      res.status(201).end();
    })
    .fail(function(err) {
      if (err.code === '23505') {
        err = new Error('Duplicate group');
        err.status = 403;
      }

      next(err);
    })
    .fin(req.closeClient);
};

module.exports.updateGroup = function(req, res, next) {
  const departmentID = req.sanitize('departmentID').escape();
  const groupID = req.sanitize('groupID').escape();
  const values = {
    name: req.sanitize('name').escape(),
    name_abbr: req.sanitize('nameAbbr').escape(),
    stream_number: req.sanitize('streamNumber').escape(),
    acquisition_year: req.sanitize('acquisitionYear').escape(),
    department_id: departmentID
  };
  escaper.sanitize(values)
    .then(function(results) {
      const query = squel.update()
        .table('juvity.groups')
        .setFields(results)
        .where('id = ?', groupID)
        .where('department_id = ?', departmentID)
        .toString();
      return req.pgClient.promiseQuery(query);
    })
    .then(function(results) {
      res.status(200).end();
    })
    .fail(next)
    .fin(req.closeClient);
};

module.exports.deleteGroup = function(req, res, next) {
  const departmentID = req.sanitize('departmentID').escape();
  const groupID = req.sanitize('groupID').escape();
  const query = squel.delete()
    .from('juvity.groups')
    .where('id = ?', groupID)
    .where('department_id = ?', departmentID)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(200).end();
    })
    .fail(function(err) {
      if (err.code === '23503') {
        err = new Error('Group already in use!');
        err.status = 403;
      }

      next(err);
    })
    .fin(req.closeClient);
};
