const api_key = '7fa8736b6bff6464bc7cf056797ebcf1';
const url_base = 'https://ws.audioscrobbler.com/2.0/?'
const username = 'EdwinW';
const user = '&user='+username
const key = '&api_key='+api_key

$(document).ready(function()  {
  const base_url = url_base+'method=user.getrecenttracks&user='+username+'&api_key='+api_key+'&limit=1&format=json';
  $.getJSON(base_url, function(data){
    if(jQuery.type(data.recenttracks.track) === 'array') {
      var mostRecent = data.recenttracks.track[0];
    }
    else {
      var mostRecent = data.recenttracks.track;
    }
    try {
      // When not playing anything, this attribute is not set to false but is absent altogether 
      mostRecent["@attr"]["nowplaying"];
      var listening_text = 'I am currently listening to ';
    } catch (error) {
      var listening_text = 'Last listened to ';
    }
    var currentTrack = '"'+mostRecent['name'] + '" by ' + mostRecent['artist']['#text'];
    $('#now_playing').html("<a href="+mostRecent['url']+">" + listening_text + currentTrack + "</a>");
    try {
      // 0, 1, 2, 3 are image sizes
      $('#now_playing_img').html('<img src='+mostRecent['image']['2']['#text']+'/>');
    } catch (error) {
      console.log(error)
    }
  });
});

$(document).ready(function() {
	const method = 'method=user.gettopartists'
	const limit = 20
	const meta = '&limit='+limit+'&format=json'
	const url = url_base+method+user+key+meta
	console.log(url);
	$.getJSON(url, function(data) {
		$.each(data.topartists.artist, function(i, artist) {
			var row = "<tr>" + "<td>" + "<a href="+artist.url+">"+artist.name+"</a>" + "</td>" + "<td>" + artist.playcount +"</td>" + "</tr>";
			$(row).appendTo("#artists tbody");
		});
	});
});

$(document).ready(function() {
	const method = 'method=user.getweeklyartistchart'
	const limit = 5 
	const meta = '&format=json'
	const url = url_base+method+user+key+meta
	console.log(url);

	$.getJSON(url, function(data) {
			var artists = ""
		$.each(data.weeklyartistchart.artist, function(i, artist) {
			if (i < limit) {
				var row = "<tr>" + "<td>" + "<a href="+artist.url+">"+artist.name+"</a>" + "</td>" + "<td>" + artist.playcount +"</td>" + "</tr>";
				$(row).appendTo("#weekly_artists tbody");
			}
		});
	});
});

/*
$(document).ready(function() {
	const method = 'method=user.gettoptags'
	const limit = 20
	const meta = '&limit='+limit+'&format=json'
	const url = url_base+method+user+key+meta
	console.log(url);

	$.getJSON(url, function(data) {
		$.each(data.toptags, function(i, tag_i) {
			var tags = tag_i.name;
			$(tags).appendTo("tags p");
		});
	});
});
*/
