<?php
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE HTML>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Beams Ads - Demo</title>
  <link href="css/ads.css" rel="stylesheet" type="text/css" />
  <link href='http://fonts.googleapis.com/css?family=Ubuntu:300' rel='stylesheet' type='text/css'>
  <script src="js/jquery-2.1.0.min.js" type="text/javascript"></script>
  <script src="js/ads/jquery.interstitial.min.js" type="text/javascript"></script>
  <script src="js/cookies/jquery.cookie.js" type="text/javascript"></script>
 
  <style>
  *{
	font-family: 'Ubuntu', sans-serif;
	color:black;
  }
  </style>
</head>


<body>

  <div class="sponsorad" style="text-align:center;vertical-align:middle">
  <?php
  if (rand(1,100)>=50){
  ?>
<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<!-- indiara320 -->
<ins class="adsbygoogle"
     style="display:inline-block;width:320px;height:50px"
     data-ad-client="ca-pub-9323451720624000"
     data-ad-slot="6965633779"></ins>
<script>
(adsbygoogle = window.adsbygoogle || []).push({});
</script>
     <br/><br/>
		<a href="http://juegosjuegosgratis.mobi" target="_blank"><img src="/logo.png" width="80px"/></a>
		<br/>
		<a href="http://juegosjuegosgratis.mobi" target="_blank"><h1>Más juegos online 100% para tu móvil</h1></a>

	<?php
	}else{
	?>
	<div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/es_LA/sdk.js#xfbml=1&appId=1392764564297544&version=v2.0";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>
<p align="center">
<a href="http://juegosjuegosgratis.mobi" target="_blank"><h1>Más juegos online 100% para tu móvil</h1></a><br/>
<div class="fb-like" data-href="https://www.facebook.com/juegosgratisparamovil" data-layout="box_count" data-action="like" data-show-faces="true" data-share="true"></div>
</p>
<?php
}
?>
<br/>
		<br>Este juego ha costado mucho tiempo y esfuerzo, apoya nuestro trabajo visitando nuestra web o siguiendonos en facebook, y disfruta de los mejores juegos 100% gratis (se añaden nuevos cada día)
	<br/><br/><br/>
        <a href="#" onClick="$().interstitial('close'); return true;" style="font-weight:bolder">[X] CERRAR ANUNCIO Y JUGAR</a>

  </div><!-- End sponsorad -->

</body>
</html>
