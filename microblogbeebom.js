/**
 * ============================================================================
 * INICIALIZACIÓN GLOBAL (COMPATIBLE CON CARGA TARDÍA / POST-LOAD)
 * ============================================================================
 */
function initAppManager() {
  Logger.log('Inicializando AppManager...');

  // 1. Reemplazo de tags de Amazon
  setTimeout(updateAmazonAffiliateTags, 1000);

  // Exclusión por Adsense/Google
  if (window.conadsense !== undefined || window.adsbygoogle !== undefined) {
    Logger.warn('Google AdSense detectado. Se detiene la inyección publicitaria.');
    return;
  }

  // 2. Verificación de edad y flujo por país
  checkAgeVerification((isAdult) => {
    if (!isAdult) return;

    Logger.group('Geolocalización');
    fetch(CONFIG.GEO_API)
      .then(res => res.json())
      .then(data => {
        window.cfpais = (data.country === "ES" || data.country_name === "Spain") ? "spain" : data.country;
        Logger.log(`País asignado: ${window.cfpais}`);

        if (window.cfpais === "spain") {
          if (window.location.hostname !== "eleglide.es") {
            loadScript("https://bitelchux.github.io/facha.js");
            injectOfferBanner("ES");
          } else {
            initAmazonStickyButton();
          }
        } else {
          inyectaTelegramFlotante();
          inyectaSmartLink();
          loadRandomAds();
        }
      })
      .catch(err => {
        Logger.error('Error al geolocalizar:', err);
        inyectaSmartLink();
      })
      .finally(() => {
        Logger.groupEnd();
      });
  });

  // 3. Script de analíticas
  if (window.beebomstats === undefined) {
    loadScript("https://bitelchux.github.io/beebomstats.js");
  }
}

// Ejecución segura según el estado actual del DOM
if (document.readyState === 'complete') {
  Logger.log('El DOM ya estaba cargado. Ejecutando inmediatamente.');
  initAppManager();
} else {
  Logger.log('Esperando a que termine la carga de la página...');
  window.addEventListener('load', initAppManager);
}
