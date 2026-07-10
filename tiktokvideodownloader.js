(async () => {
  console.log('🚀 Iniciando...');
  
  const urlsVistas = new Set();
  const contenedor = document.documentElement;
  const comando = [];
  const selector = 'a[href*="tiktok.com"]';

  const recolectarEnlaces = () => {
    const encontrados = [...document.querySelectorAll(selector)];
    console.log(`  Coincidencias: ${encontrados.length}`);
    
    encontrados.forEach(a => {
      const url = a.href;
      if (!urlsVistas.has(url)) {
        urlsVistas.add(url);
        const videoIdMatch = url.match(/\/video\/(\d+)/);
        const videoId = videoIdMatch ? videoIdMatch[1] : 'unknown';
        
        comando.push({
          clipboard: `yt-dlp --no-overwrites -f best --write-info-json --write-description -o "%(uploader)s_${videoId}.%(ext)s" "${url}"`,
          batch: `yt-dlp  --no-overwrites -f best --write-info-json --write-description -o "%%(uploader)s_${videoId}.%%(ext)s" "${url}"`
        });
      }
    });
  };

  const scroll = async () => {
    let nuevosEnlaces = true;
    let iteracion = 0;

    while (nuevosEnlaces) {
      iteracion++;
      console.log(`⏬ Scroll ${iteracion}`);
      
      window.scrollTo(0, contenedor.scrollHeight);
      await new Promise(resolve => setTimeout(resolve, 2000));

      const tamanoAntes = urlsVistas.size;
      recolectarEnlaces();
      nuevosEnlaces = urlsVistas.size > tamanoAntes;
      console.log(`  Enlaces: ${urlsVistas.size}`);
    }
  };

  await scroll();
  console.log(`✅ Total: ${comando.length} comandos`);

  // Generar .bat
  const lineas = [
    '@echo off',
    'chcp 65001 >nul',
    'REM Descargas de TikTok con yt-dlp',
    `REM Generado: ${new Date().toLocaleString()}`,
    `REM Total: ${comando.length} videos`,
    'REM ',
    'echo Iniciando descargas en directorio actual...',
    'REM'
  ];
  
  comando.forEach((cmd, idx) => {
    lineas.push(`REM [${idx + 1}/${comando.length}]`);
    lineas.push(cmd.batch);
  });
  
  lineas.push(
    '',
    'echo.',
    'echo ✓ Descarga completada',
    'pause'
  );

  const contenidoBat = lineas.join('\r\n');
	/*
  // Enfocar ventana ANTES de todo
  window.focus();
  
  // COPIAR al portapapeles CON DELAY
  console.log('📋 Copiando al portapapeles...');
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const textoClip = comando.map(c => c.clipboard).join('\n');
    await navigator.clipboard.writeText(textoClip);
    console.log('✓ Copiado al portapapeles');
  } catch (error) {
    console.error('❌ Error clipboard:', error.message);
    console.log('⚠️ Intenta hacer click en la página y repite el comando');
  }
*/
  // DESCARGAR .bat
  try {
    const blob = new Blob([contenidoBat], { 
      type: 'text/plain;charset=windows-1252' 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `descargar_tiktok_${Date.now()}.bat`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log(`✓ Descargado: ${link.download}`);
  } catch (error) {
    console.error('❌ Error descarga:', error.message);
  }

  console.log('\n--- EJEMPLO BAT ---');
  console.log(lineas.slice(0, 12).join('\n'));
})();
