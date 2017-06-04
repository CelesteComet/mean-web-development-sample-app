var User = require('mongoose').model('User');
var passport = require('passport');

var getErrorMessage = function(err) {
  var message = '';

  if(err.code) {
    switch(err.code) {
      case 11000:
      case 11001:
        message = 'Email already exists';
        break;
      default:
        message = 'Something went wrong';
    }
  } else {
    for (var errorName in err.errors) {
      if(err.errors[errorName].message) {
        message = err.errors[errorName].message;
      }
    }
  }
  return message;
};

exports.create = function(req, res, next) {
  var user = new User(req.body);
  user.save(function(err) {
    if(err) {
      return next(err);
    } else {
      res.json(user);
    }
  });
};

exports.read = function(req, res) {
  res.json(req.user);
};

exports.update = function(req, res) {

};

exports.delete = function(req, res) {

}

exports.userByID = function(req, res, next, id) {
  User.findOne({
    _id: id
  }, function(err, user) {
    if(err) {
      return next(err);
    } else {
      req.user = user;
      next();
    }
  });
};

exports.list = function(req, res, next) {
  User.find({}, function(err, users) {
    if(err) {
      return next(err);
    } else {
      res.json(users);
    }
  })
}

exports.renderSignup = function(req, res, next) {
  // If there are no users, render the signup form, else render the main page.
  if(!req.user) {
    res.render('signup', {
      title: 'Signup Form',
      messages: req.flash('error') || req.flash('info')
    })
  } else {
    return res.redirect('/');
  }
}

exports.renderSignin = function(req, res, next) {
  if(!req.user) {
    res.render('signin', {
      title: 'Signin Form',
      messages: req.flash('error') || req.flash('info')
    })
  } else {
    return res.redirect('/');
  }
}

exports.signup = function(req, res, next) {
  
  // If there is no user logged in, create a new user and save to to the database.
  if(!req.user) {

    var user = new User(req.body);
    var message = null;

    user.save(function(err) {

      // If there is an error in save, redirect to same place with error message.
      if(err) {
        var message = getErrorMessage(err);
        req.flash('error', message);
        return res.redirect('/signup');
      }

      req.login(user, function(err) {
        if(err) {
          return next(err);
          res.redirect('/');
        } else {
          res.redirect('/');
        }
      })

    })
  }
}

exports.signout = function(req, res, next) {
  req.logout();
  res.redirect('/');
}




