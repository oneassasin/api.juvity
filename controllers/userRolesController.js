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

module.exports.createUserRoleId = function(req, res, next) {
};

module.exports.updateUserRole = function(req, res, next) {
};

module.exports.deleteUserRole = function(req, res, next) {
};

