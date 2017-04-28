//Requires & Global Vars 
require('dotenv').config();
var express = require('express');
var db = require('../models');
var passport = require('../config/passportConfig');
var router = express.Router(); 
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var getSign = require('horoscope').getSign;
var getZodiac = require('horoscope').getZodiac;
var horoscope = require('horoscope');
var horoscopeData = require('../public/js/horoscopeData');
var SpotifyWebApi = require('spotify-web-api-node');
var _ = require('lodash');
var horoScore = null; 
var valence = [];
var superSad = ['1oZNh749l4OIJYgrnpENZG', '0xLusQmpL2MWGajcw0YyXQ', '54E4j2VeN6bucTMtlP8NhD', '54X78diSLoUDI3joC2bjMz', '3QwN6nANXiVnexlOMXQNp7', '3NX3jLUU2sFQjvDRdoOvEN', '1djfA7kl7SbBhoQ2rYQITf', '621BmKwXCNiTBfmeJtxoD8', '0dBshgRgTOWzTwlacQd4aC'];
var mild = ['0QeI79sp1vS8L3JgpEO7mD', '5Fw92tQZz532B0n1LSWP2i', '0khi86hc79RfsRC0rrkkA2', '0LncTjpmLHn86PYGmWAoVf', '7en6a6ajlibz5CsLkoYAdK', '7AFxCS5OHNvZgD2qceIc5Q', '5he5lB7ZYa7EIICHn4WPOk', '1BNtFSws7fjbn9aVBPA79j', '2dBRAH9J3fL24AJkYmjZno', '3apSWeSMRsnzOAjGoVurPP', '69XTyX3ksnOsWj28Yytnym', '7dUuxR8ZgrZ6YL8rwdml1Y', '5shPZ6RnC6sCm0iSZiv7wU', '2H7PHVdQ3mXqEHXcvclTB0', '3KgByVmDzMkOXwtbqbqjBn', '6fBwVe6udYdnRqwqo06if8', '2soBvUQBf5rbMj9HIyhzzK'];
var superHappy = ['0dHvGez5CZNjiE7Z5PZfu7', '3rNCkAhv9cASYco3kC9q3D', '765k9tDIFOnoOfkO2cgitB', '4ylO0IAVZviyGLRsFgj6Nb', '4yrM5BVyJzy5Ed4GPO6e8j', '05ggCWQusGFRTaxqPh7eXP', '4iozhXt27eMl39W5z7R8H6', '2hABMU63xtaIYChN6eYlEb', '1YpgRBDgD8ed7eb8i053Qt', '7h4X53Z6RTBsLTCcmXISI3', '3olcbtUJV3xdHIfFjy8owe', '1ximT3PZHLnfYA545Iv8E9', '2fwx7cUAtsq0mnxswRfOh7', '29QOYtxStXGuGmACR2R6rJ', '31ink8UgWSYUXz0hPasoif', '51H2y6YrNNXcy3dfc3qSbA', '2nsN3TDtw5YaAJ6H7jGUla', '3IiS3fVdtsMPSHsWBgDcFn', '6Kbkge4WbvwWv1jVzSQsr8', '0wgVCOPXv9YSgmRijmDSkh', '57DZno6SOk5AjBYkoGbgJA', '1MpPRotMSsZhI5eevP2qeO', '0bNPzbyaT9npwhIP8d2Rsi', '2k96E0L0SY9raNEVMBqbVL', '6Q8s3YuAWkx0Qui0Jgkr5m', '3ZqU6tXOpZhSeMJ1Y0JpBG', '6hazdpTPlt5W2BTCGYKBoj', '0UTqMwlkHazhoNuwEBz6aJ'];

var credentials = {
  clientId : process.env.SPOTIFY_APP_ID, // Your client id,
  clientSecret : process.env.SPOTIFY_SECRET_KEY, // Your secret
  redirectUri : process.env.BASE_URL + 'auth/spotify/callback'
};

var spotifyApi = new SpotifyWebApi(credentials);

// The code that's returned as a query parameter to the redirect URI
var code = process.env.SPOTIFY_ACCESS_TOKEN;

// Retrieve an access token and a refresh token
spotifyApi.authorizationCodeGrant(code)
  .then(function(data) {
    console.log('The token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);
    console.log('The refresh token is ' + data.body['refresh_token']);

    // Set the access token on the API object to use it in later calls
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// clientId, clientSecret and refreshToken has been set on the api object previous to this call.
spotifyApi.refreshAccessToken()
  .then(function(data) {
    console.log('The access token has been refreshed!');

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Could not refresh access token', err);
  }); 

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
        console.log('Something went wrong when retrieving an access token', err);
  });  





