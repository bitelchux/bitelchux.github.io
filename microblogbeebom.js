(function () {
  /* from lgtb.com */
  if (document.referrer && document.referrer.includes('donlgbt.com')) {
      window.location.href = 'https://promptchan.com/m/tJEjzfPGqgXGCw2EVpiQf1YQ60q1/donlgt?landing=/gay-ai-porn';
  }
  /* aviso legal*/
  const lang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
 const article = document.querySelector('article');
    let text;
    if (lang.startsWith('es')) {
        text = `
        <div class="ip-notice">
            <strong>Derechos de autor</strong><br>
            Si cree que algún contenido infringe derechos de autor o propiedad intelectual,
            contacte en <a href="mailto:bitelchux@yahoo.es">bitelchux@yahoo.es</a>.
        </div>`;
    } else {
        text = `
        <div class="ip-notice">
            <strong>Copyright notice</strong><br>
            If you believe any content infringes copyright or intellectual property rights,
            please contact <a href="mailto:bitelchux@yahoo.es">bitelchux@yahoo.es</a>.
        </div>`;
    }


    if (article) {
        article.insertAdjacentHTML('beforeend', text);
    }
})();
