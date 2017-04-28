//Requires & Global Vars
require('dotenv').config();
var express         = require('express');
var ejsLayouts      = require('express-ejs-layouts');
var bodyParser      = require('body-parser');
var morgan          = require('morgan');
var db              = require('./models');
var fs              = require('fs');
var passport        = require('./config/passportConfig');
var isLoggedIn      = require('./middleware/isLoggedIn');
var session         = require('express-session');
var flash           = require('connect-flash');
var getSign         = require('horoscope').getSign;
var getZodiac       = require('horoscope').getZodiac;
var horoscope       = require('horoscope');
var horoscopeData   = require('./public/js/horoscopeData');
var validating      = require('./public/js/validating');
var querystring     = require('querystring');
var request         = require('request'); // "Request" library
var SpotifyWebApi   = require('spotify-web-api-node');
var _               = require('lodash');
var app             = express();
var horoScore       = null;
var valence         = [];
var superSad        = ['1oZNh749l4OIJYgrnpENZG', '0xLusQmpL2MWGajcw0YyXQ', '54E4j2VeN6bucTMtlP8NhD', '54X78diSLoUDI3joC2bjMz', '3QwN6nANXiVnexlOMXQNp7', '3NX3jLUU2sFQjvDRdoOvEN', '1djfA7kl7SbBhoQ2rYQITf', '621BmKwXCNiTBfmeJtxoD8', '0dBshgRgTOWzTwlacQd4aC'];
var mild            = ['0QeI79sp1vS8L3JgpEO7mD', '5Fw92tQZz532B0n1LSWP2i', '0khi86hc79RfsRC0rrkkA2', '0LncTjpmLHn86PYGmWAoVf', '7en6a6ajlibz5CsLkoYAdK', '7AFxCS5OHNvZgD2qceIc5Q', '5he5lB7ZYa7EIICHn4WPOk', '1BNtFSws7fjbn9aVBPA79j', '2dBRAH9J3fL24AJkYmjZno', '3apSWeSMRsnzOAjGoVurPP', '69XTyX3ksnOsWj28Yytnym', '7dUuxR8ZgrZ6YL8rwdml1Y', '5shPZ6RnC6sCm0iSZiv7wU', '2H7PHVdQ3mXqEHXcvclTB0', '3KgByVmDzMkOXwtbqbqjBn', '6fBwVe6udYdnRqwqo06if8', '2soBvUQBf5rbMj9HIyhzzK'];
var superHappy      = ['0dHvGez5CZNjiE7Z5PZfu7', '3rNCkAhv9cASYco3kC9q3D', '765k9tDIFOnoOfkO2cgitB', '4ylO0IAVZviyGLRsFgj6Nb', '4yrM5BVyJzy5Ed4GPO6e8j', '05ggCWQusGFRTaxqPh7eXP', '4iozhXt27eMl39W5z7R8H6', '2hABMU63xtaIYChN6eYlEb', '1YpgRBDgD8ed7eb8i053Qt', '7h4X53Z6RTBsLTCcmXISI3', '3olcbtUJV3xdHIfFjy8owe', '1ximT3PZHLnfYA545Iv8E9', '2fwx7cUAtsq0mnxswRfOh7', '29QOYtxStXGuGmACR2R6rJ', '31ink8UgWSYUXz0hPasoif', '51H2y6YrNNXcy3dfc3qSbA', '2nsN3TDtw5YaAJ6H7jGUla', '3IiS3fVdtsMPSHsWBgDcFn', '6Kbkge4WbvwWv1jVzSQsr8', '0wgVCOPXv9YSgmRijmDSkh', '57DZno6SOk5AjBYkoGbgJA', '1MpPRotMSsZhI5eevP2qeO', '0bNPzbyaT9npwhIP8d2Rsi', '2k96E0L0SY9raNEVMBqbVL', '6Q8s3YuAWkx0Qui0Jgkr5m', '3ZqU6tXOpZhSeMJ1Y0JpBG', '6hazdpTPlt5W2BTCGYKBoj', '0UTqMwlkHazhoNuwEBz6aJ'];


var spotifyApi = new SpotifyWebApi({
	client_id : process.env.SPOTIFY_APP_ID, // Your client id
	client_secret : process.env.SPOTIFY_SECRET_KEY, // Your secret
	redirect_uri : process.env.BASE_URL + 'auth/spotify/callback'
});

//Set & Use Statements
app.set('view engine', 'ejs'); 
spotifyApi.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN);
// spotifyApi.setRefreshToken('myRefreshToken');
app.use(require('morgan')('dev'));
app.use(ejsLayouts);
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true
})); 
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public/'));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
	res.locals.currentUser = req.user; 
	res.locals.alerts = req.flash();
	next();
});

//Routes
app.get('/', function(req, res) {
  res.render('index');
});

//Get a horoscope
app.get('/profile', isLoggedIn, function(req,res) {
 db.user.findById(req.user.id).then(function(user){
 	
 	console.log('THIS IS THE USER', user.birthMonth);
 	 var sign = horoscope.getSign({ month: user.birthMonth, day: user.birthDay});
 	 console.log('THIS IS THE SIGN', sign);
 	 var urlSign = sign.toLowerCase();
 	 console.log('THIS IS THE urlSign', urlSign);
 	 var horoApiUrl = 'https://thawing-hollows-25987.herokuapp.com/api/horoscope/' + urlSign +'/today';
 	 console.log('THIS IS THE horoAPI', horoApiUrl);
	request(horoApiUrl, function(error, response, body) {
		if (!error && response.statusCode == 200) {
    		var horoApi = JSON.parse(body);
    		res.render("profile", {horoApi: horoApi});
		} 
  	});
 }).catch(function(error){
 	console.log(error);
 	res.status(404).send('Something is Wrong');
 })
});


//Controllers
app.use('/auth', require('./controllers/auth'));
app.use('/randomSong', require('./controllers/randomSong'));
app.use('/idGenerator', require('./controllers/idGenerator'));
// app.use('/accessToken', require('./controllers/accessToken'));


//Listener
var server = app.listen(process.env.PORT || 3000);
module.exports = server;