/**
 * ============================================================================
 * SCRIPT FUSIONADO: GESTOR DE PUBLICIDAD, AFILIADOS Y WIDGETS
 * ============================================================================
 */

/**
 * MÓDULO DE LOGGING Y TRACEO
 */
const Logger = {
  PREFIX: '[AppManager]',
  log: (msg, ...data) => console.log(`${Logger.PREFIX} ℹ️ ${msg}`, ...data),
  warn: (msg, ...data) => console.warn(`${Logger.PREFIX} ⚠️ ${msg}`, ...data),
  error: (msg, ...data) => console.error(`${Logger.PREFIX} ❌ ${msg}`, ...data),
  group: (label) => console.group(`${Logger.PREFIX} 🔍 ${label}`),
  groupEnd: () => console.groupEnd()
};

/**
 * CONFIGURACIÓN Y CONSTANTES GLOBALES
 */
const CONFIG = {
  LS_AGE_KEY: 'age_18_confirmed',
  GEO_API: 'https://ipapi.co/json/',
  
  // Rotación del banner en milisegundos (8 segundos)
  BANNER_ROTATION_INTERVAL_MS: 8000,

  // Dominios donde se activará la verificación de adultos (+18)
  ADULT_DOMAINS: [
    'www.infoenbolas.com',
    'acelstorexxx.es',
    'dedronesxxx.es',
    'localhost'
  ],

  // Mapeo de dominios para Tags de Afiliado de Amazon
  AFFILIATE_TAGS: {
    MAP: {
      "acelstore.es": "iphonesreacondicionados-21",
      "tusarten.es": "tusarten-21",
      "eleglide.es": "elecbici-21",
      "kloner.es": "portatiles0b-21",
      "tugrifodecocina.es": "grifosfregadero-21",
      "dedrones.es": "dedronesjulk-21"
    },
    FALLBACK: "otrosafiliados-21",
    PROTECTED: "pyc03-21"
  },

  SPOTIFY: {
    ALBUM_URL: 'https://open.spotify.com/album/413ZRAjsrULjx1uiXi1qGn',
    TRACKS: [],
    MESSAGES: [
      '🎧 Escucha música relajante mientras lees',
      '🌿 Música tranquila para acompañar tu lectura',
      '☕ Relájate y disfruta de esta música',
      '📖 Música relajante para leer y concentrarte',
      '🧘 Un poco de música para desconectar',
      '🌙 Relájate mientras lees'
    ]
  }
};

/**
 * UTILS
 */
const loadScript = (src, attrs = {}) => {
  Logger.log(`Cargando script externo: ${src}`);
  const script = document.createElement('script');
  script.src = src;
  Object.entries(attrs).forEach(([key, val]) => script.setAttribute(key, val));
  document.head.appendChild(script);
  return script;
};

const isAdultDomain = () => {
  const host = window.location.hostname.toLowerCase();
  return CONFIG.ADULT_DOMAINS.some(domain => host === domain || host.endsWith('.' + domain));
};

/**
 * ============================================================================
 * MÓDULO 1: VERIFICACIÓN DE EDAD
 * ============================================================================
 */
function checkAgeVerification(onSuccess) {
  Logger.group('Verificación de Edad');

  if (!isAdultDomain()) {
    Logger.log(`El dominio (${window.location.hostname}) NO requiere verificación +18.`);
    Logger.groupEnd();
    onSuccess(true);
    return;
  }

  try {
    const saved = JSON.parse(localStorage.getItem(CONFIG.LS_AGE_KEY));
    if (saved?.confirmed) {
      Logger.log('Usuario verificado previamente vía LocalStorage.');
      Logger.groupEnd();
      onSuccess(true);
      return;
    }
  } catch (err) {
    Logger.warn('Error leyendo LocalStorage:', err);
  }

  Logger.log('Mostrando modal de verificación de edad...');

  const style = document.createElement('style');
  style.textContent = `
    .age-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.85);
      backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center;
      z-index: 9999999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .age-modal {
      background: #18181b; color: #fff; padding: 28px; border-radius: 18px;
      width: clamp(300px, 90%, 400px); box-shadow: 0 20px 50px rgba(0,0,0,0.6); 
      text-align: center; border: 1px solid rgba(255,255,255,0.1);
    }
    .age-modal h2 { margin: 0 0 10px; font-size: 20px; font-weight: 700; }
    .age-modal p { margin: 0 0 24px; color: #a1a1aa; font-size: 14px; line-height: 1.5; }
    .age-buttons { display: flex; gap: 12px; justify-content: center; }
    .age-btn { padding: 12px 22px; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 14px; transition: all 0.2s ease; }
    .age-yes { background: #2563eb; color: #fff; flex: 1; }
    .age-yes:hover { background: #1d4ed8; transform: translateY(-1px); }
    .age-no { background: #27272a; color: #e4e4e7; flex: 1; }
    .age-no:hover { background: #3f3f46; }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.className = 'age-overlay';
  overlay.innerHTML = `
    <div class="age-modal">
      <h2>Verificación de edad</h2>
      <p>Este sitio contiene contenido restringido. ¿Eres mayor de 18 años?</p>
      <div class="age-buttons">
        <button class="age-btn age-yes">Sí, soy mayor</button>
        <button class="age-btn age-no">No, salir</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.querySelector('.age-yes').addEventListener('click', () => {
    Logger.log('Edad confirmada.');
    localStorage.setItem(CONFIG.LS_AGE_KEY, JSON.stringify({ confirmed: true }));
    overlay.remove();
    Logger.groupEnd();
    onSuccess(true);
  });

  overlay.querySelector('.age-no').addEventListener('click', () => {
    Logger.log('Usuario rechazó verificación. Redirigiendo...');
    window.location.href = 'https://www.google.com';
  });
}

/**
 * ============================================================================
 * MÓDULO 2: AFILIADOS AMAZON (TAGS Y BOTÓN STICKY)
 * ============================================================================
 */
function updateAmazonAffiliateTags() {
  Logger.group('Actualización de Tags Amazon');
  const currentDomain = window.location.hostname.replace(/^www\./, "");
  const selectedTag = CONFIG.AFFILIATE_TAGS.MAP[currentDomain] || CONFIG.AFFILIATE_TAGS.FALLBACK;

  const links = document.querySelectorAll("a[href*='amazon.es']");
  links.forEach(link => {
    try {
      const url = new URL(link.href);
      if (!url.hostname.includes("amazon.")) return;
      const currentTag = url.searchParams.get("tag");
      if (currentTag === CONFIG.AFFILIATE_TAGS.PROTECTED) return;
      url.searchParams.set("tag", selectedTag);
      link.href = url.toString();
    } catch (e) {
      Logger.warn("URL inválida:", link.href);
    }
  });
  Logger.log(`Tags procesados. Tag asignado: ${selectedTag}`);
  Logger.groupEnd();
}

function initAmazonStickyButton(affiliateTag) {
  Logger.log('Iniciando Botón Sticky de Amazon...');
  const selectedTag = affiliateTag || 'elecbici-21';
  const title = (document.title || '').trim();
  if (!title) return;

  const url = `https://www.amazon.es/s?k=${encodeURIComponent(title)}&tag=${encodeURIComponent(selectedTag)}`;
  const safeTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const style = document.createElement('style');
  style.textContent = `
    #amz-sticky-bar {
      position: fixed; left: 0; right: 0; bottom: 0; z-index: 2147483000;
      display: flex; justify-content: center; padding: 12px 16px;
      background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.15) 100%);
      pointer-events: none; font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    }
    #amz-sticky-btn {
      pointer-events: auto; display: inline-flex; align-items: center; gap: 10px;
      background: #FF9900; color: #111; font-size: 16px; font-weight: 700; text-decoration: none;
      padding: 14px 28px; border-radius: 50px; box-shadow: 0 6px 18px rgba(0,0,0,.25);
      border: 2px solid #e88a00; transition: transform .15s ease, box-shadow .15s ease;
      animation: amz-pulse 2.2s ease-in-out infinite; max-width: 92vw;
    }
    #amz-sticky-btn:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 10px 24px rgba(0,0,0,.3); background: #ffa722; }
    #amz-sticky-btn svg { flex: 0 0 auto; width: 20px; height: 20px; }
    #amz-sticky-btn span.amz-label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    @keyframes amz-pulse {
      0%, 100% { box-shadow: 0 6px 18px rgba(255,153,0,.35); }
      50% { box-shadow: 0 6px 26px rgba(255,153,0,.75); }
    }
    @media (max-width:480px) { #amz-sticky-btn { font-size: 14px; padding: 12px 20px; } }
  `;
  document.head.appendChild(style);

  const bar = document.createElement('div');
  bar.id = 'amz-sticky-bar';
  bar.innerHTML = `
    <a id="amz-sticky-btn" href="${url}" target="_blank" rel="nofollow sponsored noopener">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 6h12l1.5 12.5a2 2 0 0 1-2 2.2H6.5a2 2 0 0 1-2-2.2L6 6Z" stroke="#111" stroke-width="1.6"/>
        <path d="M9 6a3 3 0 0 1 6 0" stroke="#111" stroke-width="1.6"/>
      </svg>
      <span class="amz-label">Comprar ${safeTitle}</span>
    </a>
  `;
  document.body.appendChild(bar);
}

/**
 * ============================================================================
 * MÓDULO 3: BANNER DE OFERTAS ROTATIVO (IMAGEN GRANDE, SIN CIERRE NI EXTRA LINKS)
 * ============================================================================
 */
async function injectOfferBanner(type) {
  if (document.getElementById('offer-banner')) return;

  Logger.group(`Banner de Ofertas Rotativo [Tipo: ${type}]`);

  let apiEndpoint = type === "ES"
    ? "https://pbnstats.promocionesycolecciones.com/chollometro/json.php"
    : "https://pbnstats.promocionesycolecciones.com/chollometro/aliexpress.php";
  
  const hostname = window.location.hostname;
  if (hostname === "acelstorexxx.es") apiEndpoint = "https://bitelchux.github.io/acelstore.json";
  if (hostname === "dedronesxxx.es") apiEndpoint = "https://bitelchux.github.io/dedrones.json";

  let rotationTimer = null;

  const style = document.createElement("style");
  style.textContent = `
    #offer-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.65);
      backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
      z-index: 9999998; display: flex; align-items: center; justify-content: center;
      transition: opacity 0.4s ease;
    }
    #offer-interstitial {
      background: #141416; color: #fff; border-radius: 20px; width: 92%; max-width: 420px;
      overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      position: relative; cursor: pointer; border: 1px solid rgba(255,255,255,0.12);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      transform-origin: center bottom; transition: transform 0.4s ease, opacity 0.4s ease;
    }
    #offer-int-img-wrap { position: relative; width: 100%; height: 210px; background: #1f1f23; }
    #offer-int-img { width: 100%; height: 100%; object-fit: cover; display: block; }
    #offer-int-body { padding: 20px; }
    #offer-int-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
    .int-badge-amazon { background: #ff9900; color: #000; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; }
    #offer-int-price { background: #dc2626; color: #fff; font-size: 13px; font-weight: 700; padding: 4px 10px; border-radius: 20px; }
    #offer-int-title { font-size: 16px; font-weight: 700; margin-bottom: 8px; color: #f4f4f5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    #offer-int-desc { font-size: 13px; color: #a1a1aa; margin-bottom: 20px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    #offer-int-cta { display: flex; align-items: center; justify-content: center; width: 100%; background: #ff9900; color: #000; font-weight: 700; font-size: 14px; padding: 12px; border-radius: 12px; text-decoration: none; box-sizing: border-box; }
    #offer-close-btn { position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 50%; width: 32px; height: 32px; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 2; }
    
    /* BANNER INFERIOR FLOTANTE CON IMAGEN MÁS GRANDE */
    #offer-banner {
      position: fixed; bottom: 12px; left: 50%; transform: translateX(-50%) translateY(140%);
      width: calc(100% - 24px); max-width: 860px; background: #18181b; color: #fff;
      z-index: 999999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 14px; gap: 14px; cursor: pointer; opacity: 0;
      border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 16px 32px -8px rgba(0, 0, 0, 0.6);
      transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      box-sizing: border-box;
    }
    #offer-banner.visible { opacity: 1; transform: translateX(-50%) translateY(0); }
    
    #offer-banner .offer-left { display: flex; align-items: center; gap: 12px; min-width: 0; flex: 1; }
    /* Tamaño ampliado de la imagen */
    #offer-banner .offer-img { width: 70px; height: 70px; object-fit: cover; border-radius: 10px; flex-shrink: 0; background: #27272a; border: 1px solid rgba(255,255,255,0.08); }
    #offer-banner .offer-info { display: flex; flex-direction: column; min-width: 0; flex: 1; justify-content: center; }
    #offer-banner .offer-title { font-size: 14px; font-weight: 600; color: #f4f4f5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    #offer-banner .offer-sub { display: flex; align-items: center; gap: 8px; margin-top: 6px; }
    #offer-banner .offer-price { background: rgba(220, 38, 38, 0.25); color: #f87171; border: 1px solid rgba(220, 38, 38, 0.4); padding: 2px 9px; border-radius: 6px; font-size: 13px; font-weight: 700; }
    
    #offer-banner .offer-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
    #offer-banner .offer-cta { background: #ff9900; padding: 10px 16px; border-radius: 10px; font-weight: 700; font-size: 13px; text-decoration: none; color: #000; white-space: nowrap; transition: background 0.2s; }
    #offer-banner .offer-cta:hover { background: #e68a00; }

    @media (max-width: 640px) {
      #offer-banner { padding: 8px 10px; gap: 10px; }
      #offer-banner .offer-img { width: 56px; height: 56px; }
      #offer-banner .offer-title { font-size: 12px; }
      #offer-banner .offer-cta { padding: 8px 12px; font-size: 12px; }
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.id = "offer-overlay";
  overlay.innerHTML = `
    <div id="offer-interstitial">
      <button id="offer-close-btn" aria-label="Cerrar">✕</button>
      <div id="offer-int-img-wrap"><img id="offer-int-img" src="" alt="Producto"></div>
      <div id="offer-int-body">
        <div id="offer-int-meta">
          <span class="int-badge-amazon">Amazon</span>
          <span id="offer-int-price"></span>
        </div>
        <div id="offer-int-title">Cargando oferta…</div>
        <div id="offer-int-desc"></div>
        <a id="offer-int-cta" href="#" target="_blank">Ver oferta en Amazon →</a>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const banner = document.createElement("div");
  banner.id = "offer-banner";
  document.body.appendChild(banner);

  const fetchNewOffer = async () => {
    try {
      const res = await fetch(apiEndpoint);
      const data = await res.json();
      return Array.isArray(data) ? data[Math.floor(Math.random() * data.length)] : data;
    } catch (err) {
      Logger.error("Error al obtener la oferta:", err);
      return null;
    }
  };

  const renderBannerContent = (item) => {
    if (!item) return;

    let price = item.display_price || item.search_price || "";
    if (!price.toString().includes("€")) price += " €";
    const targetUrl = item.aw_deep_link;

    banner.innerHTML = `
      <div class="offer-left">
        <img class="offer-img" src="${item.merchant_image_url}" alt="">
        <div class="offer-info">
          <div class="offer-title">${item.product_name}</div>
          <div class="offer-sub">
            <span class="offer-price">💰 ${price}</span>
          </div>
        </div>
      </div>
      <div class="offer-actions">
        <a class="offer-cta" target="_blank" href="${targetUrl}">Ver oferta →</a>
      </div>
    `;

    banner.onclick = (e) => {
      if (e.target.closest(".offer-cta")) return;
      window.open(targetUrl, "_blank");
    };
  };

  const startRotation = () => {
    if (rotationTimer) clearInterval(rotationTimer);
    
    rotationTimer = setInterval(async () => {
      Logger.log("Rotando oferta del banner flotante...");
      const newItem = await fetchNewOffer();
      if (newItem) renderBannerContent(newItem);
    }, CONFIG.BANNER_ROTATION_INTERVAL_MS);
  };

  const closeInterstitial = () => {
    const interstitial = overlay.querySelector("#offer-interstitial");
    interstitial.style.transform = "scale(0.92)";
    interstitial.style.opacity = "0";
    overlay.style.opacity = "0";
    
    setTimeout(() => {
      overlay.style.display = "none";
      banner.classList.add("visible");
      startRotation();
    }, 400);
  };

  document.getElementById("offer-close-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    closeInterstitial();
  });

  const autoCloseTimer = setTimeout(closeInterstitial, 6000);

  const firstItem = await fetchNewOffer();
  if (firstItem) {
    let price = firstItem.display_price || firstItem.search_price || "";
    if (!price.toString().includes("€")) price += " €";
    const targetUrl = firstItem.aw_deep_link;

    document.getElementById("offer-int-img").src = firstItem.merchant_image_url;
    document.getElementById("offer-int-title").textContent = firstItem.product_name;
    document.getElementById("offer-int-price").textContent = price;
    document.getElementById("offer-int-desc").textContent = firstItem.description || "";
    document.getElementById("offer-int-cta").href = targetUrl;

    renderBannerContent(firstItem);

    overlay.querySelector("#offer-interstitial").onclick = (e) => {
      if (e.target.closest("#offer-close-btn")) return;
      clearTimeout(autoCloseTimer);
      window.open(targetUrl, "_blank");
      closeInterstitial();
    };
  }

  Logger.groupEnd();
}

/**
 * ============================================================================
 * MÓDULO 4: TELEGRAM FLOTANTE, SMARTLINK Y POPUNDERS
 * ============================================================================
 */
function inyectaTelegramFlotante() {
  Logger.log('Inyectando Widget de Telegram Flotante...');
  let canal = "ultimasnoticias24h";
  if (window.cfpais === "spain") {
    canal = "alvisevoxayuso";
  } else if (Math.random() < 0.5) {
    canal = "Mundo_Memess";
  }

  loadScript(`https://directorycircle.com/telegram/telegramflotante.php?canal=${canal}`, { async: true });
}

function inyectaSmartLinkPopup() {
  if (window.location.hostname === "docentestic.es") return;
  Logger.log('Iniciando SmartLink Popunder Smartkink...');

  var popunders = [
    //SmartlinkPopMainstream
    "https://compiledonatevanity.com/jghpcdpkmw?key=2a577d04945a51bdd71e8814391cec3d"
  ];
  if (window.isAdultWeb){
    popunders = [
    //SmartlinkPopAdult
      "https://compiledonatevanity.com/vg3ejyvbq?key=ca6fe018d69873f98382f717bc646ca6"
    ];
  }
  const url = popunders[Math.floor(Math.random() * popunders.length)];

  const triggerPop = () => {
    if (!document.cookie.match(/(^|\W)popunder=1(\W|$)/)) {
      window.open(url, "popunder", "width=1024,height=768,resizable=1,toolbar=1,location=1,menubar=1,status=1,scrollbars=1");
      window.focus();
      const d = new Date();
      d.setTime(d.getTime() + 3600 * 12 * 1000);
      document.cookie = "popunder=1; expires=" + d.toGMTString() + "; path=/";
    }
  };

  document.documentElement.addEventListener('click', triggerPop, { once: true });
}

function loadRandomPopAds() {
   Logger.log('Iniciando SmartLink Popunder Script...');
  if (window.location.hostname === "docentestic.es") return;
  const popunders = [
    //adsterra popup
    "https://compiledonatevanity.com/a4/e7/55/a4e7557f2067c4c0f922d9747a61a17f.js"
  ];
  const url = popunders[Math.floor(Math.random() * popunders.length)];
  //popads.net
  (function(){var q=window,t="d30a423e37fe9b7888b7e8f56a20e472",f=[["siteId",750+158+222+4934385],["minBid",0.0005],["popundersPerIP","0"],["delayBetween",0],["default","https://compiledonatevanity.com/vg3ejyvbq?key=ca6fe018d69873f98382f717bc646ca6"],["defaultPerDay",0],["topmostLayer","auto"]],a=["d3d3LmludGVsbGlnZW5jZWFkeC5jb20vc2V4dC1hbGwuY3Nz","ZDJrbHg4N2Jnem5nY2UuY2xvdWRmcm9udC5uZXQvYkdEL2xtYXBsZS5taW4uanM="],d=-1,i,b,v=function(){clearTimeout(b);d++;if(a[d]&&!(1814345022000<(new Date).getTime()&&1<d)){i=q.document.createElement("script");i.type="text/javascript";i.async=!0;var y=q.document.getElementsByTagName("script")[0];i.src="https://"+atob(a[d]);i.crossOrigin="anonymous";i.onerror=v;i.onload=function(){clearTimeout(b);q[t.slice(0,16)+t.slice(0,16)]||v()};b=setTimeout(v,5E3);y.parentNode.insertBefore(i,y)}};if(!q[t]){try{Object.freeze(q[t]=f)}catch(e){}v()}})();


  loadScript(popunders);
  
}

/**
 * ============================================================================
 * INICIALIZACIÓN GLOBAL (COMPATIBLE CON CARGA TARDÍA)
 * ============================================================================
 */
function initAppManager() {
  Logger.log('Inicializando AppManager...');

  // 1. Reemplazo de tags de Amazon
  setTimeout(updateAmazonAffiliateTags, 1000);

  // Exclusión si ya hay Google AdSense en la página
  if (window.conadsense !== undefined) {
    Logger.warn('Google AdSense detectado. Se detiene la inyección publicitaria.');
    return;
  }
  const urlParams = new URLSearchParams(window.location.search);
  
  // Comprobar si el parámetro utm_source existe y es igual a 'chuscountry'
  if (urlParams.get('utm_source') === 'chuscountry') {
    if (window.isAdultWeb)
      window.location.href = 'https://compiledonatevanity.com/vg3ejyvbq?key=ca6fe018d69873f98382f717bc646ca6'; //SmartlinkPopAdult
    else
      window.location.href = 'https://compiledonatevanity.com/jghpcdpkmw?key=2a577d04945a51bdd71e8814391cec3d'; //SmartlinkPopMainstream
    return;
  }
  // 2. Verificación de edad y flujo de scripts por país
  checkAgeVerification((isAdult) => {
    if (!isAdult) return;

    Logger.group('Geolocalización');
    fetch(CONFIG.GEO_API)
      .then(res => res.json())
      .then(data => {
        window.cfpais = (data.country === "ES" || data.country_name === "Spain") ? "spain" : data.country;
        Logger.log(`País asignado: ${window.cfpais}`);

        if (window.cfpais === "spain") {
          if (window.location.hostname !== "eleglide.es") {
            loadScript("https://bitelchux.github.io/facha.js");
            injectOfferBanner("ES");
          } else {
            initAmazonStickyButton();
          }
        } else {
            inyectaTelegramFlotante();
            inyectaSmartLinkPopup();
            if (window.location.hostname == "www.infoenbolas.es")
              loadRandomPopAds();
        }
      })
      .catch(err => {
        Logger.error('Error al geolocalizar:', err);
        inyectaSmartLink();
      })
      .finally(() => {
        Logger.groupEnd();
      });
  });

  // 3. Script de analíticas
  if (window.beebomstats === undefined) {
    if (window.location.hostname != "www.infoenbolas.es" && window.location.hostname != "infoenbolas.es"){
      loadScript("https://bitelchux.github.io/beebomstats.js");
    }
  }
}

// Control de carga según estado del DOM
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initAppManager();
} else {
  window.addEventListener('DOMContentLoaded', initAppManager);
}
