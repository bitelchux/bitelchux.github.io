(async () => {
  console.log('🚀 Iniciando...');
  
  const urlsVistas = new Set();
  const contenedor = document.documentElement;
  const comando = [];
  const selector = 'a[href*="tiktok.com"]';

  console.log('📍 Buscando:', selector);
  const todosLosEnlaces = document.querySelectorAll('a');
  console.log(`Total de <a>: ${todosLosEnlaces.length}`);
  
  console.log('Primeros hrefs:');
  [...todosLosEnlaces].slice(0, 5).forEach(a => {
    console.log(`  - ${a.href}`);
  });

  const recolectarEnlaces = () => {
    const encontrados = [...document.querySelectorAll(selector)];
    console.log(`  Coincidencias selector: ${encontrados.length}`);
    
    encontrados.forEach(a => {
      const url = a.href;
      if (!urlsVistas.has(url)) {
        urlsVistas.add(url);
        
        // Extraer video ID del URL
        const videoIdMatch = url.match(/\/video\/(\d+)/);
        const videoId = videoIdMatch ? videoIdMatch[1] : 'unknown';
        
        // Formato robusto para TikTok
        comando.push(`yt-dlp --no-overwrites -f best --write-info-json --write-description -o "%(uploader)s_%(title)s_${videoId}.%(ext)s" "${url}"`);
        console.log(`    ✓ ${url} (ID: ${videoId})`);
      }
    });
  };

  const scroll = async () => {
    let nuevosEnlaces = true;
    let iteracion = 0;

    while (nuevosEnlaces) {
      iteracion++;
      console.log(`\n⏬ Scroll iteración ${iteracion}`);
      
      window.scrollTo(0, contenedor.scrollHeight);
      console.log(`  Altura: ${contenedor.scrollHeight}`);
      
      await new Promise(resolve => setTimeout(resolve, 2000));

      const tamanoAntes = urlsVistas.size;
      recolectarEnlaces();
      
      nuevosEnlaces = urlsVistas.size > tamanoAntes;
      console.log(`  Enlaces: ${urlsVistas.size} (antes: ${tamanoAntes})`);
    }
  };

  await scroll();
  console.log(`\n✅ Recolección completa: ${comando.length} comandos`);

  // Generar .bat
  const lineas = [
    '@echo off',
    'setlocal enabledelayedexpansion',
    'REM Descargas de TikTok con yt-dlp',
    `REM Generado: ${new Date().toLocaleString()}`,
    `REM Total: ${comando.length} videos`,
    'REM ',
    'cd /d "%~dp0"',
    'mkdir "descargas_tiktok" 2>nul',
    'cd descargas_tiktok',
    'REM ',
    'echo Iniciando descargas...',
    'REM '
  ];
  
  lineas.push(...comando);
  
  lineas.push(
    '',
    'REM Finalizado',
    'echo.',
    'echo ✓ Descarga completada',
    'pause'
  );

  const contenidoBat = lineas.join('\r\n');

  // COPIAR AL PORTAPAPELES
  try {
    window.focus();
    const texto = comando.join('\n');
    await navigator.clipboard.writeText(texto);
    console.log('✓ Copiado al portapapeles');
  } catch (error) {
    console.error('❌ Error clipboard:', error.message);
  }

  // DESCARGAR .BAT
  try {
    const encoder = new TextEncoder();
    const uint8array = encoder.encode(contenidoBat);
    const blob = new Blob([uint8array], { type: 'text/plain;charset=utf-8' });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `descargar_tiktok_${Date.now()}.bat`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log(`✓ Fichero descargado: ${link.download}`);
  } catch (error) {
    console.error('❌ Error descarga:', error.message);
  }

  console.log('\n--- COMANDO EJEMPLO ---');
  console.log(comando[0]);
})();
