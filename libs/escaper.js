const async = require('async');
const Q = require('q');

module.exports.escape = function escape(str) {
  if (str === null)
    return null;
  if (str === undefined)
    return null;
  if (str === '')
    return null;
  return (str.replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\//g, '&#x2F;')
    .replace(/`/g, '&#96;'));
};

module.exports.sanitize = function (object) {
  return Q.Promise(function (resolve, reject, notify) {
    if (typeof object !== 'object')
      return reject(new Error('Unsupported object'));
    async.filter(Object.keys(object),
      function (item, callback) {
        const value = object[item];
        if (value !== null && value !== undefined && value !== '')
          return callback(true);
        return callback(false);
      },

      function (results) {
        if (Object.keys(results).length === 0)
          return reject(new Error('Empty list'));
        resolve(results);
      });
  }).then(function (results) {
    return Q.Promise(function (resolve, reject, notify) {
      async.map(Object.keys(results),
        function (item, callback) {
          const value = object[item];
          callback(null, escape(value));
        },

        function (err, results) {
          if (err)
            return reject(err);
          if (Object.keys(results).length === 0)
            return reject(new Error('Empty list'), null);
          resolve(results);
        });
    });
  });
};

module.exports.getLength = function getLength(object) {
  if (typeof object !== 'object')
    return 0;
  return Object.keys(object).length;
};
