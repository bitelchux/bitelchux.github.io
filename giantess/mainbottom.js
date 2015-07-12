var waves=1;
var timeinseconds=0;
var fpsOut = document.getElementById('fps');
var weaver;
function nextWave(){
  if (Game.playing){
	  //fpsOut.innerHTML = parseInt(fps) + "fps time:" + timeinseconds;
	  timeinseconds++;
	  if (timeinseconds%5==0)
		spawnFormacion(timeinseconds,waves++);	
	  if (timeinseconds%2==0)
		spawnSoldado();
	  weaver = window.setTimeout(nextWave, 1000);
	}
}    


$(document).ready(function(){
		var txt="<h3>INSTRUCTIONS<h3>";
		txt=txt+"1.SHOOT THE TANKS,COPTERS AND JETS<BR/>"
		txt=txt+"2.RECOVER ENERGY CRUSHING SOLDIERS<BR/>"
		txt=txt+"3.DONT SHOOT THE SKULLS!!!<BR/>"
		$(".msg").html(txt)
		$(".msg").show();
		initScroll();
		t=new Tools();
		
		document.body.onmousedown = function() { 
			t.mouseDown = 1;
		}
		document.body.onmouseup = function() {
			t.mouseDown = 0;
		}
		
		
		
		if ('ontouchstart' in document.documentElement) {	
			document.getElementById("gamemain").addEventListener("touchstart", tap,false);
			document.getElementById("gamemain").addEventListener("touchend", untap,false);
		  //document.getElementById("gamemain").addEventListener("touchmove", tap,false);	
		}else{
			document.getElementById("gamemain").addEventListener("mousedown", tap,false);		
			document.getElementById("gamemain").addEventListener("mouseup", untap,false);	
			//document.getElementById("gamemain").addEventListener("mousemove", tap,false);		
		}
		redim();
		initSprites();
		p=new Player();
		e=new Array();	
		tictac();	
	

});
