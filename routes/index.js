const debug = require('debug')('Errors');
const sessionsRouter = require('./sessionsRouter');
const usersRouter = require('./usersRouter');
const userRolesRouter = require('./userRolesRouter');

module.exports = function(app) {

  app.use('/', sessionsRouter);
  app.use('/', usersRouter);
  app.use('/', userRolesRouter);

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
