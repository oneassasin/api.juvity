const util = require('util');
const escaper = require('./escaper');

module.exports.format = function(latitude, longitude) {
  latitude = escaper.escape(latitude);
  longitude = escaper.escape(longitude);
  if (latitude === null || longitude === null)
    return null;
  return util.format('POINT(%d, %d)', latitude, longitude);
};
