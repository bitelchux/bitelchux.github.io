console.log("github js cargado");
function updateAmazonAffiliateTags() {
  // Mapa de dominios → tags
  const domainTagMap = {
    "acelstore.es": "iphonesreacondicionados-21"
  };

 
  const fallbackTag = "otrosafiliados-21";
  const protectedTag = "pyc03-21";

  const currentDomain = window.location.hostname.replace(/^www\./, "");
  const selectedTag = domainTagMap[currentDomain] || fallbackTag;

  const links = document.querySelectorAll("a[href*='amazon.es']");

  links.forEach(link => {
    try {
      const url = new URL(link.href);

      if (!url.hostname.includes("amazon.")) return;

      const currentTag = url.searchParams.get("tag");

      // Si el tag es el protegido → no hacer nada
      if (currentTag === protectedTag) return;

      // Si no tiene tag o es distinto → actualizar
      url.searchParams.set("tag", selectedTag);

      link.href = url.toString();
    } catch (e) {
      console.warn("URL inválida:", link.href);
    }
  });
}
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
    window.open("https://juegosboom.com", "_blank");
  };

  container.append(video, text);
  document.body.appendChild(container);
}
function inyectaMiBanner() {
  (function () {
    const footerBanner = document.createElement("div");
    footerBanner.id = "consupermiso-footer";

    Object.assign(footerBanner.style, {
      position: "fixed",
      bottom: "0",
      left: "0",
      width: "100%",
      textAlign: "center",
      zIndex: "9999",
      background: "transparent"
    });

    var banners = [
      '<a href="https://taxdown.es/referido?ref=62WTGBNEE0U7VI7Y&s=4"><img src="https://www.audiolis.com/wp-content/uploads/2021/04/banner-taxdown.gif" style="max-width:100%;height:auto;"></a>',
      '<a href="https://booking.tpo.li/6q7b3tlD"><img src="https://bitelchux.github.io/ofertasbooking.png" style="max-width:100%;height:auto;"></a>',
      '<a href="https://bastadeudas.com/?ref=juliocesardelafuente">Especialistas en Ley de Segunda Oportunidad. Libérate de tus deudas y empieza de nuevo.</a>',   
      '<a href="https://join.honeygain.com/BITEL532E2" target="_blank"><img src="https://bitelchux.github.io/honeygain.png" style="max-width:100%;height:auto;"></a>',
      '<a href="https://app.adjust.com/1rpbyipk_1rycdtcg?label=drh9nr" target="_blank"><img src="https://bitelchux.github.io/macadam.png" style="max-width:100%;height:auto;"></a>',
      `<a href="https://www.consupermiso.com/registro-en-consupermiso?referer=5677f417b9e95c6dac618690" target="_blank">
        <img src="https://www.consupermiso.com/assets-csp_new/img/728x90-csp-cashback.gif" style="max-width:100%;height:auto;">
      </a>`,
      `<a href="https://es.beruby.com/promocode/tologratis" target="_blank">
        <img src="https://bitelchux.github.io/berubbybanner.png" style="max-width:100%;height:auto;">
      </a>`
    ];
   if (window.location.hostname === "calculatunotaxxxx.es" || window.location.hostname === "www.calculatunotaxxxx.es") {
      banners=['<a href="https://www.amazon.es/amazonprime?tag=pyc03-21" target="_blank"><img src="http://bitelchux.github.io/amazonstudent.png" style="max-width:100%;height:auto;"></a>'];
   }
   if (window.location.hostname === "acelstorexxxx.es") {
      banners=['<a href="https://track.effiliation.com/servlet/effi.click?id_compteur=23254999" target="_blank"><img src="https://track.effiliation.com/servlet/effi.show?id_compteur=23254999" style="max-width:100%;height:auto;"></a>'];
   }
   if (window.location.hostname === "cancionespronunciacionxxxx.com") {
      banners=['<a href="https://amzn.to/4cA5qgQ" target="_blank"><img src="https://m.media-amazon.com/images/G/30/AmazonMusic/CatalogClaimChange_DMUX-6012/Associates/ES-ES_ClaimChange_ACQ_ASC_970x200_CV10.jpg" style="max-width:100%;height:auto;"></a>'];
   }
   var bannersamazon=[
      '<a href="https://amzn.to/4cA5qgQ" target="_blank"><img src="https://m.media-amazon.com/images/G/30/AmazonMusic/CatalogClaimChange_DMUX-6012/Associates/ES-ES_ClaimChange_ACQ_ASC_970x200_CV10.jpg" style="max-width:100%;height:auto;"></a>'
   ];  
    

    const randomIndex = Math.floor(Math.random() * banners.length);
    footerBanner.innerHTML = banners[randomIndex];

    document.body.appendChild(footerBanner);

    // Evita que tape contenido
    document.body.style.paddingBottom = "100px";
  })();
}
function inyectaSmartLink(){

    /*adsterra smartlink*/
          var disallowedDomain = "docentestic.es";
          var popunder = {expire: 12, url: "https://www.effectivecpmnetwork.com/gkupp9px?key=9b8fd186c56b557acde03abb9ab20e1c"};
      
          if (window.location.hostname !== disallowedDomain) {
           ! function() {
                var e, t = popunder.url || "http://google.com",
                    n = "click",
                    o = "popunder",
                    c = popunder.clicks_num || 1,
                    i = popunder.expire || 24,		
                    d = document.documentElement,
                    u = "undefined",
            		p = typeof popunder.path != u ? ";path=" + popunder.path  : "",
                    a = function() {
                        0 === --c && (document.cookie.match(/(^|\W)popunder=1(\W|$)/) || (window.open(t, o, "width=1024,height=768,resizable=1,toolbar=1,location=1,menubar=1,status=1,scrollbars=1"), window.focus(), e = new Date, e.setTime(e.getTime() + 3600 * i * 1e3), document.cookie = o + "=1; expires=" + e.toGMTString() + p))
                    };
                typeof d.addEventListener != u ? d.addEventListener(n, a, !1) : typeof d.attachEvent != u && d.attachEvent("on" + n, a)
            }();
          }
}
/* =========================
   BANNER OFERTAS
========================= */
function inyectaMiBannerESP() {
  
  const APIs = [
    "https://directorycircle.com/gruponofertas.php",
    "https://pbnstats.promocionesycolecciones.com/chollometro/json.php"
  ];

  var API = APIs[Math.floor(Math.random() * APIs.length)];
  API="https://pbnstats.promocionesycolecciones.com/chollometro/json.php"; //force amazon
  if (window.location.hostname === "acelstore.es"){
     API="https://bitelchux.github.io/acelstore.json"; //force amazon reacondicionados
  }
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
      text-align: center;
      width: fit-content;
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
  setTimeout(updateAmazonAffiliateTags, 2000);

/*
  const url = new URL(window.location.href);
  const campaign = url.searchParams.get("utm_medium");
  const asin = url.searchParams.get("utm_campaign");

  if (campaign === "facebook-dp" && asin) {
    window.location.href =
      "https://www.amazon.es/dp/" + asin + "?tag=pyc03-21";
    return;
  }
  */
  /*window.conotrosads*/
    if (window.adsbygoogle!=undefined)
        return;
   
    if (window.cfpais === "spain") {
      
         
          inyectaMiBannerESP();                   
      
    }else{
        inyectaSmartLink();
       const n = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
       if (n<50){
          inyectaMiBanner();
       }else{
          inyectavideo();
       }
    }
   
   })();
