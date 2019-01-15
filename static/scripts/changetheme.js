var style_cookie_name = "style";
var style_domain = "localhost";
var count = 0;

function switch_style ()
{
// Script adapted from https://www.thesitewizard.com/javascripts/change-style-sheets.shtml
  var i, link_tag ;
  for (i = 0, link_tag = document.getElementsByTagName("link") ;
    i < link_tag.length ; i++ ) {
    if ((link_tag[i].rel.indexOf( "stylesheet" ) != -1) &&
      link_tag[i].title) {
      link_tag[i].disabled = true ;
      if (count%2==0) {
        link_tag[i].disabled = false ;
		count = count + 1;
		set_cookie( style_cookie_name, "Dark theme", style_domain );
		console.log("cookie set")
      }
	  else {
		link_tag[i].disabled = true;
		count = count + 1;
		set_cookie( style_cookie_name, "unset", style_domain );
		console.log("cookie unset")
	  }
    }
  }
}

function set_style_from_cookie()
{
	var css_title = get_cookie( style_cookie_name);
	console.log(css_title)
	if (css_title.length && css_title=="Dark theme") {
		switch_style();
	}
}

function set_cookie ( cookie_name, cookie_value, valid_domain )
{
    // https://www.thesitewizard.com/javascripts/cookies.shtml
    var domain_string = valid_domain ?
                       ("; domain=" + valid_domain) : '' ;
    document.cookie = cookie_name + "=" + encodeURIComponent( cookie_value ) + 
						";expires = 0;" +
						";path=/" + domain_string ;
}
function get_cookie ( cookie_name )
{
    // https://www.thesitewizard.com/javascripts/cookies.shtml
	var cookie_string = document.cookie ;
	if (cookie_string.length != 0) {
		var cookie_array = cookie_string.split( '; ' );
		for (i = 0 ; i < cookie_array.length ; i++) {
			cookie_value = cookie_array[i].match ( cookie_name + '=(.*)' );
			if (cookie_value != null) {
				return decodeURIComponent ( cookie_value[1] ) ;
			}
		}
	}
	return '' ;
}
