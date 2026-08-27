

function addSpotifyRelax() {

    if (document.getElementById('spotify-relax-dialog')) return;

    /* =========================================================
       CONFIGURACIÓN
    ========================================================= */

    const albumUrl =
        'https://open.spotify.com/album/413ZRAjsrULjx1uiXi1qGn';

    /*
     * PON AQUÍ LAS URLS DE LAS CANCIONES DEL ÁLBUM.
     *
     * Ejemplo:
     *
     * const tracks = [
     *     'https://open.spotify.com/track/XXXXXXXXXXXX',
     *     'https://open.spotify.com/track/YYYYYYYYYYYY',
     *     'https://open.spotify.com/track/ZZZZZZZZZZZZ'
     * ];
     *
     * El orden debe ser el mismo que en el álbum.
     */

    const tracks = [

        // 'https://open.spotify.com/track/XXXXXXXXXXXX',
        // 'https://open.spotify.com/track/YYYYYYYYYYYY',
        // 'https://open.spotify.com/track/ZZZZZZZZZZZZ',

    ];


    const messages = [
        '🎧 Escucha música relajante mientras lees',
        '🌿 Música tranquila para acompañar tu lectura',
        '☕ Relájate y disfruta de esta música',
        '📖 Música relajante para leer y concentrarte',
        '🧘 Un poco de música para desconectar',
        '🌙 Relájate mientras lees'
    ];

    const message =
        messages[Math.floor(Math.random() * messages.length)];


    /* =========================================================
       ESTILOS
    ========================================================= */

    if (!document.getElementById('spotify-relax-styles')) {

        const style = document.createElement('style');

        style.id = 'spotify-relax-styles';

        style.textContent = `

        #spotify-relax-dialog {
            position: fixed;
            inset: 0;
            z-index: 9999999999;

            display: flex;
            align-items: center;
            justify-content: center;

            background: rgba(0,0,0,.58);

            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);

            padding: 20px;
            box-sizing: border-box;

            animation: spotifyRelaxFade .25s ease;
        }


        .spotify-relax-box {
            width: 100%;
            max-width: 430px;

            background: #fff;

            border-radius: 22px;

            padding: 32px 28px 27px;

            box-sizing: border-box;

            text-align: center;

            box-shadow:
                0 25px 70px rgba(0,0,0,.35);

            font-family:
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                Arial,
                sans-serif;

            animation: spotifyRelaxPopup .3s ease;
        }


        .spotify-relax-icon {
            font-size: 50px;
            margin-bottom: 12px;
        }


        .spotify-relax-title {
            font-size: 23px;
            font-weight: 700;
            color: #222;
            margin-bottom: 10px;
        }


        .spotify-relax-description {
            font-size: 16px;
            line-height: 1.5;
            color: #666;
            margin-bottom: 25px;
        }


        .spotify-relax-buttons {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }


        #spotify-relax-yes {
            border: 0;

            border-radius: 30px;

            padding: 14px 20px;

            background: #1DB954;
            color: white;

            font-size: 16px;
            font-weight: 600;

            cursor: pointer;

            transition:
                transform .15s ease,
                background .15s ease;
        }


        #spotify-relax-yes:hover {
            background: #1ed760;
            transform: translateY(-1px);
        }


        #spotify-relax-no {
            border: 0;

            background: transparent;

            color: #777;

            font-size: 14px;

            padding: 8px;

            cursor: pointer;
        }


        #spotify-relax-no:hover {
            color: #333;
        }


        /* =====================================================
           BARRA
        ===================================================== */

        #spotify-relax-widget {

            position: fixed;

            top: 0;
            left: 0;

            width: 100%;
            height: 64px;

            z-index: 999999999;

            background:
                linear-gradient(
                    135deg,
                    #191414,
                    #242424
                );

            box-shadow:
                0 3px 15px rgba(0,0,0,.30);

            display: flex;

            align-items: center;

            justify-content: center;

            padding:
                0 45px
                0 15px;

            box-sizing: border-box;

            font-family:
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                Arial,
                sans-serif;

            animation:
                spotifyRelaxSlide .3s ease;
        }


        .spotify-relax-text {

            color: #fff;

            font-size: 15px;

            font-weight: 500;

            margin-right: 22px;

            white-space: nowrap;
        }


        /* =====================================================
           CONTROLES
        ===================================================== */

        .spotify-relax-controls {

            display: flex;

            align-items: center;

            gap: 7px;
        }


        .spotify-relax-control {

            width: 40px;
            height: 40px;

            border: 0;

            border-radius: 50%;

            background:
                rgba(255,255,255,.10);

            color: white;

            display: flex;

            align-items: center;
            justify-content: center;

            font-size: 17px;

            cursor: pointer;

            transition:
                background .15s ease,
                transform .15s ease;
        }


        .spotify-relax-control:hover {

            background:
                rgba(255,255,255,.20);

            transform: scale(1.05);
        }


        .spotify-relax-control:disabled {

            opacity: .3;

            cursor: default;

            transform: none;
        }


        .spotify-relax-play {

            width: 44px;
            height: 44px;

            background: #1DB954;

            font-size: 19px;
        }


        .spotify-relax-play:hover {

            background: #1ed760;
        }


        /* =====================================================
           CERRAR
        ===================================================== */

        .spotify-relax-close {

            position: absolute;

            right: 12px;

            top: 50%;

            transform:
                translateY(-50%);

            width: 32px;
            height: 32px;

            border: 0;

            background: transparent;

            color: #aaa;

            font-size: 24px;

            cursor: pointer;
        }


        .spotify-relax-close:hover {
            color: #fff;
        }


        /* =====================================================
           IFRAME SPOTIFY INVISIBLE
        ===================================================== */

        #spotify-relax-embed {

            position: fixed;

            width: 1px;
            height: 1px;

            left: -10000px;
            top: -10000px;

            opacity: 0;

            pointer-events: none;
        }


        /* =====================================================
           ANIMACIONES
        ===================================================== */

        @keyframes spotifyRelaxFade {

            from {
                opacity: 0;
            }

            to {
                opacity: 1;
            }
        }


        @keyframes spotifyRelaxPopup {

            from {
                opacity: 0;

                transform:
                    scale(.92)
                    translateY(10px);
            }

            to {
                opacity: 1;

                transform:
                    scale(1)
                    translateY(0);
            }
        }


        @keyframes spotifyRelaxSlide {

            from {
                opacity: 0;

                transform:
                    translateY(-100%);
            }

            to {
                opacity: 1;

                transform:
                    translateY(0);
            }
        }


        /* =====================================================
           MÓVIL
        ===================================================== */

        @media (max-width: 600px) {

            #spotify-relax-widget {

                height: 60px;

                padding:
                    0 38px
                    0 8px;
            }


            .spotify-relax-text {
                display: none;
            }


            .spotify-relax-controls {
                gap: 5px;
            }


            .spotify-relax-control {

                width: 38px;
                height: 38px;

                font-size: 16px;
            }


            .spotify-relax-play {

                width: 42px;
                height: 42px;
            }
        }

        `;

        document.head.appendChild(style);
    }


    /* =========================================================
       POPUP
    ========================================================= */

    const dialog =
        document.createElement('div');

    dialog.id =
        'spotify-relax-dialog';

    dialog.innerHTML = `

        <div class="spotify-relax-box">

            <div class="spotify-relax-icon">
                🎧
            </div>

            <div class="spotify-relax-title">
                ¿Te apetece escuchar música?
            </div>

            <div class="spotify-relax-description">
                ${message}
            </div>

            <div class="spotify-relax-buttons">

                <button id="spotify-relax-yes">
                    🎵 Escuchar música
                </button>

                <button id="spotify-relax-no">
                    Ahora no
                </button>

            </div>

        </div>

    `;

    document.body.appendChild(dialog);


    /* =========================================================
       AHORA NO
    ========================================================= */

    document
        .getElementById('spotify-relax-no')
        .onclick = function () {

            dialog.remove();

        };


    /* =========================================================
       ESCUCHAR
    ========================================================= */

    document
        .getElementById('spotify-relax-yes')
        .onclick = function () {

            dialog.remove();


            /* =================================================
               CREAR BARRA
            ================================================= */

            const widget =
                document.createElement('div');

            widget.id =
                'spotify-relax-widget';

            widget.innerHTML = `

                <div class="spotify-relax-text">
                    ${message}
                </div>


                <div class="spotify-relax-controls">

                    <button
                        class="spotify-relax-control"
                        id="spotify-relax-prev"
                        title="Canción anterior">
                        ⏮
                    </button>


                    <button
                        class="spotify-relax-control spotify-relax-play"
                        id="spotify-relax-play"
                        title="Reproducir">
                        ▶
                    </button>


                    <button
                        class="spotify-relax-control"
                        id="spotify-relax-pause"
                        title="Pausa">
                        ⏸
                    </button>


                    <button
                        class="spotify-relax-control"
                        id="spotify-relax-next"
                        title="Siguiente canción">
                        ⏭
                    </button>

                </div>


                <button
                    class="spotify-relax-close"
                    title="Cerrar">
                    ×
                </button>


                <div id="spotify-relax-embed"></div>

            `;

            document.body.prepend(widget);


            document.body.style.paddingTop =
                '64px';


            /* =================================================
               VARIABLES
            ================================================= */

            let controller = null;

            let currentTrack = 0;

            let playerReady = false;


            /* =================================================
               BOTONES
            ================================================= */

            const playButton =
                document.getElementById(
                    'spotify-relax-play'
                );

            const pauseButton =
                document.getElementById(
                    'spotify-relax-pause'
                );

            const prevButton =
                document.getElementById(
                    'spotify-relax-prev'
                );

            const nextButton =
                document.getElementById(
                    'spotify-relax-next'
                );


            /*
             * Si no hemos puesto las pistas todavía,
             * desactivamos anterior/siguiente.
             */

            if (!tracks.length) {

                prevButton.disabled = true;
                nextButton.disabled = true;

            }


            /* =================================================
               PLAY
            ================================================= */

            playButton.onclick = function () {

                if (!controller) return;

                controller
                    .resume()
                    .catch(function (error) {

                        console.log(
                            'No se pudo reproducir:',
                            error
                        );

                    });

            };


            /* =================================================
               PAUSE
            ================================================= */

            pauseButton.onclick = function () {

                if (!controller) return;

                controller
                    .pause()
                    .catch(function (error) {

                        console.log(
                            'No se pudo pausar:',
                            error
                        );

                    });

            };


            /* =================================================
               SIGUIENTE
            ================================================= */

            nextButton.onclick = function () {

                if (!controller) return;

                if (!tracks.length) return;


                currentTrack++;

                if (
                    currentTrack >=
                    tracks.length
                ) {

                    currentTrack = 0;

                }


                controller
                    .loadEntity(
                        tracks[currentTrack]
                    )
                    .then(function () {

                        return controller.play();

                    })
                    .catch(function (error) {

                        console.log(
                            'Error cargando siguiente canción:',
                            error
                        );

                    });

            };


            /* =================================================
               ANTERIOR
            ================================================= */

            prevButton.onclick = function () {

                if (!controller) return;

                if (!tracks.length) return;


                currentTrack--;

                if (currentTrack < 0) {

                    currentTrack =
                        tracks.length - 1;

                }


                controller
                    .loadEntity(
                        tracks[currentTrack]
                    )
                    .then(function () {

                        return controller.play();

                    })
                    .catch(function (error) {

                        console.log(
                            'Error cargando canción anterior:',
                            error
                        );

                    });

            };


            /* =================================================
               CERRAR
            ================================================= */

            widget
                .querySelector(
                    '.spotify-relax-close'
                )
                .onclick = function () {

                    if (controller) {

                        try {

                            controller.pause();

                        } catch (e) {}

                    }


                    widget.remove();


                    document.body.style.paddingTop =
                        '';

                };


            /* =================================================
               CREAR REPRODUCTOR
            ================================================= */

            function createPlayer(IFrameAPI) {

                const element =
                    document.getElementById(
                        'spotify-relax-embed'
                    );

                if (!element) return;


                /*
                 * Si tenemos canciones, empezamos
                 * directamente por la primera.
                 *
                 * Si no, cargamos el álbum.
                 */

                const firstEntity =
                    tracks.length
                        ? tracks[0]
                        : albumUrl;


                IFrameAPI.createController(

                    element,

                    {
                        width: 1,
                        height: 1,
                        url: firstEntity
                    },

                    function (EmbedController) {

                        controller =
                            EmbedController;


                        controller.addListener(
                            'ready',
                            function () {

                                playerReady =
                                    true;


                                console.log(
                                    'Spotify preparado'
                                );


                                /*
                                 * Intentamos reproducir
                                 * porque acabamos de recibir
                                 * un clic del usuario.
                                 */

                                controller
                                    .play()
                                    .then(function () {

                                        console.log(
                                            '🎵 Música iniciada'
                                        );

                                    })
                                    .catch(function (error) {

                                        console.log(
                                            'Spotify bloqueó el autoplay:',
                                            error
                                        );

                                    });

                            }
                        );


                        /*
                         * Detectar qué pista está sonando.
                         */

                        controller.addListener(
                            'playback_started',
                            function (event) {

                                console.log(
                                    'Reproduciendo:',
                                    event.data.playingURI
                                );

                            }
                        );

                    }
                );

            }


            /* =================================================
               API SPOTIFY
            ================================================= */

            if (window.SpotifyIframeApi) {

                createPlayer(
                    window.SpotifyIframeApi
                );

                return;
            }


            /* =================================================
               API CARGÁNDOSE
            ================================================= */

            if (
                document.getElementById(
                    'spotify-iframe-api'
                )
            ) {

                window.onSpotifyIframeApiReady =
                    function (IFrameAPI) {

                        window.SpotifyIframeApi =
                            IFrameAPI;

                        createPlayer(
                            IFrameAPI
                        );

                    };

                return;
            }


            /* =================================================
               CARGAR API
            ================================================= */

            window.onSpotifyIframeApiReady =
                function (IFrameAPI) {

                    window.SpotifyIframeApi =
                        IFrameAPI;

                    createPlayer(
                        IFrameAPI
                    );

                };


            const script =
                document.createElement('script');

            script.id =
                'spotify-iframe-api';

            script.src =
                'https://open.spotify.com/embed/iframe-api/v1';

            script.async = true;

            document.head.appendChild(script);

        };

}


function updateAmazonAffiliateTags() {
  const domainTagMap = {
    "acelstore.es": "iphonesreacondicionados-21",
    "tusarten.es": "tusarten-21",
    "eleglide.es": "elecbici-21",
    "kloner.es": "portatiles0b-21",
    "tugrifodecocina.es": "grifosfregadero-21",
    "dedrones.es": "dedronesjulk-21"
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
      if (currentTag === protectedTag) return;
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
function inyectaTelegramFlotante() {
 
  const script = document.createElement("script");
   if (window.cfpais === "spain") {
       //script.src = "https://directorycircle.com/telegram/telegramflotante.php?canal=chollosamazoneshoy";
        script.src = "https://directorycircle.com/telegram/telegramflotante.php?canal=alvisevoxayuso";
      
   }else{
    var randi = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
    if (randi < 50) 
      script.src = "https://directorycircle.com/telegram/telegramflotante.php?canal=Mundo_Memess";
    else
      script.src = "https://directorycircle.com/telegram/telegramflotante.php?canal=ultimasnoticias24h";
   }
  script.async = true;
  
  document.head.appendChild(script);
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
      banners = ['<a href="https://www.amazon.es/amazonprime?tag=pyc03-21" target="_blank"><img src="http://bitelchux.github.io/amazonstudent.png" style="max-width:100%;height:auto;"></a>'];
    }
    if (window.location.hostname === "acelstorexxxx.es") {
      banners = ['<a href="https://track.effiliation.com/servlet/effi.click?id_compteur=23254999" target="_blank"><img src="https://track.effiliation.com/servlet/effi.show?id_compteur=23254999" style="max-width:100%;height:auto;"></a>'];
    }
    if (window.location.hostname === "cancionespronunciacionxxxx.com") {
      banners = ['<a href="https://amzn.to/4cA5qgQ" target="_blank"><img src="https://m.media-amazon.com/images/G/30/AmazonMusic/CatalogClaimChange_DMUX-6012/Associates/ES-ES_ClaimChange_ACQ_ASC_970x200_CV10.jpg" style="max-width:100%;height:auto;"></a>'];
    }

    const randomIndex = Math.floor(Math.random() * banners.length);
    footerBanner.innerHTML = banners[randomIndex];
    document.body.appendChild(footerBanner);
    document.body.style.paddingBottom = "100px";
  })();
}
function inyectaViads(){

    var pageUrl = encodeURIComponent("https://promocionesycolecciones.com/ofertas-amazon");
    var el = document.createElement('script');
    el.type = 'text/javascript';
    el.src = 'https://player.viads.com/tag/load-106536.js?page_url='+pageUrl;
    el.async = true;
    window.top.document.head.append(el);
 
}
function inyectaSmartLink() {
  var disallowedDomain = "docentestic.es";
  var popunders = [
    //adsterra
    "https://compiledonatevanity.com/yt94dzqqz?key=8c687ab6a953d34b9bee3ccbd9d06a4e",
    "https://compiledonatevanity.com/yt94dzqqz?key=8c687ab6a953d34b9bee3ccbd9d06a4e",
    "https://music.youtube.com/watch?v=wNgglJ6oWMY&list=OLAK5uy_lnLdv1bDsta5c7gcKxFbGr2ELt_97c53Q",
    //richads "https://11745.xml.4armn.com/direct-link-v2?pubid=798270&siteid=330240&linkid=2035",
    //monetag "https://omg10.com/4/10456283"
    //hilltopads
    //"https://fluffy-machine.com/GZpJ18"
  ];
  
  var popunder = {
      expire: 12,
      url: popunders[Math.floor(Math.random() * popunders.length)]
  };
 //  var popunder = { expire: 12, url: "https://www.crazygames.com/game/solitarie-rpg" };

  if (window.location.hostname !== disallowedDomain) {
    /*
    loadJS("https://www.dwin2.com/pub.963035.min.js"); //awin
     */
    !function () {
      var e, t = popunder.url || "http://google.com",
        n = "click",
        o = "popunder",
        c = popunder.clicks_num || 1,
        i = popunder.expire || 24,
        d = document.documentElement,
        u = "undefined",
        p = typeof popunder.path != u ? ";path=" + popunder.path : "",
        a = function () {
          0 === --c && (document.cookie.match(/(^|\W)popunder=1(\W|$)/) || (window.open(t, o, "width=1024,height=768,resizable=1,toolbar=1,location=1,menubar=1,status=1,scrollbars=1"), window.focus(), e = new Date, e.setTime(e.getTime() + 3600 * i * 1e3), document.cookie = o + "=1; expires=" + e.toGMTString() + p))
        };
      typeof d.addEventListener != u ? d.addEventListener(n, a, !1) : typeof d.attachEvent != u && d.attachEvent("on" + n, a)
    }();
  }
}

/* =========================
   BANNER OFERTAS
========================= */
function inyectaMiBannerChollo(tipo) {
  const APIs = [
    //"https://directorycircle.com/gruponofertas.php",
    "https://pbnstats.promocionesycolecciones.com/chollometro/json.php"
  ];

  var API = APIs[Math.floor(Math.random() * APIs.length)];
  if (tipo=="ES")
    API = "https://pbnstats.promocionesycolecciones.com/chollometro/json.php";
  else
    API = "https://pbnstats.promocionesycolecciones.com/chollometro/aliexpress.php";
  if (window.location.hostname === "acelstorexxx.es") {
    API = "https://bitelchux.github.io/acelstore.json";
  }
  if (window.location.hostname === "docentestiddddc.es") {
    API = "https://bitelchux.github.io/docentestic.json";
  }
  if (window.location.hostname === "dedronesxxx.es") {
    API = "https://bitelchux.github.io/dedrones.json";
  }
  if (document.getElementById("offer-banner")) return;

  const style = document.createElement("style");
  style.textContent = `
    #offer-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      z-index: 9999998;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.4s ease;
    }
    #offer-interstitial {
      background: #111;
      color: #fff;
      border-radius: 16px;
      width: 92%;
      max-width: 460px;
      overflow: hidden;
      font-family: Arial, sans-serif;
      position: relative;
      cursor: pointer;
      transform-origin: center bottom;
      transition: transform 0.65s cubic-bezier(.4,0,.2,1), opacity 0.5s ease;
    }
    #offer-int-img {
      width: 100%;
      height: 220px;
      object-fit: cover;
      display: block;
      background: #222;
    }
    #offer-int-body {
      padding: 16px 18px 20px;
    }
    #offer-int-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
    }
    .int-badge-amazon {
      background: #FF9900;
      color: #111;
      font-size: 11px;
      font-weight: 800;
      padding: 3px 9px;
      border-radius: 999px;
    }
    #offer-int-price {
      background: #e00;
      color: #fff;
      font-size: 14px;
      font-weight: 800;
      padding: 4px 12px;
      border-radius: 999px;
    }
    #offer-int-title {
      font-size: 16px;
      font-weight: 700;
      line-height: 1.35;
      margin-bottom: 8px;
      color: #fff;
    }
    #offer-int-desc {
      font-size: 12px;
      color: #aaa;
      line-height: 1.6;
      margin-bottom: 16px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    #offer-int-cta {
      display: block;
      width: 100%;
      background: #FFD000;
      color: #111;
      text-align: center;
      font-weight: 800;
      font-size: 15px;
      padding: 13px;
      border-radius: 10px;
      text-decoration: none;
    }
    #offer-close-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0,0,0,0.55);
      border: none;
      color: #fff;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      font-size: 15px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }
    #offer-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background: #0f0f0f;
      color: #fff;
      z-index: 999999;
      font-family: Arial;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      gap: 12px;
      cursor: pointer;
      opacity: 0;
      transform: translateY(100%);
      transition: opacity 0.45s ease, transform 0.5s cubic-bezier(.4,0,.2,1);
    }
     #offer-banner div {
        margin:8px auto;
     }
      #offer-banner .offer-telegram a{
        text-decoration:none !important;
        color:white !important;
      }
      #offer-banner .offer-telegram svg{
        max-width: 20px;
      }
     #offer-banner .offer-telegram{
        background: #229ed9;
        white-space: nowrap;
        padding: 4px 10px;
        border-radius: 999px;
        font-weight: 800;
        text-align: center;
        width: 200px;
     }
    #offer-banner.visible {
      opacity: 1;
      transform: translateY(0);
    }
    #offer-banner .offer-left { display: flex; align-items: center; gap: 12px; }
    #offer-banner .offer-img {
      width: 130px;
      height: 80px;
      object-fit: cover;
      border-radius: 4px;
    }
    #offer-banner .offer-title { font-size: 14px; font-weight: 700; }
    #offer-banner .offer-price {
      
      background: #ff2d2d;
      padding: 4px 10px;
      border-radius: 999px;
      font-weight: 800;
      text-align: center;
      width: fit-content;
    }
    #offer-banner .offer-cta {
      background: #ffd000;
      padding: 10px 14px;
      border-radius: 10px;
      font-weight: 800;
      text-decoration: none;
      color: #000;
      white-space: nowrap;
    }
    #offer-banner .offer-ticker {
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      margin: 0 10px;
    }
    #offer-banner .offer-ticker span {
      display: inline-block;
      padding-left: 100%;
      animation: ticker 18s linear infinite;
      color: #ccc;
      font-size: 13px;
    }
    @keyframes ticker {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-100%); }
    }
    @media(max-width: 700px) {
      #offer-banner .offer-ticker,
      #offer-banner .offer-cta { display: none; }
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.id = "offer-overlay";

  const interstitial = document.createElement("div");
  interstitial.id = "offer-interstitial";
  interstitial.innerHTML = `
    <img id="offer-int-img" src="" alt="">
    <div id="offer-int-body">
      <div id="offer-int-meta">
        <span class="int-badge-amazon">Amazon</span>
        <span id="offer-int-price"></span>
      </div>
      <div id="offer-int-title">Cargando oferta…</div>
      <div id="offer-int-desc"></div>
      <a id="offer-int-cta" href="#" target="_blank">Ver oferta en Amazon →</a>
    </div>
    <button id="offer-close-btn" aria-label="Cerrar">✕</button>
  `;
  overlay.appendChild(interstitial);
  document.body.appendChild(overlay);

  const banner = document.createElement("div");
  banner.id = "offer-banner";
  document.body.appendChild(banner);

  function cerrarIntersticial() {
    const rect = interstitial.getBoundingClientRect();
    const distancia = window.innerHeight - rect.top + 20;
    interstitial.style.transform = `translateY(${distancia}px) scaleX(0.9) scaleY(0.6)`;
    interstitial.style.opacity = "0";
    overlay.style.opacity = "0";
    setTimeout(() => {
      overlay.style.display = "none";
      banner.classList.add("visible");
      document.body.style.paddingBottom = "100px";
    }, 600);
  }

  document.getElementById("offer-close-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    cerrarIntersticial();
  });

  const autoClose = setTimeout(cerrarIntersticial, 6000);

  fetch(API)
    .then(r => r.json())
    .then(data => {
      const item = Array.isArray(data)
        ? data[Math.floor(Math.random() * data.length)]
        : data;

      let price = item.display_price || item.search_price || "";
      if (!price.toString().includes("€")) price += " €";
      const url = item.aw_deep_link;

      document.getElementById("offer-int-img").src = item.merchant_image_url;
      document.getElementById("offer-int-title").textContent = item.product_name;
      document.getElementById("offer-int-price").textContent = "💰 " + price;
      document.getElementById("offer-int-desc").textContent = item.description || "";
      document.getElementById("offer-int-cta").href = url;

      interstitial.onclick = (e) => {
        if (e.target.closest("#offer-close-btn")) return;
        clearTimeout(autoClose);
        window.open(url, "_blank");
        cerrarIntersticial();
      };

      banner.innerHTML = `
        <div class="offer-left">
          <img class="offer-img" src="${item.merchant_image_url}">
          <div>
            <div class="offer-title">${item.product_name}</div>
            <div class="offer-price">💰 ${price}</div>
            <div class="offer-telegram"><a  href="https://t.me/chollosamazoneshoy" target="_blank" rel="noopener"> <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"></path></svg>
            Canal de chollos
            </a></div>
          </div>
        </div>
        <div class="offer-ticker">
          <span>${item.description || ""}</span>
        </div>
        <a class="offer-cta" target="_blank" href="${url}">Ver oferta →</a>
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

function loadJS(src, attrs = {}) {
    const s = document.createElement("script");
    s.src = src;
    for (const k in attrs) s.setAttribute(k, attrs[k]);
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
/**
 * Botón sticky "Comprar en Amazon"
 * ------------------------------------------------------------
 * Genera automáticamente un enlace de búsqueda en Amazon.es usando
 * el título de la página (document.title) y añade tu tag de afiliado.
 *
 * Uso: incluye este archivo en tu web (antes de </body>).
 *
 *   <script src="amazon-sticky-button.js" defer></script>
 *
 * Ejemplo: título de página "Bicicleta eléctrica Eleglide C1" →
 *   https://www.amazon.es/s?k=Bicicleta+el%C3%A9ctrica+Eleglide+C1&tag=elecbici-21
 */
/**
 * Botón sticky "Comprar en Amazon"
 * ------------------------------------------------------------
 * Genera automáticamente un enlace de búsqueda en Amazon.es usando
 * el título de la página (document.title) y añade tu tag de afiliado.
 *
 * Uso: incluye este archivo en tu web (antes de </body>).
 *
 *   <script src="amazon-sticky-button.js" defer></script>
 *
 * Ejemplo: título de página "Bicicleta eléctrica Eleglide C1" →
 *   https://www.amazon.es/s?k=Bicicleta+el%C3%A9ctrica+Eleglide+C1&tag=elecbici-21
 */
function initAmazonStickyButton(affiliateTag) {
  'use strict';

  var AFFILIATE_TAGX = affiliateTag || 'elecbici-21';
  var AMAZON_DOMAIN  = 'https://www.amazon.es/s';

  var title = (document.title || '').trim();
  if (!title) return; // sin título no hay búsqueda fiable que generar

  var url = AMAZON_DOMAIN + '?k=' + encodeURIComponent(title) +
            '&tag=' + encodeURIComponent(AFFILIATE_TAGX);

  var safeTitle = title
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // ── Estilos ────────────────────────────────────────────────
  var css = [
    '#amz-sticky-bar{position:fixed;left:0;right:0;bottom:0;z-index:2147483000;',
    'display:flex;justify-content:center;padding:12px 16px;',
    'background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,.15) 100%);',
    'pointer-events:none;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;}',

    '#amz-sticky-btn{pointer-events:auto;display:inline-flex;align-items:center;gap:10px;',
    'background:#FF9900;color:#111;font-size:16px;font-weight:700;text-decoration:none;',
    'padding:14px 28px;border-radius:50px;box-shadow:0 6px 18px rgba(0,0,0,.25);',
    'border:2px solid #e88a00;transition:transform .15s ease,box-shadow .15s ease;',
    'animation:amz-pulse 2.2s ease-in-out infinite;max-width:92vw;}',

    '#amz-sticky-btn:hover{transform:translateY(-3px) scale(1.03);',
    'box-shadow:0 10px 24px rgba(0,0,0,.3);background:#ffa722;}',

    '#amz-sticky-btn:active{transform:translateY(0) scale(.98);}',

    '#amz-sticky-btn svg{flex:0 0 auto;width:20px;height:20px;}',

    '#amz-sticky-btn span.amz-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',

    '@keyframes amz-pulse{',
    '0%,100%{box-shadow:0 6px 18px rgba(255,153,0,.35);}',
    '50%{box-shadow:0 6px 26px rgba(255,153,0,.75);}',
    '}',

    '@media (max-width:480px){',
    '#amz-sticky-btn{font-size:14px;padding:12px 20px;}',
    '}'
  ].join('');

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ── Botón ──────────────────────────────────────────────────
  var bar = document.createElement('div');
  bar.id = 'amz-sticky-bar';

  var link = document.createElement('a');
  link.id = 'amz-sticky-btn';
  link.href = url;
  link.target = '_blank';
  link.rel = 'nofollow sponsored noopener';

  link.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M6 6h12l1.5 12.5a2 2 0 0 1-2 2.2H6.5a2 2 0 0 1-2-2.2L6 6Z" stroke="#111" stroke-width="1.6"/>' +
    '<path d="M9 6a3 3 0 0 1 6 0" stroke="#111" stroke-width="1.6"/>' +
    '</svg>' +
    '<span class="amz-label">Comprar ' + safeTitle + '</span>';

  bar.appendChild(link);
  document.body.appendChild(bar);
}

/* =========================
   MAIN INIT
========================= */
(function () {
  setTimeout(updateAmazonAffiliateTags, 2000);
  if (window.conadsense != undefined) return;
  if (window.adsbygoogle != undefined) return;
  //inyectaTelegramFlotante();
  

     
  if (window.cfpais === "spain") {
    if (window.location.hostname !== "eleglide.es") {
      loadJS("https://bitelchux.github.io/facha.js");
      inyectaMiBannerChollo("ES");
    }else{
      initAmazonStickyButton();
    }
  } else {
    //addSpotifyRelax();
      //inyectaTelegramFlotante();
inyectaTelegramFlotante();
    //inyectaMiBannerChollo("XX");
    inyectaSmartLink();
    
    /*
    loadJS("https://js.wpadmngr.com/static/adManager.js", { "data-admpid": "456594"});
     inyectaViads();
    const n = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
    if (n < 50) {
      inyectaMiBanner();
    } else {
      inyectavideo();
    }
    */
  }
  //impact
  //(function(i,m,p,a,c,t){c.ire_o=p;c[p]=c[p]||function(){(c[p].a=c[p].a||[]).push(arguments)};t=a.createElement(m);var z=a.getElementsByTagName(m)[0];t.async=1;t.src=i;z.parentNode.insertBefore(t,z)})('https://utt.impactcdn.com/P-A2324750-5eb4-40da-b87c-329d5292774c1.js','script','impactStat',document,window);impactStat('trackImpression');
  if (window.beebomstats==undefined){
    loadJS("https://bitelchux.github.io/beebomstats.js");
  }
})();
