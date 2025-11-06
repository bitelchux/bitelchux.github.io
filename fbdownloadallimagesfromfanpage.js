(function downloadFacebookFullResPreload() {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const randomDelay = () => 200 + Math.random() * 1800; // 200–2000 ms
  const scrollPause = 1200;
  const scrollStep = 1000; // píxeles por paso de scroll
  let totalDownloaded = 0;
  let cyclesWithoutNew = 0;

  // 🧠 Recuperar URLs ya descargadas de localStorage
  const seen = new Set(JSON.parse(localStorage.getItem("fb_seen") || "[]"));

  console.log("📸 Starting scroll-and-download loop (human-like)...");

  // 💾 Guardar el set de descargadas en localStorage
  function saveSeen() {
    localStorage.setItem("fb_seen", JSON.stringify(Array.from(seen)));
  }

  // 📥 Descargar imagen
  function downloadImage(url, id) {
    console.log(`🖼️ Downloading image: ${url}`);
    return fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("Bad response");
        return res.blob();
      })
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        const extMatch = url.match(/\.(jpg|jpeg|png|webp|gif)/i);
        const ext = extMatch ? extMatch[0] : ".jpg";
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `fb_${id}${ext}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(blobUrl);
        console.log(`✅ Image saved: fb_${id}${ext}`);
        return sleep(randomDelay());
      })
      .catch(e => console.warn("⚠️ Error downloading image", e));
  }

  // 📝 Descargar descripción del meta tag
  function downloadDescription(url, id) {
    return fetch(url)
      .then(res => res.text())
      .then(html => {
        const match = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
        const description = match ? match[1] : "No description found";
        const decoded = new DOMParser().parseFromString(description, "text/html").documentElement.textContent;
        const txtBlob = new Blob([decoded], { type: "text/plain;charset=utf-8" });
        const blobUrl = URL.createObjectURL(txtBlob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `fb_${id}.txt`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(blobUrl);
        console.log(`💾 Description saved: fb_${id}.txt`);
        return sleep(randomDelay());
      })
      .catch(e => console.warn("⚠️ Error downloading description", e));
  }

  // 🔁 Scroll y procesamiento incremental
  async function processCycle(cycle = 0) {
    if (cycle >= 10) {
      console.log(`✅ Finished after ${cycle} cycles. Downloaded ${totalDownloaded} items.`);
      saveSeen();
      return;
    }

    console.log(`🔄 Cycle ${cycle} — scrolling...`);
    window.scrollBy(0, scrollStep);
    await sleep(scrollPause + randomDelay());

    const links = Array.from(document.querySelectorAll('a[href*="photo.php?"]'));
    const urls = links.map(l => l.href).filter(u => u && !seen.has(u));

    if (urls.length) {
      console.log(`🔍 Found ${urls.length} new images this cycle.`);
      const batch = urls.slice(0, 3); // solo 3 imágenes por depuración

      for (const url of batch) {
        seen.add(url);
        saveSeen();
        const id = new URL(url).searchParams.get("fbid") || `temp_${Date.now()}`;
        await downloadImage(url, id);
        await downloadDescription(url, id);
        totalDownloaded++;
        await sleep(randomDelay());
      }

      cyclesWithoutNew = 0;
    } else {
      cyclesWithoutNew++;
      console.log(`😴 No new images (x${cyclesWithoutNew})`);
      if (cyclesWithoutNew >= 3) {
        console.log(`✅ No more images. Total downloaded: ${totalDownloaded}`);
        saveSeen();
        return;
      }
    }

    await processCycle(cycle + 1);
  }

  processCycle(0);
})();
