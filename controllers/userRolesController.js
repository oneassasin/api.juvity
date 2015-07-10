const squel = require('squel');
const escaper = require('../libs/escaper');

module.exports.getUserRoles = function(req, res, next) {
  const skipInt = parseInt(req.sanitize('skip').escape() || 0);
  var countInt = parseInt(req.sanitize('count').escape() || 25);
  if (countInt > 25)
    countInt = 25;
  const query = squel.select()
    .from('juvity.user_roles')
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

module.exports.createUserRole = function(req, res, next) {
  req.assert('name', 'name_required').notEmpty();
  req.assert('mask', 'mask_required').notEmpty();
  if (req.validationErrors()) {
    req.closeClient();
    return res.status(400).end();
  }

  const values = {
    name: req.sanitize('name').escape(),
    bit_mask: req.sanitize('mask').escape()
  };
  const query = squel.insert()
    .into('juvity.user_roles')
    .setFields(values)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(201).end();
    })
    .fail(next)
    .fin(req.closeClient)
};

module.exports.updateUserRole = function(req, res, next) {
};

module.exports.deleteUserRole = function(req, res, next) {
};

