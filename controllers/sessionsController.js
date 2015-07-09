const debug = require('debug')('sessionsController');
const squel = require('squel');
const sha1 = require('sha1');
const Q = require('q');
const escaper = require('../libs/escaper');

module.exports.createSession = function (req, res, next) {

};

module.exports.getSessionList = function (req, res, next) {

};

module.exports.deleteSession = function (req, res, next) {
  const values = {
    expired: 0, 
    session: ''
  };
  const query = squel.update({autoQuoteFieldNames: true})
    .table('sessions')
    .setFields(values)
    .where('session = ?', escaper.escape(req.cookie.SID))
    .toString();
  req.promiseQuery(query)
  .then(function(result) {
      res.status(200).end();
    })
  .fail(next)
  .fin(req.endClient);
};

module.exports.deleteSessionID = function (req, res, next) {
  const userID = req.sanitize('userID').escape();
  const values = {
    expired: 0,
    session: ''
  };
  const query = squel.update({autoQuoteFieldNames: true})
    .table('sessions')
    .setFields(values)
    .where('userId = ?', userID)
    .toString();
  req.promiseQuery(query)
    .then(function(result) {
      res.status(200).end();
    })
    .fail(next)
    .fin(req.endClient);
};

module.exports.updateSession = function (req, res, next) {
  const userID = req.sanitize('userID').escape();
  const values = {
    json: req.sanitize('json').escape(),
    expired: req.sanitize('expired').escape()
  };
  escaper.sanitize(values)
    .then(function(values) {
      const query = squel.update({autoQuoteFieldNames: true})
        .table('sessions')
        .setFields(values)
        .where('userId = ?', userID)
        .toString();
      return req.promiseQuery(query);
    })
    .then(function(results) {
      res.status(200).end();
    })
    .fail(next)
    .fin(req.closeClient);
};