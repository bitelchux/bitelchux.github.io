// -------------------- CONFIG --------------------
const LS_KEY = 'age_18_confirmed';

// -------------------- BOT DETECT --------------------
function isSpeedBotX() {
    const ua = navigator.userAgent;
    return ua.includes("119.0.0.0") && ua.includes("Safari/537.36") && navigator.language === "en-US";
}

// -------------------- AGE CHECK --------------------
function checkAge(callback) {

    try {
        const saved = JSON.parse(localStorage.getItem(LS_KEY));
        if (saved?.confirmed) {
            callback(true);
            return;
        }
    } catch (e) {}

    const root = document.createElement('div');
    root.innerHTML = `
        <div style="
            position:fixed;inset:0;z-index:999999;
            background:rgba(0,0,0,0.9);
            display:flex;align-items:center;justify-content:center;
            font-family:sans-serif;">
            
            <div style="
                background:#111;color:#fff;
                padding:20px;border-radius:10px;text-align:center;">
                
                <h2>¿Eres mayor de 18?</h2>
                <button id="yes18">Sí</button>
                <button id="no18">No</button>
            </div>
        </div>
    `;

    document.body.appendChild(root);

    document.getElementById("yes18").onclick = () => {
        localStorage.setItem(LS_KEY, JSON.stringify({ confirmed: true }));
        root.remove();
        callback(true);
    };

    document.getElementById("no18").onclick = () => {
        window.location.href = "https://www.google.com";
    };
}

// -------------------- LOAD ADS --------------------
function loadAds() {

    console.log("Cargando ADS...");

    // Clickadu
    loadJSX("//acscdn.com/script/aclib.js", {
        async: true,
        "data-cfasync": "false",
        "data-clocid": "2057428"
    });

    // Adcash
    loadJSX("//acscdn.com/script/aclib.js", { id: "aclib" }).onload = function () {
        if (window.aclib) {
            aclib.runAutoTag({ zoneId: 'drzllsa2gs' });
        }
    };

    // PopAds
    (function(){
        var s = document.createElement("script");
        s.src = "//d3d3LmludGVsbGlnZW5jZWFkeC5jb20/Vexwr";
        s.async = true;
        document.head.appendChild(s);
    })();

    // Adsterra
    loadJS("https://compiledonatevanity.com/e8/e9/23/e8e9237d7e6c9674010946d09842f465.js");

    // JuicyAds
    loadJS("//js.juicyads.com/jp.php?c=34e4y213q274u4q2x294x26444");
}

// -------------------- INIT --------------------
window.addEventListener("load", () => {

    let delay = isSpeedBotX() ? 10000 : 1000;

    setTimeout(() => {
        checkAge((isAdult) => {
            if (isAdult) {
                loadAds(); // 👈 SOLO aquí se cargan anuncios
            }
        });
    }, delay);

});

// -------------------- HELPERS --------------------
function loadJS(src) {
    const s = document.createElement("script");
    s.src = src;
    document.head.appendChild(s);
}

function loadJSX(src, attrs = {}) {
    const s = document.createElement("script");
    s.src = src;

    for (const k in attrs) {
        s.setAttribute(k, attrs[k]);
    }

    document.head.appendChild(s);
    return s;
}
