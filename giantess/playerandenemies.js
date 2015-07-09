
var ZIGZAG=3;
var INMOVIL=0;
var MOVIL=1;
function Player() {
	this.disparando=false;
	this.andando=1;
	
	this.tictac=function(){
		if (this.disparando){			
			t.paintLaser(t.cursorX,t.cursorY);
		}
	}	
}
function BaseEnemy () {
	//estados
	//constanes
	this.ANDANDO="andando";
	this.MURIENDO="muriendo";
	this.MURIENDO2="muriendo2";
	this.MUERTO="muerto";
	this.INMUNE="inmune";
	this.status=this.ANDANDO;
	
	this.contstatus=new Array()
	this.contstatus[this.ANDANDO]=0;	
	this.contstatus[this.MURIENDO]=50;
	this.contstatus[this.MURIENDO2]=50;
	this.contstatus[this.MUERTO]=100;

	
	this.arrayPosition=-1;
	this.image=new Array();
	this.sprites=new Array()
	this.sprites[this.ANDANDO]=new Sprite();	
	this.sprites[this.MURIENDO]=new Sprite();
	this.sprites[this.MURIENDO2]=new Sprite();
	this.sprites[this.MUERTO]=new Sprite();
	
	
	
	
	this.tipoMov=0;
	this.tipoEne="";
	this.damage=0;
	//MOVIMIENTO
	this.x=0;
	this.y=0;	
	this.fromx=0;
	this.fromy=0;
	this.tox=0;
	this.toy=0;
	this.stepMaxcont=0;
	this.stepCont=0;
	this.incx=0;
	this.incy=0;
	//this.w=100;
	//this.h=100;
	this.centrox=0;
	this.centroy=0;
	this.energia=100;	
	this.cont=0;
	this.speed=1;
	this.teteado=false;
	this.resetcontstatus=function(){
		this.contstatus=t.contstatus;
	}
	this.seno=function(x) {
		return 50 * Math.sin(0.05 * x) + 50;
	}
	this.impactar=function(cantidad){		
		if (this.status!=this.INMUNE){
			this.energia=this.energia-cantidad;
			if (this.tipoEne!="Soldier"){
				var r=randi(1,4)
				if (!library.sfx["e"+r].playing) library.sfx["e"+r].play();
			}else{
				if (!library.sfx["pop"].playing) library.sfx["pop"].play();
			}
	
			if (this.energia<=0){
				this.energia=0;
				this.status=this.MURIENDO;
			}else{
				this.status=this.INMUNE;
			}
		}			
	}	
	this.tetazo=function(){		
		if(!this.teteado){
			if (this.tipoEne=="Soldier"){
				Game.vida=Game.vida+this.damage;
				Game.crushed++;
				this.status=this.MURIENDO2;
				
			}else{
				Game.vida=Game.vida-this.damage;
				this.impactar(100);
			}
			
			this.teteado=true;
		}
	}
	this.tictac=function(){
		if (this.stepCont>0){
			this.stepCont
		}
		if (p.andando>=0){
			if (this.tipoMov==ZIGZAG){
				this.y=this.y+this.incy;
				this.x=this.fromx+this.seno(this.y);
			}
			else{		
				this.y=this.y+this.incy;
				this.x=this.x+this.incx;
			}
		}
		
		if (this.status==this.INMUNE){			
			this.contstatus[this.INMUNE]=this.contstatus[this.INMUNE]-1;
			if (this.contstatus[this.INMUNE]<=0){
				this.status=this.ANDANDO;
			}
		}
		if (this.status==this.MURIENDO){			
			this.contstatus[this.MURIENDO]=this.contstatus[this.MURIENDO]-1;
			if (this.contstatus[this.MURIENDO]<=0){
				this.status=this.MUERTO;				
			}
			
		}
		if (this.status==this.MUERTO){			
			this.contstatus[this.MUERTO]=this.contstatus[this.MUERTO]-1;
			if (this.contstatus[this.MUERTO]<=0){
				delete e[this.arrayPosition];
			}			
		}		

		/*
		var color="blue";
		if (this.tipo2==this.ZIGZAG){
			color="green";
			
			if (this.direccion==R){
		
				this.x=this.x+(this.speed);
				if (--this.contstatus<=0 || this.x>=t.w){
					this.direccion=L;
					this.resetcontstatus()
				}
			}
			if (this.direccion==L){
				this.x=this.x-(this.speed);
				if (--this.contstatus<=0 || this.x<=0){
					this.direccion=R;
					this.resetcontstatus()
				}				
			}
			
		}
		*/

		if (this.inmune<=0 || this.inmune%10==0){
	
			var img=this.sprites["andando"].Get();
			t.paintSprite(this.x,this.y,img.w,img.h,img);
		}
		else if (this.status==this.ANDANDO){
			var img=this.sprites[this.ANDANDO].Get();
			t.paintSprite(this.x,this.y,img.w,img.h,img);
		}
		else if (this.status==this.MURIENDO2){
			var img=this.sprites["muriendo2"].Get();
			t.paintSprite(this.x,this.y,img.w,img.h,img);
		}else if (this.disparando){
			var img=this.sprites["disparando"].Get();
			t.paintSprite(this.x,this.y,img.w,img.h,img);
		}else if (this.status==this.MURIENDO){
			var img=this.sprites[this.MURIENDO].Get();
			
			t.paintSprite(this.x,this.y,img.w,img.h,img);
			if (this.tipoEne!="Soldier"){
				t.paintSprite(this.x-10,this.y-10,img.w,img.h,img);
				t.paintSprite(this.x-20,this.y+20,img.w,img.h,img);
			}
		}else if (this.status==this.MUERTO){
			var img=this.sprites[this.MUERTO].Get();
			t.paintSprite(this.x,this.y,img.w,img.h,img);
		}
		//if (this.x>t.maxw) {dbug("limit x");this.reset()}
		if (this.y>t.c.height) {
			
			/*
			if (this.muerto>0 || this.muriendo>0)
				Game.vida=Game.vida+this.damage;
			*/
			delete e[this.arrayPosition];
		}
	}	
	
	

}
//soldier
function Enemy0 () {
	this.comun=new BaseEnemy();
	this.comun.speed=1; //max vel 4
	this.reset=function(){
		this.comun.damage=2;
		this.comun.tipoMov=1;	
		
		//this.comun.fromx=aleatorio(0,t.c.width);
		//this.comun.fromy=0;		
		this.comun.x=this.comun.fromx;
		this.comun.y=this.comun.fromy;
		
		this.comun.tox=this.comun.fromx;
		this.comun.toy=t.c.height;
		this.comun.w=100;
		this.comun.h=100;		
		
		
		this.comun.stepMaxcont=parseInt(t.c.height/this.comun.speed)
		this.comun.incx=0;
		//this.comun.incy=(this.comun.toy-this.comun.fromy)/(t.c.height/this.comun.speed)
		this.comun.incy=(this.comun.toy)/(t.c.height/this.comun.speed)
		//fx2.play();
		this.comun.incy=this.comun.incy*t.scalefactor;
		
		

		//this.comun.sprites[this.comun.ANDANDO].Add("soldadodispara_1.png|soldadodispara_2.png|soldadodispara_3.png",-1,10,100,100);
		this.comun.sprites[this.comun.ANDANDO].Add("soldado1.png|soldado2.png",-1,10,this.comun.w*2,this.comun.h*2);
		//this.comun.sprites[this.comun.ANDANDO].Add("e1.png",-1,10,50,50);
		this.comun.sprites[this.comun.MURIENDO].AddSeq("soldadom",1,6,1,10,this.comun.w*2,this.comun.h*2);
		this.comun.sprites[this.comun.MURIENDO2].Add("soldadomx.png",1,10,this.comun.w*2,this.comun.h*2);
		//this.comun.sprites[this.comun.MURIENDO].Add("soldadomuriendo_1.png|soldadomuriendo_2.png",-1,10,50,50);
		this.comun.sprites[this.comun.MUERTO].Add("soldadomuerto.png",0,10,this.comun.w*2,this.comun.h*2);
	}

}
//tank1
function Enemy1 () {
	this.comun=new BaseEnemy();
	this.comun.speed=1; //max vel 4
	this.reset=function(){
		this.comun.damage=10;
		this.comun.tipoMov=1;	
		if (!library.sfx["pop"].playing) library.sfx["pop"].play();
		//this.comun.fromx=aleatorio(0,t.c.width);
		//this.comun.fromy=0;		
		this.comun.x=this.comun.fromx;
		this.comun.y=this.comun.fromy;
		
		this.comun.tox=this.comun.fromx;
		this.comun.toy=t.c.height;
		this.comun.w=100;
		this.comun.h=100;		
		
		
		this.comun.stepMaxcont=parseInt(t.c.height/this.comun.speed)
		this.comun.incx=0;
		//this.comun.incy=(this.comun.toy-this.comun.fromy)/(t.c.height/this.comun.speed)
		this.comun.incy=(this.comun.toy)/(t.c.height/this.comun.speed)
		//fx2.play();
		this.comun.incy=this.comun.incy*t.scalefactor;
		
		

		//this.comun.sprites[this.comun.ANDANDO].Add("soldadodispara_1.png|soldadodispara_2.png|soldadodispara_3.png",-1,10,100,100);
		this.comun.sprites[this.comun.ANDANDO].AddSeq("tank",1,7,-1,10,this.comun.w,this.comun.h);
		//this.comun.sprites[this.comun.ANDANDO].Add("e1.png",-1,10,50,50);
		this.comun.sprites[this.comun.MURIENDO].AddSeq("explo",1,12,1,2,this.comun.w*2,this.comun.h*2);
		//this.comun.sprites[this.comun.MURIENDO].Add("soldadomuriendo_1.png|soldadomuriendo_2.png",-1,10,50,50);
		this.comun.sprites[this.comun.MUERTO].Add("soldadomuerto.png",0,10,50,50);
	}

}
//copter
function Enemy2 () {
	this.comun=new BaseEnemy();
	this.comun.speed=4; //max vel 4
	this.reset=function(){
		this.comun.damage=10;
		this.comun.tipoMov=3;
		
		//this.comun.fromx=aleatorio(0,t.c.width);
		//this.comun.fromy=0;	
		this.comun.w=100;
		this.comun.h=100;		
		this.comun.x=this.comun.fromx;
		this.comun.y=this.comun.fromy;
		this.comun.tox=aleatorio(0,t.c.width);
		this.comun.toy=t.c.height;
		
		this.comun.stepMaxcont=parseInt(t.c.height/this.comun.speed)
		this.comun.incx=(this.comun.tox-this.comun.fromx)/(t.c.height/this.comun.speed)
		this.comun.incy=(this.comun.toy)/(t.c.height/this.comun.speed)
		
		this.comun.incx=this.comun.incx*t.scalefactor;
		this.comun.incy=this.comun.incy*t.scalefactor;
		//fx3.play();
		
		this.comun.sprites[this.comun.ANDANDO].AddSeq("copter",1,4,-1,2,this.comun.w,this.comun.h);
		this.comun.sprites[this.comun.MURIENDO].AddSeq("explo",1,12,1,2,this.comun.w*2,this.comun.h*2);
		//this.comun.sprites[this.comun.ANDANDO].Add("e2.png",-1,10,60,60);
		//this.comun.sprites[this.comun.MURIENDO].Add("soldadomuriendo_1.png|soldadomuriendo_2.png",-1,10,50,50);
		this.comun.sprites[this.comun.MUERTO].Add("soldadomuerto.png",0,10,50,50);
	}
}
/*
function Enemy3 () {
	this.comun=new BaseEnemy();
	this.reset=function(){
		this.comun.damage=10;
		this.comun.tipo=3;	
		
		this.comun.fromx=aleatorio(0,t.c.width);
		this.comun.fromy=0;		
		this.comun.x=this.comun.fromx;
		this.comun.y=this.comun.fromy;
	//	this.comun.w=50;
	//	this.comun.h=50;
		this.comun.tox=this.comun.fromx;
		this.comun.toy=t.c.height;
		this.comun.speed=2; //max vel 4
		this.comun.stepMaxcont=parseInt(t.c.height/this.comun.speed)
		this.comun.incx=0;
		this.comun.incy=(this.comun.toy-this.comun.fromy)/(t.c.height/this.comun.speed)
		this.comun.incy=this.comun.incy*t.scalefactor;
	}
}
*/
//copterAPAche
function Enemy3 () {
	this.comun=new BaseEnemy();
	this.comun.speed=2; //max vel 4
	this.reset=function(){
		this.comun.damage=10;
		this.comun.tipoMov=1;	
		
		//this.comun.fromx=aleatorio(0,t.c.width);
		//this.comun.fromy=0;		
		this.comun.x=this.comun.fromx;
		this.comun.y=this.comun.fromy;
		
		this.comun.tox=this.comun.fromx;
		this.comun.toy=t.c.height;
		this.comun.w=100;
		this.comun.h=100;		
		
		
		this.comun.stepMaxcont=parseInt(t.c.height/this.comun.speed)
		this.comun.incx=0;
		this.comun.incy=(this.comun.toy)/(t.c.height/this.comun.speed)
		//fx2.play();
		this.comun.incy=this.comun.incy*t.scalefactor;
		
		
	//this.comun.sprites[this.comun.ANDANDO].Add("soldadodispara_1.png|soldadodispara_2.png|soldadodispara_3.png",-1,10,100,100);
		this.comun.sprites[this.comun.ANDANDO].AddSeq("copterapache",1,4,-1,10,this.comun.w,this.comun.h);
		//this.comun.sprites[this.comun.ANDANDO].Add("e1.png",-1,10,50,50);
		this.comun.sprites[this.comun.MURIENDO].AddSeq("explo",1,12,1,2,this.comun.w*2,this.comun.h*2);
		//this.comun.sprites[this.comun.MURIENDO].Add("soldadomuriendo_1.png|soldadomuriendo_2.png",-1,10,50,50);
		this.comun.sprites[this.comun.MUERTO].Add("soldadomuerto.png",0,10,50,50);
		/*
		//this.comun.sprites[this.comun.ANDANDO].Add("soldadodispara_1.png|soldadodispara_2.png|soldadodispara_3.png",-1,10,100,100);
		this.comun.sprites[this.comun.ANDANDO].Add("e3.png",-1,10,70,70);
		this.comun.sprites[this.comun.MURIENDO].Add("soldadomuriendo_1.png|soldadomuriendo_2.png",-1,10,50,50);
		this.comun.sprites[this.comun.MUERTO].Add("soldadomuerto.png",0,10,50,50);
		*/
	}

}

function Enemy4 () {
	this.comun=new BaseEnemy();
	this.comun.speed=2; //max vel 4
	this.reset=function(){
		this.comun.damage=10;
		this.comun.tipoMov=1;	
		
		//this.comun.fromx=aleatorio(0,t.c.width);
		//this.comun.fromy=0;		
		this.comun.x=this.comun.fromx;
		this.comun.y=this.comun.fromy;
		
		this.comun.tox=this.comun.fromx;
		this.comun.toy=t.c.height;
		this.comun.w=100;
		this.comun.h=100;		
		
		
		this.comun.stepMaxcont=parseInt(t.c.height/this.comun.speed)
		this.comun.incx=0;
		this.comun.incy=(this.comun.toy)/(t.c.height/this.comun.speed)
		//fx2.play();
		this.comun.incy=this.comun.incy*t.scalefactor;
		
		

		//this.comun.sprites[this.comun.ANDANDO].Add("soldadodispara_1.png|soldadodispara_2.png|soldadodispara_3.png",-1,10,100,100);
		this.comun.sprites[this.comun.ANDANDO].Add("jet1.png|jet2.png",-1,10,this.comun.w,this.comun.h);
		//this.comun.sprites[this.comun.ANDANDO].Add("e1.png",-1,10,50,50);
		this.comun.sprites[this.comun.MURIENDO].AddSeq("explo",1,12,1,2,this.comun.w*2,this.comun.h*2);
		//this.comun.sprites[this.comun.MURIENDO].Add("soldadomuriendo_1.png|soldadomuriendo_2.png",-1,10,50,50);
		this.comun.sprites[this.comun.MUERTO].Add("soldadomuerto.png",0,10,50,50);
	}

}

function Bomb () {
	this.comun=new BaseEnemy();
	this.reset=function(){
		this.comun.damage=10;
		this.comun.tipoMov=1;	
		
		this.comun.fromx=aleatorio(0,t.c.width);
		this.comun.fromy=0;		
		this.comun.x=this.comun.fromx;
		this.comun.y=this.comun.fromy;
		
		this.comun.tox=this.comun.fromx;
		this.comun.toy=t.c.height;
		this.comun.w=100;
		this.comun.h=100;		
		
		this.comun.speed=2; //max vel 4
		this.comun.stepMaxcont=parseInt(t.c.height/this.comun.speed)
		this.comun.incx=0;
		this.comun.incy=(this.comun.toy)/(t.c.height/this.comun.speed)
		//fx2.play();
		this.comun.incy=this.comun.incy*t.scalefactor;
		
		

		//this.comun.sprites[this.comun.ANDANDO].Add("soldadodispara_1.png|soldadodispara_2.png|soldadodispara_3.png",-1,10,100,100);
		this.comun.sprites[this.comun.ANDANDO].Add("muerte1.png|muerte2.png",-1,10,this.comun.w,this.comun.h);
		//this.comun.sprites[this.comun.ANDANDO].Add("e1.png",-1,10,50,50);
		this.comun.sprites[this.comun.MURIENDO].AddSeq("explo",1,12,1,2,this.comun.w*2,this.comun.h*2);
		//this.comun.sprites[this.comun.MURIENDO].Add("soldadomuriendo_1.png|soldadomuriendo_2.png",-1,10,50,50);
		this.comun.sprites[this.comun.MUERTO].Add("soldadomuerto.png",0,10,50,50);
	}

}
