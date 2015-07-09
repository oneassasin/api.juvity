const nconf = require('nconf');
const pg = require('pg');
const Q = require('q');
const sql = require('debug')('SQL');

module.exports = function pgMiddleware() {
  return function middleware(req, res, next) {
    const client = new pg.Client(nconf.get('database:url'));
    client.connect(function callback(err) {
      if (err)
        return next(err);

      req.closeClient = client.end;

      client.promiseQuery = function(query) {
        return Q.promise(function(resolve, reject, notify) {
          sql(query);
          client.query(query, function(err, results) {
            if (err)
              return reject(err);
            resolve(results);
          });
        });
      };

      req.pgClient = client;
      next();
    });
  };
};
