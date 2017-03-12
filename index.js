//Requires & Global Vars
require('dotenv').config();
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var db = require('./models');
var fs = require('fs');
var passport = require('./config/passportConfig');
var isLoggedIn = require('./middleware/isLoggedIn');
var session = require('express-session');
var flash = require('connect-flash');
var getSign = require('horoscope').getSign;
var getZodiac = require('horoscope').getZodiac;
var horoscope = require('horoscope');
var horoscopeData = require('./public/js/horoscopeData');
var validating = require('./public/js/validating');
var querystring = require('querystring');
var request = require('request'); // "Request" library
var SpotifyWebApi = require('spotify-web-api-node');
var _ = require('lodash');
var app = express(); 
var horoScore = null; 
var valence = [];
var superSad = ['1oZNh749l4OIJYgrnpENZG', '0xLusQmpL2MWGajcw0YyXQ', '54E4j2VeN6bucTMtlP8NhD', '54X78diSLoUDI3joC2bjMz', '3QwN6nANXiVnexlOMXQNp7', '3NX3jLUU2sFQjvDRdoOvEN', '1djfA7kl7SbBhoQ2rYQITf', '621BmKwXCNiTBfmeJtxoD8', '0dBshgRgTOWzTwlacQd4aC'];
var mild = ['0QeI79sp1vS8L3JgpEO7mD', '5Fw92tQZz532B0n1LSWP2i', '0khi86hc79RfsRC0rrkkA2', '0LncTjpmLHn86PYGmWAoVf', '7en6a6ajlibz5CsLkoYAdK', '7AFxCS5OHNvZgD2qceIc5Q', '5he5lB7ZYa7EIICHn4WPOk', '1BNtFSws7fjbn9aVBPA79j', '2dBRAH9J3fL24AJkYmjZno', '3apSWeSMRsnzOAjGoVurPP', '69XTyX3ksnOsWj28Yytnym', '7dUuxR8ZgrZ6YL8rwdml1Y', '5shPZ6RnC6sCm0iSZiv7wU', '2H7PHVdQ3mXqEHXcvclTB0', '3KgByVmDzMkOXwtbqbqjBn', '6fBwVe6udYdnRqwqo06if8', '2soBvUQBf5rbMj9HIyhzzK'];
var superHappy = ['0dHvGez5CZNjiE7Z5PZfu7', '3rNCkAhv9cASYco3kC9q3D', '765k9tDIFOnoOfkO2cgitB', '4ylO0IAVZviyGLRsFgj6Nb', '4yrM5BVyJzy5Ed4GPO6e8j', '05ggCWQusGFRTaxqPh7eXP', '4iozhXt27eMl39W5z7R8H6', '2hABMU63xtaIYChN6eYlEb', '1YpgRBDgD8ed7eb8i053Qt', '7h4X53Z6RTBsLTCcmXISI3', '3olcbtUJV3xdHIfFjy8owe', '1ximT3PZHLnfYA545Iv8E9', '2fwx7cUAtsq0mnxswRfOh7', '29QOYtxStXGuGmACR2R6rJ', '31ink8UgWSYUXz0hPasoif', '51H2y6YrNNXcy3dfc3qSbA', '2nsN3TDtw5YaAJ6H7jGUla', '3IiS3fVdtsMPSHsWBgDcFn', '6Kbkge4WbvwWv1jVzSQsr8', '0wgVCOPXv9YSgmRijmDSkh', '57DZno6SOk5AjBYkoGbgJA', '1MpPRotMSsZhI5eevP2qeO', '0bNPzbyaT9npwhIP8d2Rsi', '2k96E0L0SY9raNEVMBqbVL', '6Q8s3YuAWkx0Qui0Jgkr5m', '3ZqU6tXOpZhSeMJ1Y0JpBG', '6hazdpTPlt5W2BTCGYKBoj', '0UTqMwlkHazhoNuwEBz6aJ'];


var spotifyApi = new SpotifyWebApi({
	client_id : '46c3474cdf9045198875d6a7f129e9ea', // Your client id
	client_secret : 'a0b8e89f16ec46a7b6e3ff38f803d68e', // Your secret
	redirect_uri : 'http://localhost:3000/auth/spotify/callback',
	accessToken : 'njd9wng4d0ycwnn3g4d1jm30yig4d27iom5lg4d3' 
});

//Set & Use Statements
app.set('view engine', 'ejs'); 
spotifyApi.setAccessToken('BQDL59EXlORoSIb9T1qy4HuOmWhWIhVvXKXteifqFw58bsQh0NmO6xQNMqgUG-vdPN9BunuGtVQpj6TzB07r6N8cV0EIMaCdU9v6_QPGjonhOWSg_bIE_-ce30vvZsoEaiBipFMWq-nf');
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

app.get('/profile', isLoggedIn, function(req,res) {
 db.user.find().then(function(users){
 	// res.render('profile', { users: users });
 	 var sign = horoscope.getSign({ month: users.birthMonth, day: users.birthDay});
 	 var urlSign = sign.toLowerCase();
 	 var horoApiUrl = 'http://theastrologer-api.herokuapp.com/api/horoscope/' + urlSign +'/today';
	 console.log(horoApiUrl);
	request(horoApiUrl, function(error, response, body) {
		if (!error && response.statusCode == 200) {
    		var horoApi = JSON.parse(body);
    		console.log(horoApi);
    		res.render("profile", {users: users, horoApi: horoApi});
		} 
  	});
 }).catch(function(error){
 	res.status(404).send('Something is Wrong');
 })
});

// var horoApi.intensity.replace(/\d+% ?/g, ""); 

// Get a playlist
spotifyApi.getPlaylist('12135695932', '0LugNdXIsKK8eNfPNyWo8s')
  .then(function(data) {
  	var trackObj = data.body.tracks.items;
  	var trackIds = [];
  	for (var i = 0; i < trackObj.length; i++){
  		trackIds.push(trackObj[i].track.id);
  		
  	}
	spotifyApi.getAudioFeaturesForTracks(trackIds)
	  .then(function(data) {
	  	var trackObj = data.body.audio_features;
	  	
	  	for (var i = 0; i < trackObj.length; i++){
	    valence[i] = trackObj[i].valence;
	    
	    
	}
	console.log();
	  }, function(err) {
	    done(err);
	  });
			db.user.find().then(function(users){
		 	// res.render('profile', { users: users });
		 	 var sign = horoscope.getSign({ month: users.birthMonth, day: users.birthDay});
		 	 var urlSign = sign.toLowerCase();
		 	 var horoApiUrl = 'http://theastrologer-api.herokuapp.com/api/horoscope/' + urlSign +'/today';
			 console.log(horoApiUrl);
			request(horoApiUrl, function(error, response, body) {
				if (!error && response.statusCode == 200) {
		    		var horoApi = JSON.parse(body);
		    		horoScore = horoApi.meta.intensity;
		    		horoScore = horoScore.replace('%', '');
		    		horoScore = horoScore.split('');
		    		horoScore.unshift('0.')
		    		horoScore = horoScore.toString();
		    		horoScore = horoScore.replace(/,/g,"");
				} 
				console.log(horoScore)
						if (horoScore < 0.33) {
							var sadRnd = superSad[Math.floor(Math.random()*superSad.length)];
							console.log('https://open.spotify.com/track/' + sadRnd);
						} else if (horoScore > 0.33 && horoScore < 0.66) {
							var mildRnd = mild[Math.floor(Math.random()*mild.length)];
							console.log('https://open.spotify.com/track/' + mildRnd);
						} else if (horoScore > 0.66 && horoScore < 1) {
							var happyRnd = superHappy[Math.floor(Math.random()*superHappy.length)];
							console.log('https://open.spotify.com/track/' + happyRnd);
						} else {
							console.log('fuck');
						}
		  	});
		 }).catch(function(error){
		 	res.status(404).send('Something is Wrong');
		 })

    // console.log('Some information about this playlist', data.body.tracks.items[0].track.id);
  }, function(err) {
    console.log('Something went wrong!', err);
  });


/* Get Audio Features for several tracks */
// spotifyApi.getAudioFeaturesForTracks(['1BNtFSws7fjbn9aVBPA79j', '3rNCkAhv9cASYco3kC9q3D'])
//   .then(function(data) {
//   	var trackObj = data.body.audio_features;
//   	for (var i = 0; i < trackObj.length; i++){

//     console.log(trackObj[i].valence);
// }
//   }, function(err) {
//     done(err);
//   });

// /* Get Audio Features for several tracks */
// spotifyApi.getAudioFeaturesForTracks(['4iV5W9uYEdYUVa79Axb7Rh', '3rNCkAhv9cASYco3kC9q3D'])
//   .then(function(data) {
//   	// var trackObj = data.body.audio_features;
//   	var trackObj = data.body;
//   	for (var i = 0; i < trackObj.length; i++){
//   		if(trackObj[i].valence < .1) {
//   			console.log('https://open.spotify.com/track/' + trackObj[i].id); 
//   		} else if (trackObj[i].valence > .2 && trackObj[i].valence < .3) {
//   			console.log('https://open.spotify.com/track/' + trackObj[i].id); 
//   		} else if (trackObj[i].valence > .3 && trackObj[i].valence < .4) {
//   			console.log('https://open.spotify.com/track/' + trackObj[i].id); 
//   		} else if (ttrackObj[i].valence > .4 && trackObj[i].valence < .5) {
//   			console.log('https://open.spotify.com/track/' + trackObj[i].id); 
//   		} else if (trackObj[i].valence > .5 && trackObj[i].valence < .6) {
//   			console.log('https://open.spotify.com/track/' + trackObj[i].id); 
//   		} else if (trackObj[i].valence > .6 && trackObj[i].valence < .7) {
//   			console.log('https://open.spotify.com/track/' + trackObj[i].id); 
//   		} else if (trackObj[i].valence > .7 && trackObj[i].valence < .8) {
// 			console.log('https://open.spotify.com/track/' + trackObj[i].id); 
//   		} else if (trackObj[i].valence > .8 && trackObj[i].valence < .9) {
//   			console.log('https://open.spotify.com/track/' + trackObj[i].id); 
//   		} else if (trackObj[i].valence > .9 && trackObj[i].valence < 1)  {
//   			console.log('https://open.spotify.com/track/' + trackObj[i].id); 
//   		} else {
//   			console.log('oops!');
//   		}
//     console.log(trackObj[i].valence);
// 	}
//   }, function(err) {
//     done(err);
//   });




//Controllers
app.use('/auth', require('./controllers/auth'));
app.use('/randomSong', require('./controllers/randomSong'));


//Listener
var server = app.listen(process.env.PORT || 3000);
module.exports = server;