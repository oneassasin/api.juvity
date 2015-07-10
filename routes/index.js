const debug = require('debug')('Errors');
const sessionsController = require('./sessionsRouter');
const usersController = require('./usersRouter');

module.exports = function(app) {

  app.use('/', sessionsController);
  app.use('/', usersController);

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
