/**
 * ============================================================================
 * APP MANAGER: PUBLICIDAD, AFILIADOS Y WIDGETS
 * ============================================================================
 * Flujo:
 *  1. Tags de afiliado de Amazon (siempre).
 *  2. Si hay AdSense en la página, no se inyecta publicidad.
 *  3. utm_source=chuscountry → redirección directa al smartlink.
 *  4. Verificación de edad (solo en dominios adultos).
 *  5. Geolocalización (cacheada por sesión) y publicidad según país.
 *  6. Analíticas.
 */
(() => {
  'use strict';

  // Evita doble ejecución si el script se incluye dos veces
  if (window.__appManagerLoaded) return;
  window.__appManagerLoaded = true;

  /* ==========================================================================
   * LOGGING
   * ======================================================================== */
  const Logger = {
    PREFIX: '[AppManager]',
    log:   (msg, ...d) => console.log(`${Logger.PREFIX} ℹ️ ${msg}`, ...d),
    warn:  (msg, ...d) => console.warn(`${Logger.PREFIX} ⚠️ ${msg}`, ...d),
    error: (msg, ...d) => console.error(`${Logger.PREFIX} ❌ ${msg}`, ...d)
  };

  /* ==========================================================================
   * CONFIGURACIÓN
   * ======================================================================== */
  const SMARTLINK_MAINSTREAM = 'https://compiledonatevanity.com/jghpcdpkmw?key=2a577d04945a51bdd71e8814391cec3d';
  const SMARTLINK_ADULT      = 'https://compiledonatevanity.com/vg3ejyvbq?key=ca6fe018d69873f98382f717bc646ca6';

  const CONFIG = {
    AGE: {
      STORAGE_KEY: 'age_18_confirmed',
      // Dominios sin "www." (también cubre subdominios)
      ADULT_DOMAINS: ['infoenbolas.com', 'acelstorexxx.es', 'dedronesxxx.es', 'localhost'],
      EXIT_URL: 'https://www.google.com'
    },

    GEO: {
      API: 'https://ipapi.co/json/',
      CACHE_KEY: 'geo_country',
      TIMEOUT_MS: 5000
    },

    AFFILIATE_TAGS: {
      MAP: {
        'acelstore.es': 'iphonesreacondicionados-21',
        'tusarten.es': 'tusarten-21',
        'eleglide.es': 'elecbici-21',
        'kloner.es': 'portatiles0b-21',
        'tugrifodecocina.es': 'grifosfregadero-21',
        'dedrones.es': 'dedronesjulk-21'
      },
      FALLBACK: 'otrosafiliados-21',
      PROTECTED: 'pyc03-21'
    },

    OFFERS: {
      ENDPOINTS: {
        ES: 'https://pbnstats.promocionesycolecciones.com/chollometro/json.php',
        DEFAULT: 'https://pbnstats.promocionesycolecciones.com/chollometro/aliexpress.php'
      },
      ENDPOINT_BY_HOST: {
        'acelstorexxx.es': 'https://bitelchux.github.io/acelstore.json',
        'dedronesxxx.es': 'https://bitelchux.github.io/dedrones.json'
      },
      ROTATION_MS: 8000,               // Cada cuánto cambia el slider
      INTERSTITIAL_AUTOCLOSE_MS: 6000, // Tiempo que se ve el popup grande
      INTERSTITIAL_SEEN_KEY: 'offer_interstitial_seen',
      INTERSTITIAL_TTL_MS: 12 * 3600 * 1000, // Tras 12 h vuelve a salir el popup
      FETCH_TIMEOUT_MS: 8000,
      IMAGE_TIMEOUT_MS: 8000,
      MAX_IMAGE_ATTEMPTS: 5            // Ofertas a probar si falla la imagen
    },

    // Script que se carga en España cuando el popup de chollos pasa a slider
    // (si el widget de Telegram viene de aquí, nunca coincidirá con el popup)
    SPAIN_DEFERRED_SCRIPT: 'https://bitelchux.github.io/facha.js',

    TELEGRAM: {
      URL: 'https://directorycircle.com/telegram/telegramflotante.php',
      CHANNEL_SPAIN: 'alvisevoxayuso',
      CHANNELS_OTHER: ['ultimasnoticias24h', 'Mundo_Memess']
    },

    POPUNDER: {
      COOKIE: 'popunder',
      HOURS: 12,
      EXCLUDED_HOSTS: ['docentestic.es'],
      ADSTERRA_POPUNDERS: ['https://compiledonatevanity.com/a4/e7/55/a4e7557f2067c4c0f922d9747a61a17f.js'],
      ADSTERRA_SOCIAL: 'https://compiledonatevanity.com/e8/e9/23/e8e9237d7e6c9674010946d09842f465.js'
    },

    ANALYTICS: {
      URL: 'https://bitelchux.github.io/beebomstats.js',
      EXCLUDED_HOSTS: ['infoenbolas.es']
    }
  };

  /* ==========================================================================
   * UTILIDADES
   * ======================================================================== */
  const HOST = window.location.hostname.toLowerCase();
  const BARE_HOST = HOST.replace(/^www\./, '');

  /** ¿El host actual es alguno de estos dominios (sin www)? */
  const hostIs = (...domains) => domains.includes(BARE_HOST);

  const isAdultDomain = () =>
    CONFIG.AGE.ADULT_DOMAINS.some(d => BARE_HOST === d || BARE_HOST.endsWith('.' + d));

  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  const escapeHtml = (str) => String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const loadScript = (src, attrs = {}) => {
    Logger.log(`Cargando script externo: ${src}`);
    const script = document.createElement('script');
    script.src = src;
    Object.entries(attrs).forEach(([k, v]) => script.setAttribute(k, v));
    document.head.appendChild(script);
    return script;
  };

  /** Inyecta un bloque CSS una sola vez */
  const injectStyle = (id, css) => {
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
  };

  /** Acceso seguro a localStorage / sessionStorage (puede lanzar en modo privado) */
  const storage = {
    _store(session) {
      try { return session ? window.sessionStorage : window.localStorage; } catch { return null; }
    },
    get(key, { session = false } = {}) {
      try { return JSON.parse(this._store(session)?.getItem(key) ?? 'null'); } catch { return null; }
    },
    set(key, value, { session = false } = {}) {
      try { this._store(session)?.setItem(key, JSON.stringify(value)); } catch { /* sin almacenamiento */ }
    }
  };

  const cookies = {
    has: (name) => new RegExp(`(^|;\\s*)${name}=`).test(document.cookie),
    set: (name, value, hours) => {
      const expires = new Date(Date.now() + hours * 3600 * 1000).toUTCString();
      document.cookie = `${name}=${value}; expires=${expires}; path=/`;
    }
  };

  /** fetch + JSON con timeout */
  const fetchJson = async (url, timeoutMs) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: ctrl.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  };

  /** Resuelve cuando la imagen está descargada (queda en caché del navegador) */
  const preloadImage = (src, timeoutMs) => new Promise((resolve, reject) => {
    const img = new Image();
    const timer = setTimeout(() => reject(new Error('Timeout de imagen')), timeoutMs);
    img.onload = () => { clearTimeout(timer); resolve(src); };
    img.onerror = () => { clearTimeout(timer); reject(new Error('Error cargando imagen')); };
    img.src = src;
  });

  const openInNewTab = (url) => window.open(url, '_blank', 'noopener');

  const getAffiliateTag = () =>
    CONFIG.AFFILIATE_TAGS.MAP[BARE_HOST] || CONFIG.AFFILIATE_TAGS.FALLBACK;

  /* ==========================================================================
   * MÓDULO 1: VERIFICACIÓN DE EDAD
   * ======================================================================== */
  const AGE_CSS = `
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
    .age-btn { padding: 12px 22px; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 14px; transition: all 0.2s ease; flex: 1; }
    .age-yes { background: #2563eb; color: #fff; }
    .age-yes:hover { background: #1d4ed8; transform: translateY(-1px); }
    .age-no { background: #27272a; color: #e4e4e7; }
    .age-no:hover { background: #3f3f46; }
  `;

  /** Resuelve cuando el usuario puede ver el contenido */
  function ensureAgeVerified() {
    return new Promise((resolve) => {
      if (!window.isAdultWeb) {
        Logger.log(`El dominio (${HOST}) no requiere verificación +18.`);
        return resolve();
      }

      if (storage.get(CONFIG.AGE.STORAGE_KEY)?.confirmed) {
        Logger.log('Edad verificada previamente.');
        return resolve();
      }

      Logger.log('Mostrando modal de verificación de edad...');
      injectStyle('age-styles', AGE_CSS);

      const overlay = document.createElement('div');
      overlay.className = 'age-overlay';
      overlay.innerHTML = `
        <div class="age-modal" role="dialog" aria-modal="true">
          <h2>Verificación de edad</h2>
          <p>Este sitio contiene contenido restringido. ¿Eres mayor de 18 años?</p>
          <div class="age-buttons">
            <button type="button" class="age-btn age-yes">Sí, soy mayor</button>
            <button type="button" class="age-btn age-no">No, salir</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      overlay.querySelector('.age-yes').addEventListener('click', () => {
        Logger.log('Edad confirmada.');
        storage.set(CONFIG.AGE.STORAGE_KEY, { confirmed: true });
        overlay.remove();
        resolve();
      });

      overlay.querySelector('.age-no').addEventListener('click', () => {
        Logger.log('Verificación rechazada. Redirigiendo...');
        window.location.href = CONFIG.AGE.EXIT_URL;
      });
    });
  }

  /* ==========================================================================
   * MÓDULO 2: AFILIADOS AMAZON
   * ======================================================================== */
  function updateAmazonAffiliateTags() {
    const tag = getAffiliateTag();
    let updated = 0;

    document.querySelectorAll("a[href*='amazon.es']").forEach(link => {
      try {
        const url = new URL(link.href);
        if (!url.hostname.endsWith('amazon.es')) return;
        if (url.searchParams.get('tag') === CONFIG.AFFILIATE_TAGS.PROTECTED) return;
        url.searchParams.set('tag', tag);
        link.href = url.toString();
        updated++;
      } catch {
        Logger.warn('URL inválida:', link.href);
      }
    });

    Logger.log(`Tags de Amazon actualizados: ${updated} enlaces con tag ${tag}`);
  }

  const STICKY_CSS = `
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
    #amz-sticky-btn .amz-label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    @keyframes amz-pulse {
      0%, 100% { box-shadow: 0 6px 18px rgba(255,153,0,.35); }
      50% { box-shadow: 0 6px 26px rgba(255,153,0,.75); }
    }
    @media (max-width: 480px) { #amz-sticky-btn { font-size: 14px; padding: 12px 20px; } }
  `;

  function initAmazonStickyButton() {
    const title = (document.title || '').trim();
    if (!title || document.getElementById('amz-sticky-bar')) return;

    Logger.log('Iniciando botón sticky de Amazon...');
    const url = `https://www.amazon.es/s?k=${encodeURIComponent(title)}&tag=${encodeURIComponent(getAffiliateTag())}`;
    injectStyle('amz-sticky-styles', STICKY_CSS);

    const bar = document.createElement('div');
    bar.id = 'amz-sticky-bar';
    bar.innerHTML = `
      <a id="amz-sticky-btn" href="${escapeHtml(url)}" target="_blank" rel="nofollow sponsored noopener">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M6 6h12l1.5 12.5a2 2 0 0 1-2 2.2H6.5a2 2 0 0 1-2-2.2L6 6Z" stroke="#111" stroke-width="1.6"/>
          <path d="M9 6a3 3 0 0 1 6 0" stroke="#111" stroke-width="1.6"/>
        </svg>
        <span class="amz-label">Comprar ${escapeHtml(title)}</span>
      </a>
    `;
    document.body.appendChild(bar);
  }

  /* ==========================================================================
   * MÓDULO 3: CHOLLOS (POPUP INICIAL + SLIDER INFERIOR ROTATIVO)
   * ======================================================================== */
  const OFFER_CSS = `
    /* ---------- Popup (intersticial) ---------- */
    #offer-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.65);
      backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
      z-index: 9999998; display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.4s ease;
    }
    #offer-overlay.visible { opacity: 1; }
    #offer-interstitial {
      background: #141416; color: #fff; border-radius: 20px; width: 92%; max-width: 420px;
      overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      position: relative; cursor: pointer; border: 1px solid rgba(255,255,255,0.12);
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7);
      transform-origin: center bottom; transform: scale(0.92); opacity: 0;
      transition: transform 0.4s ease, opacity 0.4s ease;
    }
    #offer-overlay.visible #offer-interstitial { transform: scale(1); opacity: 1; }
    #offer-int-img-wrap { width: 100%; height: 210px; background: #1f1f23; }
    #offer-int-img { width: 100%; height: 100%; object-fit: cover; display: block; }
    #offer-int-body { padding: 20px; }
    #offer-int-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
    .int-badge-store { background: #ff9900; color: #000; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; }
    #offer-int-price { background: #dc2626; color: #fff; font-size: 13px; font-weight: 700; padding: 4px 10px; border-radius: 20px; }
    #offer-int-title, #offer-int-desc {
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }
    #offer-int-title { font-size: 16px; font-weight: 700; margin-bottom: 8px; color: #f4f4f5; }
    #offer-int-desc { font-size: 13px; color: #a1a1aa; }
    #offer-int-cta {
      display: flex; align-items: center; justify-content: center; width: 100%; margin-top: 20px;
      background: #ff9900; color: #000; font-weight: 700; font-size: 14px; padding: 12px;
      border-radius: 12px; text-decoration: none; box-sizing: border-box;
    }
    #offer-close-btn {
      position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.6);
      border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 50%;
      width: 32px; height: 32px; font-size: 14px; cursor: pointer;
      display: flex; align-items: center; justify-content: center; z-index: 2;
    }

    /* ---------- Slider inferior ---------- */
    #offer-banner {
      position: fixed; bottom: 12px; left: 50%; transform: translateX(-50%) translateY(140%);
      width: calc(100% - 24px); max-width: 860px; background: #18181b; color: #fff;
      z-index: 999999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 14px; gap: 14px; cursor: pointer; opacity: 0;
      border-radius: 16px; border: 1px solid rgba(255,255,255,0.12);
      box-shadow: 0 16px 32px -8px rgba(0,0,0,0.6);
      transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      box-sizing: border-box;
    }
    #offer-banner.visible { opacity: 1; transform: translateX(-50%) translateY(0); }
    #offer-banner > * { transition: opacity 0.25s ease; }
    #offer-banner.swapping > * { opacity: 0; }
    #offer-banner .offer-left { display: flex; align-items: center; gap: 12px; min-width: 0; flex: 1; }
    #offer-banner .offer-img {
      width: 70px; height: 70px; object-fit: cover; border-radius: 10px; flex-shrink: 0;
      background: #27272a; border: 1px solid rgba(255,255,255,0.08);
    }
    #offer-banner .offer-info { display: flex; flex-direction: column; min-width: 0; flex: 1; }
    #offer-banner .offer-title { font-size: 14px; font-weight: 600; color: #f4f4f5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    #offer-banner .offer-sub { display: flex; align-items: center; gap: 8px; margin-top: 6px; }
    #offer-banner .offer-price {
      background: rgba(220,38,38,0.25); color: #f87171; border: 1px solid rgba(220,38,38,0.4);
      padding: 2px 9px; border-radius: 6px; font-size: 13px; font-weight: 700;
    }
    #offer-banner .offer-cta {
      flex-shrink: 0; background: #ff9900; padding: 10px 16px; border-radius: 10px; font-weight: 700;
      font-size: 13px; text-decoration: none; color: #000; white-space: nowrap; transition: background 0.2s;
    }
    #offer-banner .offer-cta:hover { background: #e68a00; }

    @media (max-width: 640px) {
      #offer-banner { padding: 8px 10px; gap: 10px; }
      #offer-banner .offer-img { width: 56px; height: 56px; }
      #offer-banner .offer-title { font-size: 12px; }
      #offer-banner .offer-cta { padding: 8px 12px; font-size: 12px; }
    }
  `;

  /** Convierte un elemento del feed en una oferta válida (o null) */
  function normalizeOffer(raw) {
    if (!raw?.product_name || !raw.merchant_image_url || !/^https?:\/\//i.test(raw.aw_deep_link || '')) {
      return null;
    }
    let price = String(raw.display_price ?? raw.search_price ?? '').trim();
    if (price && !price.includes('€')) price += ' €';

    return {
      title: raw.product_name,
      image: raw.merchant_image_url,
      url: raw.aw_deep_link,
      price,
      description: raw.description || ''
    };
  }

  /**
   * Feed de ofertas: descarga el JSON una sola vez, las rota sin repetir
   * y solo devuelve una oferta cuando su imagen ya está descargada.
   */
  function createOfferFeed(endpoint) {
    let offers = [];
    let queue = [];
    let lastUrl = null;

    async function load() {
      const data = await fetchJson(endpoint, CONFIG.OFFERS.FETCH_TIMEOUT_MS);
      offers = (Array.isArray(data) ? data : [data]).map(normalizeOffer).filter(Boolean);
      if (!offers.length) throw new Error('El feed no contiene ofertas válidas');
      Logger.log(`Feed de ofertas cargado: ${offers.length} ofertas`);
    }

    function takeCandidate() {
      if (!queue.length) queue = shuffle([...offers]);
      let candidate = queue.pop();
      // Evita repetir la misma oferta dos veces seguidas al rebarajar
      if (candidate.url === lastUrl && queue.length) {
        queue.unshift(candidate);
        candidate = queue.pop();
      }
      return candidate;
    }

    /** Devuelve la siguiente oferta lista para pintar, o null */
    async function next() {
      if (!offers.length) await load();

      for (let i = 0; i < CONFIG.OFFERS.MAX_IMAGE_ATTEMPTS && offers.length; i++) {
        const offer = takeCandidate();
        try {
          await preloadImage(offer.image, CONFIG.OFFERS.IMAGE_TIMEOUT_MS);
          lastUrl = offer.url;
          return offer;
        } catch {
          Logger.warn('Imagen no disponible, se descarta la oferta:', offer.image);
          offers = offers.filter(o => o !== offer);
        }
      }
      return null;
    }

    return { next, get size() { return offers.length; } };
  }

  /** ¿Ya vio el popup grande recientemente? */
  const wasInterstitialSeen = () => {
    const seenAt = storage.get(CONFIG.OFFERS.INTERSTITIAL_SEEN_KEY);
    return typeof seenAt === 'number' && Date.now() - seenAt < CONFIG.OFFERS.INTERSTITIAL_TTL_MS;
  };
  const markInterstitialSeen = () => storage.set(CONFIG.OFFERS.INTERSTITIAL_SEEN_KEY, Date.now());

  function renderBanner(banner, offer) {
    banner.innerHTML = `
      <div class="offer-left">
        <img class="offer-img" src="${escapeHtml(offer.image)}" alt="">
        <div class="offer-info">
          <div class="offer-title">${escapeHtml(offer.title)}</div>
          ${offer.price ? `<div class="offer-sub"><span class="offer-price">💰 ${escapeHtml(offer.price)}</span></div>` : ''}
        </div>
      </div>
      <a class="offer-cta" target="_blank" rel="nofollow sponsored noopener" href="${escapeHtml(offer.url)}">Ver oferta →</a>
    `;
    banner.onclick = (e) => {
      if (e.target.closest('.offer-cta')) return; // el enlace ya abre la oferta
      openInNewTab(offer.url);
    };
  }

  /** Cambia la oferta del slider con un fundido suave */
  async function swapBanner(banner, offer) {
    banner.classList.add('swapping');
    await wait(250);
    renderBanner(banner, offer);
    banner.classList.remove('swapping');
  }

  /**
   * Rotación del slider. El siguiente cambio se programa cuando el anterior
   * ha terminado (oferta + imagen cargadas), así nunca queda vacío.
   * No rota con la pestaña oculta ni con el ratón encima.
   */
  function startBannerRotation(banner, feed) {
    if (feed.size < 2) return;

    const scheduleNext = () => setTimeout(async () => {
      if (!document.hidden && !banner.matches(':hover')) {
        try {
          const offer = await feed.next();
          if (offer) await swapBanner(banner, offer);
        } catch (err) {
          Logger.warn('No se pudo rotar la oferta:', err);
        }
      }
      if (feed.size >= 2) scheduleNext();
    }, CONFIG.OFFERS.ROTATION_MS);

    scheduleNext();
  }

  /** Muestra el popup grande y llama a onClosed cuando se ha cerrado */
  function showInterstitial(offer, storeLabel, onClosed) {
    const overlay = document.createElement('div');
    overlay.id = 'offer-overlay';
    overlay.innerHTML = `
      <div id="offer-interstitial" role="dialog" aria-modal="true" aria-label="Oferta destacada">
        <button id="offer-close-btn" type="button" aria-label="Cerrar">✕</button>
        <div id="offer-int-img-wrap">
          <img id="offer-int-img" src="${escapeHtml(offer.image)}" alt="${escapeHtml(offer.title)}">
        </div>
        <div id="offer-int-body">
          <div id="offer-int-meta">
            <span class="int-badge-store">${escapeHtml(storeLabel)}</span>
            ${offer.price ? `<span id="offer-int-price">${escapeHtml(offer.price)}</span>` : ''}
          </div>
          <div id="offer-int-title">${escapeHtml(offer.title)}</div>
          ${offer.description ? `<div id="offer-int-desc">${escapeHtml(offer.description)}</div>` : ''}
          <a id="offer-int-cta" href="${escapeHtml(offer.url)}" target="_blank" rel="nofollow sponsored noopener">
            Ver oferta en ${escapeHtml(storeLabel)} →
          </a>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    void overlay.offsetWidth;          // fuerza reflow para que la transición de entrada funcione
    overlay.classList.add('visible');

    let closed = false;
    const close = () => {
      if (closed) return;
      closed = true;
      clearTimeout(autoCloseTimer);
      document.removeEventListener('keydown', onKeyDown);
      overlay.classList.remove('visible'); // animación de "hacerse pequeño"
      setTimeout(() => {
        overlay.remove();
        onClosed();
      }, 400);
    };

    const onKeyDown = (e) => { if (e.key === 'Escape') close(); };
    const autoCloseTimer = setTimeout(close, CONFIG.OFFERS.INTERSTITIAL_AUTOCLOSE_MS);

    overlay.addEventListener('click', (e) => {
      if (e.target.closest('#offer-close-btn') || e.target === overlay) return close();
      if (e.target.closest('#offer-int-cta')) return close(); // el enlace abre la oferta solo
      if (e.target.closest('#offer-interstitial')) {
        openInNewTab(offer.url);
        close();
      }
    });
    document.addEventListener('keydown', onKeyDown);
  }

  /**
   * Punto de entrada de los chollos.
   * - Nada se muestra hasta que la primera oferta (y su imagen) está cargada.
   * - El popup grande solo sale una vez (ver INTERSTITIAL_TTL_MS); en las
   *   siguientes páginas aparece directamente el slider.
   * - onBannerMode se llama cuando ya solo queda el slider (o si no hay ofertas),
   *   para mostrar después otros widgets sin que coincidan con el popup.
   */
  async function initOffers(region, { onBannerMode } = {}) {
    if (document.getElementById('offer-banner')) return;

    const endpoint = CONFIG.OFFERS.ENDPOINT_BY_HOST[BARE_HOST]
      || (region === 'ES' ? CONFIG.OFFERS.ENDPOINTS.ES : CONFIG.OFFERS.ENDPOINTS.DEFAULT);
    const storeLabel = region === 'ES' ? 'Amazon' : 'AliExpress';
    const feed = createOfferFeed(endpoint);

    let firstOffer = null;
    try {
      firstOffer = await feed.next();
    } catch (err) {
      Logger.error('Error al obtener ofertas:', err);
    }

    if (!firstOffer) {
      Logger.warn('No hay ofertas disponibles; no se muestra popup ni slider.');
      onBannerMode?.();
      return;
    }

    injectStyle('offer-styles', OFFER_CSS);

    const banner = document.createElement('div');
    banner.id = 'offer-banner';
    renderBanner(banner, firstOffer);
    document.body.appendChild(banner);

    const showBanner = () => {
      void banner.offsetWidth;
      banner.classList.add('visible');
      startBannerRotation(banner, feed);
      onBannerMode?.();
    };

    if (wasInterstitialSeen()) {
      Logger.log('Popup ya visto: se muestra solo el slider.');
      showBanner();
    } else {
      markInterstitialSeen(); // se marca al mostrarlo, aunque cambie de página antes de cerrarlo
      showInterstitial(firstOffer, storeLabel, showBanner);
    }
  }

  /* ==========================================================================
   * MÓDULO 4: TELEGRAM, SMARTLINK Y POPUNDERS
   * ======================================================================== */
  let telegramInjected = false;

  function injectTelegramWidget() {
    if (telegramInjected) return;
    telegramInjected = true;

    const channel = window.cfpais === 'spain'
      ? CONFIG.TELEGRAM.CHANNEL_SPAIN
      : pickRandom(CONFIG.TELEGRAM.CHANNELS_OTHER);

    Logger.log(`Inyectando widget de Telegram (${channel})...`);
    loadScript(`${CONFIG.TELEGRAM.URL}?canal=${encodeURIComponent(channel)}`, { async: true });
  }

  const isPopunderExcluded = () => hostIs(...CONFIG.POPUNDER.EXCLUDED_HOSTS);

  function initSmartLinkPopunder() {
    if (isPopunderExcluded()) return;
    Logger.log('Iniciando smartlink popunder...');

    const url = window.isAdultWeb ? SMARTLINK_ADULT : SMARTLINK_MAINSTREAM;

    const triggerPop = () => {
      if (cookies.has(CONFIG.POPUNDER.COOKIE)) return;
      window.open(url, 'popunder', 'width=1024,height=768,resizable=1,toolbar=1,location=1,menubar=1,status=1,scrollbars=1');
      window.focus();
      cookies.set(CONFIG.POPUNDER.COOKIE, '1', CONFIG.POPUNDER.HOURS);
    };

    document.documentElement.addEventListener('click', triggerPop, { once: true });
  }

  function loadPopAdsScripts() {
    if (isPopunderExcluded()) return;
    Logger.log('Cargando scripts de PopAds / Adsterra...');

    // popads.net (código del proveedor, sin modificar)
    (function(){var q=window,t="d30a423e37fe9b7888b7e8f56a20e472",f=[["siteId",750+158+222+4934385],["minBid",0.000001],["popundersPerIP","0"],["delayBetween",0],["default","https://compiledonatevanity.com/vg3ejyvbq?key=ca6fe018d69873f98382f717bc646ca6"],["defaultPerDay",0],["topmostLayer","auto"]],a=["d3d3LmludGVsbGlnZW5jZWFkeC5jb20vc2V4dC1hbGwuY3Nz","ZDJrbHg4N2Jnem5nY2UuY2xvdWRmcm9udC5uZXQvYkdEL2xtYXBsZS5taW4uanM="],d=-1,i,b,v=function(){clearTimeout(b);d++;if(a[d]&&!(1814345022000<(new Date).getTime()&&1<d)){i=q.document.createElement("script");i.type="text/javascript";i.async=!0;var y=q.document.getElementsByTagName("script")[0];i.src="https://"+atob(a[d]);i.crossOrigin="anonymous";i.onerror=v;i.onload=function(){clearTimeout(b);q[t.slice(0,16)+t.slice(0,16)]||v()};b=setTimeout(v,5E3);y.parentNode.insertBefore(i,y)}};if(!q[t]){try{Object.freeze(q[t]=f)}catch(e){}v()}})();

    // Adsterra popunder + social bar
    loadScript(pickRandom(CONFIG.POPUNDER.ADSTERRA_POPUNDERS));
    loadScript(CONFIG.POPUNDER.ADSTERRA_SOCIAL);
  }

  /* ==========================================================================
   * GEOLOCALIZACIÓN (cacheada durante la sesión para no llamar a la API en cada página)
   * ======================================================================== */
  async function getCountry() {
    const cached = storage.get(CONFIG.GEO.CACHE_KEY, { session: true });
    if (cached) return cached;

    const data = await fetchJson(CONFIG.GEO.API, CONFIG.GEO.TIMEOUT_MS);
    const country = (data.country === 'ES' || data.country_name === 'Spain') ? 'spain' : data.country;
    if (country) storage.set(CONFIG.GEO.CACHE_KEY, country, { session: true });
    return country;
  }

  /* ==========================================================================
   * PUBLICIDAD SEGÚN PAÍS
   * ======================================================================== */
  function runSpainAds() {
    if (hostIs('eleglide.es')) {
      initAmazonStickyButton();
      return;
    }
    // El script diferido (y el widget de Telegram) solo aparece cuando
    // el popup de chollos ya se ha convertido en slider
    initOffers('ES', {
      onBannerMode: () => loadScript(CONFIG.SPAIN_DEFERRED_SCRIPT)
      // Si el Telegram lo quieres inyectar desde aquí y no desde facha.js:
      // onBannerMode: () => { loadScript(CONFIG.SPAIN_DEFERRED_SCRIPT); injectTelegramWidget(); }
    });
  }

  function runInternationalAds() {
    // injectTelegramWidget();
    initSmartLinkPopunder();
    if (hostIs('infoenbolas.com')) loadPopAdsScripts();
  }

  /* ==========================================================================
   * ANALÍTICAS
   * ======================================================================== */
  function loadAnalytics() {
    if (window.beebomstats !== undefined) return;
    if (hostIs(...CONFIG.ANALYTICS.EXCLUDED_HOSTS)) return;
    loadScript(CONFIG.ANALYTICS.URL);
  }

  /* ==========================================================================
   * INICIALIZACIÓN
   * ======================================================================== */
  async function initAppManager() {
    Logger.log('Inicializando AppManager...');
    window.isAdultWeb = isAdultDomain();

    // 1. Tags de Amazon (con margen para contenido cargado después)
    setTimeout(updateAmazonAffiliateTags, 1000);

    // 3. Analíticas (independientes de la publicidad)
    loadAnalytics();

    // 2. Si hay AdSense no se inyecta publicidad
    if (window.conadsense !== undefined) {
      Logger.warn('Google AdSense detectado. Se detiene la inyección publicitaria.');
      return;
    }

    // Tráfico de campaña chuscountry → smartlink directo
    if (new URLSearchParams(window.location.search).get('utm_source') === 'chuscountry') {
      window.location.href = window.isAdultWeb ? SMARTLINK_ADULT : SMARTLINK_MAINSTREAM;
      return;
    }

    await ensureAgeVerified();

    try {
      window.cfpais = await getCountry();
      Logger.log(`País asignado: ${window.cfpais}`);
    } catch (err) {
      Logger.error('Error al geolocalizar, se usa publicidad internacional:', err);
    }

    if (window.cfpais === 'spain') runSpainAds();
    else runInternationalAds();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAppManager);
  } else {
    initAppManager();
  }
})();
