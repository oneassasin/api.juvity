const squel = require('squel');
const escaper = require('../libs/escaper');
const Q = require('q');
const BitMask = require('../libs/BitMask');

module.exports.authentication = function() {
  return function(req, res, next) {
    _authentication(req)
      .then(function(empty) {
        next();
      })
      .fail(next);
  };
};

function _authentication(req) {
  return Q.promise(function(resolve, reject, notify) {
    const SID = escaper.escape(req.cookies.SID);
    if (SID === null) {
      const error = new Error('Need to authenticate');
      error.status = 400;
      return reject(error);
    }

    const query = squel.select()
      .from('juvity.sessions')
      .where('session = ?', SID)
      .toString();
    return req.pgClient.promiseQuery(query)
      .then(function(results) {
        if (results.rowCount === 0) {
          const error = new Error('Need to authorize');
          error.status = 401;
          return reject(error);
        }

        if (Date.now() >= results.rows[0].expired) {
          const values = {
            expired: 0,
            session: ''
          };
          req.pgClient.promiseQuery(query)
            .then(function(results) {
              const error = new Error('Session expired');
              error.status = 400;
              return reject(error);
            });
        }

        req.session = {
          userID: results.rows[0].user_id,
          json: JSON.parse(results.rows[0].json)
        };
        return resolve(null);
      });
  });
}

module.exports.permissionCheck = function(permission) {
  return function(req, res, next) {
    _authentication(req)
      .then(function(empty) {
        const query = squel.select()
          .from('juvity.user_roles')
          .where('id = ?', squel.select().field('role_id').from('juvity.users').where('id = ?', req.session.userID))
          .toString();
        req.pgClient.promiseQuery(query)
          .then(function(results) {
            const bitMask = new BitMask(results.rows[0].bit_mask, 11);
            if (!bitMask.checkBit(permission)) {
              const error = new Error('Permissions denied: ' + bitMask.bitMask());
              error.status = 403;
              return Q.reject(error);
            }

            next();
          });
      })
      .fail(next);
  };
};
