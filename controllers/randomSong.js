//Requires & Global Vars 
require('dotenv').config();
var express = require('express');
var db = require('../models');
var passport = require('../config/passportConfig');
var router = express.Router(); 
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var async = require('async');

var trackId = [ '0QeI79sp1vS8L3JgpEO7mD',
  '765k9tDIFOnoOfkO2cgitB',
  '1BNtFSws7fjbn9aVBPA79j',
  '3rNCkAhv9cASYco3kC9q3D',
  '0khi86hc79RfsRC0rrkkA2',
  '51H2y6YrNNXcy3dfc3qSbA',
  '6fBwVe6udYdnRqwqo06if8',
  '2soBvUQBf5rbMj9HIyhzzK',
  '54X78diSLoUDI3joC2bjMz',
  '7en6a6ajlibz5CsLkoYAdK',
  '1ximT3PZHLnfYA545Iv8E9',
  '6Q8s3YuAWkx0Qui0Jgkr5m',
  '7dUuxR8ZgrZ6YL8rwdml1Y',
  '7h4X53Z6RTBsLTCcmXISI3',
  '0dBshgRgTOWzTwlacQd4aC',
  '29QOYtxStXGuGmACR2R6rJ',
  '3NX3jLUU2sFQjvDRdoOvEN',
  '0LncTjpmLHn86PYGmWAoVf',
  '4yrM5BVyJzy5Ed4GPO6e8j',
  '57DZno6SOk5AjBYkoGbgJA',
  '3KgByVmDzMkOXwtbqbqjBn',
  '1oZNh749l4OIJYgrnpENZG',
  '54E4j2VeN6bucTMtlP8NhD',
  '3apSWeSMRsnzOAjGoVurPP',
  '5Fw92tQZz532B0n1LSWP2i',
  '0bNPzbyaT9npwhIP8d2Rsi',
  '3QwN6nANXiVnexlOMXQNp7',
  '0xLusQmpL2MWGajcw0YyXQ',
  '6Kbkge4WbvwWv1jVzSQsr8',
  '0UTqMwlkHazhoNuwEBz6aJ',
  '5he5lB7ZYa7EIICHn4WPOk',
  '3IiS3fVdtsMPSHsWBgDcFn',
  '4ylO0IAVZviyGLRsFgj6Nb',
  '05ggCWQusGFRTaxqPh7eXP',
  '2fwx7cUAtsq0mnxswRfOh7',
  '5shPZ6RnC6sCm0iSZiv7wU',
  '69XTyX3ksnOsWj28Yytnym',
  '621BmKwXCNiTBfmeJtxoD8',
  '3ZqU6tXOpZhSeMJ1Y0JpBG',
  '0dHvGez5CZNjiE7Z5PZfu7',
  '0wgVCOPXv9YSgmRijmDSkh',
  '1djfA7kl7SbBhoQ2rYQITf',
  '2nsN3TDtw5YaAJ6H7jGUla',
  '2H7PHVdQ3mXqEHXcvclTB0',
  '4iozhXt27eMl39W5z7R8H6',
  '6hazdpTPlt5W2BTCGYKBoj',
  '31ink8UgWSYUXz0hPasoif',
  '1YpgRBDgD8ed7eb8i053Qt',
  '1MpPRotMSsZhI5eevP2qeO',
  '2hABMU63xtaIYChN6eYlEb',
  '2dBRAH9J3fL24AJkYmjZno',
  '3olcbtUJV3xdHIfFjy8owe',
  '2k96E0L0SY9raNEVMBqbVL',
  '7AFxCS5OHNvZgD2qceIc5Q' ]

  var valence = [ 0.389,
  0.69,
  0.522,
  0.687,
  0.409,
  0.841,
  0.648,
  0.661,
  0.182,
  0.455,
  0.762,
  0.924,
  0.626,
  0.748,
  0.345,
  0.817,
  0.306,
  0.428,
  0.704,
  0.898,
  0.638,
  0.0572,
  0.13,
  0.623,
  0.392,
  0.909,
  0.277,
  0.0888,
  0.89,
  0.979,
  0.497,
  0.877,
  0.698,
  0.707,
  0.812,
  0.628,
  0.625,
  0.341,
  0.949,
  0.683,
  0.895,
  0.334,
  0.859,
  0.633,
  0.712,
  0.961,
  0.83,
  0.742,
  0.899,
  0.716,
  0.53,
  0.75,
  0.916,
  0.459 ]

  //Routes
  router.get('/', function(req,res){
    async.forEachSeries(valence, function(v, callback) {
      var i = valence.indexOf(v);
      db.track.create({
        valence: v,
        trackId: trackId[i]
      }).then(function(){
        callback(null);
      })
    }, function() {
      res.send('yay!'); 
    })
  });

//Export 
module.exports = router; 