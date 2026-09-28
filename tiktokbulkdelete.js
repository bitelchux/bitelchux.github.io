async function borrarTodos() {
    while (document.querySelector('button[data-tt="components_ActionCell_Clickable"]')) {

        // Click en el primer elemento
        document.querySelector('button[data-tt="components_ActionCell_Clickable"]').click();

        // Esperar 3 segundos
        await new Promise(r => setTimeout(r, 3000));

        // Click en Delete del menú
        [...document.querySelectorAll('div.Tooltip__root')]
            .find(el => el.innerText.trim() === 'Delete')
            ?.querySelector('[data-tt="components_ActionCell_FlexRow"]')
            ?.click();

        // Esperar 2 segundos
        await new Promise(r => setTimeout(r, 2000));

        // Click en Delete del modal
        [...document.querySelectorAll('button[data-tt="components_Modal_TUXButton"]')]
            .find(el => el.innerText.trim() === 'Delete')
            ?.click();

        // Esperar aleatoriamente entre 3 y 6 segundos
        const espera = 3000 + Math.random() * 3000;
        await new Promise(r => setTimeout(r, espera));
    }

    console.log('No quedan elementos para borrar.');
}

borrarTodos();
