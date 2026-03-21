/* Archivo Core JS */

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cliente = urlParams.get('cliente');

    /* Usamos ./ para asegurar que busque relativo a la carpeta actual en GitHub Pages */
    const rutaJson = cliente ? `./pedidos/${cliente}/data.json` : './data.json';

    try {
        const response = await fetch(rutaJson);
        if (!response.ok) throw new Error(`No se encontró el archivo: ${rutaJson}`);

        const dataCompleta = await response.json();

        /* Alch no se como pero jala y no le muevan */
        ejecutarModulos(dataCompleta);

    } catch (error) {
        document.body.innerHTML = `
            <div style="color:white;text-align:center;margin-top:20vh;font-family:sans-serif;padding:20px;">
                <h2>Lo sentimos, no pudimos cargar la experiencia</h2>
                <p>${error.message}</p>
                <p>Verifica que el link sea correcto o intenta más tarde.</p>
            </div>`;
    }
});

/* Funcion principal */
function ejecutarModulos(data) {
    /* Esta monstruosidad detecta el tema buscando en cada modulo. */
    const tema = data.nuestra_historia?.config?.tema || 
                 data.trivia?.config?.tema || 
                 data.tarjetas?.config?.tema || 
                 data.evasivo?.config?.tema || 
                 data.contador?.config?.tema || 
                 data.dedicatorias?.config?.tema || "aesthetic"; 
    
    cargarTemaGlobal(tema);

    /* Iniciar musica si viene la URL (ya no jala sepa pq) */
    const cancionURL = data.nuestra_historia?.config?.cancion || 
                       data.trivia?.config?.cancion || 
                       data.tarjetas?.config?.cancion;
                       
    if (cancionURL && typeof iniciarReproductor === 'function') {
        iniciarReproductor(cancionURL);
    }

    /* Encendido de modulos individuales */
    if (data.nuestra_historia) {
        const mod = document.getElementById('modulo-historia');
        if (mod) mod.classList.remove('oculto');
        if (typeof iniciarHistoria === 'function') iniciarHistoria(data.nuestra_historia);
    }

    if (data.trivia) {
        const mod = document.getElementById('modulo-trivia');
        if (mod) mod.classList.remove('oculto');
        if (typeof iniciarTrivia === 'function') iniciarTrivia(data.trivia);
    }

    if (data.tarjetas) {
        const mod = document.getElementById('modulo-tarjetas');
        if (mod) mod.classList.remove('oculto');
        if (typeof iniciarTarjetas === 'function') iniciarTarjetas(data.tarjetas);
    }
    
    if (data.evasivo) {
        const mod = document.getElementById('modulo-evasivo');
        if (mod) mod.classList.remove('oculto');
        if (typeof iniciarEvasivo === 'function') iniciarEvasivo(data.evasivo);
    }
    
    if (data.contador) {
        const mod = document.getElementById('modulo-contador');
        if (mod) mod.classList.remove('oculto');
        if (typeof iniciarContador === 'function') iniciarContador(data.contador);
    }
    
    if (data.dedicatorias) {
        const mod = document.getElementById('modulo-dedicatorias'); 
        if (mod) mod.classList.remove('oculto');
        if (typeof iniciarDedicatorias === 'function') iniciarDedicatorias(data.dedicatorias);
    }
}

/* Cargador de CSS de temas */
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

/* Antivirus de scroll. Arregla el bug en celular, jala que es lo importante */
document.addEventListener("DOMContentLoaded", () => {
    document.body.style.setProperty('touch-action', 'pan-y', 'important');
    document.documentElement.style.setProperty('touch-action', 'pan-y', 'important');

    const elementosBloqueados = document.querySelectorAll('.memory-card, .trivia-card, .carta, #app-container, .escena');
    
    elementosBloqueados.forEach(el => {
        el.style.setProperty('touch-action', 'pan-y', 'important');
    });
});