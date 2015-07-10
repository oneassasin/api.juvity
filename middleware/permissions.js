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
    req.pgClient.promiseQuery(query)
      .then(function(results) {
        if (results.rowCount === 0) {
          const error = new Error('Need to authorize');
          error.status = 401;
          return reject(error);
        }

        if ((Date.now() / 1000) >= results.rows[0].expired) {
          const values = {
            expired: 0,
            session: ''
          };
          const query = squel.update()
            .table('juvity.sessions')
            .setFields(values)
            .where('session = ?', results.rows[0].session)
            .toString();
          req.pgClient.promiseQuery(query)
            .then(function(results) {
              const error = new Error('Session expired');
              error.status = 400;
              reject(error);
            });
        } else {
          req.session = {
            userID: results.rows[0].user_id,
            json: JSON.parse(results.rows[0].json)
          };
          resolve(null);
        }
      });
  });
}

module.exports.permissionCheck = function(permission) {
  return function(req, res, next) {
    _authentication(req)
      .then(function(empty) {
        const subQuery = squel.select()
          .field('role_id')
          .from('juvity.users')
          .where('id = ?', req.session.userID);
        const query = squel.select()
          .from('juvity.user_roles')
          .where('id = ?', subQuery)
          .toString();
        return req.pgClient.promiseQuery(query);
      })
      .then(function(results) {
        const bitMask = new BitMask(results.rows[0].bit_mask);
        if (!bitMask.checkBit(permission)) {
          const error = new Error('Permissions denied: ' + bitMask.bitMask());
          error.status = 403;
          return Q.reject(error);
        }

        next();
      })
      .fail(next);
  };
};
