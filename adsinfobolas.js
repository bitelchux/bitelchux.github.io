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
