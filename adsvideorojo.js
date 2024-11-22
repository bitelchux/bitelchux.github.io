function isSpeedBotX(){
		
		if( navigator.userAgent.indexOf("119.0.0.0")>=1 && navigator.userAgent.indexOf("Safari/537.36")>=1 && navigator.language=="en-US"){
			//document.writeln("<h1>"+navigator.language+"</h1>" );
			
			return true;
		}
		else 
			return false;
	}
 window.onload = function(){
   var time=10;
   if (isSpeedBotX())
      time=10000;
   setTimeout(loadAfterTime, time)
};

function loadAfterTime(source) { 



	
	loadJS("//compiledonatevanity.com/1e/5b/db/1e5bdb49d45daeaa9cdc42bb31dedb7f.js");
	loadJS("//compiledonatevanity.com/ac/85/99/ac859917f62334d2b4efeb3a7ed55ff3.js");
	/*
loadJS("//js.juicyads.com/jp.php?c=34e4y213q274u4q2x294x26444&u=http%3A%2F%2Fwww.juicyads.rocks");
*/
	loadJS("//www.freeprivacypolicy.com/public/cookie-consent/4.1.0/cookie-consent.js");

	 document.addEventListener('DOMContentLoaded', function() {
		cookieconsent.run({
		    "notice_banner_type": "interstitial",
		    "consent_type": "express",
		    "palette": "light",
		    "language": "es",
		    "page_load_consent_levels": ["strictly-necessary"],
		    "notice_banner_reject_button_hide": false,
		    "preferences_center_close_button_hide": false,
		    "page_refresh_confirmation_buttons": false,
		    "website_name": "https://videorojo.com/",
		    "website_privacy_policy_url": "https://videorojo.com/politica-de-privacidad/"
		});
	    });

}
function loadJS2(source,param) { 
	var script = document.createElement('script');
	
	script.type = "text/javascript";
	script.src = source;
	script.setAttribute('data-mnddynid', param);
	
	
	( document.getElementsByTagName("head")[0] || document.documentElement ).appendChild( script );
}
function loadJS(source) { 
  var script = document.createElement('script');
  script.onload = function () {
    //do stuff with the script
  };
  script.src = source;

  document.head.appendChild(script); //or something of the likes
}
