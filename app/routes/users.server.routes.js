var users = require('../controllers/users.server.controller');
var passport = require('passport');

module.exports = function(app) {
  app.route('/users')
     .post(users.create)
     .get(users.list);

  // To get JSON representation of a single user.  
  app.route('/users/:userId')
     .get(users.read)
     .put(users.update)
     .delete(users.delete);

  // Will be executed before any other route with userId parameter.
  app.param('userId', users.userByID);

  app.route('/signup')
     .get(users.renderSignup)
     .post(users.signup);

  app.route('/signin')
     .get(users.renderSignin)
     .post(passport.authenticate('local', {
       successRedirect: '/',
       failureRedirect: '/signin',
       failureFlash: true
     }));

  app.get('/logout', users.signout)



};