// Paso 1: obtener todos los elementos con data-icon="media-play"
const playButtons = document.querySelectorAll('[data-icon="media-play"]');

// Paso 2: recorrer y hacer clic en cada uno
playButtons.forEach((playBtn, index) => {
  setTimeout(() => {
    // Hacer clic en el botón de reproducción
    playBtn.click();
    console.log(`Hice clic en media-play #${index + 1}`);

    // Esperar un poco a que aparezca el nuevo elemento "download-refreshed"
    setTimeout(() => {
      const downloadBtn = document.querySelector('[data-icon="download-refreshed"]');
      if (downloadBtn) {
        downloadBtn.click();
        console.log(`Hice clic en download-refreshed después del play #${index + 1}`);
      } else {
        console.warn('No se encontró el botón download-refreshed');
      }
    }, 1000); // espera 1 segundo (ajústalo según lo que tarde en aparecer)
    
  }, index * 2000); // separa los clics entre sí para evitar solapamiento
});
