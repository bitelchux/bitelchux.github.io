(async () => {
  console.log('🚀 Iniciando...');
  
  const urlsVistas = new Set();
  const contenedor = document.documentElement;
  const comando = [];
  const selector = 'a[href*="navarro/video/"]';

  // TRAZAS: ver qué selectores existen en la página
  console.log('📍 Buscando:', selector);
  const todosLosEnlaces = document.querySelectorAll('a');
  console.log(`Total de <a>: ${todosLosEnlaces.length}`);
  
  // Mostrar primeros 5 hrefs para debuggear
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
        comando.push(`yt-dlp --no-overwrites --write-description -o "%(title)s.%(ext)s" ${url}`);
        console.log(`    ✓ ${url}`);
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

  // Ejecutar scroll
  await scroll();
  console.log(`\n✅ Recolección completa: ${comando.length} comandos`);

  // Generar contenido .bat
  const contenidoBat = `@echo off
REM Descargas de videos con yt-dlp
REM Generado automáticamente
REM Total: ${comando.length} videos

${comando.join('\n')}

REM Finalizado
pause
`;

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
    const blob = new Blob([contenidoBat], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `descargar_videos_${Date.now()}.bat`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log(`✓ Fichero descargado: ${link.download}`);
  } catch (error) {
    console.error('❌ Error descarga:', error.message);
  }

  console.log('\n--- CONTENIDO GENERADO ---');
  console.log(contenidoBat);
})();
