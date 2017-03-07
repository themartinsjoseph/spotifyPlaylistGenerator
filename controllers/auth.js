//Requires & Global Vars 
var express = require('express');
var db = require('../models');
var passport = require('../config/passportConfig');
var router = express.Router(); 


//Routes
router.get('/auth/spotify',
  passport.authenticate('spotify'),
  function(req, res){
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  });

router.get('/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

//Export 
module.exports = router; 