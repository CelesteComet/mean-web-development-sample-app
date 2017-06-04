var mongoose = require('mongoose'),
    Schema = mongoose.Schema
    bcrypt = require('bcrypt-nodejs');

var validator = require('validator');

var UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, 'Invalid email.'],
    index: {unique: true}
  },
  password: {
    type: String,
    validate: [
      function(password) {
        return password && password.length >= 5;
      }, 'Password should be longer.'
    ]
  }
});

UserSchema.pre('save', function(next) {
  if(this.password) {
    this.password = this.generateHash(this.password);
  }
  next();
})

// Generating a hash.
UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// Checking if password is valid.
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

// Create the model for Users and expore it to our app.
mongoose.model('User', UserSchema);