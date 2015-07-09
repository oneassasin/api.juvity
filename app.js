const config = require('nconf');
const express = require('express');
const http = require('http');
const debug = require('debug')('Application');
const app = express();

config.argv()
  .env()
  .file({file: './config.json'});

// Boot server
require('./boot/index')(app);

// Routing
require('./routes/index')(app);

http.createServer(app).listen(app.get('port'), function() {
  debug('Express server listening on port ' + app.get('port'));
});

process.on('SIGINT', function() {
  debug('Server is stopped');
  process.exit()
});
