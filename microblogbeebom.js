/**
 * ============================================================================
 * CONFIGURACIÓN ACTUALIZADA
 * ============================================================================
 */
const CONFIG = {
  LS_AGE_KEY: 'age_18_confirmed',
  GEO_API: 'https://ipapi.co/json/',
  
  // Tiempo de rotación del banner inferior en milisegundos (8 segundos)
  BANNER_ROTATION_INTERVAL_MS: 8000,
  
  // Enlaces directos
  WHATSAPP_CHANNEL_URL: 'https://whatsapp.com/channel/0029VaC... (tu_link_canal)',
  ALL_DEALS_URL: 'https://promocionesycolecciones.com/ofertas-amazon/',

  ADULT_DOMAINS: [
    'acelstorexxx.es',
    'dedronesxxx.es',
    'localhost'
  ],

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
  }
};

/**
 * ============================================================================
 * MÓDULO: BANNER DE OFERTAS CON ROTACIÓN, CIERRE Y ADAPTACIÓN MÓVIL
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

  // Inyección de estilos con soporte para móviles
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
    
    /* BANNER INFERIOR FLOTANTE */
    #offer-banner {
      position: fixed; bottom: 12px; left: 50%; transform: translateX(-50%) translateY(140%);
      width: calc(100% - 24px); max-width: 860px; background: #18181b; color: #fff;
      z-index: 999999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 14px; gap: 12px; cursor: pointer; opacity: 0;
      border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 16px 32px -8px rgba(0, 0, 0, 0.6);
      transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      box-sizing: border-box;
    }
    #offer-banner.visible { opacity: 1; transform: translateX(-50%) translateY(0); }
    
    #offer-banner .offer-left { display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1; }
    #offer-banner .offer-img { width: 52px; height: 52px; object-fit: cover; border-radius: 8px; flex-shrink: 0; background: #27272a; }
    #offer-banner .offer-info { display: flex; flex-direction: column; min-width: 0; flex: 1; }
    #offer-banner .offer-title { font-size: 13px; font-weight: 600; color: #f4f4f5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    #offer-banner .offer-sub { display: flex; align-items: center; gap: 8px; margin-top: 3px; flex-wrap: wrap; }
    #offer-banner .offer-price { background: rgba(220, 38, 38, 0.25); color: #f87171; border: 1px solid rgba(220, 38, 38, 0.4); padding: 1px 7px; border-radius: 6px; font-size: 12px; font-weight: 700; }
    
    /* Enlaces WhatsApp y Ver todos */
    #offer-banner .offer-whatsapp { color: #25d366; text-decoration: none; font-size: 11px; font-weight: 600; display: inline-flex; align-items: center; gap: 3px; }
    #offer-banner .offer-all { color: #a1a1aa; text-decoration: underline; font-size: 11px; font-weight: 500; }
    
    #offer-banner .offer-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
    #offer-banner .offer-cta { background: #ff9900; padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 12px; text-decoration: none; color: #000; white-space: nowrap; transition: background 0.2s; }
    #offer-banner .offer-cta:hover { background: #e68a00; }
    
    /* Botón cerrar banner flotante */
    #offer-banner-close {
      background: rgba(255, 255, 255, 0.1); border: none; color: #a1a1aa;
      border-radius: 50%; width: 24px; height: 24px; font-size: 12px;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; flex-shrink: 0;
    }
    #offer-banner-close:hover { background: rgba(255, 255, 255, 0.25); color: #fff; }

    /* REGLAS RESPONSIVE PARA MÓVIL */
    @media (max-width: 640px) {
      #offer-banner { padding: 8px 10px; gap: 8px; }
      #offer-banner .offer-img { width: 42px; height: 42px; }
      #offer-banner .offer-title { font-size: 12px; }
      #offer-banner .offer-cta { padding: 6px 10px; font-size: 11px; }
      #offer-banner .offer-all { display: none; } /* Ocultar en pantallas muy pequeñas para no saturar */
    }
  `;
  document.head.appendChild(style);

  // Inyección DOM del Intersticial
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

  // Inyección DOM del Banner Flotante
  const banner = document.createElement("div");
  banner.id = "offer-banner";
  document.body.appendChild(banner);

  // Función para obtener una oferta nueva mediante llamada HTTP
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

  // Función para renderizar el contenido del banner inferior
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
            <a class="offer-whatsapp" href="${CONFIG.WHATSAPP_CHANNEL_URL}" target="_blank" rel="noopener">
              💚 WhatsApp
            </a>
            <a class="offer-all" href="${CONFIG.ALL_DEALS_URL}" target="_blank" rel="noopener">
              Ver todos los chollos
            </a>
          </div>
        </div>
      </div>
      <div class="offer-actions">
        <a class="offer-cta" target="_blank" href="${targetUrl}">Ver oferta →</a>
        <button id="offer-banner-close" title="Cerrar banner">✕</button>
      </div>
    `;

    // Click en la caja principal (evitando clics sobre los botones/enlaces secundarios)
    banner.onclick = (e) => {
      if (e.target.closest(".offer-cta") || e.target.closest(".offer-whatsapp") || e.target.closest(".offer-all") || e.target.closest("#offer-banner-close")) return;
      window.open(targetUrl, "_blank");
    };

    // Evento de cierre manual del banner flotante
    document.getElementById("offer-banner-close").onclick = (e) => {
      e.stopPropagation();
      Logger.log("Banner de ofertas cerrado manualmente por el usuario.");
      clearInterval(rotationTimer);
      banner.classList.remove("visible");
      setTimeout(() => banner.remove(), 400);
    };
  };

  // Iniciar la rotación del banner inferior
  const startRotation = () => {
    if (rotationTimer) clearInterval(rotationTimer);
    
    rotationTimer = setInterval(async () => {
      Logger.log("Rotando oferta del banner flotante...");
      const newItem = await fetchNewOffer();
      if (newItem) renderBannerContent(newItem);
    }, CONFIG.BANNER_ROTATION_INTERVAL_MS);
  };

  // Transición del modal grande al banner flotante
  const closeInterstitial = () => {
    const interstitial = overlay.querySelector("#offer-interstitial");
    interstitial.style.transform = "scale(0.92)";
    interstitial.style.opacity = "0";
    overlay.style.opacity = "0";
    
    setTimeout(() => {
      overlay.style.display = "none";
      banner.classList.add("visible");
      startRotation(); // Comienza a rotar una vez que el banner se vuelve visible
    }, 400);
  };

  document.getElementById("offer-close-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    closeInterstitial();
  });

  const autoCloseTimer = setTimeout(closeInterstitial, 6000);

  // Carga inicial de la primera oferta
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
