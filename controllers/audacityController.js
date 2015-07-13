const Audacity = require('../models/index').Audacity;
const async = require('async');

module.exports.getAudacityTable = function(req, res, next) {
  const groupID = req.sanitize('groupID').escape();
  const time = req.sanitize('time').escape();
  Audacity.find({groupID: groupID, time: time}, {_id: false, __v: false}, function(err, result) {
    if (err)
      return next(err);
    if (result.length === 0)
      return res.status(404).end();
    res.status(200).send(result).end();
    req.closeClient();
  });
};

module.exports.createAudacity = function(req, res, next) {
  req.assert('presents', 'presents_required').notEmpty();
  if (req.validationErrors()) {
    res.status(400).end();
    return req.closeClient();
  }

  const groupID = req.session.groupID;
  const time = req.sanitize('time').escape();
  const presents = req.body.presents;
  const values = [];
  async.each(presents, function(item, callback) {
    if (typeof item === 'number')
      values.push(item);
    callback();
  }, function(err) {
    if (err)
      return next(err);
    const record = new Audacity();
    record.time = time;
    record.groupID = groupID;
    record.presents = values;
    record.save(function(err) {
      if (err)
        return next(err);
      res.status(201).end();
      req.closeClient();
    });
  });
};

module.exports.updateAudacity = function(req, res, next) {
  req.assert('presents', 'presents_required').notEmpty();
  if (req.validationErrors()) {
    req.closeClient();
    return res.status(400).end();
  }

  const groupID = req.session.groupID;
  const time = req.sanitize('time').escape();
  const newPresents = req.sanitize('presents').escape();
  Audacity.findOneAndUpdate({
    groupID: groupID,
    time: time
  }, {presents: newPresents}, function(err) {
    if (err)
      return next(err);
    res.status(200).end();
    req.closeClient();
  });
};
