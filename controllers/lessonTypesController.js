const squel = require('squel');
const escaper = require('../libs/escaper');

module.exports.getLessonTypeID = function(req, res, next) {
  req.assert('name', 'name_required').notEmpty();
  if (req.validationErrors()) {
    req.closeClient();
    return res.status(400).end();
  }

  const query = squel.select()
    .from('juvity.lesson_types')
    .where('name = ?', req.sanitize('name').escape())
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      if (results.rowCount === 0)
        return res.status(404).end();
      res.status(200).send(results.rows[0]).end();
    })
    .fail(next)
    .fin(req.closeClient);
};

module.exports.createLessonType = function(req, res, next) {
  req.assert('name', 'name_required').notEmpty();
  if (req.validationErrors()) {
    req.closeClient();
    return res.status(400).end();
  }

  const values = {
    name: req.sanitize('name').escape()
  };
  const query = squel.insert()
    .into('juvity.lesson_types')
    .setFields(results)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(201).end();
    })
    .fail(function(err) {
      if (err.code === '23505') {
        err = new Error('Duplicate lesson type');
        err.status = 403;
      }

      next(err);
    })
    .fin(req.closeClient)
};

module.exports.updateLessonType = function(req, res, next) {
  const lessonTypeID = req.sanitize('lessonTypeID').escape();
  const values = {
    name: req.sanitize('name').escape()
  };
  escaper.sanitize(values)
    .then(function(results) {
      const query = squel.update()
        .table('juvity.lesson_types')
        .setFields(results)
        .where('id = ?', lessonTypeID)
        .toString();
      return req.pgClient.promiseQuery(query);
    })
    .then(function(results) {
      res.status(200).end();
    })
    .fail(next)
    .fin(req.closeClient);
};

module.exports.deleteLessonType = function(req, res, next) {
  const lessonTypeID = req.sanitize('lessonTypeID').escape();
  const query = squel.delete()
    .from('juvity.lesson_types')
    .where('id = ?', lessonTypeID)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(200).end();
    })
    .fail(function(err) {
      if (err.code === '23503') {
        err = new Error('Lesson type already in use!');
        err.status = 403;
      }

      next(err);
    })
    .fin(req.closeClient);
};
