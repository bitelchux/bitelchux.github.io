(function() {

    // ======= PARÁMETROS DEL LIBRO — edita solo esto para reutilizar el widget =======
    const config = {
        libroNombre: "Pánico en el Platanar",
        autor: "",
        precio: "3.07$ Kindle, 6.55$ tapa blanda",
        imagenPortada: "https://bitelchux.github.io/platanar2.jpg",
        urlAmazon: "https://www.amazon.es/dp/B0H7DGH2P5",
        disponibleKindleUnlimited: true
    };
    // ==================================================================================

    const container = document.createElement('div');
    container.id = 'widget-libro-flotante';
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        max-width: 320px;
        width: calc(100% - 40px);
        background: #F7F3EA;
        border-radius: 14px;
        box-shadow: 0 10px 30px rgba(20,33,61,0.25);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        overflow: hidden;
        opacity: 0;
        transform: translateY(-12px);
        transition: opacity 0.5s ease, transform 0.5s ease;
    `;

    // Cabecera
    const cabecera = document.createElement('div');
    cabecera.style.cssText = `
        padding: 10px 16px;
        background: #14213D;
        color: #E4C047;
        font-weight: 700;
        font-size: 11px;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        text-align: center;
    `;
    cabecera.textContent = 'Recomendado para ti';
    //container.appendChild(cabecera);

    // Portada + cinta "Kindle Unlimited"
    const imgContainer = document.createElement('div');
    imgContainer.style.cssText = `
        position: relative;
        width: 100%;
        max-height: 320px;
        overflow: hidden;
        background: #ddd6c4;
        display: flex;
        justify-content: center;
    `;
    const img = document.createElement('img');
    img.src = config.imagenPortada;
    img.alt = config.libroNombre;
    img.style.cssText = `
        width: auto;
        max-width: 100%;
        max-height: 320px;
        display: block;
    `;
    img.onerror = () => { imgContainer.style.display = 'none'; };
    imgContainer.appendChild(img);

    if (config.disponibleKindleUnlimited) {
        const cinta = document.createElement('div');
        cinta.textContent = 'Gratis con Kindle Unlimited';
        cinta.style.cssText = `
            position: absolute;
            top: 16px;
            right: -46px;
            width: 190px;
            transform: rotate(45deg);
            background: linear-gradient(135deg, #C9A227, #E4C047);
            color: #14213D;
            text-align: center;
            font-size: 10.5px;
            font-weight: 700;
            letter-spacing: 0.02em;
            padding: 6px 0;
            box-shadow: 0 2px 6px rgba(0,0,0,0.25);
        `;
        //imgContainer.appendChild(cinta);
    }
    container.appendChild(imgContainer);

    // Contenido: título, autor, precio
    const contenido = document.createElement('div');
    contenido.style.cssText = `padding: 16px 18px 4px;`;

    const titulo = document.createElement('div');
    titulo.textContent = config.libroNombre;
    titulo.style.cssText = `
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 17px;
        font-weight: 700;
        color: #14213D;
        line-height: 1.3;
        margin-bottom: 4px;
    `;
    contenido.appendChild(titulo);

    if (config.autor) {
        const autor = document.createElement('div');
        autor.textContent = config.autor;
        autor.style.cssText = `
            font-size: 12.5px;
            color: #6b6b6b;
            margin-bottom: 10px;
        `;
        contenido.appendChild(autor);
    }

    const precioFila = document.createElement('div');
    precioFila.style.cssText = `
        display: inline-block;
        background: #7A2E2E;
        color: #fff;
        font-weight: 700;
        font-size: 14px;
        padding: 4px 10px;
        border-radius: 6px;
        margin-bottom: 6px;
    `;
    precioFila.textContent = config.precio;
    //contenido.appendChild(precioFila);

    if (config.disponibleKindleUnlimited) {
        const notaKU = document.createElement('div');
        notaKU.textContent = 'Léelo gratis si tienes Kindle Unlimited';
        notaKU.style.cssText = `
            font-size: 12px;
            color: #4a4a4a;
            margin: 6px 0 4px;
        `;
        contenido.appendChild(notaKU);
    }

    container.appendChild(contenido);

    // Footer con botones de acción
    const footer = document.createElement('div');
    footer.style.cssText = `
        padding: 14px 18px 18px;
        display: flex;
        flex-direction: column;
        gap: 8px;
    `;

    const btnAmazon = document.createElement('a');
    btnAmazon.href = config.urlAmazon;
    btnAmazon.target = '_blank';
    btnAmazon.rel = 'noopener';
    btnAmazon.textContent = 'Ver en Amazon';
    btnAmazon.style.cssText = `
        display: block;
        text-align: center;
        background: #14213D;
        color: #E4C047;
        text-decoration: none;
        font-weight: 700;
        font-size: 13px;
        padding: 10px 0;
        border-radius: 8px;
        transition: background 0.2s;
    `;
    btnAmazon.onmouseover = () => btnAmazon.style.background = '#1d2e54';
    btnAmazon.onmouseout = () => btnAmazon.style.background = '#14213D';
    footer.appendChild(btnAmazon);

    if (config.disponibleKindleUnlimited) {
        const btnKU = document.createElement('a');
        btnKU.href = config.urlAmazon;
        btnKU.target = '_blank';
        btnKU.rel = 'noopener';
        btnKU.textContent = 'Leer con Kindle Unlimited';
        btnKU.style.cssText = `
            display: block;
            text-align: center;
            background: transparent;
            color: #7A2E2E;
            text-decoration: none;
            font-weight: 700;
            font-size: 13px;
            padding: 9px 0;
            border-radius: 8px;
            border: 1.5px solid #7A2E2E;
            transition: background 0.2s, color 0.2s;
        `;
        btnKU.onmouseover = () => { btnKU.style.background = '#7A2E2E'; btnKU.style.color = '#fff'; };
        btnKU.onmouseout = () => { btnKU.style.background = 'transparent'; btnKU.style.color = '#7A2E2E'; };
        footer.appendChild(btnKU);
    }

    container.appendChild(footer);

    // Botón de cerrar (aparece al pasar el ratón)
    const btnCerrar = document.createElement('button');
    btnCerrar.innerHTML = '✕';
    btnCerrar.setAttribute('aria-label', 'Cerrar');
    btnCerrar.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(0,0,0,0.15);
        border: none;
        color: #fff;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 12px;
        display: none;
        z-index: 10000;
        transition: background 0.2s;
    `;
    btnCerrar.onmouseover = () => btnCerrar.style.background = 'rgba(0,0,0,0.3)';
    btnCerrar.onmouseout = () => btnCerrar.style.background = 'rgba(0,0,0,0.15)';
    btnCerrar.onclick = () => container.remove();
    container.appendChild(btnCerrar);

    container.onmouseenter = () => btnCerrar.style.display = 'block';
    container.onmouseleave = () => btnCerrar.style.display = 'none';

    // Responsive: en móvil lo bajamos a la esquina inferior para no tapar la cabecera de la web
    const mq = window.matchMedia('(max-width: 480px)');
    const ajustarPosicion = () => {
        if (mq.matches) {
            container.style.top = 'auto';
            container.style.bottom = '16px';
            container.style.right = '16px';
            container.style.left = '16px';
            container.style.width = 'auto';
            container.style.maxWidth = 'none';
        } else {
            container.style.top = '20px';
            container.style.bottom = 'auto';
            container.style.right = '20px';
            container.style.left = 'auto';
            container.style.width = 'calc(100% - 40px)';
            container.style.maxWidth = '320px';
        }
    };
    mq.addEventListener('change', ajustarPosicion);

    const inyectar = () => {
        if (document.body) {
            document.body.appendChild(container);
            ajustarPosicion();
            requestAnimationFrame(() => {
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            });
        } else {
            setTimeout(inyectar, 100);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inyectar);
    } else {
        inyectar();
    }
})();
