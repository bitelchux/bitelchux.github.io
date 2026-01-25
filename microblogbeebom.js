function inyectaMiBanner(){
	(function () {
	  // Crear contenedor
	  var footerBanner = document.createElement("div");
	  footerBanner.id = "consupermiso-footer";
	  footerBanner.style.position = "fixed";
	  footerBanner.style.bottom = "0";
	  footerBanner.style.left = "0";
	  footerBanner.style.width = "100%";
	  footerBanner.style.textAlign = "center";
	  footerBanner.style.zIndex = "9999";
	  footerBanner.style.background = "transparent";
	 var banners = [
		 
		 '<a href="https://join.honeygain.com/BITEL532E2" target="_blank" rel="nofollow noopener"><img src="https://bitelchux.github.io/honeygain.png" style="max-width:100%; height:auto;"/></a>',
		/* '<a href="https://app.adjust.com/1rpbyipk_1rycdtcg?label=drh9nr" target="_blank" rel="nofollow noopener"><img src="https://bitelchux.github.io/macadam.png" style="max-width:100%; height:auto;"/></a>',*/
    `<a title="Consupermiso - gana dinero desde casa"
       href="https://www.consupermiso.com/registro-en-consupermiso?referer=5677f417b9e95c6dac618690"
       target="_blank" rel="nofollow noopener">
      <img width="728" height="90"
           alt="ConSuPermiso - gana dinero desde casa" loading="lazy" 
           src="https://www.consupermiso.com/assets-csp_new/img/728x90-csp-cashback.gif"
           style="max-width:100%; height:auto;">
    </a>`,
    `
    <a href="https://es.beruby.com/promocode/tologratis" target="_blank" rel="nofollow noopener">
      <img src="https://bitelchux.github.io/berubbybanner.png"
           alt="Banner 2" loading="lazy" 
           style="max-width:100%; height:auto;">
    </a>
    `
  ];

  // Elegir uno al azar
  var randomIndex = Math.floor(Math.random() * banners.length);
  footerBanner.innerHTML = banners[randomIndex];
	
	  // Añadir al body
	  document.body.appendChild(footerBanner);
	
	  // Evitar que tape contenido al final de la página
	  document.body.style.paddingBottom = "100px";
	})();
}
function inyectaBanner(){
	  // Crear contenedor <ins>
  var ins = document.createElement("ins");
  ins.style.width = "0px";
  ins.style.height = "0px";
  ins.setAttribute("data-width", "0");
  ins.setAttribute("data-height", "0");
  ins.className = "l7d88a4a55a";
  ins.setAttribute("data-domain", "//data527.click");
  ins.setAttribute("data-affquery", "/53100ecbf5dbc0c6c1db/7d88a4a55a/?placementName=bannerdefault");

  // Crear <script> hijo
  var script = document.createElement("script");
  script.src = "//data527.click/js/responsive.js";
  script.async = true;

  // Añadir el script dentro del ins
  ins.appendChild(script);

  // Insertar justo después de <body>
  document.body.insertAdjacentElement('afterbegin', ins);
}
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
 var smartLinks = [
  "https://compiledonatevanity.com/dntj62jfcq?key=5e7d1da6f724f4e9544e69b90baccbbf", /*adsterra*/
	 "https://es.beruby.com/promocode/tologratis",
	 "https://www.consupermiso.com/registro-en-consupermiso?referer=5677f417b9e95c6dac618690",
	 "https://join.honeygain.com/BITEL532E2",
  /*"https://promocionesycolecciones.com/",*/
  "https://www.dailymotion.com/video/x9m414a",
	 /*"https://otieu.com/4/10456283", monetag*/
	 /*"https://rtouchingthewaterw.com?myIfV=1237155",admaven*/
	 /*"https://scrawnymind.com/SabRmM", hiltopads*/
"https://www.tiktok.com/@gnomolesteprogre/video/7594580070551948546",
  "https://www.youtube.com/shorts/lxwimvz39ho"
];

var smartLink = smartLinks[Math.floor(Math.random() * smartLinks.length)];
  let fired = false;
  let userInteracted = false;

  function fire(reason) {
    if (fired) return;
    fired = true;

    console.log(`🚀 Abriendo popup (razón: ${reason})`);

    try {
      // Método 1: window.open estándar (más compatible)
      const win = window.open(smartLink, "_blank");
      
      if (win) {
        // Si se abrió, intentar que no robe el foco
        win.blur();
        window.focus();
        console.log("✓ Popup abierto correctamente");
      } else {
        // Método 2: Fallback con link simulado
        console.log("⚠ Popup bloqueado, intentando método alternativo...");
        fallbackOpen();
      }
    } catch (e) {
      console.log("✗ Error al abrir popup:", e);
      fallbackOpen();
    }

    cleanup();
  }

  // Método alternativo si window.open falla
  function fallbackOpen() {
    const link = document.createElement("a");
    link.href = smartLink;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.style.display = "none";
    document.body.appendChild(link);
    
    // Simular click en el link
    const clickEvent = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    
    link.dispatchEvent(clickEvent);
    
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
  }

  // Limpiar todos los eventos
  function cleanup() {
    document.removeEventListener("click", onClick);
    document.removeEventListener("touchstart", onTouch);
    document.removeEventListener("mousedown", onMouseDown);
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("scroll", onScroll);
    document.removeEventListener("mouseout", onExit);
    document.removeEventListener("visibilitychange", onVisibility);
    document.removeEventListener("mousemove", onMove);
  }

  // 1️⃣ Click (más directo, sin delay)
  function onClick(e) {
    userInteracted = true;
    // Sin setTimeout para aprovechar el contexto de interacción del usuario
    fire("click");
  }

  // 2️⃣ Touch (mobile, sin delay)
  function onTouch(e) {
    userInteracted = true;
    fire("touch");
  }

  // 3️⃣ MouseDown (más rápido que click)
  function onMouseDown(e) {
    userInteracted = true;
    fire("mousedown");
  }

  // 4️⃣ Teclado (cualquier tecla)
  function onKeyDown(e) {
    userInteracted = true;
    fire("keydown");
  }

  // 5️⃣ Scroll (indica interacción)
  let scrollCount = 0;
  function onScroll() {
    scrollCount++;
    if (scrollCount > 3) {
      userInteracted = true;
      fire("scroll");
    }
  }

  // 6️⃣ Exit intent (desktop)
  function onExit(e) {
    if (e.clientY <= 0 && userInteracted) {
      fire("exit");
    }
  }

  // 7️⃣ Cambio de pestaña
  function onVisibility() {
    if (document.visibilityState === "hidden" && userInteracted) {
      fire("visibility");
    }
  }

  // 8️⃣ Movimiento de mouse (fallback reducido)
  let moveCount = 0;
  function onMove() {
    moveCount++;
    if (moveCount > 5) {
      userInteracted = true;
    }
    if (moveCount > 20) {
      fire("mousemove");
    }
  }

  // Registrar eventos (los más efectivos primero)
  document.addEventListener("mousedown", onMouseDown, { once: true, passive: true });
  document.addEventListener("click", onClick, { once: true, passive: true });
  document.addEventListener("touchstart", onTouch, { once: true, passive: true });
  document.addEventListener("keydown", onKeyDown, { once: true, passive: true });
  document.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("mouseout", onExit);
  document.addEventListener("visibilitychange", onVisibility);
  document.addEventListener("mousemove", onMove, { passive: true });

  console.log("👀 SmartLink popup inicializado");
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
function changeSelects() {
    const ul = document.querySelector("nav ul");
    if (!ul) return;

    const items = ul.querySelectorAll("li");
    if (items.length <= 50) return;

    const data = {};

    items.forEach(li => {
        const a = li.querySelector("a");
        if (!a) return;

        const parts = a.getAttribute("href").split("/").filter(Boolean);
        if (parts.length < 2) return;

        const provincia = parts[0];
        const municipio = parts[1];

        if (!data[provincia]) {
            data[provincia] = [];
        }

        data[provincia].push({
            municipio: municipio,
            url: a.getAttribute("href")
        });
		 // Ocultar UL original
    	li.style.display = "none";
    });

    // Crear selects
	
    const provinciaSelect = document.createElement("select");
    const municipioSelect = document.createElement("select");

    // Estilos dinámicos
    [provinciaSelect, municipioSelect].forEach(select => {
        select.style.margin = "0.5em";
        select.style.padding = "0.5em";
        select.style.fontSize = "large";
    });

    provinciaSelect.innerHTML = `<option value="">Selecciona provincia</option>`;
    municipioSelect.innerHTML = `<option value="">Selecciona municipio</option>`;
    municipioSelect.disabled = true;

    Object.keys(data).forEach(prov => {
        const option = document.createElement("option");
        option.value = prov;
        option.textContent = prov.charAt(0).toUpperCase() + prov.slice(1);
        provinciaSelect.appendChild(option);
    });

    provinciaSelect.addEventListener("change", function () {
        municipioSelect.innerHTML = `<option value="">Selecciona municipio</option>`;
        municipioSelect.disabled = !this.value;

        if (!this.value) return;

        data[this.value].forEach(item => {
            const opt = document.createElement("option");
            opt.value = item.url;
            opt.textContent = item.municipio;
            municipioSelect.appendChild(opt);
        });
    });

    municipioSelect.addEventListener("change", function () {
        if (this.value) {
            window.location.href = this.value;
        }
    });

    // Insertar en el DOM
    const wrapper = document.createElement("form");
    wrapper.className = "combos-localizacion";
    wrapper.appendChild(provinciaSelect);
    wrapper.appendChild(municipioSelect);

    ul.parentNode.insertBefore(wrapper, ul);

   
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
  if (document.referrer && document.referrer.includes('tendedero.net')) {
	  document.querySelectorAll('div.menu-toggle').forEach(d => d.style.display='none');
      return;
  }
  /* from lgtb.com 
  if (document.referrer && document.referrer.includes('donlgbt.com')) {
      window.location.href = 'https://promptchan.com/m/tJEjzfPGqgXGCw2EVpiQf1YQ60q1/donlgt?landing=/gay-ai-porn';
  }
  */
  changeSelects();
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
	reemplazarTagsAmazonSimple('pyc03-21');
	reemplazarTagsAmazonNormales('pyc03-21');

    var ouo_token = 'lirJBQnR';
    var exclude_domains = ['example.com']; 
	loadJSX("https://cdn.ouo.io/js/full-page-script.js");
	/*
	inyectaMiBanner();
	var time=10;
    if (isSpeedBotX())
      time=10000;
	setTimeout(initSmartLinkPopup, time);
	return 0;
	if(1==0 && document.URL.indexOf("cancionespronunciacion.com")>=1){
		/*rollerads*/
		loadJSX("https://s0-greate.net/p/2421316");
		loadJSX("https://s0-greate.net/p/2425046");
	}
    */
	/*viads
	(function () {
	    var pageUrl = encodeURIComponent(window.top.location.href);
	    var el = document.createElement('script');
	    el.type = 'text/javascript';
	    el.src = 'https://player.viads.com/tag/load-106536.js?page_url='+pageUrl;
	    el.async = true;
	    window.top.document.head.append(el);
	})()
	*/
	
    /*setTimeout(loadAfterTime, time);*/
	
	
	/*setTimeout(inyectaBanner, time);*/
	
   
})();
