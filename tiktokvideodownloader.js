(async () => {
  console.log('🚀 Iniciando...');
  
  const urlsVistas = new Set();
  const contenedor = document.documentElement;
  const comando = [];
  const selector = 'a[href*="navarro/video/"]';

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
        comando.push(`yt-dlp --no-overwrites --write-description -o "%(title)s.%(ext)s" "${url}"`);
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

  await scroll();
  console.log(`\n✅ Recolección completa: ${comando.length} comandos`);

