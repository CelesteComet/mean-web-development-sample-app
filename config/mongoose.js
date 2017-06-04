var config = require('./config')
    mongoose = require('mongoose');

module.exports = function() {

  // Remove deprecation warning.
  mongoose.Promise = global.Promise;
  
  var db = mongoose.connect(config.db);

  require('../app/models/user.server.model');
  require('../app/models/article.server.model');

  return db;
};