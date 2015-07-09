const squel = require('squel');
const escaper = require('../libs/escaper');
const Q = require('q');

module.exports.authentication = function() {
  return function(req, res, next) {
    const SID = escaper.escape(req.cookies.SID);
    if (SID === null) {
      const error = new Error('Need to authenticate');
      error.status = 400;
      return next(error);
    }

    const query = squel.select()
      .from('juvity.sessions')
      .where('session = ?', SID)
      .toString();
    req.pgClient.promiseQuery(query)
      .then(function(results) {
        if (results.rowCount === 0) {
          const error = new Error();
          error.status = 401;
          return Q.reject(error);
        }

        if (Date.now() >= results.rows[0].expired) {
          const values = {
            expired: 0,
            session: ''
          };
          const query = squel.update()
            .table('juvity.sessions')
            .setFields(values)
            .where('session = ?', SID)
            .toString();
          return req.pgClient.promiseQuery(query)
            .then(function(results) {
              const error = new Error();
              error.status = 400;
              return Q.reject(error);
            });
        }

        req.session = {
          userID: results.rows[0].user_id,
          json: JSON.parse(results.rows[0].json)
        };
        next();
      })
      .fail(next);
  };
};
