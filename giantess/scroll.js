
	//SCROLL INFINITO INICIO
	var infiniteImage=null;
    var infiniteImageHeight=null;
    var scrollimg=null;
	var scrollcanvas=null;
    var scrollctx=null;
	
  
  	var p1img=library.AddImage("p2","pie2.png");
	var p1maxy=0;
	var p1x=0;
	var p1y=0;	
	var p1incy=-1;
	var p2img=library.AddImage("p1","pie1.png");
	var p2maxy=0;
	var p2x=0;
	var p2y=0;
	var p2incy=1;
	var bodyimg=library.AddImage("body","busto.png");
	var bodymaxy=0;
	var bodyx=0;
	var bodyy=0;	
	var bodyincy=1;
	function scrollLoaded(){
			// use a tempCanvas to create a horizontal mirror image
			// This makes the panning appear seamless when
			// transitioning to a new image on the right
			var tempCanvas=document.createElement("canvas");
			var tempCtx=tempCanvas.getContext("2d");
			tempCanvas.width=scrollimg.width;
			tempCanvas.height=scrollimg.height*2;
			tempCtx.drawImage(scrollimg,0,0);
			tempCtx.save();
			tempCtx.translate(0,tempCanvas.height);
			tempCtx.scale(1,-1);
			tempCtx.drawImage(scrollimg,0,0);
			tempCtx.restore();
			infiniteImageHeight=scrollimg.height*2;
			infiniteImage=document.createElement("img");
			infiniteImage.src=tempCanvas.toDataURL();
	}
	function initScroll(){
		scrollimg=document.createElement("img");
		//scrollimg=document.getElementById("scrollimg");
		scrollcanvas=document.getElementById("gamebackground");
		scrollctx=scrollcanvas.getContext("2d");
		scrollimg.onload=function(){
			scrollLoaded();
		}
		scrollimg.crossOrigin="anonymous"
		scrollimg.src="https://dl.dropboxusercontent.com/u/6932226/suelo0.jpg";
		//scrollimg.src="suelo0.png";
		offsetLeft=0;
	
	}
	function animateGiantess(){
		bodyy=bodyy+bodyincy;
		if (bodyincy<0){
			if (bodyy<bodyimg.height*-1*t.scalefactor){
				bodyincy=1;
			}else{
				bodyincy=bodyincy-0.01;
			}			
		}else{
			if (bodyy>0){
				bodyincy=-1;
			}else{
				bodyincy=bodyincy+0.01;
			}	
		}
		p1y=p1y+p1incy;
		if (p1incy<0){
			if (p1y<p1img.height*-1*t.scalefactor){
				p1incy=1;
			}else{
				p1incy=p1incy-0.1;
			}			
		}else{
			if (p1y>0){
				p1incy=-1;
				p2y=p2img.height*-1*t.scalefactor
				p2incy=1;
			}else{
				p1incy=p1incy+0.1;
			}	
		}
		p2y=p2y+p2incy;
		if (p2incy<0){
			if (p2y<p2img.height*-1*t.scalefactor){
				p2incy=1;
			}else{
				p2incy=p2incy-0.1;
			}			
		}else{
			if (p2y>0){
				p2incy=-1;
			}else{
				p2incy=p2incy+0.1;
			}	
		}
		t.paintSpriteFromBottom(t.c.width/3-p2img.width*t.scalefactor,p2y,p2img.width,p2img.height,p2img);
		t.paintSpriteFromBottom(t.c.width-t.c.width/3,p1y,p1img.width,p1img.height,p1img);
		t.paintSpriteFromBottom(bodyx,bodyy,bodyimg.width,bodyimg.height,bodyimg);		
	}
    //img.crossOrigin="anonymous";
    function scroll(){
		
		
		if (scrollctx!=null && infiniteImage!=null){
			// increase the left offset
			offsetLeft-=1;
			if(offsetLeft<=0){ offsetLeft=infiniteImageHeight; }

			scrollctx.drawImage(infiniteImage,0,-offsetLeft);
			scrollctx.drawImage(infiniteImage,0,infiniteImage.height-offsetLeft);
		}
        
    }
	//SCROLL INFINITO FIN
