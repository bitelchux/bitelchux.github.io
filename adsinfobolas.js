function isSpeedBotX(){
		
		if( navigator.userAgent.indexOf("119.0.0.0")>=1 && navigator.userAgent.indexOf("Safari/537.36")>=1 && navigator.language=="en-US"){
			//document.writeln("<h1>"+navigator.language+"</h1>" );
			
			return true;
		}
		else 
			return false;
	}
function tienesmasde18(){
	(function(){
		  const LS_KEY = 'aviso_mayor18_confirmed_v2';
		
		  function detectLang() {
		    const navLang = (navigator.language || '').toLowerCase();
		    if (navLang.startsWith('es')) return 'es';
		    const ua = (navigator.userAgent || '').toLowerCase();
		    if (ua.includes('spanish') || ua.includes('es-') || ua.includes('español')) return 'es';
		    return 'en';
		  }
		
		  const lang = detectLang();
		  const TEXT = {
		    es: {
		      title: 'Verificación de edad',
		      message: '¿Eres mayor de 18 años?',
		      confirm: 'Sí, soy mayor de 18',
		      deny: 'No soy mayor de 18',
		      remember: 'Recordarme'
		    },
		    en: {
		      title: 'Verificación de edad',
		      message: '¿Eres mayor de 18 años?',
		      confirm: 'Sí, soy mayor de 18',
		      deny: 'No soy mayor de 18',
		      remember: 'Recordarme'
		    }
		  };
		  const t = TEXT[lang];
		
		  try {
		    const saved = JSON.parse(localStorage.getItem(LS_KEY));
		    if (saved?.confirmed) {
		      return;
		    }
		  } catch(e){}
		
		  const css = `
		  .age-root{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;}
		  .age-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(2px);}
		  .age-modal{position:relative;z-index:2;width:clamp(300px,80%,500px);
		     padding:22px;background:#111;color:#f1f1f1;border-radius:14px;
		     box-shadow:0 8px 35px rgba(0,0,0,0.7);font-family:system-ui, sans-serif;}
		  .age-title{font-size:1.35rem;font-weight:600;margin-bottom:10px;}
		  .age-msg{font-size:1.05rem;margin-bottom:20px;}
		  .age-actions{display:flex;flex-wrap:wrap;gap:10px;justify-content:flex-end;}
		  .age-btn{padding:10px 16px;border-radius:8px;border:0;cursor:pointer;font-weight:600;}
		  .age-btn-ok{background:#0b76ef;color:white;}
		  .age-btn-no{background:#333;color:#eee;}
		  .age-remember{display:flex;align-items:center;gap:7px;margin-right:auto;font-size:0.9rem;}
		  `;
		  
		  const style = document.createElement('style');
		  style.textContent = css;
		  document.head.appendChild(style);
		
		  const root = document.createElement('div');
		  root.className = 'age-root';
		
		  const overlay = document.createElement('div');
		  overlay.className = 'age-overlay';
		
		  const modal = document.createElement('div');
		  modal.className = 'age-modal';
		
		  modal.innerHTML = `
		    <div class="age-title">${t.title}</div>
		    <div class="age-msg">${t.message}</div>
		  `;
		
		  const remember = document.createElement('label');
		  remember.className = 'age-remember';
		  const chk = document.createElement('input');
		  chk.type = 'checkbox';
		  chk.checked = true;
		  remember.appendChild(chk);
		  remember.append(t.remember);
		
		  const btnNo = document.createElement('button');
		  btnNo.className = 'age-btn age-btn-no';
		  btnNo.textContent = t.deny;
		
		  const btnOk = document.createElement('button');
		  btnOk.className = 'age-btn age-btn-ok';
		  btnOk.textContent = t.confirm;
		
		  const actions = document.createElement('div');
		  actions.className = 'age-actions';
		  actions.append(remember, btnNo, btnOk);
		
		  modal.appendChild(actions);
		
		  root.append(overlay, modal);
		  document.body.appendChild(root);
		
		  const prev = document.documentElement.style.overflow;
		  document.documentElement.style.overflow = 'hidden';
		
		  function close() {
		    root.remove();
		    document.documentElement.style.overflow = prev;
		  }
		
		  function save(c) {
		    if (chk.checked) {
		      try { localStorage.setItem(LS_KEY, JSON.stringify({confirmed: c, ts: Date.now()})); }
		      catch(e){}
		    }
		  }
		
		  btnOk.onclick = () => {
		    save(true);
		    close();
		  };
		
		  btnNo.onclick = () => {
		    save(false);
		    window.location.href = "https://www.google.com";
		  };
		})();
}
 window.onload = function(){

   var time=10;
   if (isSpeedBotX())
      time=10000;
   setTimeout(loadAfterTime, time);

};
var juicy_adzone = '1037514';
function loadAfterTime(source) {
	tienesmasde18();
	/*
	loadJS2("//ss.mrmnd.com/dynamic.js","4923d013-8239-4362-985e-a017c5023cb8");
	loadJS2("//ss.mrmnd.com/dynamic.js","a5d11fd3-d6d7-4261-8b24-636bc8f420e8");
	loadJS2("//ss.mrmnd.com/dynamic.js","ea51f9fc-365f-4a9d-ba21-5f2635ae5179");
	loadJS("https://ss.mrmnd.com/static/6f6e6f72-a43e-4731-93e9-df1df5076ecd.js");
	*/
	/*admaven push loadJS("https://d1i4rchxg0yau7.cloudfront.net/?hcrid=1181078"); */
	/*admaven loadJS("//1i4rchxg0yau7.cloudfront.net/?hcrid=1181078"); */
	/*https://www.cpmturbo.com
    loadJS("//www.effectivegatecpm.com/x2nex92iwf?key=b89c05ae6b9ffb4eda9e5b1dd4b1c1d2");
	*/
	
	/*
		(function(w,d,o,g,r,a,m){
		var cid=(Math.random()*1e17).toString(36);d.write('<div id="'+cid+'" ></div>');
		w[r]=w[r]||function(){(w[r+'l']=w[r+'l']||[]).push(arguments)};
		function e(b,w,r){if((w[r+'h']=b.pop())&&!w.ABN){
		var a=d.createElement(o),p=d.getElementsByTagName(o)[0];a.async=1;a.setAttribute('data-cfasync','false');
		a.src='https://cdn.'+w[r+'h']+'/libs/e.js';a.onerror=function(){e(g,w,r)};
		p.parentNode.insertBefore(a,p)}}e(g,w,r);
		w[r](cid,{id:909627184,domain:w[r+'h']});
		})(window,document,'script',['adsbetnet.com'],'ABNS');
		
		(function(w,d,o,g,r,a,m){
		var cid=(Math.random()*1e17).toString(36);d.write('<div id="'+cid+'" ></div>');
		w[r]=w[r]||function(){(w[r+'l']=w[r+'l']||[]).push(arguments)};
		function e(b,w,r){if((w[r+'h']=b.pop())&&!w.ABN){
		var a=d.createElement(o),p=d.getElementsByTagName(o)[0];a.async=1;a.setAttribute('data-cfasync','false');
		a.src='https://cdn.'+w[r+'h']+'/libs/e.js';a.onerror=function(){e(g,w,r)};
		p.parentNode.insertBefore(a,p)}}e(g,w,r);
		w[r](cid,{id:981791016,domain:w[r+'h']});
		})(window,document,'script',['adsbetnet.com'],'ABNS');
	*/	
	
	var randi=Math.floor(Math.random() * 101);
	/*if (randi<20) {*/
		(function(){var b=window,n="d30a423e37fe9b7888b7e8f56a20e472",c=[["siteId",5*879*873-763+117+1099326],["minBid",0.0001],["popundersPerIP","0"],["delayBetween",0],["default","https://telegram.openinapp.co/7myyn"],["defaultPerDay",0],["topmostLayer","auto"]],l=["d3d3LmludGVsbGlnZW5jZWFkeC5jb20vUldZcUttL3lqcXVlcnkubGV0dGVyaW5nLm1pbi5qcw==","ZDJrbHg4N2Jnem5nY2UuY2xvdWRmcm9udC5uZXQvTXdHSE0vdi90c3dpdGNoeS5taW4uY3Nz"],i=-1,h,z,f=function(){clearTimeout(z);i++;if(l[i]&&!(1766049660000<(new Date).getTime()&&1<i)){h=b.document.createElement("script");h.type="text/javascript";h.async=!0;var d=b.document.getElementsByTagName("script")[0];h.src="https://"+atob(l[i]);h.crossOrigin="anonymous";h.onerror=f;h.onload=function(){clearTimeout(z);b[n.slice(0,16)+n.slice(0,16)]||f()};z=setTimeout(f,5E3);d.parentNode.insertBefore(h,d)}};if(!b[n]){try{Object.freeze(b[n]=c)}catch(e){}f()}})();
	/*}else if (randi<40) {*/
		/*hilltopads video*/
		(function(vcdtls){
			var d = document,
			    s = d.createElement('script'),
			    l = d.scripts[d.scripts.length - 1];
			s.settings = vcdtls || {};
			s.src = "\/\/snarlingrequirement.com\/bpXqVSswd.GflI0eYwWdcq\/Fegmo9\/u\/ZmUEl\/kaPTT\/YxwhN\/T\/YBy\/Ntj\/gXtxNcjWAO1\/Nij_IH2\/OaQm";
			s.async = true;
			s.referrerPolicy = 'no-referrer-when-downgrade';
			l.parentNode.insertBefore(s, l);
			})({})
	/*}else if (randi<60) {*/
		loadJS("//pl18385895.profitablegatecpm.com/e8/e9/23/e8e9237d7e6c9674010946d09842f465.js");
		loadJS("//pl18385961.profitablegatecpm.com/a4/e7/55/a4e7557f2067c4c0f922d9747a61a17f.js");
	/*}else if (randi<80) {*/
		loadJS("//js.juicyads.com/jp.php?c=34e4y213q274u4q2x294x26444&u=http%3A%2F%2Fwww.juicyads.rocks");
		loadJS("//poweredby.jads.co/js/jfc.js");
	/*}else if (randi<102) {*/		
			/* trafficstars popup*/
			loadJSX("//cdn.tsyndicate.com/sdk/v1/p.js", {
			    "data-ts-spot": "b07a926c7d0b4f6198b278302abdec0c",
			    "data-ts-extid": "{extid}",
			    async: "",
			    defer: ""
			});
			/* trafficstars inters*/
			loadCSS("//cdn.tsyndicate.com/sdk/v1/interstitial.ts.css");
			const interstitial = loadJS("//cdn.tsyndicate.com/sdk/v1/interstitial.ts.js");
			interstitial.onload = function () {
			    InterstitialTsAd({
			        spot: "d4855591409845028a317401c5e578b0",
			        extid: "{extid}"
			    });
			};
			/* trafficstars push*/
			const inpagePush = loadJS("//cdn.tsyndicate.com/sdk/v1/inpage.push.js");
			inpagePush.onload = function () {
			    TsInPagePush({
			        spot: "e6434178000d48449787deeceafc222b",
			        verticalPosition: "bottom"
			    });
			};
	/*}*/
	loadJS("//www.freeprivacypolicy.com/public/cookie-consent/4.1.0/cookie-consent.js");
	document.addEventListener('DOMContentLoaded', function() {
			cookieconsent.run({
			    "notice_banner_type": "interstitial",
			    "consent_type": "express",
			    "palette": "light",
			    "language": "es",
			    "page_load_consent_levels": ["strictly-necessary"],
			    "notice_banner_reject_button_hide": false,
			    "preferences_center_close_button_hide": false,
			    "page_refresh_confirmation_buttons": false,
			    "website_name": "https://www.infoenbolas.com/",
			    "website_privacy_policy_url": "https://www.infoenbolas.com/p/politica-de-privacidad.html"
			});
	});	
}
function loadCSS(href) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
}

function loadJSX(src, attrs = {}) {
    const script = document.createElement("script");
    script.src = src;
    script.type = "text/javascript";

    for (const key in attrs) {
        script.setAttribute(key, attrs[key]);
    }

    document.head.appendChild(script);

    return script;
}

function loadJS2(source,param) { 
	var script = document.createElement('script');
	
	script.type = "text/javascript";
	script.src = source;
	script.setAttribute('data-mnddynid', param);
	
	
	( document.getElementsByTagName("head")[0] || document.documentElement ).appendChild( script );
}
function loadJS(source) { 
  var script = document.createElement('script');
  script.onload = function () {
    //do stuff with the script
  };
  script.src = source;

  document.head.appendChild(script); //or something of the likes
}
	/*hilltopads popup*/
(function(ajox){
var d = document,
    s = d.createElement('script'),
    l = d.scripts[d.scripts.length - 1];
s.settings = ajox || {};
s.src = "\/\/glossyrun.com\/c.Df9F6Fb\/2\/5llNSWWeQQ9iNBjlY\/5AN\/Dqg-5jOBCC0W2KNijOko0QO\/DUkg5u";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})
