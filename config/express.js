var config = require('./config');
var express = require('express');


// Third Party Middleware Definitions

var morgan = require('morgan'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session');
    passport = require('passport');
    flash = require('connect-flash');

module.exports = function() {

  var app = express();
  
  // Serving Static Files
  app.use(express.static('./public'));

  // Mounting Application Middleware

  if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else if(process.env.NODE_ENV === 'production') {
    app.use(compress());
  }

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());
  app.use(methodOverride());

  // Mounting Session Middleware

  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret
  }));

  // Setting the View Engine

  app.set('views', './app/views');
  app.set('view engine', 'ejs');

  // Passport Initialization
  app.use(passport.initialize());
  app.use(passport.session());

  // Mounting Routes

  app.use(flash());

  require('../app/routes/index.server.routes.js')(app);
  require('../app/routes/users.server.routes.js')(app);
  require('../app/routes/articles.server.routes.js')(app);

  

  

  return app;
}