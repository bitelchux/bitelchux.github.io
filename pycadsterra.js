<script>
 window.onload = function(){
   setTimeout(loadAfterTime, 3000)
};

function loadAfterTime(source) { 
  loadJS("//pl15031480.highcpmgate.com/08/73/58/0873587c2e686832a2c1a67b41131e61.js");
  loadJS("//pl22642461.highcpmgate.com/e2/4e/4e/e24e4e8f43d0379a140fede3f2568592.js");
}
function loadJS(source) { 
  var script = document.createElement('script');
  script.onload = function () {
    //do stuff with the script
  };
  script.src = source;

  document.head.appendChild(script); //or something of the likes
}
</script>
