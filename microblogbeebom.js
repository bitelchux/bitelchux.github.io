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
  
  // Dominios donde se activará la verificación de adultos (+18)
  ADULT_DOMAINS: [
    'acelstorexxx.es',
    'dedronesxxx.es',
    'localhost' // Añadido para pruebas locales
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

const isSpeedBotX = () => {
  return navigator.userAgent.includes("119.0.0.0") &&
         navigator.userAgent.includes("Safari/537.36") &&
         navigator.language === "en-US";
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
 * MÓDULO 2: AFILIADOS AMAZON (REEMPLAZO DE TAGS Y BOTÓN STICKY)
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
 * MÓDULO 3: BANNER DE OFERTAS Y CHOLLOS
 * ============================================================================
 */
async function injectOfferBanner(type) {
  if (document.getElementById('offer-banner')) return;

  Logger.group(`Banner de Ofertas [Tipo: ${type}]`);

  let apiEndpoint = type === "ES"
    ? "https://pbnstats.promocionesycolecciones.com/chollometro/json.php"
    : "https://pbnstats.promocionesycolecciones.com/chollometro/aliexpress.php";
  
  const hostname = window.location.hostname;
  if (hostname === "acelstorexxx.es") apiEndpoint = "https://bitelchux.github.io/acelstore.json";
  if (hostname === "dedronesxxx.es") apiEndpoint = "https://bitelchux.github.io/dedrones.json";

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
    
    #offer-banner {
      position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%) translateY(120%);
      width: calc(100% - 32px); max-width: 820px; background: #18181b; color: #fff;
      z-index: 999999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 14px; gap: 16px; cursor: pointer; opacity: 0;
      border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 16px 32px -8px rgba(0, 0, 0, 0.5);
      transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      box-sizing: border-box;
    }
    #offer-banner.visible { opacity: 1; transform: translateX(-50%) translateY(0); }
    #offer-banner .offer-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
    #offer-banner .offer-img { width: 56px; height: 56px; object-fit: cover; border-radius: 10px; flex-shrink: 0; background: #27272a; }
    #offer-banner .offer-info { display: flex; flex-direction: column; min-width: 0; }
    #offer-banner .offer-title { font-size: 13px; font-weight: 600; color: #f4f4f5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    #offer-banner .offer-price { margin-top: 4px; background: rgba(220, 38, 38, 0.2); color: #f87171; border: 1px solid rgba(220, 38, 38, 0.3); padding: 2px 8px; border-radius: 6px; font-size: 12px; font-weight: 700; width: fit-content; }
    #offer-banner .offer-telegram { margin-top: 4px; }
    #offer-banner .offer-telegram a { color: #38bdf8; text-decoration: none; font-size: 11px; font-weight: 600; display: flex; align-items: center; gap: 4px; }
    #offer-banner .offer-cta { background: #ff9900; padding: 10px 18px; border-radius: 10px; font-weight: 700; font-size: 13px; text-decoration: none; color: #000; white-space: nowrap; flex-shrink: 0; }
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

  const closeInterstitial = () => {
    const interstitial = overlay.querySelector("#offer-interstitial");
    interstitial.style.transform = "scale(0.92)";
    interstitial.style.opacity = "0";
    overlay.style.opacity = "0";
    setTimeout(() => {
      overlay.style.display = "none";
      banner.classList.add("visible");
    }, 400);
  };

  document.getElementById("offer-close-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    closeInterstitial();
  });

  const autoCloseTimer = setTimeout(closeInterstitial, 6000);

  try {
    const res = await fetch(apiEndpoint);
    const data = await res.json();
    const item = Array.isArray(data) ? data[Math.floor(Math.random() * data.length)] : data;

    let price = item.display_price || item.search_price || "";
    if (!price.toString().includes("€")) price += " €";
    const targetUrl = item.aw_deep_link;

    document.getElementById("offer-int-img").src = item.merchant_image_url;
    document.getElementById("offer-int-title").textContent = item.product_name;
    document.getElementById("offer-int-price").textContent = price;
    document.getElementById("offer-int-desc").textContent = item.description || "";
    document.getElementById("offer-int-cta").href = targetUrl;

    banner.innerHTML = `
      <div class="offer-left">
        <img class="offer-img" src="${item.merchant_image_url}" alt="">
        <div class="offer-info">
          <div class="offer-title">${item.product_name}</div>
          <div class="offer-price">💰 ${price}</div>
          <div class="offer-telegram">
            <a href="https://t.me/chollosamazoneshoy" target="_blank" rel="noopener">Canal de chollos ↗</a>
          </div>
        </div>
      </div>
      <a class="offer-cta" target="_blank" href="${targetUrl}">Ver oferta →</a>
    `;

    banner.onclick = (e) => {
      if (e.target.closest(".offer-cta") || e.target.closest(".offer-telegram")) return;
      window.open(targetUrl, "_blank");
    };

  } catch (err) {
    Logger.error('Error cargando banner de ofertas:', err);
  } finally {
    Logger.groupEnd();
  }
}

/**
 * ============================================================================
 * MÓDULO 4: REPRODUCTOR SPOTIFY RELAX
 * ============================================================================
 */
function addSpotifyRelax() {
  if (document.getElementById('spotify-relax-dialog')) return;
  Logger.log('Iniciando Spotify Relax...');

  const message = CONFIG.SPOTIFY.MESSAGES[Math.floor(Math.random() * CONFIG.SPOTIFY.MESSAGES.length)];

  if (!document.getElementById('spotify-relax-styles')) {
    const style = document.createElement('style');
    style.id = 'spotify-relax-styles';
    style.textContent = `
      #spotify-relax-dialog { position: fixed; inset: 0; z-index: 9999999999; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,.58); backdrop-filter: blur(6px); padding: 20px; box-sizing: border-box; }
      .spotify-relax-box { width: 100%; max-width: 430px; background: #fff; border-radius: 22px; padding: 32px 28px 27px; text-align: center; font-family: -apple-system, sans-serif; }
      .spotify-relax-icon { font-size: 50px; margin-bottom: 12px; }
      .spotify-relax-title { font-size: 23px; font-weight: 700; color: #222; margin-bottom: 10px; }
      .spotify-relax-description { font-size: 16px; color: #666; margin-bottom: 25px; }
      .spotify-relax-buttons { display: flex; flex-direction: column; gap: 10px; }
      #spotify-relax-yes { border: 0; border-radius: 30px; padding: 14px 20px; background: #1DB954; color: white; font-size: 16px; font-weight: 600; cursor: pointer; }
      #spotify-relax-no { border: 0; background: transparent; color: #777; font-size: 14px; padding: 8px; cursor: pointer; }
      #spotify-relax-widget { position: fixed; top: 0; left: 0; width: 100%; height: 64px; z-index: 999999999; background: linear-gradient(135deg, #191414, #242424); display: flex; align-items: center; justify-content: center; padding: 0 45px 0 15px; box-sizing: border-box; font-family: sans-serif; }
      .spotify-relax-text { color: #fff; font-size: 15px; margin-right: 22px; white-space: nowrap; }
      .spotify-relax-controls { display: flex; align-items: center; gap: 7px; }
      .spotify-relax-control { width: 40px; height: 40px; border: 0; border-radius: 50%; background: rgba(255,255,255,.10); color: white; display: flex; align-items: center; justify-content: center; font-size: 17px; cursor: pointer; }
      .spotify-relax-play { width: 44px; height: 44px; background: #1DB954; }
      .spotify-relax-close { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 32px; height: 32px; border: 0; background: transparent; color: #aaa; font-size: 24px; cursor: pointer; }
      #spotify-relax-embed { position: fixed; width: 1px; height: 1px; left: -10000px; top: -10000px; opacity: 0; pointer-events: none; }
      @media (max-width: 600px) { .spotify-relax-text { display: none; } }
    `;
    document.head.appendChild(style);
  }

  const dialog = document.createElement('div');
  dialog.id = 'spotify-relax-dialog';
  dialog.innerHTML = `
    <div class="spotify-relax-box">
      <div class="spotify-relax-icon">🎧</div>
      <div class="spotify-relax-title">¿Te apetece escuchar música?</div>
      <div class="spotify-relax-description">${message}</div>
      <div class="spotify-relax-buttons">
        <button id="spotify-relax-yes">🎵 Escuchar música</button>
        <button id="spotify-relax-no">Ahora no</button>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);

  document.getElementById('spotify-relax-no').onclick = () => dialog.remove();
  document.getElementById('spotify-relax-yes').onclick = () => {
    dialog.remove();

    const widget = document.createElement('div');
    widget.id = 'spotify-relax-widget';
    widget.innerHTML = `
      <div class="spotify-relax-text">${message}</div>
      <div class="spotify-relax-controls">
        <button class="spotify-relax-control" id="spotify-relax-prev" title="Anterior">⏮</button>
        <button class="spotify-relax-control spotify-relax-play" id="spotify-relax-play" title="Reproducir">▶</button>
        <button class="spotify-relax-control" id="spotify-relax-pause" title="Pausa">⏸</button>
        <button class="spotify-relax-control" id="spotify-relax-next" title="Siguiente">⏭</button>
      </div>
      <button class="spotify-relax-close" title="Cerrar">×</button>
      <div id="spotify-relax-embed"></div>
    `;
    document.body.prepend(widget);
    document.body.style.paddingTop = '64px';

    let controller = null;

    const createPlayer = (IFrameAPI) => {
      const element = document.getElementById('spotify-relax-embed');
      if (!element) return;
      const firstEntity = CONFIG.SPOTIFY.TRACKS.length ? CONFIG.SPOTIFY.TRACKS[0] : CONFIG.SPOTIFY.ALBUM_URL;

      IFrameAPI.createController(element, { width: 1, height: 1, url: firstEntity }, (EmbedController) => {
        controller = EmbedController;
        controller.addListener('ready', () => {
          controller.play().catch(err => Logger.warn('Autoplay bloqueado:', err));
        });
      });
    };

    widget.querySelector('.spotify-relax-close').onclick = () => {
      if (controller) { try { controller.pause(); } catch (e) {} }
      widget.remove();
      document.body.style.paddingTop = '';
    };

    if (window.SpotifyIframeApi) {
      createPlayer(window.SpotifyIframeApi);
    } else {
      window.onSpotifyIframeApiReady = (API) => {
        window.SpotifyIframeApi = API;
        createPlayer(API);
      };
      if (!document.getElementById('spotify-iframe-api')) {
        loadScript('https://open.spotify.com/embed/iframe-api/v1', { id: 'spotify-iframe-api', async: true });
      }
    }
  };
}

/**
 * ============================================================================
 * MÓDULO 5: TELEGRAM FLOTANTE, SMARTLINK Y POPUNDERS
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

function inyectaSmartLink() {
  if (window.location.hostname === "docentestic.es") return;
  Logger.log('Iniciando SmartLink Popunder...');

  const popunders = [
    "https://compiledonatevanity.com/yt94dzqqz?key=8c687ab6a953d34b9bee3ccbd9d06a4e"
  ];
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

function loadRandomAds() {
  Logger.group('Cargando Redes de Publicidad Alternativas');
  loadScript("https://compiledonatevanity.com/a4/e7/55/a4e7557f2067c4c0f922d9747a61a17f.js");
  Logger.groupEnd();
}

/**
 * ============================================================================
 * INICIALIZACIÓN GLOBAL (MAIN INIT)
 * ============================================================================
 */
window.addEventListener("load", () => {
  Logger.log('Inicializando AppManager...');

  // 1. Reemplazo de tags de Amazon
  setTimeout(updateAmazonAffiliateTags, 2000);

  // Exclusión por Adsense/Google
  if (window.conadsense !== undefined || window.adsbygoogle !== undefined) {
    Logger.warn('Google AdSense detectado. Se detiene la inyección publicitaria.');
    return;
  }

  // 2. Verificación de edad y flujo por país
  setTimeout(() => {
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
            inyectaSmartLink();
            loadRandomAds();
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
  }, 1000);

  // 3. Script de analíticas
  if (window.beebomstats === undefined) {
    loadScript("https://bitelchux.github.io/beebomstats.js");
  }
});
