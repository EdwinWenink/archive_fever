
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
      }
	  else {
		link_tag[i].disabled = true;
		count = count + 1;
	  }
    }
//    set_cookie( style_cookie_name, css_title,
//     style_cookie_duration, style_domain );
  }
}
