const config = require('nconf');
const expressValidator = require('express-validator');
const debug = require('debug')('Express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const postgres = require('../middleware/postgres');
const cookieParser = require('cookie-parser');

module.exports = function index(app) {
  app.set('port', config.get('app:port'));

  //if behind a reverse proxy such as Varnish or Nginx
  //app.enable('trust proxy');
  app.disable('x-powered-by');
  app.set('etag', false);
  app.use(morgan('combined'));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json({}));
  app.use(expressValidator());
  app.use(postgres());

  debug('Configuration complete!');
};
