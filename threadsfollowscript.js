const delay = (delayInms) => {
  return new Promise(resolve => setTimeout(resolve, delayInms));
};

function randi(min, max) {  
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function autoFollow() {
  const MAX_SESSION = 350; // Límite por sesión
  const MAX_HOURLY = 85;   // Límite por hora
  
  let totalFollowed = 0;
  let hourlyFollowed = 0;
  let sessionStartTime = Date.now();
  let hourlyStartTime = Date.now();

  console.log("Iniciando script de follow automatizado con límites de seguridad...");

  // Bucle amplio (puedes ajustarlo o dejarlo infinito controlado por el límite de sesión)
  for (var i = 0; i < 500; i++) {
    
    // 1. Verificar límite total de sesión (350)
    if (totalFollowed >= MAX_SESSION) {
      console.log(`Límite de sesión alcanzado (${MAX_SESSION} personas). Deteniendo script.`);
      break;
    }

    // 2. Control de límite por hora (85)
    let elapsedHourTime = (Date.now() - hourlyStartTime) / 1000 / 60; // en minutos
    if (hourlyFollowed >= MAX_HOURLY) {
      if (elapsedHourTime < 60) {
        let waitMinutes = Math.ceil(60 - elapsedHourTime);
        console.log(`Límite por hora alcanzado (${MAX_HOURLY}). Pausando durante ${waitMinutes} minutos para respetar el ritmo...`);
        await delay(waitMinutes * 60 * 1000);
      }
      // Reiniciar contador de hora y cronómetro
      hourlyFollowed = 0;
      hourlyStartTime = Date.now();
    }

    console.log(`[Intento ${i + 1}] Buscando botón de Follow... (Sesión: ${totalFollowed}/${MAX_SESSION} | Hora: ${hourlyFollowed}/${MAX_HOURLY})`);
    
    var xpath = "//div[text()='Follow']";
    var btn = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    
    if (btn) {
      try {
        btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await delay(randi(1000, 2000)); // Breve pausa tras hacer scroll
        btn.click();
        
        totalFollowed++;
        hourlyFollowed++;
        console.log("-> ¡Click realizado con éxito!");
      } catch (error) {
        console.log("-> Error al hacer click en el botón:", error);
      }
    } else {
      console.log("-> No se encontró el botón 'Follow' visible en este ciclo.");
    }

    // 3. Retraso aleatorio entre acciones (para simular comportamiento humano y espaciar las 85 por hora)
    // Con un delay aleatorio de 40 a 75 segundos por acción, garantizamos estar por debajo de las 85 por hora.
    let randomDelay = randi(40, 75) * 1000;
    console.log(`Esperando ${randomDelay / 1000} segundos para la siguiente acción...\n`);
    await delay(randomDelay);
  }

  console.log("Script finalizado.");
}

// Ejecutar función principal
autoFollow();
