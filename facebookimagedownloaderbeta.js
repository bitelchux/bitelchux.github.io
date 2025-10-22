(async function downloadFacebookFullResPreload() {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const scrollPause = 1200; // ms entre scrolls
  const seen = new Set();
  let totalDownloaded = 0;

  // Función para descargar una imagen
  async function downloadImage(url, id) {
    try {
      console.log(`Downloading: ${url}`);
      
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`Failed to download (HTTP ${res.status}): ${url}`);
        return;
      }
      
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      // Detectar extensión
      const extMatch = url.match(/\.(jpg|jpeg|png|webp|gif)/i);
      const ext = extMatch ? extMatch[0] : '.jpg';
      
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `fb_${id}${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
      
      totalDownloaded++;
      await sleep(300); // Pausa entre descargas
    } catch (e) {
      console.error('Error downloading', url, e);
    }
  }

  console.log("📸 Starting scroll-and-download loop...");
  console.log("🔍 Strategy: Extract high-res URLs from preload links and img tags");
  
  let cyclesWithoutNew = 0;
  
  for (let cycle = 0; cycle < 100; cycle++) {
    // Hacer scroll hacia abajo
    window.scrollTo(0, document.body.scrollHeight);
    await sleep(scrollPause);
    
    // Estrategia 1: Links de preload (suelen ser alta resolución)
    const preloadLinks = Array.from(
      document.querySelectorAll('link[rel="preload"][as="image"]')
    ).map(l => l.href);
    
    // Estrategia 2: Imágenes grandes visibles en el DOM
    const imgTags = Array.from(
      document.querySelectorAll('img[src*="scontent"]')
    )
      .filter(img => {
        // Filtrar solo imágenes razonablemente grandes (no iconos)
        return img.naturalWidth > 200 && img.naturalHeight > 200;
      })
      .map(img => img.src);
    
    // Estrategia 3: Buscar URLs de alta resolución en atributos data-
    const dataUrls = Array.from(
      document.querySelectorAll('[data-visualcompletion="media-vc-image"]')
    )
      .map(el => el.src || el.getAttribute('src'))
      .filter(Boolean);
    
    // Estrategia 4: Links en el código que apunten a scontent (CDN de Facebook)
    const allLinks = Array.from(document.querySelectorAll('a[href*="scontent"]'))
      .map(a => a.href)
      .filter(url => /\.(jpg|jpeg|png|webp)/i.test(url));
    
    // Combinar todas las estrategias
    const allUrls = [...new Set([
      ...preloadLinks,
      ...imgTags,
      ...dataUrls,
      ...allLinks
    ])];
    
    // Filtrar URLs nuevas y válidas
    const urls = allUrls.filter(url => {
      // Debe ser una URL válida de imagen
      if (!url || seen.has(url)) return false;
      
      // Debe venir del CDN de Facebook (scontent)
      if (!url.includes('scontent')) return false;
      
      // Evitar imágenes muy pequeñas (thumbnails)
      // Facebook usa parámetros como _nc_cat, _nc_ohc en URLs reales
      if (url.includes('s130x130') || url.includes('p130x130')) return false;
      
      return true;
    });
    
    if (urls.length) {
      console.log(`\n🔄 Cycle ${cycle + 1}: Found ${urls.length} new image(s)`);
      console.log(`   (${preloadLinks.length} preload, ${imgTags.length} img tags, ${dataUrls.length} data attrs, ${allLinks.length} links)`);
      
      for (const url of urls) {
        seen.add(url);
        
        // Generar ID único desde la URL
        const idMatch = url.match(/\/(\d+)_(\d+)_(\d+)_[on]\.jpg/);
        const id = idMatch ? `${idMatch[1]}_${idMatch[2]}` : Date.now();
        
        await downloadImage(url, id);
      }
      
      cyclesWithoutNew = 0;
    } else {
      cyclesWithoutNew++;
      console.log(`No new images found (${cyclesWithoutNew}/3)`);
      
      if (cyclesWithoutNew >= 3) {
        console.log("⏹️  No new content detected, stopping...");
        break;
      }
    }
  }
  
  console.log(`\n✅ Finished! Downloaded ${totalDownloaded} full-resolution photo(s).`);
  console.log(`💡 Tip: If you want even higher resolution, try opening photos individually and checking the Network tab for the largest image file.`);
})();
