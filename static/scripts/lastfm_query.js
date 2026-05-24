const api_key = '7fa8736b6bff6464bc7cf056797ebcf1';
const url_base = 'https://ws.audioscrobbler.com/2.0/?'
const username = 'EdwinW';
const user = '&user='+username
const key = '&api_key='+api_key

document.addEventListener('DOMContentLoaded', function()  {
  const base_url = url_base+'method=user.getrecenttracks&user='+username+'&api_key='+api_key+'&limit=1&format=json';
  fetch(base_url)
    .then(response => response.json())
    .then(function(data){
      const mostRecent = Array.isArray(data.recenttracks.track)
        ? data.recenttracks.track[0]
        : data.recenttracks.track;

      const listening_text = mostRecent["@attr"]?.nowplaying
        ? 'I am currently listening to '
        : 'Last listened to ';

      const currentTrack = '"'+mostRecent['name'] + '" by ' + mostRecent['artist']['#text'];
      const nowPlayingEl = document.getElementById('now_playing');
      if (nowPlayingEl) {
        nowPlayingEl.innerHTML = "<a href="+mostRecent['url']+">" + listening_text + currentTrack + "</a>";
      }

      try {
        const nowPlayingImgEl = document.getElementById('now_playing_img');
        if (nowPlayingImgEl && mostRecent['image']?.[2]?.['#text']) {
          nowPlayingImgEl.innerHTML = '<img src='+mostRecent['image']['2']['#text']+'/>';
        }
      } catch (error) {
        console.log(error)
      }
    })
    .catch(error => console.error('Error fetching recent tracks:', error));
});

document.addEventListener('DOMContentLoaded', function() {
	const method = 'method=user.gettopartists'
	const limit = 20
	const meta = '&limit='+limit+'&format=json'
	const url = url_base+method+user+key+meta
	console.log(url);

	fetch(url)
	  .then(response => response.json())
	  .then(function(data) {
	    const artistsTableBody = document.querySelector("#artists tbody");
	    if (artistsTableBody) {
	      data.topartists.artist.forEach(function(artist) {
	        const row = "<tr>" + "<td>" + "<a href="+artist.url+">"+artist.name+"</a>" + "</td>" + "<td>" + artist.playcount +"</td>" + "</tr>";
	        artistsTableBody.insertAdjacentHTML('beforeend', row);
	      });
	    }
	  })
	  .catch(error => console.error('Error fetching top artists:', error));
});

document.addEventListener('DOMContentLoaded', function() {
	const method = 'method=user.getweeklyartistchart'
	const limit = 5
	const meta = '&format=json'
	const url = url_base+method+user+key+meta
	console.log(url);

	fetch(url)
	  .then(response => response.json())
	  .then(function(data) {
	    const weeklyArtistsTableBody = document.querySelector("#weekly_artists tbody");
	    if (weeklyArtistsTableBody) {
	      data.weeklyartistchart.artist.forEach(function(artist, i) {
	        if (i < limit) {
	          const row = "<tr>" + "<td>" + "<a href="+artist.url+">"+artist.name+"</a>" + "</td>" + "<td>" + artist.playcount +"</td>" + "</tr>";
	          weeklyArtistsTableBody.insertAdjacentHTML('beforeend', row);
	        }
	      });
	    }
	  })
	  .catch(error => console.error('Error fetching weekly artists:', error));
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
