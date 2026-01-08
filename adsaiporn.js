/**
 * Intersticial con Banner
 * Script que crea un intersticial responsive que se convierte en banner al cerrarse
 */

(function() {
  'use strict';

  // Configuración del intersticial
 const config = {
    imageSrc: 'https://promptchan.com/assets/gayLanding/gay-landing.webp',
    title: 'Genera tu propio porno GAY',
    description: 'Genera tu propio porno GAY con IA, videos, fotos, hentai, imagenes...',
    buttonText: 'EMPEZAR',
    buttonUrl: 'https://promptchan.com/m/tJEjzfPGqgXGCw2EVpiQf1YQ60q1/gayban?landing=/gay-ai-porn',
    closeOnBackdropClick: true
  };

  // Estilos CSS
  const styles = `
    /* Intersticial */
    .interstitial-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.92);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      opacity: 0;
      transition: opacity 0.3s ease;
      padding: 20px;
      box-sizing: border-box;
    }

    .interstitial-overlay.show {
      opacity: 1;
    }

    .interstitial-content {
      background: #1a1a1a;
      border-radius: 12px;
      max-width: 800px;
      width: 100%;
      position: relative;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
      overflow: hidden;
      transform: scale(0.9);
      transition: transform 0.3s ease;
      border: 1px solid #333;
    }

    .interstitial-overlay.show .interstitial-content {
      transform: scale(1);
    }

    .interstitial-close {
      position: absolute;
      top: 15px;
      right: 15px;
      width: 32px;
      height: 32px;
      background: rgba(255, 255, 255, 0.15);
      border: none;
      border-radius: 50%;
      cursor: pointer;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .interstitial-close:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: rotate(90deg);
    }

    .interstitial-close::before,
    .interstitial-close::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 2px;
      background: #fff;
    }

    .interstitial-close::before {
      transform: rotate(45deg);
    }

    .interstitial-close::after {
      transform: rotate(-45deg);
    }

    .interstitial-body {
      display: flex;
      flex-direction: row;
    }

    .interstitial-image {
      flex: 0 0 40%;
      min-height: 300px;
      background-size: cover;
      background-position: center;
    }

    .interstitial-text {
      flex: 1;
      padding: 40px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: #1a1a1a;
    }

    .interstitial-title {
      font-size: 28px;
      font-weight: bold;
      margin: 0 0 15px 0;
      color: #fff;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .interstitial-description {
      font-size: 16px;
      line-height: 1.6;
      color: #ccc;
      margin: 0 0 25px 0;
    }

    .interstitial-buttons {
      display: flex;
      gap: 15px;
      align-items: center;
    }

    .interstitial-button {
      display: inline-block;
      padding: 12px 30px;
      background: linear-gradient(135deg, #FF1744 0%, #F50057 100%);
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      transition: all 0.2s ease;
      border: none;
      cursor: pointer;
      font-size: 16px;
      box-shadow: 0 4px 15px rgba(255, 23, 68, 0.3);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .interstitial-button:hover {
      background: linear-gradient(135deg, #F50057 0%, #FF1744 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 23, 68, 0.4);
    }

    .interstitial-button-close {
      display: inline-block;
      padding: 12px 30px;
      background: transparent;
      color: #aaa;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      transition: all 0.2s ease;
      border: 2px solid #444;
      cursor: pointer;
      font-size: 16px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .interstitial-button-close:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: #666;
      color: #fff;
    }

    .interstitial-image {
      cursor: pointer;
      transition: opacity 0.2s ease;
    }

    .interstitial-image:hover {
      opacity: 0.9;
    }

    .interstitial-title,
    .interstitial-description {
      cursor: pointer;
      transition: opacity 0.2s ease;
    }

    .interstitial-title:hover,
    .interstitial-description:hover {
      opacity: 0.9;
    }

    /* Banner en el pie */
    .sticky-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background: #1a1a1a;
      box-shadow: 0 -2px 15px rgba(0, 0, 0, 0.5);
      z-index: 999998;
      transform: translateY(100%);
      transition: transform 0.3s ease;
      border-top: 1px solid #333;
    }

    .sticky-banner.show {
      transform: translateY(0);
    }

    .sticky-banner-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .sticky-banner-left {
      display: flex;
      align-items: center;
      flex: 1;
      gap: 20px;
    }

    .sticky-banner-image {
      width: 80px;
      height: 60px;
      background-size: cover;
      background-position: center;
      border-radius: 6px;
      flex-shrink: 0;
      border: 1px solid #333;
    }

    .sticky-banner-text {
      flex: 1;
      min-width: 0;
    }

    .sticky-banner-title {
      font-size: 16px;
      font-weight: bold;
      margin: 0 0 5px 0;
      color: #fff;
    }

    .sticky-banner-description {
      font-size: 14px;
      color: #aaa;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sticky-banner-button {
      padding: 10px 25px;
      background: linear-gradient(135deg, #FF1744 0%, #F50057 100%);
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      transition: all 0.2s ease;
      white-space: nowrap;
      border: none;
      cursor: pointer;
      font-size: 14px;
      margin: 0 15px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 3px 10px rgba(255, 23, 68, 0.3);
    }

    .sticky-banner-button:hover {
      background: linear-gradient(135deg, #F50057 0%, #FF1744 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(255, 23, 68, 0.4);
    }

    .sticky-banner-close {
      width: 28px;
      height: 28px;
      background: transparent;
      border: none;
      cursor: pointer;
      position: relative;
      flex-shrink: 0;
      opacity: 0.6;
      transition: all 0.2s ease;
    }

    .sticky-banner-close:hover {
      opacity: 1;
      transform: rotate(90deg);
    }

    .sticky-banner-close::before,
    .sticky-banner-close::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 2px;
      background: #fff;
      top: 50%;
      left: 50%;
    }

    .sticky-banner-close::before {
      transform: translate(-50%, -50%) rotate(45deg);
    }

    .sticky-banner-close::after {
      transform: translate(-50%, -50%) rotate(-45deg);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .interstitial-body {
        flex-direction: column;
      }

      .interstitial-image {
        flex: 0 0 200px;
        min-height: 200px;
      }

      .interstitial-text {
        padding: 30px 20px;
      }

      .interstitial-title {
        font-size: 22px;
      }

      .interstitial-description {
        font-size: 14px;
      }

      .interstitial-buttons {
        flex-direction: column;
        gap: 10px;
        width: 100%;
      }

      .interstitial-button,
      .interstitial-button-close {
        width: 100%;
        text-align: center;
        padding: 12px 20px;
      }

      /* Banner en móvil - solo texto */
      .sticky-banner-image {
        display: none;
      }

      .sticky-banner-content {
        padding: 12px 15px;
      }

      .sticky-banner-title {
        font-size: 14px;
      }

      .sticky-banner-description {
        font-size: 12px;
      }

      .sticky-banner-button {
        padding: 8px 15px;
        font-size: 12px;
        margin: 0 10px;
      }
    }

    @media (max-width: 480px) {
      .sticky-banner-description {
        display: none;
      }

      .sticky-banner-button {
        padding: 8px 12px;
        font-size: 11px;
      }
    }
  `;

  // Crear intersticial
  function createInterstitial() {
    const overlay = document.createElement('div');
    overlay.className = 'interstitial-overlay';
    overlay.innerHTML = `
      <div class="interstitial-content">
        <button class="interstitial-close" aria-label="Cerrar"></button>
        <div class="interstitial-body">
          <div class="interstitial-image" style="background-image: url('${config.imageSrc}')" data-clickable="true"></div>
          <div class="interstitial-text">
            <h2 class="interstitial-title" data-clickable="true">${config.title}</h2>
            <p class="interstitial-description" data-clickable="true">${config.description}</p>
            <div class="interstitial-buttons">
              <a href="${config.buttonUrl}" class="interstitial-button">${config.buttonText}</a>
              <button class="interstitial-button-close" data-close-btn="true">CERRAR</button>
            </div>
          </div>
        </div>
      </div>
    `;

    return overlay;
  }

  // Crear banner
  function createBanner() {
    const banner = document.createElement('div');
    banner.className = 'sticky-banner';
    banner.innerHTML = `
      <div class="sticky-banner-content">
        <div class="sticky-banner-left">
          <div class="sticky-banner-image" style="background-image: url('${config.imageSrc}')"></div>
          <div class="sticky-banner-text">
            <h3 class="sticky-banner-title">${config.title}</h3>
            <p class="sticky-banner-description">${config.description}</p>
          </div>
        </div>
        <a href="${config.buttonUrl}" class="sticky-banner-button">${config.buttonText}</a>
        <button class="sticky-banner-close" aria-label="Cerrar banner"></button>
      </div>
    `;

    return banner;
  }

  // Inicializar
  function init() {
    // Inyectar estilos
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Crear elementos
    const interstitial = createInterstitial();
    const banner = createBanner();

    // Agregar al DOM
    document.body.appendChild(interstitial);
    document.body.appendChild(banner);

    // Mostrar intersticial con animación
    setTimeout(() => {
      interstitial.classList.add('show');
    }, 100);

    // Cerrar intersticial y mostrar banner
    function closeInterstitial() {
      interstitial.classList.remove('show');
      setTimeout(() => {
        interstitial.style.display = 'none';
        banner.classList.add('show');
      }, 300);
    }

    // Event listeners
    const closeBtn = interstitial.querySelector('.interstitial-close');
    closeBtn.addEventListener('click', closeInterstitial);

    // Botón CERRAR
    const closeBtnText = interstitial.querySelector('[data-close-btn]');
    closeBtnText.addEventListener('click', closeInterstitial);

    // Hacer clickeables imagen, título y descripción
    const clickableElements = interstitial.querySelectorAll('[data-clickable]');
    clickableElements.forEach(element => {
      element.addEventListener('click', () => {
        window.location.href = config.buttonUrl;
      });
    });

    if (config.closeOnBackdropClick) {
      interstitial.addEventListener('click', (e) => {
        if (e.target === interstitial) {
          closeInterstitial();
        }
      });
    }

    // Cerrar banner completamente
    const bannerCloseBtn = banner.querySelector('.sticky-banner-close');
    bannerCloseBtn.addEventListener('click', () => {
      banner.classList.remove('show');
      setTimeout(() => {
        banner.remove();
      }, 300);
    });
  }

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
