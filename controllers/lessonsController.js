const squel = require('squel');
const escaper = require('../libs/escaper');

module.exports.getLessonID = function(req, res, next) {
  req.assert('teacherID', 'teacher_id_required').notEmpty();
  req.assert('lessonNameID', 'lesson_name_id_required').notEmpty();
  req.assert('lessonScheduleID', 'lesson_schedule_id_required').notEmpty();
  req.assert('lessonTypeID', 'lesson_type_id_required').notEmpty();
  req.assert('semesterID', 'semester_id_required').notEmpty();
  if (req.validationErrors()) {
    req.closeClient();
    return res.status(400).end();
  }

  const query = squel.select()
    .from('juvity.lessons')
    .where('teacher_id = ?', req.sanitize('teacherID').escape())
    .where('lesson_type_id = ?', req.sanitize('lessonTypeID').escape())
    .where('lesson_name_id = ?', req.sanitize('lessonNameID').escape())
    .where('lesson_schedule_id = ?', req.sanitize('lessonScheduleID').escape())
    .where('semester_id = ?', req.sanitize('semesterID').escape())
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

module.exports.createLesson = function(req, res, next) {
  req.assert('teacherID', 'teacher_id_required').notEmpty();
  req.assert('lessonNameID', 'lesson_name_id_required').notEmpty();
  req.assert('lessonScheduleID', 'lesson_schedule_id_required').notEmpty();
  req.assert('lessonTypeID', 'lesson_type_id_required').notEmpty();
  req.assert('semesterID', 'semester_id_required').notEmpty();
  if (req.validationErrors()) {
    req.closeClient();
    return res.status(400).end();
  }

  const values = {
    teacher_id: req.sanitize('teacher_id').escape(),
    semester_id: req.sanitize('semester_id').escape(),
    lesson_type_id: req.sanitize('lesson_type_id').escape(),
    lesson_name_id: req.sanitize('lesson_name_id').escape(),
    lesson_schedule_id: req.sanitize('lesson_schedule_id').escape()
  };
  const query = squel.insert()
    .into('juvity.lessons')
    .setFields(values)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(201).end();
    })
    .fail(function(err) {
      if (err.code === '23505') {
        err = new Error('Duplicate lesson');
        err.status = 403;
      }

      next(err);
    })
    .fin(req.closeClient)
};

module.exports.deleteLesson = function(req, res, next) {
  const lessonID = req.sanitize('lessonID').escape();
  const query = squel.delete()
    .from('juvity.lessons')
    .where('id = ?', lessonID)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(200).end();
    })
    .fail(function(err) {
      if (err.code === '23503') {
        err = new Error('Lesson already in use!');
        err.status = 403;
      }

      next(err);
    })
    .fin(req.closeClient);
};
