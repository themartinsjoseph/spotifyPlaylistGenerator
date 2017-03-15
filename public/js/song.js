$(document).ready(function(){
	$.ajax({
		url: './idGenerator/spotifySong',
		method: 'get'
	}).success(function(data){
		console.log(data); //url in here
		//create a new element and append it to 
		var iframe = $('<iframe src="https://embed.spotify.com/?uri=spotify:track:' + data + '"' + " " + 'frameborder="0" allowtransparency="true"></iframe>');
		$('#song-rec').append(iframe);
	}).error(function(data){
		console.log('error', data);
	})
});

