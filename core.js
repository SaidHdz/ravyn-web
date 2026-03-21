document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cliente = urlParams.get('cliente');

    console.log("🔍 Cliente detectado en URL:", cliente);
    // Usamos ./ para asegurar que busque relativo a la carpeta actual en GitHub
    const rutaJson = cliente ? `./pedidos/${cliente}/data.json` : './data.json';
    console.log("📂 Intentando hacer fetch a:", rutaJson);

    try {
        const response = await fetch(rutaJson);
        if (!response.ok) throw new Error(`No se encontró el archivo: ${rutaJson}`);

        const dataCompleta = await response.json();
        console.log("✅ Datos cargados con éxito:", dataCompleta);

        // LANZAMOS LA ORQUESTA
        ejecutarModulos(dataCompleta);

    } catch (error) {
        console.error("❌ Error crítico:", error);
        document.body.innerHTML = `
            <div style="color:white;text-align:center;margin-top:20vh;font-family:sans-serif;">
                <h2>Lo sentimos</h2>
                <p>${error.message}</p>
            </div>`;
    }
});

// ESTA ES LA FUNCIÓN QUE TE FALTABA:
function ejecutarModulos(data) {
    // 1. Detectar el tema (buscamos en cualquier módulo que venga en el JSON)
    const tema = data.nuestra_historia?.config?.tema || 
                 data.trivia?.config?.tema || 
                 data.tarjetas?.config?.tema || "aesthetic";
    
    cargarTemaGlobal(tema);

    // 2. Iniciar Música si viene la URL
    const cancionURL = data.nuestra_historia?.config?.cancion || data.trivia?.config?.cancion;
    if (cancionURL && typeof iniciarReproductor === 'function') {
        iniciarReproductor(cancionURL);
    }

    // 3. Encender Módulo: Historia
    if (data.nuestra_historia) {
        const mod = document.getElementById('modulo-historia');
        if (mod) mod.classList.remove('oculto');
        if (typeof iniciarHistoria === 'function') iniciarHistoria(data.nuestra_historia);
    }

    // 4. Encender Módulo: Trivia
    if (data.trivia) {
        const mod = document.getElementById('modulo-trivia');
        if (mod) mod.classList.remove('oculto');
        if (typeof iniciarTrivia === 'function') iniciarTrivia(data.trivia);
    }

    // 5. Encender Módulo: Tarjetas
    if (data.tarjetas) {
        const mod = document.getElementById('modulo-tarjetas');
        if (mod) mod.classList.remove('oculto');
        if (typeof iniciarTarjetas === 'function') iniciarTarjetas(data.tarjetas);
    }
}

function cargarTemaGlobal(themeName) {
    const head = document.head;
    const existingLink = document.getElementById('dynamic-theme');
    if (existingLink) existingLink.remove();

    const link = document.createElement('link');
    link.id = 'dynamic-theme';
    link.rel = 'stylesheet';
    link.href = `css/theme-${themeName}.css`;
    head.appendChild(link);
    
    document.body.className = `theme-${themeName}`;
    document.body.setAttribute('data-theme', themeName);
}
