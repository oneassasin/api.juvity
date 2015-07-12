const squel = require('squel');
const escaper = require('../libs/escaper');

module.exports.getLessonsByGroup = function(req, res, next) {
  const groupID = req.sanitize('groupID').escape();
  if (req.validationErrors()) {
    req.closeClient();
    return res.status(400).end();
  }

  const query = squel.select()
    .from('juvity.group_lessons')
    .where('group_id = ?', groupID)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(200).send(results.rows).end();
    })
    .fail(next)
    .fin(req.closeClient);
};

module.exports.addLessonToGroup = function(req, res, next) {
  req.assert('lessonID', 'lesson_id_required').notEmpty();
  if (req.validationErrors()) {
    req.closeClient();
    return res.status(400).end();
  }

  const values = {
    group_id: req.sanitize('groupID').escape(),
    lesson_id: req.sanitize('lessonID').escape()
  };
  const query = squel.insert()
    .into('juvity.group_lessons')
    .setFields(values)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(201).end();
    })
    .fail(function(err) {
      if (err.code === '23505') {
        err = new Error('Duplicate lesson for group');
        err.status = 403;
      }

      next(err);
    })
    .fin(req.closeClient)
};

module.exports.deleteLessonFromGroup = function(req, res, next) {
  const lessonID = req.sanitize('lessonID').escape();
  const groupID = req.sanitize('groupID').escape();
  const query = squel.delete()
    .from('juvity.group_lessons')
    .where('student_id = ?', lessonID)
    .where('group_id = ?', groupID)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(200).end();
    })
    .fail(next)
    .fin(req.closeClient);
};
