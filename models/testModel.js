var mongoose = require('mongoose');

var testSchema = mongoose.Schema({
  args: {
    type: Object,
    default: {}
  },
  headers: {
    type: Object,
    default: {}
  },
  origin: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    default: ''
  }
});

module.exports = testSchema;
