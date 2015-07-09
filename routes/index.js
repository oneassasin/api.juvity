const handler = require('debug')('Error handler');
const sessionsController = require('./sessionsController');

module.exports = function (app) {

  app.use('/', sessionsController);

  if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
      handler(err);
      next(err);
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500).end();
  });

};
