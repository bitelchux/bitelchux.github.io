//constantes
var W=0;
var H=0;
var PAUSED=false;
var countdown=30;
var time=0;
var currentLevel=1;

//Constantes
var R=0;
var L=1;
var U=2;
var D=3;

var PANDA=0;
var PPISA=1;


var p,t,e1;
var e;
function dbug(txt){
	$("#debug").html(txt);
}
function randomx(from,to)
{
    return Math.floor(Math.random()*(to-from+1)+from);
}
// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
 function aleatorio(inferior,superior){
    numPosibilidades = superior - inferior + 1
    aleat = Math.random() * numPosibilidades
    aleat = Math.floor(aleat)
    return parseInt(inferior) + aleat
}
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
var fps = 0, now, lastUpdate = (new Date)*1;
// The higher this value, the less the FPS will be affected by quick changes
// Setting this to 1 will show you the FPS of the last sampled frame only
var fpsFilter = 100;
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

var Game = {
	level:0, 	
	playing:false,
	paused:false,	
	menu:false,
	crushed:0,
	innerScenes:false,
	gameOver:false,
	numSoldiers:0,
	
	numEnemies:0,
	
	vida:100,
};
var animBarraVida=-666;
function drawUI(){
	t.ctx.fillStyle = 'orangered';
	t.ctx.textBaseline = 'top';
	t.ctx.fillStyle = "#ffffff";
	t.ctx.fillText  ('Crushed:'+Game.crushed, 0, t.c.height/10*t.scalefactor);
	
	
	var alto=parseInt(t.c.height/15);
	var margen=parseInt(alto/5);
	var vida=parseInt((Game.vida*(t.c.width-2*margen)/100));
	if (animBarraVida==-666)
		animBarraVida=vida;
	t.ctx.fillStyle = "#ffffff";
	t.ctx.fillRect(0,0,t.c.width,alto+margen);	
	t.ctx.fillStyle = "#000000";
	t.ctx.fillRect(margen,margen,t.c.width-2*margen,alto-margen);		
	t.ctx.fillStyle = "#ff0000";
	if (animBarraVida>=vida)
		animBarraVida--;
	t.ctx.fillRect(margen,margen,animBarraVida,alto-margen);	
	
}
function spawnSoldier(){
	
	//if (Game.remainingSoldiers>0){
	if (1==1){
		Game.numSoldiers++;		
		var enemy=new Enemy1();
		enemy.reset();		
		enemy.comun.arrayPosition="Soldier"+Game.numSoldiers;
		e["Soldier"+Game.numSoldiers]=enemy;
		return "Soldier"+Game.numSoldiers;
	}			
	
}

function spawn(tipo,x,y,incspeed){
	//if (Game.remainingSoldiers>0){
	if (1==1){
		Game.numEnemies++;	
			
		var enemy
		if (tipo=="Soldier")
			enemy=new Enemy0();
		if (tipo=="Tank")
			enemy=new Enemy1();
		if (tipo=="Tank2")
			enemy=new Enemy2();
		if (tipo=="Tank3")
			enemy=new Enemy3();
		if (tipo=="Tank4")
			enemy=new Enemy4();		
		if (tipo=="Bomb"){
			enemy=new Bomb();
			//OJO ajustar a difultad el tipo de movimiento
			enemy.comun.tipoMov=randi(1,3);
		}			
		enemy.comun.fromx=x;
		enemy.comun.fromy=y;
		enemy.comun.tipoEne=tipo;
		//
		if (incspeed!=0)
			enemy.comun.speed=enemy.comun.speed+incspeed
		enemy.reset();		

		enemy.comun.arrayPosition=tipo+Game.numEnemies;
		e[tipo+Game.numEnemies]=enemy;
		return tipo+Game.numEnemies;
	}
}
/*
function spawnSoldierWave(){
	var numEnemies=4;
	var separacionx=parseInt(t.w/numEnemies);	
	for (var i=0;i<numEnemies;i++){
		var rmin=0;
		var rmax=separacionx/10;
		var r=Math.floor((Math.random() * rmax) + rmin);
		var mid=spawnSoldier();
		e[mid].fromx=0+separacionx*i;
		e[mid].tox=e[mid].fromx;
	}
}
function spawnEnemiesWave(){
	var numEnemies=4;
	var separacionx=parseInt(t.w/numEnemies);	
	for (var i=0;i<numEnemies;i++){
		var rmin=0;
		var rmax=separacionx/10;
		var r=Math.floor((Math.random() * rmax) + rmin);
		var mid=spawnTank();
		e[mid].fromx=0+separacionx*i;
		e[mid].tox=e[mid].fromx;
	}
}
*/
function randi(min,max){
		var rmin=min;
		var rmax=max;
		return r=Math.floor((Math.random() * rmax) + rmin);
	
}
function spawnSoldado(){
	var fromx=randi(0,t.c.width);
	var fromy=randi(0,-1*t.c.height/10);
	var incspeed=0;
	mid=spawn("Soldier",fromx,fromy,incspeed);
	
}
function spawnFormacion(seconds,wave){
	
	var wnumEnemies=Math.min(20,parseInt(wave/3)+2)

	var wnumRows=randi(1,Math.min(t.maxEnemiesPerRow,wnumEnemies))
	var wnumEmeniesPerRow=parseInt(wnumEnemies/wnumRows)
	
	var formacion="";
	for (var i=0;i<wnumRows;i++){
		if (i!=0){
			formacion=formacion+".";
		}
		for (var j=0;j<wnumEmeniesPerRow;j++){
			
			if (j!=0)
				formacion=formacion+";x";
			else
				formacion=formacion+"x";
		}

	}
	var f=formacion;
	var bombs=new Array(randi(0,Math.min(parseInt(wnumEmeniesPerRow*wnumRows/3),parseInt(wave/5))));
	for (var k=0;k<bombs.length;k++){
		bombs[k]=randi(0,parseInt(wnumEmeniesPerRow*wnumRows));
		
	}
	fpsOut.innerHTML =f+fpsOut.innerHTML;
	var rows=f.split(".");

	r=randi(0,70);
	var randomizePos=false
	if (wave*1000>=r)
		randomizePos=true;
	
	for (var i=0;i<rows.length;i++){
		var cols=rows[i].split(";");
		var numEnemies=cols.length;
		var separacionx=parseInt(t.c.width/numEnemies);	
		for (var j=0;j<numEnemies;j++){

		//	var r=randi(0,separacionx/10)
		//	var tipo=cols[j].split("|")
		//	var r2=randi(0,tipo.length-1)
			if (bombs.indexOf(i*j+j)>=0){
				cols[j]="o";
				tipo=cols[j]+randi(1,parseInt(wave/20));
			}else{
				tipo=cols[j]+randi(1,parseInt(wave/10));
			}
			if (tipo!=""){
				var fromx=0;
				var fromy=0;
				if (wnumRows!=1){
					if (wave>=10){
						fromx=randi(0,t.c.width);
					}
				}
				else{
					if (wave>=20 && randomizePos){
						fromx=0-i*(t.c.width/randi(5,15));
					}else{
						fromx=0+separacionx/2 + separacionx*j;
					}
				}
				if (wave>=20 && randomizePos){
					fromy=0-i*(t.c.height/randi(5,15));
				}else{
					fromy=0-i*(t.c.height/10);
				}
				var mid=null;
				var incspeed=randi(0,parseInt(wave/10));
				if (tipo=="x1"){
					
					mid=spawn("Tank",fromx,fromy,incspeed);
				}
				if (tipo=="x2"){
					mid=spawn("Tank2",fromx-separacionx/2 ,fromy,incspeed);
				}
				if (tipo=="x3"){
					mid=spawn("Tank3",fromx,fromy,incspeed);
				}
				if (tipo=="x4"){
					mid=spawn("Tank4",fromx,fromy,incspeed);
				}
				if (tipo.indexOf("o")>=0){
					mid=spawn("Bomb",fromx,fromy,incspeed);
				}			
				
				
			}
		}	
	}
	
}

function initLevel(){
	//rellenar arrays
	
}
function Tools () {
	this.mouseDown=0;
	this.maxw=720;
	this.maxh=960;
	this.ratiowh=0.75
	this.maxEnemiesPerRow=6;
	this.scalefactor=1;
	
	this.w=0; //de la pantalla
	this.h=0;

	this.speed=1;
	
	this.cursorX=0;
	this.cursorY=0;
	
	this.ctx=null;
	this.ctx2=null;
	this.c=null; //canvas visible
    this.c2=null;//canvas oculto
	this.paint=null;
	this.contstatus=10;
	this.getCtx = function(){
		if (this.c==null){
			this.c=document.getElementById("gamemain")		
		}
		this.ctx=document.getElementById("gamemain").getContext("2d");
		this.ctx.font = '2.0em Monstruo';
		if (this.c2==null)
			this.c2=document.createElement('canvas');
		this.c2.width = this.c.width;
		this.c2.height = this.c.height;
		this.ctx2= this.c2.getContext('2d');
		
	}
	this.clearCanvas=function(){
		if (this.c==null)
			this.c=document.getElementById("gamemain")
		
		//this.ctx.drawImage(this.c2, 0, 0);
		//this.c.width = this.c.width;
		this.ctx.clearRect(0, 0, this.c.width, this.c.height);
	}

	this.paintDot = function(x,y,color){
		this.ctx.fillStyle = color;
		this.ctx.fillRect(x,y,20,20);
	}
	this.paintLaser = function(x,y){
		this.ctx.lineWidth = 15*this.scalefactor;
		this.ctx.fillStyle = "#ff0000";
		this.ctx.beginPath();
		this.ctx.moveTo(this.c.width/2, this.c.height);
		this.ctx.lineTo(x, y);
		this.ctx.stroke();
		this.paintSprite(x-40,y-40,80,80,impacto.Get());
	}	
	this.paintSprite = function(x,y,w,h,img){
		this.ctx.drawImage(img, x,y, w*this.scalefactor, h*this.scalefactor);
	}	
	this.paintSpriteFromBottom = function(x,y,w,h,img){
		this.ctx.drawImage(img, x,t.c.height-h*this.scalefactor-y, w*this.scalefactor, h*this.scalefactor);
		//this.ctx.drawImage(img, x,200, w*this.scalefactor, h*this.scalefactor);
	}	
	
	
	this.redim = function(){
		var h=this.h
		var w=this.w;
		var ratiowh=this.ratiowh;
		if (h<w){
			//ojo
			//alert("dale vuelta");
		}
		if (1==1){			
			if (w/ratiowh<=h){
				if (w>this.maxw) w=this.maxw;
				$("#main").width(w);
				$("#main").height(w/ratiowh);
			}else{
				if (h>this.maxh) h=this.maxh;
				$("#main").width(h*ratiowh);
				$("#main").height(h);
			}
			this.w=$(window).width();
			this.h=$(window).height();
			
			//colocar en la mita de la pantalla
			var difw=Math.abs(this.w-$("#main").width())/2;
			var difh=Math.abs(this.h-$("#main").height())/2;
			
			$("#main").css('left', difw+'px');
			$("#main").css('top', difh+'px');
			this.scalefactor=$("#main").width()/this.maxw
	
			document.getElementById("gamemain").width  =$("#main").width();
			document.getElementById("gamemain").height = $("#main").height() ;
			document.getElementById("gamebackground").width  =$("#main").width();
			document.getElementById("gamebackground").height = $("#main").height() ;
		
			
			this.getCtx();					
		}
		
	}

}

function untap (e) {	
	e.preventDefault();
	p.disparando=false;		
}
var canvasScaleRatioX=0;
var canvasScaleRatioY=0;

function tap (e) {
	e.preventDefault();
	if (canvasScaleRatioX==0) canvasScaleRatioX = t.c.width / t.c.offsetWidth;
	if (canvasScaleRatioY==0) canvasScaleRatioY = t.c.height / t.c.offsetHeight;
	var loc = {};
	var pos= 0;
	var tapX=0;
	var tapY=0;
	if ('ontouchstart' in document.documentElement) {
		pos = getElementPosition(t.c);
		tapX = e.targetTouches ? e.targetTouches[0].pageX : e.pageX;
		tapY = e.targetTouches ? e.targetTouches[0].pageY : e.pageY;		
	}else{
		pos = getElementPosition(t.c);
		tapX = e.pageX;
		tapY = e.pageY;				
	}
	loc.x = (tapX - pos.x) * canvasScaleRatioX;
	loc.y = (tapY - pos.y) * canvasScaleRatioY;
	t.cursorX=loc.x;
	t.cursorY=loc.y;
	p.disparando=true;

}
function getElementPosition (element) {

   var parentOffset,
	   pos = {
		   x: element.offsetLeft,
		   y: element.offsetTop 
	   };
	   
   if (element.offsetParent) {
	   parentOffset = getElementPosition(element.offsetParent);
	   pos.x += parentOffset.x;
	   pos.y += parentOffset.y;
   }
   return pos;
}

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}
function clone(obj) {
	if(obj === null || typeof(obj) !== 'object' || 'isActiveClone' in obj)
		return obj;

	var temp = obj.constructor(); // changed

	for(var key in obj) {
		if(Object.prototype.hasOwnProperty.call(obj, key)) {
			obj['isActiveClone'] = null;
			temp[key] = clone(obj[key]);
			delete obj['isActiveClone'];
		}
	}    

	return temp;
}

