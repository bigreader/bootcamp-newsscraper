var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  body: String,
  date: Date,
  author: String
});

var model = mongoose.model('Comment', schema);

module.exports = model;
