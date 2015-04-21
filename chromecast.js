
		var posx=0;
		var posy=0;
		var theSenderID=0;
		var customMessageBus=null;
		function drawCursor(x,y){
			$('#dbug').append('<br/>draw'+x+":"+y);
			$('#cursor').css('left',x + 'px');
			$('#cursor').css('top',y + 'px');
		}
 		function startChromeCastMode() {
			window.onload = function() {
			
				window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
		
				customMessageBus = window.castReceiverManager.getCastMessageBus('urn:x-cast:com.prueba.chromecast');
				
			
				customMessageBus.onMessage = function(event) {
					 
					 theSenderID = event.senderId;
					//$('#dbug').html('<br/>dataok:'+event.data);
					//var aux=event.data.replace("move","0");
					//var aux=aux.replace("click","1");
				//	$('#dbug').html('<br/>dataok:'+aux);
					var json = $.parseJSON(event.data);
					if (json.action=="move")
						drawCursor(json.x,json.y);
					if (json.action=="click"){
						clicka(json.x,json.y);
					}
					if (json.action=="clickon"){
						clickOn(json.x,json.y);
					}
					if (json.action=="clickoff"){
						clickOff(json.x,json.y);
						
						
					}
					
				}
				window.castReceiverManager.start();
				//$('#dbug').append('<br/>y');
			}
		};
		
	
		startChromeCastMode();
	
		if (typeof console  != "undefined") 
			if (typeof console.log != 'undefined')
				console.olog = console.log;
			else
				console.olog = function() {};
		console.log = function(message) {
			console.olog(message);
			$('#dbug').append('<br/>' + message);
		};
		console.error = console.debug = console.info =  console.log
		
	
	//	setInterval(function(){location.reload() }, 60000);
		function clicka(x,y){
			//$('#dbug').html('<br/>clicka:'+navigator.userAgent);
			drawCursor(x,y)
			var e = new jQuery.Event("mousedown");
			e.pageX = x;
			e.pageY = y;
			$('#c2canvas').trigger(e);
			
			var e2 = new jQuery.Event("mouseup");
			e2.pageX = x;
			e2.pageY = y;
			$('#c2canvas').trigger(e2);	
		}
		var timerClickOn=null;
		function clickOn(x,y){
			//$('#dbug').html('<br/>clicka:'+navigator.userAgent);
			
			var e = new jQuery.Event("mousedown");
			e.pageX = x;
			e.pageY = y;
			$('#c2canvas').trigger(e);
			timerClickOn=setTimeout(function(){ clickOff(x,y) }, 2000);
		}
		function clickOff(x,y){
			//$('#dbug').html('<br/>clicka:'+navigator.userAgent);
			var e2 = new jQuery.Event("mouseup");
			e2.pageX = x;
			e2.pageY = y;
			$('#c2canvas').trigger(e2);	
			clearTimeout(timerClickOn);
		}
		function send(id,msg){
			//$('#dbug').html('<br/>message sent to sender init');
			customMessageBus.send(id,msg);
			//$('#dbug').html('<br/>message sent to sender ok');
		}
		document.onkeydown = checkKey;
		function checkKey(e) {
			e = e || window.event;
			if (e.keyCode == '38') {
				posy=posy-10
				drawCursor(posx,posy)
			}
			else if (e.keyCode == '40') {
				posy=posy+10
				drawCursor(posx,posy)
			}
			else if (e.keyCode == '37') {
				posx=posx-10
				drawCursor(posx,posy)
			}
			else if (e.keyCode == '39') {
				posx=posx+10
				drawCursor(posx,posy)
			}
			else if (e.keyCode == '13') {
				clicka(posx,posy)
			}
		}
