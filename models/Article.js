var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  title: String,
  body: String,
  date: Date,
  link: String,

  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
});

var model = mongoose.model('Article', schema);

module.exports = model;
