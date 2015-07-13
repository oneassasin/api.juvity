const mongoose = require('mongoose');
const nconf = require('nconf');

mongoose.connect(nconf.get('database:mongoUrl'));

const AudacitySchema = require('./AudacitySchema');
const Audacity = mongoose.model('Audacity', AudacitySchema);

module.exports.Audacity = Audacity;
