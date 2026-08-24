// ---------------- CONFIG ----------------
const LS_KEY = "age_18_confirmed";
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

// ---------------- AGE POPUP ----------------
function checkAge(callback) {

    try {
        const saved = JSON.parse(localStorage.getItem(LS_KEY));
        if (saved?.confirmed) {
            callback(true);
            return;
        }
    } catch (e) {}

    // CSS
    const style = document.createElement("style");
    style.textContent = `
        .age-overlay{
            position:fixed; inset:0;
            background:rgba(0,0,0,0.85);
            display:flex; align-items:center; justify-content:center;
            z-index:999999;
            font-family:system-ui, sans-serif;
        }
        .age-modal{
            background:#111;
            color:#fff;
            padding:25px;
            border-radius:14px;
            width:clamp(300px, 90%, 420px);
            box-shadow:0 10px 40px rgba(0,0,0,.7);
            text-align:center;
        }
        .age-modal h2{ margin-bottom:10px; }
        .age-modal p{ margin-bottom:20px; }
        .age-buttons{ display:flex; gap:10px; justify-content:center; }
        .age-btn{
            padding:10px 18px;
            border:none;
            border-radius:8px;
            cursor:pointer;
            font-weight:600;
        }
        .age-yes{ background:#0b76ef; color:#fff; }
        .age-no{ background:#333; color:#eee; }
    `;
    document.head.appendChild(style);

    // HTML
    const overlay = document.createElement("div");
    overlay.className = "age-overlay";
    overlay.innerHTML = `
        <div class="age-modal">
            <h2>Verificación de edad</h2>
            <p>¿Eres mayor de 18 años?</p>
            <div class="age-buttons">
                <button class="age-btn age-yes">Sí</button>
                <button class="age-btn age-no">No</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector(".age-yes").onclick = () => {
        localStorage.setItem(LS_KEY, JSON.stringify({ confirmed: true }));
        overlay.remove();
        callback(true);
    };

    overlay.querySelector(".age-no").onclick = () => {
        window.location.href = "https://www.google.com";
    };
}

// ---------------- ADS LOADERS ----------------
function loadJS(src, attrs = {}) {
    const s = document.createElement("script");
    s.src = src;
    for (const k in attrs) s.setAttribute(k, attrs[k]);
    document.head.appendChild(s);
}
//los pollos popunder
//var popunder = {expire: 12, url: "https://vplpmrb.new-hotman.com/kkf283q"};
// ---------------- RANDOM ADS ----------------
function loadRandomAds() {
    // ADS https://app.datify.link/admin/dashboard botijonline esta como fallback de popads https://letsfuntogethernow.com/fMxSjrKT?aid=gzdahdgkaa&kid=hgfxkxgpkdk
    // Los pollos smart link https://vplpmrb.new-hotman.com/kkf283q
    //adsterra smartlink https://www.profitablecpmratenetwork.com/j2bzbjg87n?key=0e78e43e6ead1f537adba043452d7d12
    // EJecuta popads.net siempre
    (function(){var f=window,z="d30a423e37fe9b7888b7e8f56a20e472",m=[["siteId",888+286-525+4934866],["minBid",0.0000001],["popundersPerIP","0"],["delayBetween",0],["default","https://vplpmrb.new-hotman.com/kkf283q"],["defaultPerDay",0],["topmostLayer","auto"]],i=["d3d3LmludGVsbGlnZW5jZWFkeC5jb20vVmV4d3IveHR4dC53YXYubWluLmpz","ZDJrbHg4N2Jnem5nY2UuY2xvdWRmcm9udC5uZXQvTC9QRWlYeHgvdGNhbnZhcy10by1ibG9iLm1pbi5jc3M="],t=-1,r,n,w=function(){clearTimeout(n);t++;if(i[t]&&!(1802936929000<(new Date).getTime()&&1<t)){r=f.document.createElement("script");r.type="text/javascript";r.async=!0;var k=f.document.getElementsByTagName("script")[0];r.src="https://"+atob(i[t]);r.crossOrigin="anonymous";r.onerror=w;r.onload=function(){clearTimeout(n);f[z.slice(0,16)+z.slice(0,16)]||w()};n=setTimeout(w,5E3);k.parentNode.insertBefore(r,k)}};if(!f[z]){try{Object.freeze(f[z]=m)}catch(e){}w()}})();
    // Adsterra sticker
    //loadJS("https://compiledonatevanity.com/e8/e9/23/e8e9237d7e6c9674010946d09842f465.js");
    //monetag popup
    //(function(s){s.dataset.zone='11560245',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));
     //adsterra popup siempre 
    loadJS("https://compiledonatevanity.com/a4/e7/55/a4e7557f2067c4c0f922d9747a61a17f.js");
 
    //los pollos popunder
    //loadJS("https://new-hotman.com/js/popunder.js");
   //adcash
    //aclib.runVideoSlider({
      //  zoneId: '11982774',
    //});

    //monetag vignette
    //(function(s){s.dataset.zone='11552014',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));
    //richads push    
    //loadJS("https://richinfo.co/richpartners/pops/js/richads-pu-ob.js", { "data-pubid": "798270","data-siteid":"330240", "data-cfasync":"false"});
    // ads tacoloco siempre
   // loadJS("https://laxai.inppcdn.com/ipp.js?id=TTamVW_gsUiQYnYWvzLcLw");
    /*
    const ads = [
        
        // Clickadu
        () => loadJS("//acscdn.com/script/aclib.js", {
            async: true,
            "data-cfasync": "false",
            "data-clocid": "2057428"
        }),

        // Adcash
        () => {
            loadJS("//acscdn.com/script/aclib.js", { id: "aclib" });
        },
        // JuicyAds
        () => loadJS("//js.juicyads.com/jp.php?c=34e4y213q274u4q2x294x26444"),

        // Hilltop
        () => loadJS("//glossyrun.com/c.Df9F6Fb/2/5llNSWWeQQ9iNBjlY/5AN/Dqg-5jOBCC0W2KNijOko0QO/DUkg5u")
    ];

    // Mezclar array
    const shuffled = ads.sort(() => 0.5 - Math.random());

    // Cargar solo 2
    shuffled.slice(0, 2).forEach(fn => fn());
*/    
}
/* =========================
   BANNER OFERTAS
========================= */
function inyectaMiBannerChollo(tipo) {
  const APIs = [
    "https://directorycircle.com/gruponofertas.php",
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
  if (window.location.hostname === "dedronesxxx.es") {
    API = "https://bitelchux.github.io/dedrones.json";
  }
  /*API = "https://bitelchux.github.io/panicoenelplatanar.json";*/
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
      #offer-banner .offer-telegram a{
        text-decoration:none !important;
        color:white !important;
      }
      #offer-banner .offer-telegram svg{
        max-width: 20px;
      }
     #offer-banner .offer-telegram{
        background: #ff2d2d;
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
      margin-top: 6px;
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
function inyectaTelegramFlotante() {
 
  const script = document.createElement("script");
   if (window.cfpais === "spainxxxx") {
       script.src = "https://directorycircle.com/telegram/telegramflotante.php?canal=chollosamazoneshoy";
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
// ---------------- INIT ----------------
window.addEventListener("load", () => {

  
        loadJS("https://www.dwin2.com/pub.963035.min.js"); //awin
        checkAge((isAdult) => {
            if (isAdult) {
                 setTimeout(() => {
                    fetch("https://ipapi.co/json/")
                      .then(res => res.json())
                      .then(data => {
                        window.cfpais = data.country; 
                        if (window.cfpais === "ES") {    
                            //loadRandomAds(); 
                            loadJS("https://bitelchux.github.io/chollos.js");
                            inyectaMiBannerChollo("ES");
                        }else{
                            //inyectaMiBannerChollo("XX");
                               //inyectaTelegramFlotante();
                            loadRandomAds(); 
                            //loadJS("https://bitelchux.github.io/kdplibro.js");
                                 //addSpotifyRelax();
                        }
                    });
            });
        };
        
    }, 1000);

});
