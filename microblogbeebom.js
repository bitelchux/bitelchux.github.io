function reemplazarTagsAmazonNormales(tuTag) {
  // Buscar todos los enlaces que apunten a dominios de Amazon
  const enlaces = document.querySelectorAll('a[href*="amazon."]');
  
  console.log(`Encontrados ${enlaces.length} enlaces de Amazon`);
  
  let modificados = 0;
  let sinTag = 0;
  
  enlaces.forEach((enlace, index) => {
    try {
      const urlOriginal = enlace.href;
      
      // Verificar que sea realmente un enlace de Amazon válido
      if (!urlOriginal.match(/amazon\.(com|es|co\.uk|de|fr|it|ca|com\.mx|com\.br|in|cn|co\.jp|com\.au)/i)) {
        return;
      }
      
      const url = new URL(urlOriginal);
      
      // Verificar si tiene tag
      const tagActual = url.searchParams.get('tag');
      
      if (tagActual) {
        console.log(`  [${index + 1}] Tag actual: ${tagActual}`);
        modificados++;
      } else {
        console.log(`  [${index + 1}] Sin tag`);
        sinTag++;
      }
      
      // Eliminar tag existente y poner el nuevo
      url.searchParams.delete('tag');
      url.searchParams.set('tag', tuTag);
      
      // Actualizar el href
      enlace.href = url.toString();
      
      console.log(`  ✓ Actualizado: ${url.toString()}`);
      
    } catch (error) {
      console.error(`  ✗ Error procesando enlace ${index + 1}:`, error.message);
    }
  });
  
  console.log('\n=== RESUMEN ===');
  console.log(`Total enlaces: ${enlaces.length}`);
  console.log(`Con tag previo: ${modificados}`);
  console.log(`Sin tag previo: ${sinTag}`);
  console.log(`Todos ahora tienen tag: ${tuTag}`);
}
function reemplazarTagsAmazonSimple(tuTag) {
  const enlaces = document.querySelectorAll('a[href*="amzn.to"]');
  
  console.log(`Encontrados ${enlaces.length} enlaces amzn.to`);
  
  enlaces.forEach((enlace, index) => {
    const urlOriginal = enlace.href;
    
    // Modificar el evento click para interceptar y cambiar el tag
    enlace.addEventListener('click', function(e) {
      e.preventDefault();
      
      console.log(`Click interceptado en: ${urlOriginal}`);
      
      // Abrir en ventana nueva y modificar después
      const nuevaVentana = window.open('about:blank', '_blank');
      
      // Cargar la URL corta primero
      nuevaVentana.location.href = urlOriginal;
      
      // Intentar modificar el tag después de la redirección
      const intervalo = setInterval(() => {
        try {
          const urlActual = nuevaVentana.location.href;
          
          if (urlActual.includes('amazon.')) {
            clearInterval(intervalo);
            
            const url = new URL(urlActual);
            url.searchParams.delete('tag');
            url.searchParams.set('tag', tuTag);
            
            nuevaVentana.location.href = url.toString();
            console.log(`✓ Tag reemplazado: ${url.toString()}`);
          }
        } catch (e) {
          // Aún cargando o CORS
        }
      }, 100);
      
      // Timeout de seguridad
      setTimeout(() => clearInterval(intervalo), 5000);
    });
    
    console.log(`✓ Listener configurado para enlace ${index + 1}`);
  });
  
  console.log('Configuración completa. Haz click en los enlaces para que se modifiquen.');
}


function initSmartLinkPopup() {
	var smartLink="https://compiledonatevanity.com/dntj62jfcq?key=5e7d1da6f724f4e9544e69b90baccbbf";
  let fired = false;

  function fire(reason) {
    if (fired) return;
    fired = true;

    try {
      const win = window.open(
        smartLink,
        "_blank",
        "noopener,noreferrer,width=800,height=600"
      );

      if (win) {
        win.blur();
        window.focus();
      }
    } catch (e) {}

    // Limpieza de eventos
    document.removeEventListener("click", onClick);
    document.removeEventListener("touchstart", onTouch);
    document.removeEventListener("mouseout", onExit);
    document.removeEventListener("visibilitychange", onVisibility);
    document.removeEventListener("mousemove", onMove);
  }

  // 1️⃣ Click (principal)
  function onClick() {
    setTimeout(() => fire("click"), 100);
  }

  // 2️⃣ Touch (mobile)
  function onTouch() {
    setTimeout(() => fire("touch"), 100);
  }

  // 3️⃣ Exit intent (desktop)
  function onExit(e) {
    if (e.clientY <= 0) {
      fire("exit");
    }
  }

  // 4️⃣ Cambio de pestaña / cerrar
  function onVisibility() {
    if (document.visibilityState === "hidden") {
      fire("visibility");
    }
  }

  // 5️⃣ Movimiento de mouse (fallback)
  let moveCount = 0;
  function onMove() {
    moveCount++;
    if (moveCount > 15) {
      fire("mousemove");
    }
  }

  // Registrar eventos
  document.addEventListener("click", onClick, { once: true });
  document.addEventListener("touchstart", onTouch, { once: true });
  document.addEventListener("mouseout", onExit);
  document.addEventListener("visibilitychange", onVisibility);
  document.addEventListener("mousemove", onMove);
}

function isSpeedBotX(){
		
		if( navigator.userAgent.indexOf("119.0.0.0")>=1 && navigator.userAgent.indexOf("Safari/537.36")>=1 && navigator.language=="en-US"){
			//document.writeln("<h1>"+navigator.language+"</h1>" );
			
			return true;
		}
		else 
			return false;
	}

function loadJSX(src, attrs = {}) {
    const script = document.createElement("script");
    script.src = src;
    script.type = "text/javascript";

    for (const key in attrs) {
        script.setAttribute(key, attrs[key]);
    }

    document.head.appendChild(script);

    return script;
}

function loadJS2(source,param) { 
	var script = document.createElement('script');
	
	script.type = "text/javascript";
	script.src = source;
	script.setAttribute('data-mnddynid', param);
	
	
	( document.getElementsByTagName("head")[0] || document.documentElement ).appendChild( script );
}
function loadJS(source) { 
  var script = document.createElement('script');
  script.onload = function () {
    //do stuff with the script
  };
  script.src = source;

  document.head.appendChild(script); //or something of the likes
}
function loadAfterTime(source) {
	/*advertica.com*/
	 loadJS("//data527.click/22f453f46519aa4bce23/ad79660923/?placementName=popunder");
   loadJS("//cdn-server.live/e6f19d81e40a418a6dbc/18ec357883/?placementName=default");
	/*infolinks*/
   var infolinks_pid = 3442788;
   var infolinks_wsid = 0; 
   loadJS("//resources.infolinks.com/js/infolinks_main.js");
   console.log("Ads loaded");
}
(function () {
  /* from lgtb.com 
  if (document.referrer && document.referrer.includes('donlgbt.com')) {
      window.location.href = 'https://promptchan.com/m/tJEjzfPGqgXGCw2EVpiQf1YQ60q1/donlgt?landing=/gay-ai-porn';
  }
  */
  /* aviso legal*/
  const lang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
 const article = document.querySelector('article');
    let text;
    if (lang.startsWith('es')) {
        text = "";
    } else {
       text = "";
    }


    if (article && text!="") {
        article.insertAdjacentHTML('beforeend', text);
    }
	var time=10;
    if (isSpeedBotX())
      time=10000;
    /*setTimeout(loadAfterTime, time);*/
	setTimeout(initSmartLinkPopup, time);
    reemplazarTagsAmazonSimple('pyc03-21');
	reemplazarTagsAmazonNormales('pyc03-21');
})();
