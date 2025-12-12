(async () => {
    const delay = ms => new Promise(res => setTimeout(res, ms));

    const getFilename = url => {
        try {
            return decodeURIComponent(url.split("/").pop().split("?")[0]);
        } catch {
            return "file";
        }
    };

    const urlsSet = new Set();

    while (true) {
        console.log("📌 Haciendo scroll…");
        window.scrollTo(0, document.body.scrollHeight);

        // Esperar a que carguen las imágenes/videos
        await delay(1500);

        console.log("📥 Buscando imágenes y videos…");

        // IMÁGENES
        document.querySelectorAll("img").forEach(img => {
            const src = img.src;
            if (src && !urlsSet.has(src)) {
                urlsSet.add(src);
                console.log("Imagen encontrada:", src);
            }
        });

        // VIDEOS
        document.querySelectorAll("video").forEach(video => {
            const src = video.src || (video.querySelector("source")?.src);
            if (src && !urlsSet.has(src)) {
                urlsSet.add(src);
                console.log("Video encontrado:", src);
            }
        });

        // Guardar el listado actual como archivo .txt
        const blob = new Blob([Array.from(urlsSet).join("\n")], {type: "text/plain"});
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "urls_imagenes_videos.txt";
        document.body.appendChild(a);
        a.click();
        a.remove();

        console.log(`📄 Archivo actualizado con ${urlsSet.size} URLs`);

        await delay(2000); // Pausa antes del siguiente scroll
    }
})();
