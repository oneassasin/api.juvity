const squel = require('squel');
const sha1 = require('sha1');
const Q = require('q');
const escaper = require('../libs/escaper');

module.exports.createSession = function(req, res, next) {
  const randomizer = require('../libs/randomizer');
  const nconf = require('nconf');

  req.assert('email', 'email_required').notEmpty();
  req.assert('password', 'password_required').notEmpty();
  if (req.validationErrors()) {
    req.closeClient();
    return res.status(400).end();
  }

  const email = req.sanitize('email').escape();
  const hashPassword = sha1(req.sanitize('password').escape());

  const query = squel.select()
    .from('juvity.users')
    .where('email = ?', email)
    .where('hash_password = ?', hashPassword)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      if (results.rowCount === 0) {
        const error = new Error();
        error.status = 404;
        return Q.reject(error);
      }

      req.session = {
        userId: results.rows[0].id
      };
      const query = squel.select()
        .from('juvity.sessions')
        .where('user_id = ?', req.session.userId)
        .toString();
      return req.pgClient.promiseQuery(query);
    })
    .then(function(results) {
      const SID = sha1(new Date().getTime() + req.session.userId + randomizer.randomString(6));
      const expiredTime = Date.now() + parseInt(nconf.get('session:expiredTime'));
      req.session.SID = SID;
      const values = {
        user_id: escaper.escape(req.session.userId),
        expired: expiredTime,
        session: SID
      };
      if (results.rowCount === 0) {
        const query = squel.insert()
          .into('juvity.sessions')
          .setFields(values)
          .toString();
        return req.pgClient.promiseQuery(query);
      }

      const updateQuery = squel.update()
        .table('juvity.sessions')
        .setFields(values)
        .where('session = ?', results.rows[0].session)
        .toString();
      return req.pgClient.promiseQuery(updateQuery);
    })
    .then(function(results) {
      res.cookie('SID', req.session.SID, {}).status(200).end();
    })
    .fail(next)
    .fin(req.closeClient);
};

module.exports.getSessionList = function(req, res, next) {
  const skipInt = parseInt(req.sanitize('skip').escape() || 0);
  var countInt = parseInt(req.sanitize('count').escape() || 25);
  if (countInt > 25)
    countInt = 25;
  var query = squel.select()
    .from('juvity.sessions')
    .limit(countInt)
    .offset(skipInt)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(200).send(results.rows).end();
    })
    .fail(next)
    .fin(req.closeClient);
};

module.exports.deleteSession = function(req, res, next) {
  const values = {
    expired: 0,
    session: ''
  };
  const query = squel.update()
    .table('juvity.sessions')
    .setFields(values)
    .where('session = ?', escaper.escape(req.cookies.SID))
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(result) {
      res.clearCookie('SID', {}).status(200).end();
    })
    .fail(next)
    .fin(req.closeClient);
};

module.exports.deleteSessionID = function(req, res, next) {
  const userID = req.sanitize('userID').escape();
  const values = {
    expired: 0,
    session: ''
  };
  const query = squel.update()
    .table('juvity.sessions')
    .setFields(values)
    .where('user_id = ?', userID)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(result) {
      res.status(200).end();
    })
    .fail(next)
    .fin(req.closeClient);
};

module.exports.updateSession = function(req, res, next) {
  const userID = req.sanitize('userID').escape();
  const values = {
    json: escaper.validateJSON(req.sanitize('json').toString()),
    expired: req.sanitize('expired').toString()
  };
  escaper.sanitize(values)
    .then(function(values) {
      const query = squel.update()
        .table('juvity.sessions')
        .setFields(values)
        .where('user_id = ?', userID)
        .toString();
      return req.pgClient.promiseQuery(query);
    })
    .then(function(results) {
      res.status(200).end();
    })
    .fail(next)
    .fin(req.closeClient);
};
