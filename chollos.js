(function () {
  // ==== CONFIGURACIÓN (edita estas 3 variables) ====
  const URL_WHATSAPP = "https://whatsapp.com/channel/0029Vb42TrX8vd1LcvWRaq2Z";
  const URL_TELEGRAM  = "https://t.me/chollosamazoneshoy";
  const IMG_PROMO     = "https://bitelchux.github.io/chollos.jpg";

  const STORAGE_KEY = "ofertas-banner-cerrado";

  // Evita inyectarlo dos veces si el script se ejecuta más de una vez
  if (document.getElementById("ofertas-banner-widget")) return;

  // Si el usuario ya lo cerró en esta pestaña/sesión, no se vuelve a mostrar
  if (sessionStorage.getItem(STORAGE_KEY) === "1") return;

  // ==== ESTILOS ====
  const estilos = document.createElement("style");
  estilos.textContent = `
    #ofertas-banner-widget {
      position: fixed;
      top: 16px;
      right: 16px;
      width: 260px;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.25);
      font-family: Arial, sans-serif;
      z-index: 2147483647;
      overflow: hidden;
      animation: ofertas-banner-in .3s ease-out;
    }
    @keyframes ofertas-banner-in {
      from { opacity: 0; transform: translateY(-10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    #ofertas-banner-widget img {
      width: 100%;
      display: block;
    }
    #ofertas-banner-widget .ofertas-banner-cerrar {
      position: absolute;
      top: 6px;
      right: 8px;
      background: rgba(0,0,0,.55);
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      cursor: pointer;
      font-size: 14px;
      line-height: 1;
    }
    #ofertas-banner-widget .ofertas-banner-contenido {
      padding: 12px;
      text-align: center;
    }
    #ofertas-banner-widget .ofertas-banner-contenido p {
      margin: 0 0 10px;
      font-size: 13px;
      color: #222;
    }
    #ofertas-banner-widget .ofertas-banner-botones {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    #ofertas-banner-widget a {
      display: block;
      padding: 8px;
      border-radius: 6px;
      text-decoration: none;
      font-size: 13px;
      font-weight: bold;
      color: #fff;
    }
    #ofertas-banner-widget .btn-whatsapp { background: #25D366; }
    #ofertas-banner-widget .btn-telegram { background: #229ED9; }
  `;
  document.head.appendChild(estilos);

  // ==== MARCADO HTML DEL WIDGET ====
  const banner = document.createElement("div");
  banner.id = "ofertas-banner-widget";
  banner.innerHTML = `
    <button class="ofertas-banner-cerrar" title="Cerrar">✕</button>
    <img src="${IMG_PROMO}" alt="Ofertas Amazon" />
    <div class="ofertas-banner-contenido">
      <p>📦 Ofertas de Amazon cada día. ¡Únete gratis!</p>
      <div class="ofertas-banner-botones">
        <a class="btn-whatsapp" href="${URL_WHATSAPP}" target="_blank" rel="noopener">WhatsApp</a>
        <a class="btn-telegram" href="${URL_TELEGRAM}" target="_blank" rel="noopener">Telegram</a>
      </div>
    </div>
  `;
  document.body.appendChild(banner);

  // ==== CIERRE DEL WIDGET ====
  banner.querySelector(".ofertas-banner-cerrar").addEventListener("click", () => {
    banner.remove();
    sessionStorage.setItem(STORAGE_KEY, "1"); // no volver a mostrarlo en esta sesión
  });
})();
