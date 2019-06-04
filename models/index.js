var mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/charisma", { useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', function () {
  console.log('database connected');
  module.exports.connected = true;
});

module.exports = {
  connected: false,
  Article: require('./Article'),
  Comment: require('./Comment')
};
