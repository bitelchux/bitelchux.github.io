<?php
header('Content-type: application/x-web-app-manifest+json');
?>
{
  "name": "Indiara and the Skull Gold",

  "description": "The adventure is starting! Play as Indiara, a girl who loves to collect ancient artifacts. Indiara has to get 8 gold skulls that are hidden in a cave full of traps! And to make matters worse, a gigantic rock is chasing Indiara! Will you escape the cave?",

  "launch_path": "/indiara/index.html",
  
   "fullscreen":"true",
   
   "orientation":"landscape",
   "icons":{"16":"http://clay.io/includes/ext/image.php?width=16&height=16&image=%2Fgames%2Findiara%2Fclaymedia%2Ficon128.png","128":"http://indiara.clay.io/claymedia/icon128.png"},
  "developer": {
    "name": "Delasource"  
  },
  "default_locale": "en",  
  "installs_allowed_from": ["*"]
}