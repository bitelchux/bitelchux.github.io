/* añadir https://bastadeudas.com/?ref=juliocesardelafuente
paston.com
*/
function inyectavideo(){
		//VIDEO BANNER
		 const container = document.createElement("div");
		
		  // CONTENEDOR
		  Object.assign(container.style, {
		    position: "fixed",
		    right: "10px",
		    bottom: "10px",
		    zIndex: "999999",
		    cursor: "pointer",
		    width: "320px",
		    fontFamily: "Arial, sans-serif"
		  });
	 // VIDEO
		  const video = document.createElement("video");
		
		  video.src = "https://videos.crazygames.com/om-nom-run/3/om-nom-run-landscape-364x208_30fps.mp4";
		  video.autoplay = true;
		  video.muted = true;
		  video.loop = true;
		  video.playsInline = true;
		
		  Object.assign(video.style, {
		    width: "100%",
		    borderRadius: "8px",
		    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
		    display: "block"
		  });
		
		  // TEXTO
		  const text = document.createElement("div");
		  text.innerText = "Juega gratis ahora en tu dispositivo";
		
		  Object.assign(text.style, {
		    marginTop: "6px",
		    fontSize: "13px",
		    color: "#fff",
		    textAlign: "center",
		    background: "rgba(0,0,0,0.6)",
		    padding: "6px",
		    borderRadius: "6px"
		  });
		
		  // CLICK (video + texto)
		  container.addEventListener("click", () => {
		    window.open("https://play.famobi.com/om-nom-run/A-06DF8", "_blank");
		  });
		
		  container.appendChild(video);
		  container.appendChild(text);
		  document.body.appendChild(container);
}
function inyectaMiBannerESP(){
 //const API = "https://directorycircle.com/gruponofertas.php";
var API="https://pbnstats.promocionesycolecciones.com/chollometro/json.php";
    if (document.getElementById("offer-banner")) return;

    // ---------------- STYLE ----------------
    const style = document.createElement("style");
    style.textContent = `
        #offer-banner{
            position:fixed;
            bottom:0;
            left:0;
            width:100%;
            background:#0f0f0f;
            color:#fff;
            z-index:999999;
            font-family:Arial;
            display:flex;
            align-items:center;
            justify-content:space-between;
            padding:10px 14px;
            box-shadow:0 -6px 20px rgba(0,0,0,.6);
            gap:12px;
        }

        .offer-left{
            display:flex;
            align-items:center;
            gap:12px;
            max-width:55%;
        }

        .offer-img{
            width:80px;
            height:80px;
            object-fit:cover;
            border-radius:10px;
            flex-shrink:0;
        }

        .offer-title{
            font-size:14px;
            font-weight:700;
            line-height:1.2;
        }

        .offer-price{
            display:inline-block;
            margin-top:6px;
            background:#ff2d2d;
            color:#fff;
            padding:5px 12px;
            border-radius:999px;
            font-weight:800;
            font-size:15px;
        }

        .offer-cta{
            background:#ffd000;
            color:#000;
            padding:11px 16px;
            border-radius:10px;
            font-weight:800;
            text-decoration:none;
            white-space:nowrap;
        }

        /* 🔥 TICKER */
        .offer-ticker{
            flex:1;
            overflow:hidden;
            white-space:nowrap;
            margin:0 10px;
            border-left:1px solid rgba(255,255,255,0.2);
            border-right:1px solid rgba(255,255,255,0.2);
            padding:0 10px;
        }

        .offer-ticker span{
            display:inline-block;
            padding-left:100%;
            animation:ticker 18s linear infinite;
            font-size:13px;
            color:#ccc;
        }

        @keyframes ticker{
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
        }

        @media(max-width:700px){
            .offer-img{width:65px;height:65px;}
            .offer-ticker{display:none;} /* ocultamos ticker en móvil */
        }
    `;
    document.head.appendChild(style);

    // ---------------- CREATE ----------------
    const banner = document.createElement("div");
    banner.id = "offer-banner";
    document.body.appendChild(banner);

    // ---------------- LOAD ----------------
    fetch(API)
        .then(res => res.json())
        .then(data => {

            const item = Array.isArray(data)
                ? data[Math.floor(Math.random() * data.length)]
                : data;

            const price = item.display_price || item.search_price;
            const desc = item.description || "";

            banner.innerHTML = `
                <div class="offer-left">
                    <img class="offer-img" src="${item.merchant_image_url}" />

                    <div>
                        <div class="offer-title">${item.product_name}</div>
                        <div class="offer-price">💰 ${price} €</div>
                    </div>
                </div>

                <div class="offer-ticker">
                    <span>🔥 ${desc} 🔥 ${desc} 🔥 ${desc}</span>
                </div>

                <a class="offer-cta" target="_blank" href="${item.aw_deep_link}">
                    Ver oferta →
                </a>
            `;
        })
        .catch(err => console.error("Error loading offer:", err));
}
function inyectaMiBanner(){
	(function () {
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
		 '<a href="https://booking.tpo.li/6q7b3tlD"><img src="https://bitelchux.github.io/ofertasbooking.png" style="max-width:100%; height:auto;"/></a>',
		 '<a href="https://bastadeudas.com/?ref=juliocesardelafuente">Especialistas en Ley de Segunda Oportunidad<br/>Libérate de tus deudas y empieza de nuevo.<br/>Ayudamos a particulares y autónomos. Te ayudamos a empezar de cero y recuperar tu tranquilidad financiera.</a>',
		 '<a href="https://track.effiliation.com/servlet/effi.click?id_compteur=23254999" target="_blank"><img src="https://track.effiliation.com/servlet/effi.show?id_compteur=23254999" alt="pub" border="0"/></a>',
		 '<a href="https://join.honeygain.com/BITEL532E2" target="_blank" rel="nofollow noopener"><img src="https://bitelchux.github.io/honeygain.png" style="max-width:100%; height:auto;"/></a>',
		 '<a href="https://app.adjust.com/1rpbyipk_1rycdtcg?label=drh9nr" target="_blank" rel="nofollow noopener"><img src="https://bitelchux.github.io/macadam.png" style="max-width:100%; height:auto;"/></a>',
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
  /*
  console.log('\n=== RESUMEN ===');
  console.log(`Total enlaces: ${enlaces.length}`);
  console.log(`Con tag previo: ${modificados}`);
  console.log(`Sin tag previo: ${sinTag}`);
  console.log(`Todos ahora tienen tag: ${tuTag}`);
  */
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
function tradeTracker(){

	var _TradeTrackerTagOptions = {
		t: 'a',
		s: '504902',
		chk: '27177eea41cbfee01bad606470734d9c',
		overrideOptions: {}
	};
	window._TradeTrackerTagOptions=_TradeTrackerTagOptions;
	(function() {var tt = document.createElement('script'), s = document.getElementsByTagName('script')[0]; tt.setAttribute('type', 'text/javascript'); tt.setAttribute('src', (document.location.protocol == 'https:' ? 'https' : 'http') + '://tm.tradetracker.net/tag?t=' + _TradeTrackerTagOptions.t + '&s=' + _TradeTrackerTagOptions.s + '&chk=' + _TradeTrackerTagOptions.chk); s.parentNode.insertBefore(tt, s);})();

}
function loadAfterTime() {
	tradeTracker();
	initSmartLinkPopup();
    
	/*advertica.com	
	 loadJS("//data527.click/22f453f46519aa4bce23/ad79660923/?placementName=popunder");
   loadJS("//cdn-server.live/e6f19d81e40a418a6dbc/18ec357883/?placementName=default");
   */
	/*infolinks*/
   var infolinks_pid = 3442788;
   var infolinks_wsid = 0; 
   loadJS("//resources.infolinks.com/js/infolinks_main.js");
   console.log("Ads loaded");
}

document.addEventListener("DOMContentLoaded", function () {

  const TRACKING_PARAMS = [
    "_gl",
    "_ga",
    "gclid",
    "fbclid",
    "msclkid",
    "yclid",
    "mc_eid"
  ];

  const url = new URL(window.location.href);
  const params = url.searchParams;

  let changed = false;

  // eliminar parámetros concretos
  TRACKING_PARAMS.forEach(param => {
    if (params.has(param)) {
      params.delete(param);
      changed = true;
    }
  });

  // eliminar cualquier parámetro utm_*
  Array.from(params.keys()).forEach(key => {
    if (key.startsWith("utm_")) {
      params.delete(key);
      changed = true;
    }
  });

  // actualizar la URL sin recargar
  if (changed) {
    const newUrl =
      url.pathname +
      (params.toString() ? "?" + params.toString() : "") +
      url.hash;

    window.history.replaceState({}, document.title, newUrl);
  }

});

function legalizeimages(){
	const excludedDomains = [
	  "youtube.com",
		"i.ytimg.com",
		"img.grouponcdn.com",
	  "youtu.be",
	  "amazon.com",
	  "amazon.es",
	  "google.com",
	  "googleusercontent.com",
	  "gstatic.com",
	  "facebook.com",
	  "fbcdn.net",
	  "twitter.com",
	  "x.com",
	  "instagram.com"
	];
	
	function isExcluded(domain) {
	  return excludedDomains.some(d => domain.includes(d));
	}
	
	const currentDomain = location.hostname.replace(/^www\./, "");
	
	const images = document.querySelectorAll("img");
	
	images.forEach((img) => {
	  let sourceUrl = "";
	
	  // 1. Usar variable global si existe
	  if (window.externalurl && window.externalurl.trim() !== "") {
	    sourceUrl = window.externalurl;
	  } else {
	    // 2. Fallback: usar src de la imagen
	    sourceUrl = img.src;
	  }
	
	  let domain = "";
	  try {
	    domain = new URL(sourceUrl).hostname.replace(/^www\./, "");
	  } catch (e) {
	    return;
	  }
	
	  // 3. Filtrar dominios no deseados
	  if (isExcluded(domain)) return;
	
	  // 4. No mostrar si es del mismo dominio
	  if (domain === currentDomain) return;
	
	  const container = document.createElement("div");
	  container.style.position = "relative";
	  container.style.display = "inline-block";
	
	  const watermark = document.createElement("a");
	  watermark.href = sourceUrl || ("https://" + domain);
	  watermark.target = "_blank";
	  watermark.rel = "noopener noreferrer";
	
	  watermark.textContent = `Créditos y fuente de la imagen: ${domain} (${sourceUrl})`;
	
	  watermark.style.position = "absolute";
	  watermark.style.bottom = "5px";
	  watermark.style.left = "5px";
	  watermark.style.background = "rgba(0,0,0,0.6)";
	  watermark.style.color = "white";
	  watermark.style.fontSize = "10px";
	  watermark.style.padding = "2px 4px";
	  watermark.style.maxWidth = "90%";
	  watermark.style.wordBreak = "break-all";
	  watermark.style.textDecoration = "none";
	  watermark.style.cursor = "pointer";
	
	  img.parentNode.insertBefore(container, img);
	  container.appendChild(img);
	  container.appendChild(watermark);
	});
}
(function () {
  if (document.referrer && document.referrer.includes('tendedero.net')) {
	  document.querySelectorAll('div.menu-toggle').forEach(d => d.style.display='none');
      return;
  };
		
		reemplazarTagsAmazonSimple('pyc03-21');
    reemplazarTagsAmazonNormales('pyc03-21');
	legalizeimages();
	if (window.cfpais=="spain")
		inyectaMiBannerESP();
	else
		inyectaMiBanner();
	return;
	inyectavideo();
	var adsterras=[];
	adsterras["acelstore.es"]="https://compiledonatevanity.com/73/47/b2/7347b200da990018c3b935e57198ab71.js";
	adsterras["cancionespronunciacion.com"]="https://compiledonatevanity.com/8a/10/61/8a10618c1230962eea625d64a3f906bb.js";
	adsterras["cuentocorto.es"]="https://compiledonatevanity.com/5b/b2/36/5bb23664c43ce429fa39338771740942.js";
	adsterras["especiespro.es"]="https://compiledonatevanity.com/d9/a0/44/d9a044ac868473bc3ec4b1d0f4b099b4.js";
	adsterras["fanfic.es"]="https://compiledonatevanity.com/87/c9/83/87c98332e93283556ccaa50baa0b4993.js";
	adsterras["calculatunota.es"]="https://compiledonatevanity.com/dc/60/79/dc60790f983d67a5fe224259442f0a21.js";
	/*adsterras["multicomix.com"]="https://compiledonatevanity.com/03/f2/bb/03f2bb6fa82fe45c75dbc9e00dc4978e.js|https://compiledonatevanity.com/8a/b5/7b/8ab57b1fe35feb6cf0322988b231bac2.js";
	*/
	/*wsta variable la usa google adsense*/
	if (adsterras[window.location.host]!=undefined || (window.google_srt==undefined && window.conotrosads==undefined) ){
		/*adsterra pyc social bar*/
		if (adsterras[window.location.host]!=undefined){
			var scriptsadsterras = adsterras[window.location.host].split("|");
    
			scriptsadsterras.forEach(function(urlads){
				loadJS(urlads);
			});
		}else{
			if (window.location.host!="docentestic.es"){	
				/* awin affiliate*/
				 loadJS("https://www.dwin2.com/pub.963035.min.js");
				
				var randi = Math.floor(Math.random() * 100) + 1;
				randi=100;
				if (randi<0){
					/*hilltopads*/
					(function(kkw){
					var d = document,
					    s = d.createElement('script'),
					    l = d.scripts[d.scripts.length - 1];
					s.settings = kkw || {};
					s.src = "\/\/sophisticatedpin.com\/biXLVIsqd.GQle0aYlWAcz\/ueBmF9IuIZnU\/lskrPwT\/YS4\/NfDFMDyVNxjxU_t_NJjRgK0ZMmzeIx2tOMQR";
					s.async = true;
					s.referrerPolicy = 'no-referrer-when-downgrade';
					l.parentNode.insertBefore(s, l);
					})({});
				}else{
				/* Monetag */
					(function(s){s.dataset.zone='10681896',s.src='https://gizokraijaw.net/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))
				}
			}
		}
		/*clickadu
		var s = document.createElement("script");
		s.async = true;
		s.setAttribute("data-cfasync", "false");
		s.setAttribute("data-clipid", "2101944");
		s.src = "//guidepaparazzisurface.com/in.js";
		document.head.appendChild(s);
		*/
		
	
	}
	
  /* from lgtb.com 
  if (document.referrer && document.referrer.includes('donlgbt.com')) {
      window.location.href = 'https://promptchan.com/m/tJEjzfPGqgXGCw2EVpiQf1YQ60q1/donlgt?landing=/gay-ai-porn';
  }
  */
  /*changeSelects();*/
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

	return;
   loadJSX("https://www.dwin2.com/pub.963035.min.js");
  
	/*
	  var ouo_token = 'lirJBQnR';
    var exclude_domains = ['example.com']; 
	loadJSX("https://cdn.ouo.io/js/full-page-script.js");
	
	*/
	var time=10;
    if (isSpeedBotX()){
      time=10000;
	}
	setTimeout(loadAfterTime, time);
	return 0;

	/*
	if(1==0 && document.URL.indexOf("cancionespronunciacion.com")>=1){
		//rollerads
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
