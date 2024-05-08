
 window.onload = function(){
   setTimeout(loadAfterTime, 2800)
};

function loadAfterTime(source) { 
  loadJS("//pl23260035.highcpmgate.com/4a/49/f8/4a49f8108bdcc43a2e2167e70e1d66d4.js");
  loadJS("//pl23260091.highcpmgate.com/dc/fb/b9/dcfbb90e743664b94f16f2f8eb83bde0.js");
}
function loadJS(source) { 
  var script = document.createElement('script');
  script.onload = function () {
    //do stuff with the script
  };
  script.src = source;

  document.head.appendChild(script); //or something of the likes
}
