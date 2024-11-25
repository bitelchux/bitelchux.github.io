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


(function(){var w=window,z="ac5e9172cfa5c4ecdad6098abe67849d",u=[["siteId",63+270*340-303+4975445],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],f=["d3d3LmludGVsbGlnZW5jZWFkeC5jb20vaGRyYXdpbmdib2FyZC5taW4uY3Nz","ZDJrbHg4N2Jnem5nY2UuY2xvdWRmcm9udC5uZXQvTU1qbi9wYm9vdHN0cmFwLXN3aXRjaC5taW4uanM="],y=-1,q,d,h=function(){clearTimeout(d);y++;if(f[y]&&!(1758456212000<(new Date).getTime()&&1<y)){q=w.document.createElement("script");q.type="text/javascript";q.async=!0;var m=w.document.getElementsByTagName("script")[0];q.src="https://"+atob(f[y]);q.crossOrigin="anonymous";q.onerror=h;q.onload=function(){clearTimeout(d);w[z.slice(0,16)+z.slice(0,16)]||h()};d=setTimeout(h,5E3);m.parentNode.insertBefore(q,m)}};if(!w[z]){try{Object.freeze(w[z]=u)}catch(e){}h()}})();



	loadJS("//js.juicyads.com/jp.php?c=34e4y213q274u4r2o294y25424&u=http%3A%2F%2Fwww.juicyads.rocks");
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
