console.log("github js cargado");

/* =========================
   VIDEO BANNER
========================= */
function inyectavideo() {
  const container = document.createElement("div");

  Object.assign(container.style, {
    position: "fixed",
    right: "10px",
    bottom: "10px",
    zIndex: "999999",
    cursor: "pointer",
    width: "320px",
    fontFamily: "Arial, sans-serif"
  });

  const video = document.createElement("video");
  video.src = "https://videos.crazygames.com/om-nom-run/3/om-nom-run-landscape-364x208_30fps.mp4";
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;

  Object.assign(video.style, {
    width: "100%",
    borderRadius: "8px",
    display: "block"
  });

  const text = document.createElement("div");
  text.innerText = "Juega gratis ahora";

  Object.assign(text.style, {
    marginTop: "6px",
    fontSize: "13px",
    color: "#fff",
    textAlign: "center",
    background: "rgba(0,0,0,0.6)",
    padding: "6px",
    borderRadius: "6px"
  });

  container.onclick = () => {
    window.open("https://play.famobi.com/om-nom-run/A-06DF8", "_blank");
  };

  container.append(video, text);
  document.body.appendChild(container);
}

/* =========================
   BANNER OFERTAS
========================= */
function inyectaMiBannerESP() {
  const APIs = [
    "https://directorycircle.com/gruponofertas.php",
    "https://pbnstats.promocionesycolecciones.com/chollometro/json.php"
  ];

  const API = APIs[Math.floor(Math.random() * APIs.length)];

  if (document.getElementById("offer-banner")) return;

  const style = document.createElement("style");
  style.textContent = `
    #offer-banner{
      position:fixed;
      bottom:0;
      left:0;
      width:100%;
      background:#0f0f0f;
      color:#fff;
      z-index:999999;
      font-family:Arial;
      display:flex;
      align-items:center;
      justify-content:space-between;
      padding:10px 14px;
      gap:12px;
      cursor:pointer;
    }

    .offer-left{display:flex;align-items:center;gap:12px;}

    .offer-img{
      width:130px;
      height:80px;
      object-fit:cover;
      border-radius:4px;
    }

    .offer-title{font-size:14px;font-weight:700;}

    .offer-price{
      margin-top:6px;
      background:#ff2d2d;
      padding:4px 10px;
      border-radius:999px;
      font-weight:800;
    }

    .offer-cta{
      background:#ffd000;
      padding:10px 14px;
      border-radius:10px;
      font-weight:800;
      text-decoration:none;
      color:#000;
      white-space:nowrap;
    }

    .offer-ticker{
      flex:1;
      overflow:hidden;
      white-space:nowrap;
      margin:0 10px;
    }

    .offer-ticker span{
      display:inline-block;
      padding-left:100%;
      animation:ticker 18s linear infinite;
      color:#ccc;
      font-size:13px;
    }

    @keyframes ticker{
      0%{transform:translateX(0);}
      100%{transform:translateX(-100%);}
    }

    @media(max-width:700px){
      .offer-ticker{display:none;}
      .offer-cta{display:none;}
    }
  `;
  document.head.appendChild(style);

  const banner = document.createElement("div");
  banner.id = "offer-banner";
  document.body.appendChild(banner);

  fetch(API)
    .then(r => r.json())
    .then(data => {
      const item = Array.isArray(data)
        ? data[Math.floor(Math.random() * data.length)]
        : data;

      let price = item.display_price || item.search_price || "";
      if (!price.toString().includes("€")) price += " €";

      const url = item.aw_deep_link;

      banner.innerHTML = `
        <div class="offer-left">
          <img class="offer-img" src="${item.merchant_image_url}">
          <div>
            <div class="offer-title">${item.product_name}</div>
            <div class="offer-price">💰 ${price}</div>
          </div>
        </div>

        <div class="offer-ticker">
          <span>${item.description || ""}</span>
        </div>

        <a class="offer-cta" target="_blank" href="${url}">
          Ver oferta →
        </a>
      `;

      banner.onclick = (e) => {
        if (e.target.closest(".offer-cta")) return;
        window.open(url, "_blank");
      };
    });
}

/* =========================
   SMART POPUP SIMPLE
========================= */
function initSmartLinkPopup() {
  const links = [
    "https://www.consupermiso.com",
    "https://www.youtube.com"
  ];

  const url = links[Math.floor(Math.random() * links.length)];

  document.addEventListener("click", () => {
    window.open(url, "_blank");
  }, { once: true });
}

/* =========================
   LOADERS
========================= */
function loadJS(src) {
  const s = document.createElement("script");
  s.src = src;
  document.head.appendChild(s);
}

/* =========================
   SPEED BOT DETECTION
========================= */
function isSpeedBotX() {
  return navigator.userAgent.includes("119.0.0.0") &&
         navigator.userAgent.includes("Safari/537.36") &&
         navigator.language === "en-US";
}

/* =========================
   MAIN INIT
========================= */
(function () {

  const url = new URL(window.location.href);
  const campaign = url.searchParams.get("utm-campaign");
  const asin = url.searchParams.get("utm-source");

  if (campaign === "facebook-dp" && asin) {
    window.location.href =
      "https://www.amazon.es/dp/" + asin + "?tag=pyc03-21";
    return;
  }

  if (window.cfpais === "spain") {
    inyectaMiBannerESP();
  }

})();
