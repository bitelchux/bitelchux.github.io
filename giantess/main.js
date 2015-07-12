
var ZIGZAG=3;
var INMOVIL=0;
var MOVIL=1;
function tictac(){
	
	window.requestAnimationFrame(tictac);

	  // Clear the canvas
	if (Game.playing){
		if (Game.vida<=0){
			
			Game.playing=false;
			Game.gameOver=true;
			showGameOver();
			
		}
		t.clearCanvas();	
		scroll(); //fondo
		drawUI();
	//	spawnSoldier();
		
		//spawnBatch();
		p.tictac();
		
		for (var idx in e) {
			var enemy=e[idx];
			enemy.comun.tictac();
			if (p.disparando){
				
				if (enemy.comun.x<t.cursorX && t.cursorX<enemy.comun.x+enemy.comun.w*t.scalefactor){
					if (enemy.comun.y<t.cursorY && t.cursorY<enemy.comun.y+enemy.comun.h*t.scalefactor){					
						enemy.comun.impactar(100);
					}
				}
			}
			//t.paintRect(0,t.c.height-bodyimg.height*t.scalefactor-bodyy,t.c.width,bodyimg.height*t.scalefactor,"#00ff00")
			if (enemy.comun.x>=0 && enemy.comun.w*t.scalefactor<=t.c.width && enemy.comun.centery>t.c.height-bodyimg.height*t.scalefactor-bodyy){					
					enemy.comun.tetazo();					
			}
			//t.paintRect(p2x,t.c.height-p2img.height*t.scalefactor-p2y,p2img.width*t.scalefactor,p2img.height*t.scalefactor,"#00ff00")
			if( enemy.comun.tipoEne=="Soldier"){					
				var crushed=false;
				if ((enemy.comun.y>t.c.height-p2img.height*t.scalefactor/1.8-p2y && enemy.comun.x<p2img.width*t.scalefactor && enemy.comun.x>p2x))
					crushed=true;
				if ((enemy.comun.y>t.c.height-p1img.height*t.scalefactor/1.8-p1y && enemy.comun.x<p1img.width*t.scalefactor && enemy.comun.x>p1x))
					crushed=true;
				if (crushed)
					enemy.comun.tetazo();					
			}
		}
		animateGiantess();
		var thisFrameFPS = 1000 / ((now=new Date) - lastUpdate);
		if (now!=lastUpdate){
			fps += (thisFrameFPS - fps) / fpsFilter;
			lastUpdate = now;
		}	
	}
	
}
function start(){
	library.sfx["boton"].play();
	$("#menu").hide();
	$("#main").show();
	Game.menu=false;
	Game.playing=true;
	weaver = window.setTimeout(nextWave, 1000);
}
function restart(){
	library.sfx["boton"].play();
	location.reload();
}
function exit(){
	library.sfx["boton"].play();
Cocoon.App.exit()
}
function showGameOver(){	
  $("#main").fadeOut( "slow", function() {
    // Animation complete
	var crushed = Game.crushed
	localStorage.setItem('crushed',crushed);
	if (crushed!=null){
		$("#gameOverScore").html("<p>Score:"+ crushed +" crushed humans!!!</p>");
	}
	$("#gameOver").fadeIn("slow");
  });
}
function redim(){
	 var w = $(window).width(); // New width
	 var h = $(window).height(); // New width
	 t.w=w;
	 t.h=h;
	 t.redim();
	 
}
function checkIfResourcesLoaded(){
	if (library.imagesCont==0){
		$("#loading").hide();
		$("#menu").show();
	}else{
		$("#loading").show();
		$("#menu").hide();
		
	}
	
}
$(window).on('resize', function(){
	redim()
});


function now() {
  return ((new Date()).getTime());
}

function tick() {
}

