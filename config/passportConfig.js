//Requires & Global Vars 
var passport = require('passport');
var localStrategy = require('passport-local').Strategy; 
// var spotifyStrategy = require('passport-spotify').Strategy;
var db = require('../models');
require('dotenv').config(); 

// Passport "serializes" objects to make them easy to store, converting the user to an identifier (id)
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

// Passport "deserializes" objects by taking the user's serialization (id) and looking it up in the database
passport.deserializeUser(function(id, cb) {
  db.user.findById(id).then(function(user) {
    cb(null, user);
  }).catch(cb);
});

//We need to provide the error as the first argument, and the user as the second argument. We can provide "null" if there's no error, or "false" if there's no user.
passport.use(new localStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function(email, password, cb) {
  db.user.find({
    where: { email: email }
  }).then(function(user) {
    if (!user || !user.validPassword(password)) {
      cb(null, false);
    } else {
      cb(null, user);
    }
  }).catch(cb);
}));

// export the Passport configuration from this module
module.exports = passport;