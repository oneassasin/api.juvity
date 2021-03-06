const debug = require('debug')('Errors');

// Routers
const sessionsRouter = require('./sessionsRouter');
const usersRouter = require('./usersRouter');
const userRolesRouter = require('./userRolesRouter');
const universitiesRouter = require('./universitiesRouter');
const institutionsRouter = require('./institutionsRouter');
const facultiesRouter = require('./facultiesRouter');
const departmentsRouter = require('./departmentsRouter');
const teacherRanksRouter = require('./teacherRanksRouter');
const teachersRouter = require('./teachersRouter');
const groupsRouter = require('./groupsRouter');
const studentsRouter = require('./studentsRouter');
const groupStudentsRouter = require('./groupStudentsRouter');
const groupLessonsRouter = require('./groupLessonsRouter');
const lessonNamesRouter = require('./lessonNamesRouter');
const lessonTypesRouter = require('./lessonTypesRouter');
const lessonSchedulesRouter = require('./lessonSchedulesRouter');
const semestersRouter = require('./semestersRouter');
const lessonsRouter = require('./lessonsRouter');
const audacityRouter = require('./audacityRouter');

module.exports = function(app) {

  app.use('/', sessionsRouter);
  app.use('/', usersRouter);
  app.use('/', userRolesRouter);
  app.use('/', universitiesRouter);
  app.use('/', institutionsRouter);
  app.use('/', facultiesRouter);
  app.use('/', departmentsRouter);
  app.use('/', teacherRanksRouter);
  app.use('/', teachersRouter);
  app.use('/', groupsRouter);
  app.use('/', studentsRouter);
  app.use('/', groupStudentsRouter);
  app.use('/', groupLessonsRouter);
  app.use('/', lessonNamesRouter);
  app.use('/', lessonTypesRouter);
  app.use('/', lessonSchedulesRouter);
  app.use('/', semestersRouter);
  app.use('/', lessonsRouter);
  app.use('/', audacityRouter);

  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      debug(err);
      next(err);
    });
  }

  app.use(function(err, req, res, next) {
    res.status(err.status || 500).end();
    if (req.closeClient !== undefined)
      req.closeClient();
  });

};
