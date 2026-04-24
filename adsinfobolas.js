// ---------------- CONFIG ----------------
const LS_KEY = "age_18_confirmed";

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

// ---------------- RANDOM ADS ----------------
function loadRandomAds() {
    // ADS https://app.datify.link/admin/dashboard botijonline esta como fallback de popads https://letsfuntogethernow.com/fMxSjrKT?aid=gzdahdgkaa&kid=hgfxkxgpkdk

    // EJecuta popads.net siempre
    (function(){var f=window,z="d30a423e37fe9b7888b7e8f56a20e472",m=[["siteId",888+286-525+4934866],["minBid",0.0005],["popundersPerIP","0"],["delayBetween",0],["default","https://letsfuntogethernow.com/fMxSjrKT?aid=gzdahdgkaa&kid=hgfxkxgpkdk"],["defaultPerDay",0],["topmostLayer","auto"]],i=["d3d3LmludGVsbGlnZW5jZWFkeC5jb20vVmV4d3IveHR4dC53YXYubWluLmpz","ZDJrbHg4N2Jnem5nY2UuY2xvdWRmcm9udC5uZXQvTC9QRWlYeHgvdGNhbnZhcy10by1ibG9iLm1pbi5jc3M="],t=-1,r,n,w=function(){clearTimeout(n);t++;if(i[t]&&!(1802936929000<(new Date).getTime()&&1<t)){r=f.document.createElement("script");r.type="text/javascript";r.async=!0;var k=f.document.getElementsByTagName("script")[0];r.src="https://"+atob(i[t]);r.crossOrigin="anonymous";r.onerror=w;r.onload=function(){clearTimeout(n);f[z.slice(0,16)+z.slice(0,16)]||w()};n=setTimeout(w,5E3);k.parentNode.insertBefore(r,k)}};if(!f[z]){try{Object.freeze(f[z]=m)}catch(e){}w()}})();
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

        // Adsterra
        () => loadJS("https://compiledonatevanity.com/e8/e9/23/e8e9237d7e6c9674010946d09842f465.js"),

        // JuicyAds
        () => loadJS("//js.juicyads.com/jp.php?c=34e4y213q274u4q2x294x26444"),

        // Hilltop
        () => loadJS("//glossyrun.com/c.Df9F6Fb/2/5llNSWWeQQ9iNBjlY/5AN/Dqg-5jOBCC0W2KNijOko0QO/DUkg5u")
    ];

    // Mezclar array
    const shuffled = ads.sort(() => 0.5 - Math.random());

    // Cargar solo 2
    shuffled.slice(0, 2).forEach(fn => fn());
}

// ---------------- INIT ----------------
window.addEventListener("load", () => {

    setTimeout(() => {

        checkAge((isAdult) => {
            if (isAdult) {
                loadRandomAds(); // 👈 SOLO 2 ADS ALEATORIOS
            }
        });

    }, 1000);

});
