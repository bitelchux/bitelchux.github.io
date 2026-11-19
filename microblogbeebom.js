/**
 * ============================================================================
 * APP MANAGER v3: PUBLICIDAD, AFILIADOS Y CAMPAÑAS (CHOLLOS / PROMOS PROPIAS)
 * ============================================================================
 * Alojado en bitelchux.github.io, pero se ejecuta en el origen de cada web.
 *
 * Flujo (cada paso deja rastro en consola y en AppManager.trace):
 *  1. Siempre: tags de afiliado de Amazon y analíticas.
 *  2. Si la página tiene AdSense → no se ejecuta NADA de publicidad.
 *     Si AdSense aparece más tarde, se retiran nuestros widgets.
 *  3. utm_source=chuscountry → redirección directa al smartlink.
 *  4. Webs adultas → verificación de edad.
 *  5. País: MOCK_LOCATION / ?mocklocation=XX → caché de sesión → Cloudflare
 *     (/cdn-cgi/trace) → zona horaria.
 *  6. Campaña (popup + slider) según dominio y país: ver CAMPAIGNS.
 *     Por defecto, España = chollos de Amazon.
 *  7. Después de la campaña: popunder / acciones aleatorias / PopAds,
 *     nunca a la vez que el popup.
 *
 * Depurar desde la consola del navegador:
 *   AppManager.report()   → tabla con todas las decisiones tomadas
 *   AppManager.state      → país, campaña, motivo de AdSense, acciones…
 *   AppManager.reset()    → borra las marcas guardadas (popup visto, popunder…)
 *
 * Parámetros de URL para pruebas (no hace falta tocar el código):
 *   ?mocklocation=US   simula el país
 *   ?mockadsense=1|0   simula que la página tiene / no tiene AdSense
 *   ?am_debug=1        logs detallados
 *   ?am_reset=1        borra las marcas guardadas antes de empezar
 */
(() => {
  'use strict';

  // Evita doble ejecución si el script se incluye dos veces
  if (window.__appManagerLoaded) return;
  window.__appManagerLoaded = true;

  const VERSION = '3.0.0';

  /* ==========================================================================
   * 1. AJUSTES DE PRUEBA
   * ======================================================================== */

  /** País simulado: 'ES', 'US', 'MX'… null = país real del visitante */
  const MOCK_LOCATION = null;

  /** true = simula AdSense, false = ignora el AdSense real, null = detección real */
  const MOCK_ADSENSE = null;

  /** Logs detallados (también con ?am_debug=1) */
  const DEBUG_MODE = false;

  /* ==========================================================================
   * 2. CONFIGURACIÓN POR WEB
   * Clave sin "www.": cubre la web con y sin www y sus subdominios.
   * ======================================================================== */
  const DEFAULTS = {
    adult: false,                // verificación de edad + smartlink adulto
    amazonTag: 'otrosafiliados-21',
    spainMode: 'campaign',       // España: 'campaign' (popup + slider) | 'sticky' (botón Amazon) | 'none'
    campaigns: true,             // false = esta web nunca muestra campañas (popup/slider)
    popunder: true,              // smartlink popunder fuera de España
    popAds: false,               // PopAds + Adsterra fuera de España
    actionsInSpain: false,       // acciones aleatorias (popunder, juegos…) también en España
    analytics: true
  };

  const SITES = {
    'acelstore.es':        { amazonTag: 'iphonesreacondicionados-21' },
    'tusarten.es':         { amazonTag: 'tusarten-21' },
    'eleglide.es':         { amazonTag: 'elecbici-21', spainMode: 'sticky' },
    'kloner.es':           { amazonTag: 'portatiles0b-21' },
    'tugrifodecocina.es':  { amazonTag: 'grifosfregadero-21' },
    'dedrones.es':         { amazonTag: 'dedronesjulk-21' },
    'docentestic.es':      { popunder: false },

    // Webs adultas
    'videorojo.com':              { adult: true, actionsInSpain: true },
    'pornleaks.es':               { adult: true, actionsInSpain: true },
    'videos.infoenbolas.com':     { adult: true, actionsInSpain: true },
    'relatosgay.infoenbolas.com': { adult: true, actionsInSpain: true },
    'pornogayargentino.com':      { adult: true, actionsInSpain: true },
    'cuentocorto.es':             { adult: true, actionsInSpain: true },
    'telegramporno.es':           { adult: true, actionsInSpain: true },
    'multicomix.com':             { adult: true, actionsInSpain: true },
    'giantesscomic.com':          { adult: true, actionsInSpain: true },
    'bragasexy.es':               { adult: true, actionsInSpain: true },
    '300incestos.com':            { adult: true, actionsInSpain: true },
    'bumboobs.net':               { adult: true, actionsInSpain: true },
    'camporno.es':                { adult: true, actionsInSpain: true },
    'infoenbolas.com':            { adult: true, popAds: true, analytics: false, actionsInSpain: true }
  };

  /* ==========================================================================
   * 3. CAMPAÑAS (POPUP + SLIDER)
   * Se usa la PRIMERA campaña activa que encaje con la web y el país.
   * Pon las específicas (por dominio) antes que las generales.
   *
   * Campos de una campaña (todos opcionales salvo id y feed):
   *   id            nombre único (también se usa para recordar si ya vio el popup)
   *   enabled       false = desactivada
   *   sites         ['midominio.es', …]   solo en estas webs (y subdominios)
   *   excludeSites  ['otro.es', …]         nunca en estas
   *   countries     ['ES', 'MX', …]        solo para visitantes de estos países
   *   excludeCountries
   *   feed          URL del JSON
   *   label         etiqueta del popup ("Amazon", "Recomendado"…); '' = sin etiqueta
   *   cta           texto del botón del slider
   *   popupCta      texto del botón del popup (por defecto = cta)
   *   rel           rel de los enlaces
   *   accent        color principal del popup y del slider
   *   popup         false = solo slider
   *   slider        false = solo popup
   *
   * Formato del JSON: un array (o { "items": [...] }) de objetos con
   *   title, image, url                obligatorios
   *   description, price, badge, cta   opcionales (badge y cta pisan los de la campaña)
   * También se acepta el formato del feed de chollos
   * (product_name, merchant_image_url, aw_deep_link, display_price…).
   *
   * Ejemplo de JSON para tus webs:
   *   [
   *     { "title": "Juegos gratis sin descargar", "image": "https://juegosboom.com/img/promo.jpg",
   *       "url": "https://juegosboom.com/", "description": "Cientos de juegos para móvil y PC",
   *       "cta": "Jugar ahora" }
   *   ]
   * ======================================================================== */
  const FEEDS = {
    CHOLLOS_ES: 'https://pbnstats.promocionesycolecciones.com/chollometro/json.php'
  };

  const CAMPAIGN_DEFAULTS = {
    enabled: true,
    label: '',
    cta: 'Ver más',
    popupCta: null,
    rel: 'noopener',
    accent: '#2563eb',
    popup: true,
    slider: true
  };

  const CAMPAIGNS = [
    /* Ejemplo: promos de tus webs para Latinoamérica en todas las webs
    {
      id: 'mis-webs-latam',
      countries: ['MX', 'AR', 'CO', 'CL', 'PE'],
      feed: 'https://bitelchux.github.io/promos/latam.json',
      label: 'Te recomendamos',
      cta: 'Visitar'
    },
    */

    /* Ejemplo: una web concreta con su propio JSON, para cualquier país
    {
      id: 'promo-docentestic',
      sites: ['docentestic.es'],
      feed: 'https://bitelchux.github.io/promos/docentestic.json',
      label: 'Más recursos',
      cta: 'Ver',
      accent: '#16a34a'
    },
    */

    // Por defecto: chollos de Amazon para todas las webs, visitantes de España
    {
      id: 'chollos-es',
      countries: ['ES'],
      feed: FEEDS.CHOLLOS_ES,
      label: 'Amazon',
      cta: 'Ver oferta',
      popupCta: 'Ver oferta en Amazon',
      rel: 'nofollow sponsored noopener',
      accent: '#ff9900'
    }
  ];

  /* ==========================================================================
   * 4. CONFIGURACIÓN GENERAL
   * ======================================================================== */
  const SMARTLINK = {
    MAINSTREAM: 'https://auctionr.org/4/ca6fe018d69873f98382f717bc646ca6',
    ADULT:      'https://asiafilm.org/4/2a577d04945a51bdd71e8814391cec3d'
  };

  const HOUR = 3600 * 1000;

  const CONFIG = {
    AMAZON: {
      PROTECTED_TAGS: ['pyc03-21']    // enlaces con estos tags no se tocan
    },

    AGE: {
      KEY: 'am_age_ok',
      LEGACY_KEY: 'age_18_confirmed', // clave de la v1, para no volver a preguntar
      EXIT_URL: 'https://www.google.com'
    },

    GEO: {
      TRACE_URL: '/cdn-cgi/trace',    // Cloudflare, mismo origen que la web
      CACHE_KEY: 'am_country',        // sessionStorage
      TIMEOUT_MS: 4000,
      SPAIN_TIMEZONES: ['Europe/Madrid', 'Atlantic/Canary', 'Africa/Ceuta']
    },

    CAMPAIGN: {
      ROTATION_MS: 8000,              // cada cuánto cambia el slider
      POPUP_AUTOCLOSE_MS: 6000,       // tiempo que se ve el popup grande
      POPUP_TTL_MS: 12 * HOUR,        // tras 12 h vuelve a salir el popup
      SLIDER_CLOSED_TTL_MS: 2 * HOUR, // si cierra el slider, no vuelve a salir en 2 h
      FETCH_TIMEOUT_MS: 8000,
      IMAGE_TIMEOUT_MS: 8000,
      MAX_IMAGE_ATTEMPTS: 5           // elementos a probar si falla la imagen
    },

    POPUNDER: {
      KEY: 'am_popunder',
      TTL_MS: 12 * HOUR,
      ADSTERRA_POPUNDERS: ['https://benchform.org/1/a4e7557f2067c4c0f922d9747a61a17f'],
      ADSTERRA_SOCIAL: 'https://biomanos.org/14/e8e9237d7e6c9674010946d09842f465'
    },

    BANNER_GAMES_URL: 'https://juegosboom.com/bannergames/juegoaleatorio.js?lang=es',

    ANALYTICS_URL: 'https://bitelchux.github.io/beebomstats.js'
  };

  /* ==========================================================================
   * 5. ACCIONES ALEATORIAS
   * Se ejecutan fuera de España (o en España en webs con actionsInSpain), siempre
   * después de la campaña. Se elige una al azar según su peso; si no aplica,
   * se prueba otra. Peso 0 = desactivada.
   * Las funciones están más abajo, en ACTION_FNS.
   * ======================================================================== */
  const ACTION_WEIGHTS = {
    smartlink:   1,   // solo el popunder del smartlink (ningún widget más)
    bannerGames: 1    // intersticial de juegos de juegosboom.com
  };

  /* ==========================================================================
   * TRAZA Y LOGS
   * Todo lo que se decide queda en AppManager.trace (aunque DEBUG esté apagado).
   * ======================================================================== */
  const QUERY = new URLSearchParams(window.location.search);
  const DEBUG = DEBUG_MODE || QUERY.has('am_debug');
  const T0 = performance.now();
  const trace = [];

  const LEVELS = {
    debug: { icon: '🔹', fn: console.debug },
    info:  { icon: 'ℹ️', fn: console.log },
    step:  { icon: '▶️', fn: console.log },
    warn:  { icon: '⚠️', fn: console.warn },
    error: { icon: '❌', fn: console.error }
  };

  function writeLog(level, area, msg, data) {
    const entry = { ms: Math.round(performance.now() - T0), level, area, msg };
    if (data !== undefined) entry.data = data;
    trace.push(entry);
    if (level === 'debug' && !DEBUG) return;

    const { icon, fn } = LEVELS[level];
    const args = [`%c[AppManager]%c ${icon} [${area}] ${msg}`, 'color:#ff9900;font-weight:bold', ''];
    if (data !== undefined) args.push(data);
    fn.apply(console, args);
  }

  /** Logger con área: const log = createLog('geo'); log.info('...') */
  const createLog = (area) => ({
    debug: (msg, data) => writeLog('debug', area, msg, data),
    info:  (msg, data) => writeLog('info',  area, msg, data),
    step:  (msg, data) => writeLog('step',  area, msg, data),
    warn:  (msg, data) => writeLog('warn',  area, msg, data),
    error: (msg, data) => writeLog('error', area, msg, data)
  });

  /* ==========================================================================
   * UTILIDADES
   * ======================================================================== */
  const HOST = window.location.hostname.toLowerCase();
  const BARE_HOST = HOST.replace(/^www\./, '');

  /** ¿El host actual es alguno de estos dominios o un subdominio suyo? */
  const hostMatches = (domains) => domains.some(d => {
    const bare = d.toLowerCase().replace(/^www\./, '');
    return BARE_HOST === bare || BARE_HOST.endsWith('.' + bare);
  });

  /** Mezcla DEFAULTS con la entrada de SITES (exacta o del dominio padre) */
  function resolveSite() {
    const key = SITES[BARE_HOST] ? BARE_HOST : Object.keys(SITES).find(d => BARE_HOST.endsWith('.' + d));
    const cfg = { ...DEFAULTS, ...(key ? SITES[key] : {}) };
    if (cfg.spainMode === 'offers') cfg.spainMode = 'campaign'; // nombre de la v2
    return Object.freeze({ host: BARE_HOST, configKey: key || null, ...cfg });
  }

  const site = resolveSite();

  /** Estado visible en AppManager.state */
  const state = {
    version: VERSION,
    host: BARE_HOST,
    siteConfig: site.configKey,
    mock: { location: null, adsense: null },
    country: null,
    countrySource: null,
    adsense: null,         // motivo por el que se detectó AdSense, o null
    stopped: false,        // true = se ha parado toda la publicidad
    campaign: null,
    campaignResult: null,
    actions: []
  };

  const smartlinkUrl = () => (site.adult ? SMARTLINK.ADULT : SMARTLINK.MAINSTREAM);

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

  const scriptLog = createLog('script');
  const loadScript = (src, attrs = {}) => {
    scriptLog.info(`Cargando ${src}`);
    const script = document.createElement('script');
    script.src = src;
    script.setAttribute('data-cfasync', 'false');
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

  /**
   * Nuestros elementos llevan data-am-ui:
   *   "ad"   → publicidad (se retira si aparece AdSense)
   *   "gate" → verificación de edad
   */
  const isOwnUi = (el) => !!el?.closest?.('[data-am-ui]');

  const openInNewTab = (url) => window.open(url, '_blank', 'noopener');

  /**
   * Almacenamiento con caducidad opcional.
   * localStorage por defecto, sessionStorage con { session: true }.
   * Nunca lanza: en modo privado o con almacenamiento bloqueado devuelve null.
   */
  const store = {
    _area(session) {
      try { return session ? window.sessionStorage : window.localStorage; } catch { return null; }
    },
    get(key, { session = false } = {}) {
      try {
        const raw = this._area(session)?.getItem(key);
        if (raw == null) return null;
        const entry = JSON.parse(raw);
        // Valores antiguos sin envoltorio { v, exp }: se devuelven tal cual
        if (!entry || typeof entry !== 'object' || !('v' in entry)) return entry;
        if (entry.exp && Date.now() > entry.exp) {
          this.remove(key, { session });
          return null;
        }
        return entry.v;
      } catch {
        return null;
      }
    },
    set(key, value, { ttl = 0, session = false } = {}) {
      try {
        this._area(session)?.setItem(key, JSON.stringify({ v: value, exp: ttl ? Date.now() + ttl : 0 }));
      } catch { /* sin almacenamiento */ }
    },
    remove(key, { session = false } = {}) {
      try { this._area(session)?.removeItem(key); } catch { /* sin almacenamiento */ }
    }
  };

  /**
   * Cookies en el dominio raíz (".infoenbolas.com"), compartidas entre www,
   * sin www y subdominios. Hacen de respaldo de localStorage.
   */
  const ROOT_DOMAIN = BARE_HOST.split('.').slice(-2).join('.');

  const cookies = {
    has(name) {
      return document.cookie.split(';').some(c => c.trim().startsWith(name + '='));
    },
    set(name, value, ttlMs) {
      const domain = ROOT_DOMAIN.includes('.') ? `; domain=.${ROOT_DOMAIN}` : '';
      document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${Math.round(ttlMs / 1000)}; path=/${domain}; SameSite=Lax`;
    },
    remove(name) {
      this.set(name, '', 0);
    }
  };

  /** Marca con caducidad guardada en localStorage y en cookie */
  const flag = {
    get: (key) => store.get(key) === true || cookies.has(key),
    set: (key, ttl) => {
      store.set(key, true, { ttl });
      cookies.set(key, '1', ttl);
    },
    remove: (key) => {
      store.remove(key);
      cookies.remove(key);
    }
  };

  /** fetch con timeout */
  const fetchWithTimeout = async (url, options = {}, timeoutMs = 8000) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      return await fetch(url, { ...options, signal: ctrl.signal });
    } finally {
      clearTimeout(timer);
    }
  };

  const fetchJson = async (url, timeoutMs) => {
    const res = await fetchWithTimeout(url, {}, timeoutMs);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  /** Resuelve cuando la imagen está descargada (queda en caché del navegador) */
  const preloadImage = (src, timeoutMs) => new Promise((resolve, reject) => {
    const img = new Image();
    const timer = setTimeout(() => reject(new Error('Timeout de imagen')), timeoutMs);
    img.onload = () => { clearTimeout(timer); resolve(src); };
    img.onerror = () => { clearTimeout(timer); reject(new Error('Error cargando imagen')); };
    img.src = src;
  });

  /* ==========================================================================
   * ADSENSE
   * Si la página tiene AdSense no se inyecta ninguna publicidad nuestra.
   * Señales que deja AdSense (cualquiera vale):
   *   window.adsbygoogle      la crea la página al hacer (adsbygoogle = …).push()
   *                           y también el propio adsbygoogle.js al cargar
   *   window.google_ad_client anuncios con el código antiguo
   *   window.conadsense       variable propia de tus webs
   *   <script src="…pagead2.googlesyndication.com…">, <ins class="adsbygoogle">,
   *   <meta name="google-adsense-account">, iframes aswift_*
   * Si aparece más tarde (carga diferida), se retiran nuestros widgets.
   * ======================================================================== */
  const ADSENSE_SELECTOR = [
    'script[src*="pagead2.googlesyndication.com"]',
    'script[src*="adsbygoogle"]',
    'ins.adsbygoogle',
    'meta[name="google-adsense-account"]',
    'iframe[id^="aswift_"]'
  ].join(', ');

  const adsense = {
    log: createLog('adsense'),
    observer: null,

    /** Motivo de la detección (texto) o null si no hay AdSense */
    detect() {
      const mock = state.mock.adsense;
      if (mock === true) return 'simulado (MOCK_ADSENSE)';
      if (mock === false) return null;

      if (window.conadsense !== undefined) return 'window.conadsense';
      if (window.adsbygoogle !== undefined) return 'window.adsbygoogle';
      if (window.google_ad_client !== undefined) return 'window.google_ad_client';
      const el = document.querySelector(ADSENSE_SELECTOR);
      return el ? `elemento <${el.tagName.toLowerCase()}> de AdSense` : null;
    },

    /** Para toda la publicidad y retira lo que ya se haya pintado */
    stop(reason) {
      if (state.stopped) return;
      state.stopped = true;
      state.adsense = reason;
      const widgets = document.querySelectorAll('[data-am-ui="ad"]');
      widgets.forEach(el => el.remove());
      this.log.warn(`AdSense detectado (${reason}). Publicidad parada${widgets.length ? `, ${widgets.length} widgets retirados` : ''}.`);
      this.observer?.disconnect();
    },

    /** Vigila si AdSense se añade después de empezar */
    watchLate() {
      if (state.mock.adsense === false) return;
      const isAdSenseNode = (n) => n.nodeType === 1 && (n.matches(ADSENSE_SELECTOR) || !!n.querySelector?.(ADSENSE_SELECTOR));

      this.observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
          for (const node of m.addedNodes) {
            if (isAdSenseNode(node)) return this.stop('cargado después del inicio');
          }
        }
      });
      this.observer.observe(document.documentElement, { childList: true, subtree: true });
    }
  };

  /** true si hay que cortar (AdSense apareció). Se llama antes de pintar cualquier cosa. */
  const isStopped = () => {
    if (state.stopped) return true;
    const reason = adsense.detect();
    if (reason) adsense.stop(reason);
    return state.stopped;
  };

  /* ==========================================================================
   * AFILIADOS AMAZON
   * Etiqueta los enlaces a amazon.es al cargar y también los que se añadan
   * después. Los enlaces de nuestros widgets no se tocan.
   * ======================================================================== */
  const affiliate = {
    log: createLog('amazon'),
    isAmazonEs: (hostname) => hostname === 'amazon.es' || hostname.endsWith('.amazon.es'),

    tagLink(link) {
      if (isOwnUi(link)) return false;
      let url;
      try { url = new URL(link.href); } catch { return false; }
      if (!this.isAmazonEs(url.hostname)) return false;

      const current = url.searchParams.get('tag');
      if (current === site.amazonTag || CONFIG.AMAZON.PROTECTED_TAGS.includes(current)) return false;

      url.searchParams.set('tag', site.amazonTag);
      link.href = url.toString();
      return true;
    },

    scan(root) {
      const selector = "a[href*='amazon.es']";
      let count = 0;
      if (root.matches?.(selector) && this.tagLink(root)) count++;
      root.querySelectorAll?.(selector).forEach(a => { if (this.tagLink(a)) count++; });
      return count;
    },

    watch() {
      const count = this.scan(document);
      this.log.info(`${count} enlaces etiquetados con ${site.amazonTag}`);

      new MutationObserver((mutations) => {
        for (const m of mutations) {
          for (const node of m.addedNodes) {
            if (node.nodeType !== 1) continue;
            const n = this.scan(node);
            if (n) this.log.debug(`${n} enlaces nuevos etiquetados`);
          }
        }
      }).observe(document.body, { childList: true, subtree: true });
    }
  };

  /* ==========================================================================
   * ANALÍTICAS
   * ======================================================================== */
  function loadAnalytics() {
    const log = createLog('analíticas');
    if (!site.analytics) return log.debug('Desactivadas en esta web.');
    if (window.beebomstats !== undefined) return log.debug('Ya cargadas por la página.');
    loadScript(CONFIG.ANALYTICS_URL);
  }

  /* ==========================================================================
   * VERIFICACIÓN DE EDAD
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

  const ageGate = {
    log: createLog('edad'),

    isConfirmed() {
      return store.get(CONFIG.AGE.KEY) === true
        || store.get(CONFIG.AGE.LEGACY_KEY)?.confirmed === true;
    },

    /** Resuelve cuando el usuario puede ver el contenido */
    ensure() {
      return new Promise((resolve) => {
        if (this.isConfirmed()) {
          this.log.info('Edad verificada previamente.');
          return resolve();
        }

        this.log.step('Mostrando verificación de edad.');
        injectStyle('age-styles', AGE_CSS);

        const overlay = document.createElement('div');
        overlay.className = 'age-overlay';
        overlay.setAttribute('data-am-ui', 'gate');
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
          this.log.info('Edad confirmada.');
          store.set(CONFIG.AGE.KEY, true);
          overlay.remove();
          resolve();
        });

        overlay.querySelector('.age-no').addEventListener('click', () => {
          this.log.info('Verificación rechazada. Redirigiendo...');
          window.location.href = CONFIG.AGE.EXIT_URL;
        });
      });
    }
  };

  /* ==========================================================================
   * GEOLOCALIZACIÓN
   * Orden: simulación → caché de sesión → Cloudflare → zona horaria.
   * ======================================================================== */
  const geo = {
    log: createLog('geo'),

    async fromCloudflare() {
      const res = await fetchWithTimeout(CONFIG.GEO.TRACE_URL, { cache: 'no-store' }, CONFIG.GEO.TIMEOUT_MS);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const match = (await res.text()).match(/^loc=([A-Z0-9]{2})$/m);
      if (!match || match[1] === 'XX' || match[1] === 'T1') throw new Error('Trace sin país válido');
      return match[1];
    },

    fromTimezone() {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return CONFIG.GEO.SPAIN_TIMEZONES.includes(tz) ? 'ES' : null;
      } catch {
        return null;
      }
    },

    /** { country: 'ES' | 'MX' | … | null, source } */
    async getCountry() {
      // El país simulado no se guarda en caché: al quitarlo vuelve el real
      if (state.mock.location) return { country: state.mock.location, source: 'simulado' };

      const cached = store.get(CONFIG.GEO.CACHE_KEY, { session: true });
      if (cached) return { country: cached, source: 'caché de sesión' };

      try {
        const country = await this.fromCloudflare();
        store.set(CONFIG.GEO.CACHE_KEY, country, { session: true });
        return { country, source: 'Cloudflare' };
      } catch (err) {
        this.log.warn('Cloudflare no devolvió el país, se usa la zona horaria.', err);
        return { country: this.fromTimezone(), source: 'zona horaria' };
      }
    }
  };

  /* ==========================================================================
   * BOTÓN STICKY DE AMAZON
   * ======================================================================== */
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
    const log = createLog('sticky');
    const title = (document.title || '').trim();
    if (!title || document.getElementById('amz-sticky-bar') || isStopped()) return;

    log.step('Mostrando botón sticky de Amazon.');
    const url = `https://www.amazon.es/s?k=${encodeURIComponent(title)}&tag=${encodeURIComponent(site.amazonTag)}`;
    injectStyle('amz-sticky-styles', STICKY_CSS);

    const bar = document.createElement('div');
    bar.id = 'amz-sticky-bar';
    bar.setAttribute('data-am-ui', 'ad');
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
   * CAMPAÑAS: POPUP INICIAL + SLIDER INFERIOR ROTATIVO
   * El color sale de la campaña (variable CSS --am-accent).
   * ======================================================================== */
  const CAMPAIGN_CSS = `
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
    #offer-int-meta:empty { display: none; }
    .int-badge-store { background: var(--am-accent); color: var(--am-accent-text); font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; }
    #offer-int-price { background: #dc2626; color: #fff; font-size: 13px; font-weight: 700; padding: 4px 10px; border-radius: 20px; }
    #offer-int-title, #offer-int-desc {
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }
    #offer-int-title { font-size: 16px; font-weight: 700; margin-bottom: 8px; color: #f4f4f5; }
    #offer-int-desc { font-size: 13px; color: #a1a1aa; }
    #offer-int-cta {
      display: flex; align-items: center; justify-content: center; width: 100%; margin-top: 20px;
      background: var(--am-accent); color: var(--am-accent-text); font-weight: 700; font-size: 14px; padding: 12px;
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
    #offer-banner .offer-desc { font-size: 12px; color: #a1a1aa; margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    #offer-banner .offer-sub { display: flex; align-items: center; gap: 8px; margin-top: 6px; }
    #offer-banner .offer-price {
      background: rgba(220,38,38,0.25); color: #f87171; border: 1px solid rgba(220,38,38,0.4);
      padding: 2px 9px; border-radius: 6px; font-size: 13px; font-weight: 700;
    }
    #offer-banner .offer-cta {
      flex-shrink: 0; background: var(--am-accent); padding: 10px 16px; border-radius: 10px; font-weight: 700;
      font-size: 13px; text-decoration: none; color: var(--am-accent-text); white-space: nowrap; transition: filter 0.2s;
    }
    #offer-banner .offer-cta:hover { filter: brightness(0.92); }
    #offer-banner .offer-banner-close {
      position: absolute; top: -10px; right: -10px; width: 26px; height: 26px;
      border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: #27272a;
      color: #fff; font-size: 12px; line-height: 1; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 10px rgba(0,0,0,0.4); padding: 0;
    }
    #offer-banner .offer-banner-close:hover { background: #3f3f46; }

    @media (max-width: 640px) {
      #offer-banner { padding: 8px 10px; gap: 10px; }
      #offer-banner .offer-img { width: 56px; height: 56px; }
      #offer-banner .offer-title { font-size: 12px; }
      #offer-banner .offer-desc { display: none; }
      #offer-banner .offer-cta { padding: 8px 12px; font-size: 12px; }
    }
  `;

  /** Texto negro o blanco según lo claro que sea el color de acento */
  function accentTextColor(hex) {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
    if (!m) return '#fff';
    const n = parseInt(m[1], 16);
    const lum = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
    return lum > 0.6 ? '#000' : '#fff';
  }

  /** Primera campaña activa que encaja con esta web y este país */
  function resolveCampaign(country) {
    for (const raw of CAMPAIGNS) {
      const c = { ...CAMPAIGN_DEFAULTS, ...raw };
      if (!c.enabled || !c.id || !c.feed) continue;
      if (c.sites && !hostMatches(c.sites)) continue;
      if (c.excludeSites && hostMatches(c.excludeSites)) continue;
      if (c.countries && !c.countries.includes(country)) continue;
      if (c.excludeCountries && c.excludeCountries.includes(country)) continue;
      return Object.freeze({ ...c, popupCta: c.popupCta || c.cta });
    }
    return null;
  }

  /**
   * Convierte un elemento del JSON en { title, image, url, … } o null.
   * Acepta el formato propio (title/image/url) y el del feed de chollos.
   */
  function normalizeItem(raw, campaign) {
    if (!raw || typeof raw !== 'object') return null;
    const pick = (...keys) => {
      for (const k of keys) {
        const v = raw[k];
        if (v != null && String(v).trim() !== '') return String(v).trim();
      }
      return '';
    };

    const title = pick('title', 'name', 'product_name');
    const image = pick('image', 'img', 'imagen', 'merchant_image_url');
    const url   = pick('url', 'link', 'href', 'aw_deep_link');
    if (!title || !image || !/^https?:\/\//i.test(url)) return null;

    let price = pick('price', 'display_price', 'search_price');
    if (/^[\d.,\s]+$/.test(price)) price += ' €'; // solo número → se añade €

    const cta = pick('cta');
    return {
      title,
      image,
      url,
      price,
      description: pick('description', 'desc', 'text', 'texto'),
      badge: pick('badge') || campaign.label,
      cta: cta || campaign.cta,
      popupCta: cta || campaign.popupCta
    };
  }

  /**
   * Feed de una campaña: descarga el JSON una vez, rota los elementos sin
   * repetir y solo devuelve uno cuando su imagen ya está descargada.
   */
  function createFeed(campaign, log) {
    let items = [];
    let queue = [];
    let lastUrl = null;

    async function load() {
      const data = await fetchJson(campaign.feed, CONFIG.CAMPAIGN.FETCH_TIMEOUT_MS);
      const list = Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : [data]);
      items = list.map(r => normalizeItem(r, campaign)).filter(Boolean);
      log.info(`JSON cargado: ${items.length} elementos válidos de ${list.length}`, campaign.feed);
      if (!items.length) throw new Error('El JSON no contiene elementos válidos (title, image, url)');
    }

    function takeCandidate() {
      if (!queue.length) queue = shuffle([...items]);
      let candidate = queue.pop();
      // Evita repetir el mismo dos veces seguidas al rebarajar
      if (candidate.url === lastUrl && queue.length) {
        queue.unshift(candidate);
        candidate = queue.pop();
      }
      return candidate;
    }

    /** Siguiente elemento listo para pintar, o null */
    async function next() {
      if (!items.length) await load();

      for (let i = 0; i < CONFIG.CAMPAIGN.MAX_IMAGE_ATTEMPTS && items.length; i++) {
        const item = takeCandidate();
        try {
          await preloadImage(item.image, CONFIG.CAMPAIGN.IMAGE_TIMEOUT_MS);
          lastUrl = item.url;
          log.debug(`Elemento listo: ${item.title}`);
          return item;
        } catch {
          log.warn('Imagen no disponible, se descarta:', item.image);
          items = items.filter(o => o !== item);
          queue = queue.filter(o => o !== item);
        }
      }
      return null;
    }

    return { next, get size() { return items.length; } };
  }

  const campaignUi = {
    log: createLog('campaña'),
    started: false,

    keys: (campaign) => ({
      popup: `am_popup_${campaign.id}`,
      sliderClosed: `am_slider_closed_${campaign.id}`
    }),

    applyAccent(el, campaign) {
      el.style.setProperty('--am-accent', campaign.accent);
      el.style.setProperty('--am-accent-text', accentTextColor(campaign.accent));
    },

    /* ---------- Slider ---------- */
    renderSlider(banner, item, campaign) {
      const sub = item.price
        ? `<div class="offer-sub"><span class="offer-price">💰 ${escapeHtml(item.price)}</span></div>`
        : (item.description ? `<div class="offer-desc">${escapeHtml(item.description)}</div>` : '');

      banner.innerHTML = `
        <div class="offer-left">
          <img class="offer-img" src="${escapeHtml(item.image)}" alt="">
          <div class="offer-info">
            <div class="offer-title">${escapeHtml(item.title)}</div>
            ${sub}
          </div>
        </div>
        <a class="offer-cta" target="_blank" rel="${escapeHtml(campaign.rel)}" href="${escapeHtml(item.url)}">${escapeHtml(item.cta)} →</a>
        <button type="button" class="offer-banner-close" aria-label="Cerrar">✕</button>
      `;
      banner.onclick = (e) => {
        if (e.target.closest('.offer-banner-close')) return this.closeSlider(banner, campaign);
        this.log.info(`Clic en el slider: ${item.title}`);
        if (e.target.closest('.offer-cta')) return; // el enlace ya abre la página
        openInNewTab(item.url);
      };
    },

    closeSlider(banner, campaign) {
      this.log.info('Slider cerrado por el usuario.');
      banner.dataset.closed = '1'; // detiene la rotación
      flag.set(this.keys(campaign).sliderClosed, CONFIG.CAMPAIGN.SLIDER_CLOSED_TTL_MS);
      banner.classList.remove('visible');
      setTimeout(() => banner.remove(), 500);
    },

    async swapSlider(banner, item, campaign) {
      banner.classList.add('swapping');
      await wait(250);
      this.renderSlider(banner, item, campaign);
      banner.classList.remove('swapping');
    },

    /**
     * Rotación: el siguiente cambio se programa cuando el anterior ha
     * terminado (elemento + imagen cargados), así nunca queda vacío.
     * No rota con la pestaña oculta ni con el ratón encima.
     */
    startRotation(banner, feed, campaign) {
      if (feed.size < 2) return this.log.debug('Un solo elemento: el slider no rota.');

      const scheduleNext = () => setTimeout(async () => {
        if (banner.dataset.closed || !banner.isConnected || state.stopped) return;
        if (!document.hidden && !banner.matches(':hover')) {
          try {
            const item = await feed.next();
            if (item && banner.isConnected) await this.swapSlider(banner, item, campaign);
          } catch (err) {
            this.log.warn('No se pudo rotar el slider:', err);
          }
        }
        if (feed.size >= 2) scheduleNext();
      }, CONFIG.CAMPAIGN.ROTATION_MS);

      scheduleNext();
    },

    showSlider(item, feed, campaign) {
      if (isStopped()) return;
      const banner = document.createElement('div');
      banner.id = 'offer-banner';
      banner.setAttribute('data-am-ui', 'ad');
      this.applyAccent(banner, campaign);
      this.renderSlider(banner, item, campaign);
      document.body.appendChild(banner);
      void banner.offsetWidth;
      banner.classList.add('visible');
      this.log.step('Slider visible.');
      this.startRotation(banner, feed, campaign);
    },

    /* ---------- Popup ---------- */
    /** Muestra el popup grande; resuelve cuando se ha cerrado */
    showPopup(item, campaign) {
      return new Promise((resolve) => {
        const meta = (item.badge ? `<span class="int-badge-store">${escapeHtml(item.badge)}</span>` : '')
          + (item.price ? `<span id="offer-int-price">${escapeHtml(item.price)}</span>` : '');

        const overlay = document.createElement('div');
        overlay.id = 'offer-overlay';
        overlay.setAttribute('data-am-ui', 'ad');
        this.applyAccent(overlay, campaign);
        overlay.innerHTML = `
          <div id="offer-interstitial" role="dialog" aria-modal="true" aria-label="${escapeHtml(item.title)}">
            <button id="offer-close-btn" type="button" aria-label="Cerrar">✕</button>
            <div id="offer-int-img-wrap">
              <img id="offer-int-img" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}">
            </div>
            <div id="offer-int-body">
              <div id="offer-int-meta">${meta}</div>
              <div id="offer-int-title">${escapeHtml(item.title)}</div>
              ${item.description ? `<div id="offer-int-desc">${escapeHtml(item.description)}</div>` : ''}
              <a id="offer-int-cta" href="${escapeHtml(item.url)}" target="_blank" rel="${escapeHtml(campaign.rel)}">
                ${escapeHtml(item.popupCta)} →
              </a>
            </div>
          </div>
        `;
        document.body.appendChild(overlay);
        void overlay.offsetWidth; // fuerza reflow para que la transición de entrada funcione
        overlay.classList.add('visible');
        flag.set(this.keys(campaign).popup, CONFIG.CAMPAIGN.POPUP_TTL_MS);
        this.log.step(`Popup visible: ${item.title}`);

        let closed = false;
        const close = (how) => {
          if (closed) return;
          closed = true;
          this.log.info(`Popup cerrado (${how}).`);
          clearTimeout(autoCloseTimer);
          document.removeEventListener('keydown', onKeyDown);
          overlay.classList.remove('visible'); // animación de "hacerse pequeño"
          setTimeout(() => {
            overlay.remove();
            resolve();
          }, 400);
        };

        const onKeyDown = (e) => { if (e.key === 'Escape') close('Escape'); };
        const autoCloseTimer = setTimeout(() => close('automático'), CONFIG.CAMPAIGN.POPUP_AUTOCLOSE_MS);

        overlay.addEventListener('click', (e) => {
          if (e.target.closest('#offer-close-btn')) return close('botón ✕');
          if (e.target === overlay) return close('clic fuera');
          if (e.target.closest('#offer-int-cta')) return close('clic en el botón'); // el enlace abre la página solo
          if (e.target.closest('#offer-interstitial')) {
            openInNewTab(item.url);
            close('clic en la tarjeta');
          }
        });
        document.addEventListener('keydown', onKeyDown);
      });
    },

    /**
     * Ejecuta una campaña. Nada se pinta hasta que el primer elemento (y su
     * imagen) está cargado. El popup sale como mucho una vez cada POPUP_TTL_MS;
     * el resto de páginas muestran directamente el slider.
     *
     * Resuelve cuando ya no hay popup en pantalla (slider visible, nada que
     * mostrar o error), para que lo siguiente no coincida con el popup.
     * Además lanza el evento 'appmanager:banner' por compatibilidad.
     */
    async run(campaign) {
      const log = this.log;
      const finish = (result) => {
        state.campaignResult = result;
        log.info(`Resultado: ${result}`);
        document.dispatchEvent(new CustomEvent('appmanager:banner', { detail: { campaign: campaign.id, result } }));
        return result;
      };

      if (this.started || document.getElementById('offer-overlay') || document.getElementById('offer-banner')) {
        log.warn('La campaña ya se había iniciado en esta página; se ignora la segunda llamada.');
        return 'duplicada';
      }
      this.started = true;

      const keys = this.keys(campaign);
      const wantPopup = campaign.popup && !flag.get(keys.popup);
      const wantSlider = campaign.slider && !flag.get(keys.sliderClosed);
      log.step(`Campaña "${campaign.id}" → popup: ${wantPopup ? 'sí' : 'no (ya visto o desactivado)'}, slider: ${wantSlider ? 'sí' : 'no (cerrado o desactivado)'}`);

      if (!wantPopup && !wantSlider) return finish('nada que mostrar');

      const feed = createFeed(campaign, log);
      let first = null;
      try {
        first = await feed.next();
      } catch (err) {
        log.error('Error al cargar el JSON de la campaña:', err);
      }

      if (isStopped()) return finish('parada por AdSense');
      if (!first) return finish('sin elementos');

      injectStyle('offer-styles', CAMPAIGN_CSS);

      if (wantPopup) await this.showPopup(first, campaign);
      if (isStopped()) return finish('parada por AdSense');

      if (wantSlider) {
        this.showSlider(first, feed, campaign);
        return finish(wantPopup ? 'popup y slider' : 'solo slider');
      }
      return finish('solo popup');
    }
  };

  /* ==========================================================================
   * SMARTLINK POPUNDER Y POPADS
   * ======================================================================== */
  const popunder = {
    log: createLog('popunder'),
    started: false,

    /** Prepara el popunder para el primer clic. Devuelve true si queda activo. */
    init() {
      if (this.started) return true;
      if (!site.popunder) { this.log.debug('Desactivado en esta web.'); return false; }
      if (store.get(CONFIG.POPUNDER.KEY)) { this.log.debug('Ya se abrió en las últimas horas.'); return false; }
      this.started = true;
      this.log.step('Popunder preparado para el primer clic.');

      const root = document.documentElement;
      const onClick = (e) => {
        if (isOwnUi(e.target)) return; // los clics en nuestros widgets no cuentan
        root.removeEventListener('click', onClick);
        if (state.stopped || store.get(CONFIG.POPUNDER.KEY)) return;
        window.open(smartlinkUrl(), 'popunder', 'width=1024,height=768,resizable=1,toolbar=1,location=1,menubar=1,status=1,scrollbars=1');
        store.set(CONFIG.POPUNDER.KEY, true, { ttl: CONFIG.POPUNDER.TTL_MS });
        this.log.info('Popunder abierto.');
      };
      root.addEventListener('click', onClick);
      return true;
    }
  };

  function loadPopAdsScripts() {
    if (isStopped()) return;
    createLog('popads').step('Cargando PopAds + Adsterra.');

    // popads.net (código del proveedor, sin modificar)
    (function(){var q=window,t="d30a423e37fe9b7888b7e8f56a20e472",f=[["siteId",750+158+222+4934385],["minBid",0.000001],["popundersPerIP","0"],["delayBetween",0],["default","https://compiledonatevanity.com/vg3ejyvbq?key=ca6fe018d69873f98382f717bc646ca6"],["defaultPerDay",0],["topmostLayer","auto"]],a=["d3d3LmludGVsbGlnZW5jZWFkeC5jb20vc2V4dC1hbGwuY3Nz","ZDJrbHg4N2Jnem5nY2UuY2xvdWRmcm9udC5uZXQvYkdEL2xtYXBsZS5taW4uanM="],d=-1,i,b,v=function(){clearTimeout(b);d++;if(a[d]&&!(1814345022000<(new Date).getTime()&&1<d)){i=q.document.createElement("script");i.type="text/javascript";i.async=!0;var y=q.document.getElementsByTagName("script")[0];i.src="https://"+atob(a[d]);i.crossOrigin="anonymous";i.onerror=v;i.onload=function(){clearTimeout(b);q[t.slice(0,16)+t.slice(0,16)]||v()};b=setTimeout(v,5E3);y.parentNode.insertBefore(i,y)}};if(!q[t]){try{Object.freeze(q[t]=f)}catch(e){}v()}})();

    // Adsterra popunder + social bar
    loadScript(pickRandom(CONFIG.POPUNDER.ADSTERRA_POPUNDERS));
    loadScript(CONFIG.POPUNDER.ADSTERRA_SOCIAL);
  }

  /* ==========================================================================
   * ACCIONES ALEATORIAS
   * Cada acción devuelve (o resuelve con):
   *   true       → ha hecho algo; no se prueba otra
   *   'motivo'   → no aplica en este visitante; se prueba otra al azar
   * Para añadir una: escríbela aquí y dale peso en ACTION_WEIGHTS (arriba).
   * ======================================================================== */
  const ACTION_FNS = {
    /** Solo el popunder del smartlink */
    smartlink: () => popunder.init() || 'popunder no disponible',

    /** Intersticial de juegos de juegosboom.com */
    bannerGames: () => {
      loadScript(CONFIG.BANNER_GAMES_URL);
      return true;
    }
  };

  function pickWeighted(list) {
    const total = list.reduce((sum, a) => sum + a.weight, 0);
    let r = Math.random() * total;
    for (const a of list) {
      r -= a.weight;
      if (r < 0) return a;
    }
    return list[list.length - 1];
  }

  /** Prueba acciones al azar hasta que una haga algo. Resuelve con su nombre o null. */
  async function runRandomAction() {
    const log = createLog('acciones');
    let pool = Object.entries(ACTION_WEIGHTS)
      .filter(([name, weight]) => weight > 0 && ACTION_FNS[name])
      .map(([name, weight]) => ({ name, weight, fn: ACTION_FNS[name] }));

    log.debug('Candidatas: ' + pool.map(a => `${a.name}(${a.weight})`).join(', '));

    while (pool.length) {
      if (isStopped()) return null;
      const action = pickWeighted(pool);
      pool = pool.filter(a => a !== action);
      try {
        const result = await action.fn();
        if (result === true) {
          state.actions.push(action.name);
          log.step(`Acción elegida: ${action.name}`);
          return action.name;
        }
        log.info(`${action.name} no aplica (${result || 'sin motivo'}), se prueba otra.`);
      } catch (err) {
        log.error(`Error en la acción ${action.name}:`, err);
      }
    }

    log.info('Ninguna acción aplicable.');
    return null;
  }

  /* ==========================================================================
   * ESTRATEGIAS POR REGIÓN
   * La campaña va siempre primero; lo demás espera a que el popup se cierre.
   * ======================================================================== */
  async function runCampaignIfAny() {
    const log = createLog('campaña');
    if (!site.campaigns) {
      log.info('Campañas desactivadas en esta web.');
      return;
    }
    const campaign = resolveCampaign(state.country);
    state.campaign = campaign?.id || null;
    if (!campaign) {
      log.info(`Ninguna campaña para ${BARE_HOST} / ${state.country || 'país desconocido'}.`);
      return;
    }
    log.info(`Campaña elegida: ${campaign.id}`, campaign);
    await campaignUi.run(campaign);
  }

  async function runSpain() {
    const log = createLog('españa');

    if (site.spainMode === 'sticky') initAmazonStickyButton();
    else if (site.spainMode === 'campaign') await runCampaignIfAny();
    else log.info('spainMode "none": sin campaña ni botón.');

    if (site.actionsInSpain && !isStopped()) {
      log.info('Acciones aleatorias activas también en España en esta web.');
      runRandomAction();
    }
  }

  async function runInternational() {
    await runCampaignIfAny();
    if (isStopped()) return;

    popunder.init();
    await runRandomAction();

    // PopAds captura cualquier clic: se carga cuando la acción aleatoria ya no puede pisarse con él
    if (site.popAds) loadPopAdsScripts();
  }

  /* ==========================================================================
   * API PÚBLICA (consola)
   * ======================================================================== */
  function resetStoredFlags() {
    const keys = [
      CONFIG.POPUNDER.KEY,
      ...CAMPAIGNS.filter(c => c.id).flatMap(c => Object.values(campaignUi.keys(c)))
    ];
    keys.forEach(k => flag.remove(k));
    store.remove(CONFIG.GEO.CACHE_KEY, { session: true });
    createLog('reset').warn('Marcas borradas (popup visto, slider cerrado, popunder, país).');
  }

  function exposeApi() {
    window.isAdultWeb = site.adult; // compatibilidad con otros scripts
    window.AppManager = {
      version: VERSION,
      site,
      state,
      trace,
      get country() { return state.country; },
      report() {
        console.table(trace.map(({ ms, level, area, msg }) => ({ ms, level, area, msg })));
        return state;
      },
      reset: resetStoredFlags
    };
  }

  /* ==========================================================================
   * INICIALIZACIÓN
   * ======================================================================== */
  function readMocks() {
    const qLoc = (QUERY.get('mocklocation') || '').trim().toUpperCase();
    state.mock.location = qLoc || (MOCK_LOCATION ? String(MOCK_LOCATION).toUpperCase() : null);

    const qAds = QUERY.get('mockadsense');
    state.mock.adsense = (qAds === '1' || qAds === 'true') ? true
      : (qAds === '0' || qAds === 'false') ? false
      : MOCK_ADSENSE;
  }

  async function init() {
    const log = createLog('init');
    readMocks();
    exposeApi();

    log.step(`AppManager v${VERSION} en ${BARE_HOST} (config: ${site.configKey || 'por defecto'})`);
    if (state.mock.location) log.warn(`País SIMULADO: ${state.mock.location}`);
    if (state.mock.adsense !== null) log.warn(`AdSense SIMULADO: ${state.mock.adsense ? 'sí' : 'no'}`);
    if (QUERY.has('am_reset')) resetStoredFlags();

    // 1. Siempre
    affiliate.watch();
    loadAnalytics();

    // 2. AdSense: si está, no se hace nada más
    const adsenseReason = adsense.detect();
    if (adsenseReason) {
      adsense.stop(adsenseReason);
      return;
    }
    adsense.watchLate();

    // 3. Tráfico chuscountry
    if (QUERY.get('utm_source') === 'chuscountry') {
      log.step('utm_source=chuscountry → redirección al smartlink.');
      window.location.href = smartlinkUrl();
      return;
    }

    // 4. Edad
    if (site.adult) await ageGate.ensure();

    // 5. País
    const { country, source } = await geo.getCountry();
    state.country = country;
    state.countrySource = source;
    window.cfpais = country === 'ES' ? 'spain' : (country || undefined); // compatibilidad
    createLog('geo').step(`País: ${country || 'desconocido'} (${source})`);

    if (isStopped()) return;

    // 6-7. Publicidad según región
    if (country === 'ES') await runSpain();
    else await runInternational();

    log.debug('Flujo terminado.', state);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
