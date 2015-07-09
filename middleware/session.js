const squel = require('squel');
const config = require('../config.json');
const escaper = require('../libs/escaper');

module.exports = function sessionMiddleware(req, res, next) {
  if (!req.cookies.SID) {
    req.pgClient.end();
    return res.status(400).end();
  }

  const query = squel.select()
    .from('juvity.sessions')
    .where('session_hash = ?', escaper.escape(req.cookies.SID))
    .toString();
  req.pgClient.query(query, function callback(err, result) {
    if (err) return next(err);
    if (result.rowCount == 0 || (result.rows[0].time + config.sessions.liveTime) < new Date().getTime()) {
      req.pgClient.end();
      return res.status(401).end();
    }

    req.session = {
      userID: result.rows[0].user_id,
      sessionHash: result.rows[0].session_hash
    };
    next();
  });
};
