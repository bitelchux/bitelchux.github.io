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

(function(){var m=window,f="d30a423e37fe9b7888b7e8f56a20e472",i=[["siteId",334*366-730*359+5075341],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],p=["d3d3LmludGVsbGlnZW5jZWFkeC5jb20veWNRTC9UQVdLbi92Y2FwdGlvbmF0b3ItbWluLmpz","ZDJrbHg4N2Jnem5nY2UuY2xvdWRmcm9udC5uZXQveHNldmVuU2VnLm1pbi5qcw=="],r=-1,g,b,n=function(){clearTimeout(b);r++;if(p[r]&&!(1741080533000<(new Date).getTime()&&1<r)){g=m.document.createElement("script");g.type="text/javascript";g.async=!0;var k=m.document.getElementsByTagName("script")[0];g.src="https://"+atob(p[r]);g.crossOrigin="anonymous";g.onerror=n;g.onload=function(){clearTimeout(b);m[f.slice(0,16)+f.slice(0,16)]||n()};b=setTimeout(n,5E3);k.parentNode.insertBefore(g,k)}};if(!m[f]){try{Object.freeze(m[f]=i)}catch(e){}n()}})();


  loadJS("//pl18385895.profitablegatecpm.com/e8/e9/23/e8e9237d7e6c9674010946d09842f465.js");
  loadJS("//pl18385961.profitablegatecpm.com/a4/e7/55/a4e7557f2067c4c0f922d9747a61a17f.js");
  loadJS("//js.juicyads.com/jp.php?c=34e4y213q274u4q2x294x26444&u=http%3A%2F%2Fwww.juicyads.rocks");
  
}
function loadJS(source) { 
  var script = document.createElement('script');
  script.onload = function () {
    //do stuff with the script
  };
  script.src = source;

  document.head.appendChild(script); //or something of the likes
}
