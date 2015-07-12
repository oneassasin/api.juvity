const squel = require('squel');
const escaper = require('../libs/escaper');

module.exports.getTeacherRanks = function(req, res, next) {
  const skipInt = parseInt(req.sanitize('skip').escape() || 0);
  var countInt = parseInt(req.sanitize('count').escape() || 25);
  if (countInt > 25)
    countInt = 25;
  const query = squel.select()
    .from('juvity.teacher_ranks')
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

module.exports.createTeacherRank = function(req, res, next) {
  req.assert('name', 'name_required').notEmpty();
  if (req.validationErrors()) {
    req.closeClient();
    return res.status(400).end();
  }

  const values = {
    name: req.sanitize('name').escape()
  };
  const query = squel.insert()
    .into('juvity.teacher_ranks')
    .setFields(values)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(201).end();
    })
    .fail(function(err) {
      if (err.code === '23505') {
        err = new Error('Duplicate teacher rank');
        err.status = 403;
      }

      next(err);
    })
    .fin(req.closeClient)
};

module.exports.updateTeacherRank = function(req, res, next) {
  const rankID = req.sanitize('teacherRankID').escape();
  const values = {
    name: req.sanitize('name').escape()
  };
  escaper.sanitize(values)
    .then(function(results) {
      const query = squel.update()
        .table('juvity.teacher_ranks')
        .setFields(results)
        .where('id = ?', rankID)
        .toString();
      return req.pgClient.promiseQuery(query);
    })
    .then(function(results) {
      res.status(200).end();
    })
    .fail(next)
    .fin(req.closeClient);
};

module.exports.deleteTeacherRank = function(req, res, next) {
  const rankID = req.sanitize('teacherRankID').escape();
  const query = squel.delete()
    .from('juvity.teacher_ranks')
    .where('id = ?', rankID)
    .toString();
  req.pgClient.promiseQuery(query)
    .then(function(results) {
      res.status(200).end();
    })
    .fail(function(err) {
      if (err.code === '23503') {
        err = new Error('Teacher rank already in use!');
        err.status = 403;
      }

      next(err);
    })
    .fin(req.closeClient);
};

