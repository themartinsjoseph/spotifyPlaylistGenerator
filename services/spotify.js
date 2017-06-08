const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_APP_ID, // Your client id
    clientSecret: process.env.SPOTIFY_SECRET_KEY // Your secret
});


function resetCredentials() {
    // Retrieve an access token.
    spotifyApi.clientCredentialsGrant()
        .then(function(data) {
            console.log('The access token expires in ' + data.body.expires_in);
            console.log('The access token is ' + data.body.access_token);

            // Save the access token so that it's used in future calls
            spotifyApi.setAccessToken(data.body.access_token);
            scheduleReset(data.body.expires_in);
        }, function(err) {
            console.log('Something went wrong when retrieving an access token', err);
        });
}


function scheduleReset(expirySeconds) {
    const fiveMinutesInSeconds = 60 * 5;
    const resetTimeInSeconds = expirySeconds - fiveMinutesInSeconds;
    const resetTimeInMilliseconds = resetTimeInSeconds * 1000;

    setTimeout(function() {
        resetCredentials();
    }, resetTimeInMilliseconds);
}


resetCredentials();


module.exports = spotifyApi;
