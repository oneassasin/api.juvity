const squel = require('squel');
const escaper = require('../libs/escaper');

module.exports.getFacultiesList = function(req, res, next) {
  const instituteID = req.sanitize('instituteID').escape();
  const skipInt = parseInt(req.sanitize('skip').escape() || 0);
  var countInt = parseInt(req.sanitize('count').escape() || 25);
  if (countInt > 25)
    countInt = 25;
  const query = squel.select()
    .from('juvity.faculties')
    .limit(countInt)
    .offset(skipInt)
    .where('institute_id = ?', instituteID)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(200).send(results.rows).end();
    })
    .fail(next)
    .fin(req.closeClient);
};

module.exports.createFaculty = function(req, res, next) {
};

module.exports.updateFaculty = function(req, res, next) {
};

module.exports.deleteFaculty = function(req, res, next) {
};
