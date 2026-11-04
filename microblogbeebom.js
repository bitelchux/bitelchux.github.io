/**
 * ============================================================================
 * APP MANAGER v2: PUBLICIDAD, AFILIADOS, CHOLLOS Y NOTIFICACIONES PUSH
 * ============================================================================
 * Alojado en bitelchux.github.io, pero se ejecuta en el origen de cada web.
 *
 * Flujo:
 *  1. Siempre: tags de afiliado de Amazon (también en contenido cargado
 *     después) y analíticas.
 *  2. Si la página tiene AdSense (window.conadsense) → no se inyecta publicidad.
 *  3. utm_source=chuscountry → redirección directa al smartlink.
 *  4. Webs adultas → verificación de edad.
 *  5. País vía Cloudflare (/cdn-cgi/trace), con respaldo por zona horaria.
 *  6. España → chollos (popup + slider) o botón sticky, según la web.
 *     Resto  → popup de notificaciones push (solo si la web tiene
 *              /push-sw.js) + smartlink popunder (+ PopAds en algunas webs).
 *
 * Para añadir una web nueva basta con una línea en SITES.
 */
(() => {
  'use strict';

  // Evita doble ejecución si el script se incluye dos veces
  if (window.__appManagerLoaded) return;
  window.__appManagerLoaded = true;

  const VERSION = '2.0.0';

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
   * CONFIGURACIÓN POR WEB
   * ======================================================================== */

  /** Valores que tiene cualquier web salvo que SITES diga otra cosa */
  const DEFAULTS = {
    adult: false,                  // muestra verificación de edad y usa el smartlink adulto
    amazonTag: 'otrosafiliados-21',
    spainMode: 'offers',           // España: 'offers' (popup + slider) | 'sticky' (botón Amazon) | 'none'
    offersEndpoint: 'https://pbnstats.promocionesycolecciones.com/chollometro/json.php',
    storeLabel: 'Amazon',          // texto de la tienda en el popup de chollos
    popunder: true,                // smartlink popunder fuera de España
    popAds: false,                 // PopAds + Adsterra fuera de España
    push: true,                    // popup de notificaciones fuera de España (si existe /push-sw.js)
    analytics: true
  };

  /** Solo lo que cambia respecto a DEFAULTS. Cubre también subdominios. */
  const SITES = {
    'acelstore.es':       { amazonTag: 'iphonesreacondicionados-21' },
    'tusarten.es':        { amazonTag: 'tusarten-21' },
    'eleglide.es':        { amazonTag: 'elecbici-21', spainMode: 'sticky' },
    'kloner.es':          { amazonTag: 'portatiles0b-21' },
    'tugrifodecocina.es': { amazonTag: 'grifosfregadero-21' },
    'dedrones.es':        { amazonTag: 'dedronesjulk-21' },
    'docentestic.es':     { popunder: false },

    // Webs adultas
    'acelstorexxx.es':    { adult: true, offersEndpoint: 'https://bitelchux.github.io/acelstore.json' },
    'dedronesxxx.es':     { adult: true, offersEndpoint: 'https://bitelchux.github.io/dedrones.json' },
    'infoenbolas.com':    { adult: true, popAds: true, analytics: false }
  };

  /* ==========================================================================
   * CONFIGURACIÓN GENERAL
   * ======================================================================== */
  const SMARTLINK = {
    MAINSTREAM: 'https://compiledonatevanity.com/jghpcdpkmw?key=2a577d04945a51bdd71e8814391cec3d',
    ADULT:      'https://compiledonatevanity.com/vg3ejyvbq?key=ca6fe018d69873f98382f717bc646ca6'
  };

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

    OFFERS: {
      ROTATION_MS: 8000,              // cada cuánto cambia el slider
      POPUP_AUTOCLOSE_MS: 6000,       // tiempo que se ve el popup grande
      POPUP_KEY: 'am_offer_popup',
      POPUP_TTL_MS: 12 * 3600 * 1000, // tras 12 h vuelve a salir el popup
      FETCH_TIMEOUT_MS: 8000,
      IMAGE_TIMEOUT_MS: 8000,
      MAX_IMAGE_ATTEMPTS: 5           // ofertas a probar si falla la imagen
    },

    // Script que se carga en España cuando el popup de chollos pasa a slider
    SPAIN_DEFERRED_SCRIPT: 'https://bitelchux.github.io/facha.js',

    POPUNDER: {
      KEY: 'am_popunder',
      TTL_MS: 12 * 3600 * 1000,
      ADSTERRA_POPUNDERS: ['https://benchform.org/1/a4e7557f2067c4c0f922d9747a61a17f'],
      ADSTERRA_SOCIAL: 'https://biomanos.org/14/e8e9237d7e6c9674010946d09842f465'
    },

    PUSH: {
      ENABLED: true,
      VAPID_PUBLIC_KEY: 'BCP16U92CKj8SKsU-f-ra6VcVPuWoaanMAUPS04ufyYTgN-fL6C7pW70HmpnkK9JvOTVz5kBIs6UDHdUjkzYb1k',           // ← pegar aquí la clave pública VAPID (sin ella no se muestra nada)
      SUBSCRIBE_URL: 'https://pbnstats.promocionesycolecciones.com/push/subscribe.php',
      SW_PATH: '/push-sw.js',         // archivo que se copia a mano en la raíz de cada web
      SCOPE: '/push/',                // scope propio: no pisa otros service workers de la web
      SW_CHECK_KEY: 'am_push_sw',
      SW_CHECK_TTL_MS: 24 * 3600 * 1000,
      DISMISS_KEY: 'am_push_dismissed',
      DISMISS_TTL_MS: 7 * 24 * 3600 * 1000, // "Ahora no" → no se vuelve a preguntar en 7 días
      IGNORE_TTL_MS: 24 * 3600 * 1000,      // clic fuera del popup → 1 día
      SYNC_KEY: 'am_push_synced',
      SYNC_TTL_MS: 7 * 24 * 3600 * 1000,    // reenvía la suscripción al servidor cada 7 días
      PROMPT_DELAY_MS: 4000
    },

    ANALYTICS_URL: 'https://bitelchux.github.io/beebomstats.js'
  };

  /* ==========================================================================
   * UTILIDADES
   * ======================================================================== */
  const HOST = window.location.hostname.toLowerCase();
  const BARE_HOST = HOST.replace(/^www\./, '');

  /** Mezcla DEFAULTS con la entrada de SITES (exacta o del dominio padre) */
  function resolveSite(host) {
    const key = SITES[host] ? host : Object.keys(SITES).find(d => host.endsWith('.' + d));
    return Object.freeze({ host, ...DEFAULTS, ...(key ? SITES[key] : {}) });
  }

  const site = resolveSite(BARE_HOST);

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

  const loadScript = (src, attrs = {}) => {
    Logger.log(`Cargando script externo: ${src}`);
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

  /** ¿El elemento pertenece a algún widget nuestro? (se marcan con data-am-ui) */
  const isOwnUi = (el) => !!el?.closest?.('[data-am-ui]');

  const openInNewTab = (url) => window.open(url, '_blank', 'noopener');

  /**
   * Almacenamiento único con caducidad opcional.
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

  /** Clave VAPID en base64url → Uint8Array (lo que pide pushManager.subscribe) */
  const base64UrlToUint8Array = (b64) => {
    const padded = (b64 + '='.repeat((4 - (b64.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(padded);
    return Uint8Array.from(bin, c => c.charCodeAt(0));
  };

  /* ==========================================================================
   * AFILIADOS AMAZON
   * Etiqueta los enlaces a amazon.es al cargar y también los que se añadan
   * después (MutationObserver). Los enlaces de nuestros widgets no se tocan.
   * ======================================================================== */
  const affiliate = {
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
      Logger.log(`Tags de Amazon: ${count} enlaces con tag ${site.amazonTag}`);

      new MutationObserver((mutations) => {
        for (const m of mutations) {
          for (const node of m.addedNodes) {
            if (node.nodeType === 1) this.scan(node);
          }
        }
      }).observe(document.body, { childList: true, subtree: true });
    }
  };

  /* ==========================================================================
   * ANALÍTICAS
   * ======================================================================== */
  function loadAnalytics() {
    if (!site.analytics || window.beebomstats !== undefined) return;
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
    isConfirmed() {
      return store.get(CONFIG.AGE.KEY) === true
        || store.get(CONFIG.AGE.LEGACY_KEY)?.confirmed === true;
    },

    /** Resuelve cuando el usuario puede ver el contenido */
    ensure() {
      return new Promise((resolve) => {
        if (this.isConfirmed()) {
          Logger.log('Edad verificada previamente.');
          return resolve();
        }

        Logger.log('Mostrando modal de verificación de edad...');
        injectStyle('age-styles', AGE_CSS);

        const overlay = document.createElement('div');
        overlay.className = 'age-overlay';
        overlay.setAttribute('data-am-ui', '');
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
          store.set(CONFIG.AGE.KEY, true);
          overlay.remove();
          resolve();
        });

        overlay.querySelector('.age-no').addEventListener('click', () => {
          Logger.log('Verificación rechazada. Redirigiendo...');
          window.location.href = CONFIG.AGE.EXIT_URL;
        });
      });
    }
  };

  /* ==========================================================================
   * GEOLOCALIZACIÓN
   * Cloudflare devuelve el país en /cdn-cgi/trace (línea "loc=ES").
   * Si falla, la zona horaria del navegador sirve para detectar España.
   * ======================================================================== */
  const geo = {
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

    /** Código ISO del país ('ES', 'MX'…) o null si no se sabe */
    async getCountry() {
      const cached = store.get(CONFIG.GEO.CACHE_KEY, { session: true });
      if (cached) return cached;

      try {
        const country = await this.fromCloudflare();
        store.set(CONFIG.GEO.CACHE_KEY, country, { session: true });
        return country;
      } catch (err) {
        Logger.warn('No se pudo leer el país de Cloudflare, se usa la zona horaria:', err);
        return this.fromTimezone();
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
    const title = (document.title || '').trim();
    if (!title || document.getElementById('amz-sticky-bar')) return;

    Logger.log('Iniciando botón sticky de Amazon...');
    const url = `https://www.amazon.es/s?k=${encodeURIComponent(title)}&tag=${encodeURIComponent(site.amazonTag)}`;
    injectStyle('amz-sticky-styles', STICKY_CSS);

    const bar = document.createElement('div');
    bar.id = 'amz-sticky-bar';
    bar.setAttribute('data-am-ui', '');
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
   * CHOLLOS (POPUP INICIAL + SLIDER INFERIOR ROTATIVO)
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
          queue = queue.filter(o => o !== offer);
        }
      }
      return null;
    }

    return { next, get size() { return offers.length; } };
  }

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
  function showOfferPopup(offer, onClosed) {
    const label = site.storeLabel;
    const overlay = document.createElement('div');
    overlay.id = 'offer-overlay';
    overlay.setAttribute('data-am-ui', '');
    overlay.innerHTML = `
      <div id="offer-interstitial" role="dialog" aria-modal="true" aria-label="Oferta destacada">
        <button id="offer-close-btn" type="button" aria-label="Cerrar">✕</button>
        <div id="offer-int-img-wrap">
          <img id="offer-int-img" src="${escapeHtml(offer.image)}" alt="${escapeHtml(offer.title)}">
        </div>
        <div id="offer-int-body">
          <div id="offer-int-meta">
            <span class="int-badge-store">${escapeHtml(label)}</span>
            ${offer.price ? `<span id="offer-int-price">${escapeHtml(offer.price)}</span>` : ''}
          </div>
          <div id="offer-int-title">${escapeHtml(offer.title)}</div>
          ${offer.description ? `<div id="offer-int-desc">${escapeHtml(offer.description)}</div>` : ''}
          <a id="offer-int-cta" href="${escapeHtml(offer.url)}" target="_blank" rel="nofollow sponsored noopener">
            Ver oferta en ${escapeHtml(label)} →
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
    const autoCloseTimer = setTimeout(close, CONFIG.OFFERS.POPUP_AUTOCLOSE_MS);

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
   * - El popup grande sale como mucho una vez cada POPUP_TTL_MS; el resto de
   *   páginas muestran directamente el slider.
   * - Cuando ya solo queda el slider (o si no hay ofertas) se lanza el evento
   *   'appmanager:banner', para cargar otros widgets sin que coincidan con el popup.
   */
  async function initOffers() {
    if (document.getElementById('offer-banner')) return;

    const announceBannerMode = () => document.dispatchEvent(new CustomEvent('appmanager:banner'));
    const feed = createOfferFeed(site.offersEndpoint);

    let firstOffer = null;
    try {
      firstOffer = await feed.next();
    } catch (err) {
      Logger.error('Error al obtener ofertas:', err);
    }

    if (!firstOffer) {
      Logger.warn('No hay ofertas disponibles; no se muestra popup ni slider.');
      announceBannerMode();
      return;
    }

    injectStyle('offer-styles', OFFER_CSS);

    const banner = document.createElement('div');
    banner.id = 'offer-banner';
    banner.setAttribute('data-am-ui', '');
    renderBanner(banner, firstOffer);
    document.body.appendChild(banner);

    const showBanner = () => {
      void banner.offsetWidth;
      banner.classList.add('visible');
      startBannerRotation(banner, feed);
      announceBannerMode();
    };

    if (store.get(CONFIG.OFFERS.POPUP_KEY)) {
      Logger.log('Popup ya visto: se muestra solo el slider.');
      showBanner();
    } else {
      // Se marca al mostrarlo, aunque cambie de página antes de cerrarlo
      store.set(CONFIG.OFFERS.POPUP_KEY, true, { ttl: CONFIG.OFFERS.POPUP_TTL_MS });
      showOfferPopup(firstOffer, showBanner);
    }
  }

  /* ==========================================================================
   * NOTIFICACIONES PUSH
   * Solo se activan si la web tiene /push-sw.js en su raíz (se comprueba con
   * un HEAD del mismo origen y se cachea 24 h). El service worker se registra
   * con scope /push/ y únicamente cuando el usuario acepta.
   * ======================================================================== */
  const PUSH_CSS = `
    #am-push-prompt {
      position: fixed; left: 16px; bottom: 16px; z-index: 9999997;
      width: calc(100% - 32px); max-width: 360px; box-sizing: border-box;
      background: #18181b; color: #fff; border: 1px solid rgba(255,255,255,0.12);
      border-radius: 16px; box-shadow: 0 16px 32px -8px rgba(0,0,0,0.6); padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex; gap: 12px; align-items: flex-start;
      opacity: 0; transform: translateY(20px); transition: opacity 0.35s ease, transform 0.35s ease;
    }
    #am-push-prompt.visible { opacity: 1; transform: none; }
    #am-push-prompt .am-push-icon { font-size: 26px; line-height: 1; flex-shrink: 0; }
    #am-push-prompt .am-push-title { font-size: 15px; font-weight: 700; margin: 0 0 4px; }
    #am-push-prompt .am-push-text { font-size: 13px; color: #a1a1aa; margin: 0 0 12px; line-height: 1.4; }
    #am-push-prompt .am-push-actions { display: flex; gap: 8px; }
    #am-push-prompt button {
      border: none; border-radius: 10px; padding: 9px 14px; font-weight: 600; font-size: 13px;
      cursor: pointer; font-family: inherit;
    }
    #am-push-prompt .am-push-yes { background: #2563eb; color: #fff; }
    #am-push-prompt .am-push-yes:hover { background: #1d4ed8; }
    #am-push-prompt .am-push-no { background: #27272a; color: #e4e4e7; }
    #am-push-prompt .am-push-no:hover { background: #3f3f46; }
    @media (max-width: 480px) {
      #am-push-prompt { left: 12px; right: 12px; bottom: 12px; width: auto; max-width: none; }
    }
  `;

  const PUSH_TEXT = {
    es: {
      title: '¿Te avisamos de las novedades?',
      text: 'Recibe una notificación cuando publiquemos algo nuevo. Puedes desactivarlo cuando quieras.',
      yes: 'Sí, avisadme',
      no: 'Ahora no'
    },
    en: {
      title: 'Want to hear about new stuff?',
      text: 'Get a notification when we publish something new. You can turn it off anytime.',
      yes: 'Yes, notify me',
      no: 'Not now'
    }
  };

  const push = {
    supported() {
      return CONFIG.PUSH.ENABLED
        && site.push
        && !!CONFIG.PUSH.VAPID_PUBLIC_KEY
        && window.isSecureContext
        && 'serviceWorker' in navigator
        && 'PushManager' in window
        && 'Notification' in window;
    },

    /** ¿Esta web tiene /push-sw.js? (cacheado 24 h, también el "no") */
    async workerExists() {
      const cached = store.get(CONFIG.PUSH.SW_CHECK_KEY);
      if (cached !== null) return cached;

      let exists = false;
      try {
        const res = await fetchWithTimeout(CONFIG.PUSH.SW_PATH, { method: 'HEAD', cache: 'no-store' }, 4000);
        const type = res.headers.get('content-type') || '';
        // Comprobar el tipo evita falsos positivos de webs que responden 200 con su index
        exists = res.ok && type.includes('javascript');
      } catch { /* no existe o no responde */ }

      store.set(CONFIG.PUSH.SW_CHECK_KEY, exists, { ttl: CONFIG.PUSH.SW_CHECK_TTL_MS });
      return exists;
    },

    /** Nuestra registration (scope /push/), ignorando otros service workers de la web */
    async getRegistration() {
      const scopeUrl = new URL(CONFIG.PUSH.SCOPE, window.location.origin).href;
      const regs = await navigator.serviceWorker.getRegistrations();
      return regs.find(r => r.scope === scopeUrl) || null;
    },

    /** Registra el worker y espera a que esté activo (subscribe lo necesita) */
    async register() {
      const reg = await navigator.serviceWorker.register(CONFIG.PUSH.SW_PATH, { scope: CONFIG.PUSH.SCOPE });
      if (reg.active) return reg;

      const worker = reg.installing || reg.waiting;
      if (!worker) throw new Error('Service worker sin instancia');
      await new Promise((resolve, reject) => {
        worker.addEventListener('statechange', () => {
          if (worker.state === 'activated') resolve();
          else if (worker.state === 'redundant') reject(new Error('Service worker descartado'));
        });
      });
      return reg;
    },

    async subscribe(reg) {
      return (await reg.pushManager.getSubscription())
        || reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: base64UrlToUint8Array(CONFIG.PUSH.VAPID_PUBLIC_KEY)
        });
    },

    /** Envía la suscripción al servidor (como mucho una vez cada SYNC_TTL_MS) */
    async send(subscription, country) {
      if (store.get(CONFIG.PUSH.SYNC_KEY) === subscription.endpoint) return;

      const res = await fetchWithTimeout(CONFIG.PUSH.SUBSCRIBE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site: BARE_HOST,
          subscription: subscription.toJSON(),
          country: country || null,
          lang: navigator.language || null,
          path: window.location.pathname
        })
      }, 8000);
      if (!res.ok) throw new Error(`HTTP ${res.status} al guardar la suscripción`);

      store.set(CONFIG.PUSH.SYNC_KEY, subscription.endpoint, { ttl: CONFIG.PUSH.SYNC_TTL_MS });
      Logger.log('Suscripción push guardada en el servidor.');
    },

    async subscribeAndSend(country) {
      const reg = (await this.getRegistration()) || (await this.register());
      const sub = await this.subscribe(reg);
      await this.send(sub, country);
    },

    /**
     * Popup propio. Resuelve con el permiso del navegador ('granted', 'denied',
     * 'default') si pulsa "Sí", con 'no' si pulsa "Ahora no", o con 'ignored'
     * si hace clic en cualquier otra parte de la página.
     */
    showPrompt() {
      return new Promise((resolve) => {
        injectStyle('am-push-styles', PUSH_CSS);
        const lang = (navigator.language || 'en').toLowerCase().startsWith('es') ? 'es' : 'en';
        const t = PUSH_TEXT[lang];

        const box = document.createElement('div');
        box.id = 'am-push-prompt';
        box.setAttribute('data-am-ui', '');
        box.setAttribute('role', 'dialog');
        box.setAttribute('aria-label', t.title);
        box.innerHTML = `
          <div class="am-push-icon" aria-hidden="true">🔔</div>
          <div>
            <p class="am-push-title">${escapeHtml(t.title)}</p>
            <p class="am-push-text">${escapeHtml(t.text)}</p>
            <div class="am-push-actions">
              <button type="button" class="am-push-yes">${escapeHtml(t.yes)}</button>
              <button type="button" class="am-push-no">${escapeHtml(t.no)}</button>
            </div>
          </div>
        `;
        document.body.appendChild(box);
        void box.offsetWidth;
        box.classList.add('visible');

        let done = false;
        const finish = (result) => {
          if (done) return;
          done = true;
          document.removeEventListener('click', onOutsideClick, true);
          box.classList.remove('visible');
          setTimeout(() => box.remove(), 350);
          resolve(result);
        };
        const onOutsideClick = (e) => { if (!box.contains(e.target)) finish('ignored'); };

        box.querySelector('.am-push-yes').addEventListener('click', () => {
          // requestPermission tiene que llamarse directamente dentro del clic
          const request = Notification.requestPermission();
          finish(Promise.resolve(request).then(r => r || Notification.permission));
        });
        box.querySelector('.am-push-no').addEventListener('click', () => finish('no'));
        setTimeout(() => document.addEventListener('click', onOutsideClick, true), 0);
      });
    },

    /** Decide si preguntar; resuelve cuando ya no hay popup en pantalla */
    async maybePrompt(country) {
      if (!this.supported()) return;
      if (Notification.permission === 'denied') return;

      if (!(await this.workerExists())) {
        Logger.log(`Esta web no tiene ${CONFIG.PUSH.SW_PATH}; sin notificaciones.`);
        return;
      }

      // Ya dio permiso (en otra visita): se asegura la suscripción sin preguntar
      if (Notification.permission === 'granted') {
        await this.subscribeAndSend(country);
        return;
      }

      if (store.get(CONFIG.PUSH.DISMISS_KEY)) return;

      await wait(CONFIG.PUSH.PROMPT_DELAY_MS);
      const result = await this.showPrompt();
      Logger.log(`Popup de notificaciones: ${result}`);

      if (result === 'granted') {
        await this.subscribeAndSend(country);
      } else if (result === 'no' || result === 'default') {
        store.set(CONFIG.PUSH.DISMISS_KEY, true, { ttl: CONFIG.PUSH.DISMISS_TTL_MS });
      } else if (result === 'ignored') {
        store.set(CONFIG.PUSH.DISMISS_KEY, true, { ttl: CONFIG.PUSH.IGNORE_TTL_MS });
      }
      // 'denied': el navegador ya no dejará volver a preguntar
    }
  };

  /* ==========================================================================
   * SMARTLINK POPUNDER Y POPADS
   * ======================================================================== */
  function initSmartLinkPopunder() {
    if (!site.popunder || store.get(CONFIG.POPUNDER.KEY)) return;
    Logger.log('Iniciando smartlink popunder...');

    const root = document.documentElement;
    const onClick = (e) => {
      if (isOwnUi(e.target)) return; // los clics en nuestros popups no cuentan
      root.removeEventListener('click', onClick);
      if (store.get(CONFIG.POPUNDER.KEY)) return;
      window.open(smartlinkUrl(), 'popunder', 'width=1024,height=768,resizable=1,toolbar=1,location=1,menubar=1,status=1,scrollbars=1');
      store.set(CONFIG.POPUNDER.KEY, true, { ttl: CONFIG.POPUNDER.TTL_MS });
    };
    root.addEventListener('click', onClick);
  }

  function loadPopAdsScripts() {
    Logger.log('Cargando scripts de PopAds / Adsterra...');

    // popads.net (código del proveedor, sin modificar)
    (function(){var q=window,t="d30a423e37fe9b7888b7e8f56a20e472",f=[["siteId",750+158+222+4934385],["minBid",0.000001],["popundersPerIP","0"],["delayBetween",0],["default","https://compiledonatevanity.com/vg3ejyvbq?key=ca6fe018d69873f98382f717bc646ca6"],["defaultPerDay",0],["topmostLayer","auto"]],a=["d3d3LmludGVsbGlnZW5jZWFkeC5jb20vc2V4dC1hbGwuY3Nz","ZDJrbHg4N2Jnem5nY2UuY2xvdWRmcm9udC5uZXQvYkdEL2xtYXBsZS5taW4uanM="],d=-1,i,b,v=function(){clearTimeout(b);d++;if(a[d]&&!(1814345022000<(new Date).getTime()&&1<d)){i=q.document.createElement("script");i.type="text/javascript";i.async=!0;var y=q.document.getElementsByTagName("script")[0];i.src="https://"+atob(a[d]);i.crossOrigin="anonymous";i.onerror=v;i.onload=function(){clearTimeout(b);q[t.slice(0,16)+t.slice(0,16)]||v()};b=setTimeout(v,5E3);y.parentNode.insertBefore(i,y)}};if(!q[t]){try{Object.freeze(q[t]=f)}catch(e){}v()}})();

    // Adsterra popunder + social bar
    loadScript(pickRandom(CONFIG.POPUNDER.ADSTERRA_POPUNDERS));
    loadScript(CONFIG.POPUNDER.ADSTERRA_SOCIAL);
  }

  /* ==========================================================================
   * ESTRATEGIAS POR REGIÓN
   * ======================================================================== */
  function runSpain() {
    if (site.spainMode === 'sticky') return initAmazonStickyButton();
    if (site.spainMode === 'none') return;

    // facha.js (y lo que cargue) solo aparece cuando el popup de chollos ya es slider
    document.addEventListener('appmanager:banner', () => loadScript(CONFIG.SPAIN_DEFERRED_SCRIPT), { once: true });
    initOffers();
  }

  function runInternational(country) {
    initSmartLinkPopunder();

    const promptDone = push.maybePrompt(country)
      .catch(err => Logger.error('Error en notificaciones push:', err));

    // PopAds captura cualquier clic: se carga cuando ya no hay popup de notificaciones
    if (site.popAds) promptDone.then(loadPopAdsScripts);
  }

  /* ==========================================================================
   * INICIALIZACIÓN
   * ======================================================================== */
  async function init() {
    Logger.log(`Inicializando AppManager v${VERSION} en ${site.host}...`);

    // API pública (isAdultWeb y cfpais se mantienen por compatibilidad con otros scripts)
    window.isAdultWeb = site.adult;
    window.AppManager = { version: VERSION, site, country: null };

    affiliate.watch();
    loadAnalytics();

    if (window.conadsense !== undefined) {
      Logger.warn('Google AdSense detectado. Se detiene la inyección publicitaria.');
      return;
    }

    if (new URLSearchParams(window.location.search).get('utm_source') === 'chuscountry') {
      window.location.href = smartlinkUrl();
      return;
    }

    if (site.adult) await ageGate.ensure();

    const country = await geo.getCountry();
    window.AppManager.country = country;
    window.cfpais = country === 'ES' ? 'spain' : (country || undefined);
    Logger.log(`País: ${country || 'desconocido'}`);

    if (country === 'ES') runSpain();
    else runInternational(country);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
