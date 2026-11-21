// Descargador X — imágenes (y opcionalmente vídeos) + textos de un perfil, con trazas en consola.
// Uso: abre x.com/<usuario> (o /media), pega en consola y pulsa "Empezar".
// Filtra la consola por XDL para ver solo las trazas del script.
(() => {
  if (window.__xdl) { console.warn('[XDL] Ya cargado. Recarga la página para reiniciar.'); return; }

  // ---------- Configuración ----------
  const CONFIG = {
    DEBUG: true,                   // trazas detalladas (tweet a tweet, scroll, descartes)
    SOLO_IMAGENES: true,           // ignora vídeos y GIFs; baja solo fotos
    PAUSA_SCROLL_MS: [1500, 2500], // pausa aleatoria entre scrolls
    MAX_COLA: 30,                  // frena el scroll si hay más pendientes
    INTENTOS_SIN_CAMBIOS: 10       // intentos en el fondo sin novedades antes de terminar
  };

  // ---------- Trazas ----------
  const t0 = performance.now();
  const ts = () => ((performance.now() - t0) / 1000).toFixed(1).padStart(6) + 's';
  const pre = c => [`%c[XDL ${ts()}]`, `color:${c};font-weight:bold`];
  const log = {
    info: (...a) => console.log(...pre('#1d9bf0'), ...a),
    ok:   (...a) => console.log(...pre('#00ba7c'), '✓', ...a),
    warn: (...a) => console.warn(...pre('#ffad1f'), ...a),
    err:  (...a) => console.error(...pre('#f4212e'), ...a),
    dbg:  (...a) => CONFIG.DEBUG && console.log(...pre('#71767b'), ...a)
  };
  const fmtBytes = b => !b ? '?' : b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : (b / 1024).toFixed(0) + ' KB';

  // ---------- Temporizador en Web Worker (no se estrangula en segundo plano como setTimeout) ----------
  let sleep = ms => new Promise(r => setTimeout(r, ms));
  try {
    const src = 'onmessage=e=>setTimeout(()=>postMessage(e.data.id),e.data.ms)';
    const w = new Worker(URL.createObjectURL(new Blob([src], { type: 'text/javascript' })));
    const pend = new Map();
    let seq = 0;
    w.onmessage = e => { const r = pend.get(e.data); pend.delete(e.data); r?.(); };
    w.onerror = () => {
      log.warn('Worker de temporizador bloqueado; se usa setTimeout (más lento en segundo plano)');
      sleep = ms => new Promise(r => setTimeout(r, ms));
      for (const r of pend.values()) r();   // liberar esperas pendientes
      pend.clear();
    };
    sleep = ms => new Promise(r => { const id = ++seq; pend.set(id, r); w.postMessage({ id, ms }); });
    log.dbg('Temporizador en Web Worker activo');
  } catch (e) {
    log.warn('No se pudo crear el Worker de temporizador; se usa setTimeout', e.message);
  }

  const origFetch = window.fetch.bind(window);

  // ---------- Estado ----------
  const vistos = new Set();          // ids encolados (por red o DOM)
  const domVistos = new Set();       // tweets ya analizados en el DOM
  const pendientesVideo = new Set(); // tweets con vídeo vistos en DOM, esperando datos de red
  const cola = [];
  let dirHandle = null, iniciado = false, parar = false, trabajando = false, replayHecho = false;
  const cont = { tweets: 0, porRed: 0, porDom: 0, ficheros: 0, saltados: 0, errores: 0, segundosEnPausa: 0 };

  const usuarioActual = () => location.pathname.split('/')[1]?.toLowerCase() || '';

  window.__xdl = { cola, vistos, cont, pendientesVideo, CONFIG, parar: () => (parar = true) };

  // ---------- Panel ----------
  const panel = document.createElement('div');
  Object.assign(panel.style, {
    position: 'fixed', bottom: '20px', right: '20px', zIndex: 99999, background: '#111',
    color: '#fff', padding: '12px 14px', borderRadius: '10px', font: '13px system-ui',
    boxShadow: '0 4px 20px rgba(0,0,0,.5)', minWidth: '250px'
  });
  const titulo = document.createElement('div');
  titulo.textContent = 'Descargador X';
  titulo.style.fontWeight = '700';
  const info = document.createElement('div');
  Object.assign(info.style, { margin: '8px 0', whiteSpace: 'pre-line' });
  const btn = document.createElement('button');
  btn.textContent = 'Empezar';
  Object.assign(btn.style, { padding: '6px 12px', borderRadius: '6px', border: 0, cursor: 'pointer' });
  panel.append(titulo, info, btn);
  document.body.appendChild(panel);

  const pintar = (estado = '') => {
    info.textContent =
      `Perfil: @${usuarioActual()}\n` +
      `Tweets con media: ${cont.tweets} (red ${cont.porRed} · DOM ${cont.porDom})\n` +
      `Ficheros guardados: ${cont.ficheros}\n` +
      `Ya existían: ${cont.saltados} · Errores: ${cont.errores}\n` +
      `En cola: ${cola.length}` + (estado ? `\n${estado}` : '');
  };
  pintar('Pulsa Empezar');

  btn.onclick = async () => {
    if (!iniciado) {
      if (window.showDirectoryPicker) {
        try {
          dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
          log.info(`Carpeta destino: "${dirHandle.name}"`);
        } catch { log.warn('No se eligió carpeta'); pintar('Carpeta no elegida'); return; }
      } else {
        log.warn('Sin File System Access API: se usarán descargas normales');
      }
      iniciado = true;
      btn.textContent = 'Parar';
      log.info(`Inicio sobre @${usuarioActual()} (solo imágenes: ${CONFIG.SOLO_IMAGENES})`);
      escanearDom();
      worker();
      scrollLoop();
    } else {
      parar = true;
      btn.disabled = true;
      log.warn('Parada solicitada por el usuario');
      pintar('Parando...');
    }
  };

  // Traza de cambios de visibilidad
  document.addEventListener('visibilitychange', () => {
    if (!iniciado || parar) return;
    if (document.hidden) log.warn('Pestaña oculta: X deja de cargar tweets. Scroll en pausa; la cola de descargas sigue.');
    else log.info('Pestaña visible de nuevo: reanudando scroll');
  });

  // ---------- Utilidades de media ----------
  const decodeHtml = s => { const t = document.createElement('textarea'); t.innerHTML = s; return t.value; };

  // Normaliza a JPEG original: sirve para .../XXX.png y para .../XXX?format=jpg&name=small
  function urlJpgOriginal(url) {
    try {
      const u = new URL(url);
      u.pathname = u.pathname.replace(/\.(jpg|jpeg|png|webp)$/i, '');
      u.search = '?format=jpg&name=orig';
      return u.toString();
    } catch { return url; }
  }

  function encolar(t, fuente) {
    if (vistos.has(t.id)) { log.dbg(`${t.id}: ya encolado, se ignora (${fuente})`); return false; }
    vistos.add(t.id);
    pendientesVideo.delete(t.id);
    cola.push(t);
    cont.tweets++;
    fuente === 'red' ? cont.porRed++ : cont.porDom++;
    const nImg = t.items.filter(i => !i.video).length, nVid = t.items.length - nImg;
    log.dbg(`Encolado ${t.id} [${fuente}] ${nImg} img · ${nVid} vid · "${t.texto.slice(0, 60).replace(/\n/g, ' ')}${t.texto.length > 60 ? '…' : ''}"`);
    worker();
    pintar();
    return true;
  }

  // ---------- Fuente 1: red (GraphQL) ----------
  const opDe = url => (typeof url === 'string' ? url : '').match(/\/graphql\/[^/]+\/(\w+)/)?.[1];
  const esTimeline = url => /^(UserMedia|UserTweets|UserTweetsAndReplies)$/.test(opDe(url) || '');

  function extraerTweets(nodo, out = []) {
    if (Array.isArray(nodo)) { for (const n of nodo) extraerTweets(n, out); return out; }
    if (!nodo || typeof nodo !== 'object') return out;
    if (nodo.rest_id && nodo.legacy && 'full_text' in nodo.legacy) out.push(nodo);
    for (const k in nodo) extraerTweets(nodo[k], out);
    return out;
  }

  function parsearTweet(t) {
    const leg = t.legacy;
    if (leg.retweeted_status_result) return { motivo: 'retweet' };
    const u = t.core?.user_results?.result;
    const sn = (u?.core?.screen_name || u?.legacy?.screen_name || '').toLowerCase();
    if (sn && sn !== usuarioActual()) return { motivo: 'otro autor' };
    const media = leg.extended_entities?.media;
    if (!media?.length) return { motivo: 'sin media' };

    let texto = t.note_tweet?.note_tweet_results?.result?.text || leg.full_text || '';
    const items = [];
    for (const m of media) {
      if (m.url) texto = texto.replace(m.url, '');   // quitar enlace t.co del propio media
      if (m.type === 'photo') {
        items.push({ url: urlJpgOriginal(m.media_url_https), video: false });
      } else if (m.type === 'video' || m.type === 'animated_gif') {
        if (CONFIG.SOLO_IMAGENES) { log.dbg(`${t.rest_id}: ${m.type} ignorado (solo imágenes)`); continue; }
        const mejor = (m.video_info?.variants || [])
          .filter(v => v.content_type === 'video/mp4')
          .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0];
        if (mejor) items.push({ url: mejor.url, video: true });
        else log.warn(`${t.rest_id}: vídeo sin variante mp4`);
      }
    }
    if (!items.length) return { motivo: CONFIG.SOLO_IMAGENES ? 'sin imágenes' : 'media no descargable' };
    return { t: { id: t.rest_id, texto: decodeHtml(texto).trim(), items } };
  }

  function procesarJson(json, op) {
    try {
      const brutos = extraerTweets(json);
      let nuevos = 0;
      const descartes = {};
      for (const b of brutos) {
        const r = parsearTweet(b);
        if (!r.t) { descartes[r.motivo] = (descartes[r.motivo] || 0) + 1; continue; }
        if (encolar(r.t, 'red')) nuevos++;
      }
      log.info(`Red ${op}: ${brutos.length} tweets en la respuesta → ${nuevos} nuevos con media`,
        Object.keys(descartes).length ? descartes : '');
    } catch (e) { log.err(`Error parseando ${op}`, e); }
  }

  // Intenta recuperar la primera página (ya cargada antes de pegar el script) repitiendo la petición sin cursor
  async function pedirPrimeraPagina(url, headers) {
    if (replayHecho) return;
    replayHecho = true;
    try {
      const u = new URL(url, location.origin);
      const vars = JSON.parse(u.searchParams.get('variables'));
      if (!vars.cursor) { log.dbg('Replay: la petición ya era la primera página'); return; }
      delete vars.cursor;
      u.searchParams.set('variables', JSON.stringify(vars));
      log.info('Replay: pidiendo la primera página del timeline...');
      const r = await origFetch(u.toString(), { headers, credentials: 'include' });
      if (r.ok) procesarJson(await r.json(), opDe(url) + ' (replay)');
      else log.warn(`Replay rechazado (HTTP ${r.status}). Los tweets iniciales se toman del DOM.`);
    } catch (e) { log.warn('Replay fallido', e); }
  }

  // Hooks XHR
  const xOpen = XMLHttpRequest.prototype.open;
  const xSetHeader = XMLHttpRequest.prototype.setRequestHeader;
  const xSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url) {
    this.__url = url; this.__headers = {};
    return xOpen.apply(this, arguments);
  };
  XMLHttpRequest.prototype.setRequestHeader = function (k, v) {
    if (this.__headers) this.__headers[k] = v;
    return xSetHeader.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function () {
    const op = opDe(this.__url);
    if (op) log.dbg(`XHR GraphQL → ${op}`);
    if (esTimeline(this.__url)) {
      const xhr = this;
      xhr.addEventListener('load', () => {
        log.dbg(`XHR ${op} ← HTTP ${xhr.status}`);
        if (xhr.status !== 200) { log.warn(`${op} devolvió HTTP ${xhr.status} (¿rate limit?)`); return; }
        try {
          const json = (xhr.responseType === '' || xhr.responseType === 'text') ? JSON.parse(xhr.responseText) : xhr.response;
          procesarJson(json, op);
        } catch (e) { log.err(`Respuesta ${op} no parseable`, e); }
      });
      pedirPrimeraPagina(this.__url, this.__headers);
    }
    return xSend.apply(this, arguments);
  };

  // Hook fetch
  window.fetch = async function (input, init) {
    const resp = await origFetch(input, init);
    try {
      const url = typeof input === 'string' ? input : input?.url;
      const op = opDe(url);
      if (op) log.dbg(`fetch GraphQL ${op} ← HTTP ${resp.status}`);
      if (esTimeline(url)) {
        if (resp.status !== 200) log.warn(`${op} devolvió HTTP ${resp.status} (¿rate limit?)`);
        else resp.clone().json().then(j => procesarJson(j, op)).catch(e => log.err(`Respuesta ${op} no parseable`, e));
        pedirPrimeraPagina(url, Object.fromEntries(new Headers(init?.headers || input?.headers)));
      }
    } catch { }
    return resp;
  };
  log.info('Hooks de red (XHR + fetch) instalados');

  // ---------- Fuente 2: DOM (tweets ya renderizados) ----------
  function textoDom(art) {
    const el = art.querySelector('[data-testid="tweetText"]');
    if (!el) return '';
    let s = '';
    const walk = n => {
      for (const c of n.childNodes) {
        if (c.nodeType === 3) s += c.textContent;
        else if (c.nodeName === 'IMG') s += c.alt || '';   // emojis
        else if (c.nodeName === 'BR') s += '\n';
        else walk(c);
      }
    };
    walk(el);
    return s.trim();
  }

  function escanearDom() {
    const user = usuarioActual();
    const articles = document.querySelectorAll('article[data-testid="tweet"]');
    let analizados = 0;
    for (const art of articles) {
      // Enlace principal del tweet: el que contiene el <time>
      const link = art.querySelector('a[href*="/status/"] time')?.closest('a');
      const m = link?.getAttribute('href')?.match(/^\/([^/]+)\/status\/(\d+)/);
      if (!m) continue;
      const [, autor, id] = m;
      if (domVistos.has(id)) continue;
      domVistos.add(id);
      analizados++;

      if (autor.toLowerCase() !== user) { log.dbg(`DOM ${id}: autor @${autor}, se ignora`); continue; }
      if (vistos.has(id)) { log.dbg(`DOM ${id}: ya obtenido por red`); continue; }

      // Vídeo del tweet principal (no del citado, que va dentro de div[role=link])
      const tieneVideo = [...art.querySelectorAll('[data-testid="videoPlayer"], [data-testid="videoComponent"]')]
        .some(v => !v.closest('div[role="link"]'));
      if (tieneVideo && !CONFIG.SOLO_IMAGENES) {
        pendientesVideo.add(id);
        log.info(`DOM ${id}: contiene vídeo, esperando sus datos de red`);
        continue;
      }
      if (tieneVideo) log.dbg(`DOM ${id}: vídeo ignorado (solo imágenes)`);

      // Fotos del tweet principal, ordenadas por /photo/N
      const fotos = [...art.querySelectorAll(`a[href^="/${autor}/status/${id}/photo/"]`)]
        .map(a => ({ n: +a.getAttribute('href').split('/photo/')[1], img: a.querySelector('img[src*="pbs.twimg.com/media"]') }))
        .filter(x => x.img)
        .sort((a, b) => a.n - b.n)
        .map(x => ({ url: urlJpgOriginal(x.img.src), video: false }));

      if (!fotos.length) { log.dbg(`DOM ${id}: sin imágenes`); continue; }
      if (art.querySelector('[data-testid="tweet-text-show-more-link"]'))
        log.warn(`DOM ${id}: texto truncado ("Mostrar más"); se guarda lo visible`);

      encolar({ id, texto: textoDom(art), items: fotos }, 'DOM');
    }
    if (analizados) log.dbg(`DOM: ${articles.length} tweets en pantalla, ${analizados} nuevos analizados`);
  }

  // ---------- Guardado ----------
  async function existe(nombre) {
    if (!dirHandle) return false;
    try { await dirHandle.getFileHandle(nombre); return true; } catch { return false; }
  }

  async function guardarUrl(url, nombre) {
    const r = await origFetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const len = +r.headers.get('content-length') || 0;
    if (dirHandle) {
      const fh = await dirHandle.getFileHandle(nombre, { create: true });
      await r.body.pipeTo(await fh.createWritable());   // streaming a disco
      return len;
    }
    const blob = await r.blob();
    descargarBlob(blob, nombre);
    return blob.size;
  }

  async function guardarTexto(texto, nombre) {
    const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
    if (dirHandle) {
      const fh = await dirHandle.getFileHandle(nombre, { create: true });
      const w = await fh.createWritable();
      await w.write(blob);
      await w.close();
    } else descargarBlob(blob, nombre);
  }

  function descargarBlob(blob, nombre) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 30000);
  }

  // idtweet para el primero, idtweet_2, idtweet_3... para el resto
  const nombre = (id, n, ext) => (n === 1 ? id : `${id}_${n}`) + ext;

  // ---------- Cola de descargas (tweet a tweet) ----------
  async function worker() {
    if (!iniciado || trabajando) return;
    trabajando = true;
    while (cola.length && !parar) {
      const t = cola.shift();
      log.dbg(`Procesando ${t.id} (quedan ${cola.length} en cola)`);
      let nImg = 0, nVid = 0;
      for (const m of t.items) {
        const f = m.video ? nombre(t.id, ++nVid, '.mp4') : nombre(t.id, ++nImg, '.jpeg');
        try {
          if (await existe(f)) { cont.saltados++; log.dbg(`${f} ya existe, se salta`); continue; }
          const ini = performance.now();
          const bytes = await guardarUrl(m.url, f);
          cont.ficheros++;
          log.ok(`${f} (${fmtBytes(bytes)}, ${((performance.now() - ini) / 1000).toFixed(1)}s)`);
        } catch (e) {
          cont.errores++;
          log.err(`${f} falló: ${e.message}`, m.url);
        }
        pintar();
      }
      try {
        const txt = `${t.id}.txt`;
        if (await existe(txt)) log.dbg(`${txt} ya existe, se salta`);
        else { await guardarTexto(t.texto, txt); log.dbg(`${txt} guardado (${t.texto.length} caracteres)`); }
      } catch (e) { cont.errores++; log.err(`${t.id}.txt falló`, e); }
      pintar();
      if (!dirHandle) await sleep(300);   // en modo descargas, no saturar al navegador
    }
    trabajando = false;
  }

  // ---------- Scroll ----------
  async function scrollLoop() {
    let sinCambios = 0, ultimoVistos = -1, ultimaAltura = 0, paso = 0;
    const enFondo = () => window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 50;

    while (!parar) {
      // Pestaña oculta: X no carga nada, así que se espera sin contar como "sin novedades"
      if (document.hidden) {
        const ini = performance.now();
        pintar('⏸ En pausa (pestaña oculta)');
        while (document.hidden && !parar) await sleep(1000);
        cont.segundosEnPausa += Math.round((performance.now() - ini) / 1000);
        sinCambios = 0;
        await sleep(1500);   // margen para que X vuelva a pintar
        continue;
      }

      if (cola.length > CONFIG.MAX_COLA) {
        log.dbg(`Cola con ${cola.length} pendientes, scroll en pausa`);
        await sleep(1000);
        continue;
      }

      window.scrollBy(0, 3000);
      const [a, b] = CONFIG.PAUSA_SCROLL_MS;
      await sleep(a + Math.random() * (b - a));
      if (document.hidden) continue;   // se ocultó durante la espera: no evaluar progreso
      escanearDom();
      paso++;

      // Progreso = cualquier tweet renderizado nuevo o la página ha crecido
      const altura = document.documentElement.scrollHeight;
      const hayProgreso = domVistos.size !== ultimoVistos || altura !== ultimaAltura;
      ultimoVistos = domVistos.size;
      ultimaAltura = altura;

      if (hayProgreso) {
        sinCambios = 0;
        log.dbg(`Scroll #${paso}: ${domVistos.size} tweets vistos, ${vistos.size} con media, cola ${cola.length}, altura ${altura}px`);
      } else if (enFondo()) {
        sinCambios++;
        log.dbg(`Scroll #${paso}: en el fondo sin novedades (${sinCambios}/${CONFIG.INTENTOS_SIN_CAMBIOS})`);
        if (sinCambios >= CONFIG.INTENTOS_SIN_CAMBIOS) break;
        if (sinCambios % 3 === 0) {
          // Rebote: a veces X no dispara la carga hasta que se sube y se vuelve a bajar
          window.scrollBy(0, -1500);
          await sleep(800);
        }
      } else {
        log.dbg(`Scroll #${paso}: sin tweets nuevos todavía, sigue bajando`);
      }
      pintar('Haciendo scroll...');
    }

    log.info(parar ? 'Scroll detenido' : 'Fin del scroll: final del perfil alcanzado. Vaciando cola...');
    while ((cola.length || trabajando) && !parar) await sleep(500);

    if (pendientesVideo.size && !CONFIG.SOLO_IMAGENES)
      log.warn(`${pendientesVideo.size} tweets con vídeo sin datos de red (no descargados):`, [...pendientesVideo]);
    log.info(parar ? 'Parado' : 'Terminado');
    console.table(cont);
    pintar(parar ? 'Parado' : 'Terminado ✔');
    btn.disabled = true;
  }

  log.info('Script cargado. Pulsa "Empezar" en el panel.');
})();
