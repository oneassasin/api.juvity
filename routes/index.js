const debug = require('debug')('Errors');
const sessionsRouter = require('./sessionsRouter');
const usersRouter = require('./usersRouter');
const userRolesRouter = require('./userRolesRouter');
const universitiesRouter = require('./universitiesRouter');
const institutionsRouter = require('./institutionsRouter');

module.exports = function(app) {

  app.use('/', sessionsRouter);
  app.use('/', usersRouter);
  app.use('/', userRolesRouter);
  app.use('/', universitiesRouter);
  app.use('/', institutionsRouter);

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
