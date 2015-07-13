const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AudacitySchema = new Schema({
  time: {
    type: Number,
    index: true
  },
  groupID: {
    type: Number,
    index: true
  },
  presents: {
    type: [Number]
  }
}, {
  autoIndex: false
});

module.exports = AudacitySchema;
