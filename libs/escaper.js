const async = require('async');
const Q = require('q');

module.exports.escape = function escape(str) {
  if (str === null || str === undefined || str === '')
    return null;
  return _escapeSymbols(str);
};

function _escapeSymbols(str) {
  return str.replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\//g, '&#x2F;')
    .replace(/`/g, '&#96;');
}

module.exports.sanitize = function(object) {
  return Q.Promise(function(resolve, reject, notify) {
    const results = {};
    async.forEachOf(object,
      function(value, key, callback) {
        if (value === null || value === undefined || value === '')
          return callback();
        results[key] = _escapeSymbols(value);
        callback();
      },

      function(err) {
        if (err)
          return reject(err);
        if (_getLength(results) === 0) {
          const error = new Error('Empty params object');
          error.status = 400;
          return reject(error);
        }

        resolve(results);
      });
  });
};

module.exports.getLength = function(object) {
  return _getLength(object);
};

function _getLength(object) {
  if (typeof object !== 'object')
    return 0;
  return Object.keys(object).length;
}

module.exports.validateJSON = function(object) {
  try {
    JSON.parse(object);
  } catch (e) {
    return null;
  }

  return object;
};
