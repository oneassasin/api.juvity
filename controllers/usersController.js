const squel = require('squel');
const sha1 = require('sha1');
const Q = require('q');
const escaper = require('../libs/escaper');

module.exports.getUsersCount = function(req, res, next) {
  const query = squel.select()
    .from('juvity.users')
    .field('COUNT(id)', 'usersCount', {
      dontQuote: true
    })
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(200).send(results.rows[0]).end();
    })
    .fail(next)
    .fin(req.closeClient);
};

module.exports.getUserId = function(req, res, next) {
  const userID = req.sanitize('userID').escape();
  const fields = [
    'id', 'role_id',
    'name', 'surname', 'patronymic',
    'gender', 'registration_time'
  ];
  const query = squel.select()
    .from('juvity.users')
    .fields(fields)
    .where('id = ?', userID)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      if (results.rowCount === 0) {
        const error = new Error('User not found');
        error.status = 404;
        return Q.reject(error);
      }

      res.status(200).send(results.rows[0]).end();
    })
    .fail(next)
    .fin(req.closeClient);
};

module.exports.getUsersList = function(req, res, next) {
  const skipInt = parseInt(req.sanitize('skip').escape() || 0);
  var countInt = parseInt(req.sanitize('count').escape() || 25);
  if (countInt > 25)
    countInt = 25;
  const fields = [
    'id', 'role_id',
    'name', 'surname', 'patronymic',
    'gender', 'registration_time'
  ];
  const query = squel.select()
    .from('juvity.users')
    .fields(fields)
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

module.exports.createUser = function(req, res, next) {
};

module.exports.updateUser = function(req, res, next) {
  const values = {
    email: req.sanitize('email').escape(),
    password: req.sanitize('password').escape(),
    name: req.sanitize('name').escape(),
    surname: req.sanitize('surname').escape(),
    patronymic: req.sanitize('patronymic').escape(),
    role: req.sanitize('role').escape(),
    gender: req.sanitize('gender').escape()
  };
  escaper.sanitize(values)
    .then(function(results) {
      const query = squel.update()
        .table('juvity.users')
        .setFields(results)
        .where('id = ?', req.session.userID)
        .toString();
      return req.pgClient.promiseQuery(query);
    })
    .then(function(results) {
      res.status(200).end();
    })
    .fail(next)
    .fin(req.closeClient);
};

module.exports.updateUserId = function(req, res, next) {
  const userID = req.sanitize('userID').escape();
  const values = {
    email: req.sanitize('email').escape(),
    password: req.sanitize('password').escape(),
    name: req.sanitize('name').escape(),
    surname: req.sanitize('surname').escape(),
    patronymic: req.sanitize('patronymic').escape(),
    role: req.sanitize('role').escape(),
    gender: req.sanitize('gender').escape()
  };
  escaper.sanitize(values)
    .then(function(results) {
      const query = squel.update()
        .table('juvity.users')
        .setFields(results)
        .where('id = ?', userID)
        .toString();
      return req.pgClient.promiseQuery(query);
    })
    .then(function(results) {
      res.status(200).end();
    })
    .fail(next)
    .fin(req.closeClient);
};
