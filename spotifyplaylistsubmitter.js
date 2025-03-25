

const div = document.querySelectorAll('[data-sentry-component="VirtualPlaylistGrid"]')[0];
async function procesarScores() {
    while (true) {
        if (div.scrollTop + div.clientHeight >= div.scrollHeight) {
            console.log("Has llegado al final del contenido." + (div.scrollTop + div.clientHeight) + " hasta " + div.scrollHeight);
            return;
        } else {
            console.log("NO Has llegado al final del contenido." + (div.scrollTop + div.clientHeight) + " hasta " + div.scrollHeight);
            div.scrollTop += 300;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        var scores = document.querySelectorAll('.score');
        for (const span of scores) {
            var tarjeta = span.parentElement.parentElement.parentElement;
            const value = parseFloat(span.textContent.replace('%', ''));

            if (value > 74 && !tarjeta.classList.contains('pushed')) {
                console.log("music found");

                // Espera 3 segundos antes de hacer el click
                await new Promise(resolve => setTimeout(resolve, 2000));

                tarjeta.click(); // Hace el click
                console.log("music click");

                // Espera 3 segundos después del primer click
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Selecciona nuevamente los elementos para asegurarse de que los cambios se reflejen
                const updatedScores = document.querySelectorAll('.score');
                const botones = document.querySelectorAll('[data-sentry-source-file="PushButton.jsx"]');
                const botonescerrar = document.querySelectorAll('[data-sentry-source-file="Dialog.jsx"]');
                console.log("check push button");
                if (botones.length >= 2) {
                    botones[botones.length - 1].click();
                    console.log("push click");
                }
				
                await new Promise(resolve => setTimeout(resolve, 2000));
				if (botonescerrar.length >= 2) {
					console.log("cerrar dialog click");
					botonescerrar[botonescerrar.length - 1].click();
				}


            }
        }
    }
}
procesarScores();
