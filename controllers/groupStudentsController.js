const squel = require('squel');
const escaper = require('../libs/escaper');

module.exports.getStudentsByGroup = function(req, res, next) {
  const groupID = req.sanitize('groupID').escape();
  if (req.validationErrors()) {
    req.closeClient();
    return res.status(400).end();
  }

  const query = squel.select()
    .from('juvity.group_students')
    .where('group_id = ?', groupID)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(200).send(results.rows).end();
    })
    .fail(next)
    .fin(req.closeClient);
};

module.exports.addStudentToGroup = function(req, res, next) {
  req.assert('studentID', 'student_id_required').notEmpty();
  if (req.validationErrors()) {
    req.closeClient();
    return res.status(400).end();
  }

  const values = {
    group_id: req.sanitize('groupID').escape(),
    student_id: req.sanitize('studentID').escape()
  };
  const query = squel.insert()
    .into('juvity.group_students')
    .setFields(values)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(201).end();
    })
    .fail(function(err) {
      if (err.code === '23505') {
        err = new Error('Duplicate student in group');
        err.status = 403;
      }

      next(err);
    })
    .fin(req.closeClient)
};

module.exports.deleteStudentFromGroup = function(req, res, next) {
  const studentID = req.sanitize('studentID').escape();
  const groupID = req.sanitize('groupID').escape();
  const query = squel.delete()
    .from('juvity.group_students')
    .where('student_id = ?', studentID)
    .where('group_id = ?', groupID)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(200).end();
    })
    .fail(next)
    .fin(req.closeClient);
};
