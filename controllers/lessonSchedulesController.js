const squel = require('squel');
const escaper = require('../libs/escaper');

module.exports.getLessonSchedules = function(req, res, next) {
  const skipInt = parseInt(req.sanitize('skip').escape() || 0);
  var countInt = parseInt(req.sanitize('count').escape() || 25);
  if (countInt > 25)
    countInt = 25;
  const query = squel.select()
    .from('juvity.lesson_schedules')
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

module.exports.createLessonSchedule = function(req, res, next) {
  req.assert('numberWeak', 'number_weak_required').notEmpty();
  req.assert('day', 'day_required').notEmpty();
  req.assert('lessonStartTime', 'lesson_start_time_required').notEmpty();
  req.assert('lessonEndTime', 'lesson_end_time_required').notEmpty();
  if (req.validationErrors()) {
    req.closeClient();
    return res.status(400).end();
  }

  const values = {
    number_weak: req.sanitize('numberWeak').escape(),
    day: req.sanitize('day').escape(),
    lesson_start_time: req.sanitize('lessonStartTime').escape(),
    lesson_end_time: req.sanitize('lessonEndTime').escape()
  };
  const query = squel.insert()
    .into('juvity.lesson_schedules')
    .setFields(values)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(201).end();
    })
    .fail(function(err) {
      if (err.code === '23505') {
        err = new Error('Duplicate lesson schedule');
        err.status = 403;
      }

      next(err);
    })
    .fin(req.closeClient)
};

module.exports.deleteLessonSchedule = function(req, res, next) {
  const lessonScheduleID = req.sanitize('lessonScheduleID').escape();
  const query = squel.delete()
    .from('juvity.lesson_schedules')
    .where('id = ?', lessonScheduleID)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(200).end();
    })
    .fail(function(err) {
      if (err.code === '23503') {
        err = new Error('Lesson schedule already in use!');
        err.status = 403;
      }

      next(err);
    })
    .fin(req.closeClient);
};
