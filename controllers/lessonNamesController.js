const squel = require('squel');
const escaper = require('../libs/escaper');

module.exports.getLessonNameID = function(req, res, next) {
  req.assert('name', 'name_required').notEmpty();
  if (req.validationErrors()) {
    req.closeClient();
    return res.status(400).end();
  }

  const query = squel.select()
    .from('juvity.lesson_names')
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

module.exports.createLessonName = function(req, res, next) {
  req.assert('name', 'name_required').notEmpty();
  if (req.validationErrors()) {
    req.closeClient();
    return res.status(400).end();
  }

  const values = {
    name: req.sanitize('name').escape(),
    name_abbr: req.sanitize('nameAbbr').escape()
  };
  escaper.sanitize(values)
    .then(function(results) {
      const query = squel.insert()
        .into('juvity.lesson_names')
        .setFields(results)
        .toString();
      return req.pgClient.promiseQuery(query);
    })
    .then(function(results) {
      res.status(201).end();
    })
    .fail(function(err) {
      if (err.code === '23505') {
        err = new Error('Duplicate lesson name');
        err.status = 403;
      }

      next(err);
    })
    .fin(req.closeClient)
};

module.exports.updateLessonName = function(req, res, next) {
  const lessonNameID = req.sanitize('lessonNameID').escape();
  const values = {
    name: req.sanitize('name').escape(),
    name_abbr: req.sanitize('nameAbbr').escape()
  };
  escaper.sanitize(values)
    .then(function(results) {
      const query = squel.update()
        .table('juvity.lesson_names')
        .setFields(results)
        .where('id = ?', lessonNameID)
        .toString();
      return req.pgClient.promiseQuery(query);
    })
    .then(function(results) {
      res.status(200).end();
    })
    .fail(next)
    .fin(req.closeClient);
};

module.exports.deleteLessonName = function(req, res, next) {
  const lessonNameID = req.sanitize('lessonNameID').escape();
  const query = squel.delete()
    .from('juvity.lesson_names')
    .where('id = ?', lessonNameID)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(200).end();
    })
    .fail(function(err) {
      if (err.code === '23503') {
        err = new Error('Lesson name already in use!');
        err.status = 403;
      }

      next(err);
    })
    .fin(req.closeClient);
};

