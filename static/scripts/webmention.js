// Source: https://gist.github.com/am1t/7295b4eaf101372ea71c877cfd8be694

var post_url = window.location.href;

$(document).ready(function(){	
	$("ul#mentions-list").empty();
  $.getJSON("https://webmention.io/api/mentions?token=I5QSyPcfY5uPRzrmuznRxQ&jsonp=?", {
    target: post_url
  }, function(data){
      console.log(data.links)
	var social_media_likes = "";
	var social_media_repost = "";
	var social_media_post = "";
	if(data.links.length !== 0){
		$("#post-mentions").show();
        console.log("Read out webmentions")
	}
      else{
          console.log("No Data!")
      }

  	$.each(data.links, function(i, v){
		var activity_type = data.links[i].activity.type;
		  
		if(data.links[i].data.author && data.links[i].data.author.name){
		var men_content = "";
		if(activity_type && activity_type == "like"){
		  if(!social_media_likes){
		    social_media_likes = "<li class=\"mention-social\"> ";
		  }
		  social_media_likes = social_media_likes + 
		  "<a href=\"" + data.links[i].data.url + "\">"
		    + data.links[i].data.author.name + "</a>, ";
		} else if(activity_type && activity_type == "repost"){
		  if(!social_media_repost){
		    social_media_repost = "<li class=\"mention-social\"> ";
		  }
		  social_media_repost = social_media_repost + 
		  "<a href=\"" + data.links[i].data.url + "\">"
		    + data.links[i].data.author.name + "</a>, ";
		} else if(activity_type && activity_type == "link"){
		  if(!social_media_post){
		    social_media_post = "<li class=\"mention-social\"> ";
		  }
		  social_media_post = social_media_post + 
		  "<a href=\"" + data.links[i].data.url + "\">"
		    + data.links[i].data.author.name + "</a>, ";
		} else if(activity_type && activity_type == "reply"){
		      let mention_date = new Date(data.links[i].verified_date);
		    if(data.links[i].data.content) {
		      men_content = data.links[i].data.content;
		    }
		  $("ul#mentions-list").prepend( "<li class=\"mention\">"
		    + "<div class=\"mention-author u-author\">" 
		    + "<u><a href=\"" + data.links[i].data.author.url + "\" >"
		    + data.links[i].data.author.name + "</a></u>"
		    + "<a href=\"" + data.links[i].data.url + "\">"
		    + "replied at <time>" + mention_date.getUTCDate() + "/" + (mention_date.getUTCMonth() + 1) 
		    + "/" + mention_date.getUTCFullYear()
			+ "</time></a>:</div>"
		    + "<div class=\"mention-text\">" + men_content + "</div>"
			+ "</li>");
		}
	   }	
    });
    // Insert above if I want picture again
	// + "title=\"" + data.links[i].data.author.name + "\" width=\"40\" >" 
	//+ "<img src=\"" + data.links[i].data.author.photo + "\" class=\"u-photo\"" 
    if(social_media_post){
		social_media_post = social_media_post.substr(0, social_media_post.length - 2);
		social_media_post = social_media_post + " <span class=\"commented\">linked to this.</span></li>";
		$("ul#mentions-list").prepend(social_media_post);
    }			
    if(social_media_repost){
		social_media_repost = social_media_repost.substr(0, social_media_repost.length - 2);
    	social_media_repost = social_media_repost + " <span class=\"commented\">reposted this.</span></li>";
		$("ul#mentions-list").prepend(social_media_repost);
    }
    if(social_media_likes){
		social_media_likes = social_media_likes.substr(0, social_media_likes.length - 2);
		social_media_likes = social_media_likes  + " <span class=\"commented\">&#10084 this.</span></li>";
		$("ul#mentions-list").prepend(social_media_likes);
    }
  });
});

