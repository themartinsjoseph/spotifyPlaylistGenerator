//Requires & Global Vars 
require('dotenv').config();
var express = require('express');
var db = require('../models');
var passport = require('../config/passportConfig');
var router = express.Router(); 
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var client_id = process.env.SPOTIFY_APP_ID; // Your client id
var client_secret = process.env.SPOTIFY_SECRET_KEY; // Your secret
var redirect_uri = process.env.BASE_URL + 'auth/spotify/callback'; // Your redirect uri

//Routes
router.get('/login', function(req,res){
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  successFlash: 'Good job, you logged in',
  failureRedirect: '/auth/login',
  failureFlash: 'Invalid Credentials'
}));

router.get('/signup', function(req,res){
  res.render('auth/signup');
});

router.post('/signup', function(req,res){
  console.log(req.body);
  
  db.user.findOrCreate({
    where: {email: req.body.email},
    defaults: {
      userName: req.body.username,
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      password: req.body.password,
      birthDay: req.body.birthDay,
      birthMonth: req.body.birthMonth
    }
  }).spread(function(user, wasCreated){
    if(wasCreated){
      //Good
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'Account created and logged in'
      })(req,res);
    }else {
      //Bad
      req.flash('error', 'Email already exists');
      res.redirect('/auth/login');
    }
  }).catch(function(err){
    req.flash('error', err.message);
    res.redirect('/auth/signup');
  });
});

router.get('/logout', function(req,res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/');
});

//Export 
module.exports = router; 