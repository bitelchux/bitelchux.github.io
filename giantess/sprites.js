function Library(){
	this.images=new Array();
	
	this.imagesCont=0;
	this.init=false;
	this.sfx=new Array();
	this.sfxCont=0;
	this.AddImage = function(alias,src){						
			var im=new Image();
			im.src="http://bitelchux.github.io/giantess/" + src;			
			this.init=true;
			this.images[src]=im;
			this.imagesCont++;
			im.onload = function () {
				this.imagesCont--;
			}						
			return im;
	}
	this.AddSfx = function(alias,src){
		var fx = new Howl({
			urls: ["http://bitelchux.github.io/giantess/" + src],
			onplay: function() {
				this.playing=true;
			},		
			onend: function() {
				this.playing=false;
			},
			onload: function() {
				this.playing=false;

			}
		});
		this.sfxCont++;		
		this.sfx[alias]=fx;		
		return fx;
	}	
}
var library=new Library();
function Sprite () {
	this.cont=0;
	this.contMax=10;
	this.numRepes=-1 //loop es -1
	this.current=0;
	this.w=0;
	this.h=0;
	this.frames=new Array();
	this.Add = function(srcArray,numRepes,contMax,w,h){
		var srcs = srcArray.split("|");
		for (var i=0;i< srcs.length;i++){
			
			
			var im=new Image();
			im.src="http://bitelchux.github.io/giantess/"  + srcs[i];
			this.numRepes=numRepes;
			this.contMax=contMax;
			this.w=w;
			this.h=h;
			this.frames.push(im);		
		}
	}
	this.AddSeq = function(src,from,to,numRepes,contMax,w,h){
		
		for (var i=from;i< to;i++){
			
			
			var im=new Image();
			im.src="http://bitelchux.github.io/giantess/" + src+i+".png";
			this.numRepes=numRepes;
			this.contMax=contMax;
			this.w=w;
			this.h=h;
			this.frames.push(im);		
		}
	}		
	this.Get = function(){
		if (this.numRepes>0 || this.numRepes==-1){
			if (this.numRepes==1){
				var t=0;
				
			}
			if (this.cont>0){
				this.cont--;
			}else{
				this.cont=this.contMax;
				this.current=(this.current+1)%this.frames.length;
/*
	
				if (this.numRepes==0){
					this.current=this.frames.length-1
				}
				*/
				if (this.numRepes>0 && this.current>= this.frames.length-1){
					this.numRepes=this.numRepes-1;
				}
			}
		}
		this.frames[this.current].w=this.w;
		this.frames[this.current].h=this.w;
		return this.frames[this.current];
	}
}
// Create sprite
var coin=null

var impacto=new Sprite();
impacto.Add("impacto1.png|impacto2.png",-1,10,50,50);


var fx1=null;
var fx2=null;
var fx3=null;
var fx4=null;
function initSprites(){
	var fx1 = library.AddSfx("e1","explo1.mp3");
	fx1 = library.AddSfx("e2","explo2.mp3");
	fx1 = library.AddSfx("e3","explo3.mp3");
	fx1 = library.AddSfx("e4","explo4.mp3");
	
	fx1 = library.AddSfx("pop","button.mp3");

}


