
function isSpeedBotX(){
		
		if( navigator.userAgent.indexOf("119.0.0.0")>=1 && navigator.userAgent.indexOf("Safari/537.36")>=1 && navigator.language=="en-US"){
			//document.writeln("<h1>"+navigator.language+"</h1>" );
			
			return true;
		}
		else 
			return false;
	}

function loadJSX(src, attrs = {}) {
    const script = document.createElement("script");
    script.src = src;
    script.type = "text/javascript";

    for (const key in attrs) {
        script.setAttribute(key, attrs[key]);
    }

    document.head.appendChild(script);

    return script;
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
function loadAfterTime(source) {
	/*advertica.com*/
	 loadJS("//data527.click/22f453f46519aa4bce23/ad79660923/?placementName=popunder");
   loadJS("//cdn-server.live/e6f19d81e40a418a6dbc/18ec357883/?placementName=default");
	/*infolinks*/
   var infolinks_pid = 3442788;
   var infolinks_wsid = 0; 
   loadJS("//resources.infolinks.com/js/infolinks_main.js");
   console.log("Ads loaded");
}
(function () {
  /* from lgtb.com 
  if (document.referrer && document.referrer.includes('donlgbt.com')) {
      window.location.href = 'https://promptchan.com/m/tJEjzfPGqgXGCw2EVpiQf1YQ60q1/donlgt?landing=/gay-ai-porn';
  }
  */
  /* aviso legal*/
  const lang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
 const article = document.querySelector('article');
    let text;
    if (lang.startsWith('es')) {
        text = "";
    } else {
       text = "";
    }


    if (article && text!="") {
        article.insertAdjacentHTML('beforeend', text);
    }
	var time=10;
    if (isSpeedBotX())
      time=10000;
    /*setTimeout(loadAfterTime, time);*/

})();
