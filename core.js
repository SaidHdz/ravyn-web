// core.js - El Director de Orquesta de Ravyn

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. Buscamos si hay un cliente en la URL (ej: ravyn.com/?cliente=juan-maria)
        const parametros = new URLSearchParams(window.location.search);
        const cliente = parametros.get('cliente');
        
        // Si hay cliente, buscamos su carpeta. Si no, cargamos el data.json de prueba/demo.
        const rutaJson = cliente ? `pedidos/${cliente}/data.json` : 'data.json';

        // 2. Descargamos el gran JSON unificado UNA SOLA VEZ
        const response = await fetch(rutaJson);
        if (!response.ok) throw new Error(`Error cargando los datos del cliente: ${response.status}`);
        
        const dataCompleta = await response.json();

        // 3. Cargar el tema global
        // Buscamos el tema en el primer módulo que encontremos
        const temaGlobal = dataCompleta.nuestra_historia?.config?.tema || 
                           dataCompleta.trivia?.config?.tema || 
                           dataCompleta.tarjetas?.config?.tema || 
                           "aesthetic"; 
                           
        cargarTemaGlobal(temaGlobal);
        // INICIAR REPRODUCTOR GLOBAL
        // Busca la canción en la config general o donde la hayas mapeado en n8n
        const cancionURL = dataCompleta.nuestra_historia?.config?.cancion; 
        
        if (cancionURL && typeof iniciarReproductor === 'function') {
            iniciarReproductor(cancionURL);
        }

        // ... (resto de tus ifs para encender los módulos) ...
        // 4. ENCENDER MÓDULOS CONDICIONALMENTE
        
        // Módulo: Nuestra Historia
        if (dataCompleta.nuestra_historia) {
            document.getElementById('modulo-historia').classList.remove('oculto');
            // Le pasamos solo su pedacito de datos a la función inicializadora
            if (typeof iniciarHistoria === 'function') {
                iniciarHistoria(dataCompleta.nuestra_historia);
            }
        }

        // Módulo: Trivia
        if (dataCompleta.trivia) {
            document.getElementById('modulo-trivia').classList.remove('oculto');
            if (typeof iniciarTrivia === 'function') {
                iniciarTrivia(dataCompleta.trivia);
            }
        }

        // Módulo: Tarjetas
        if (dataCompleta.tarjetas) {
            document.getElementById('modulo-tarjetas').classList.remove('oculto');
            if (typeof iniciarTarjetas === 'function') {
                iniciarTarjetas(dataCompleta.tarjetas);
            }
        }

    } catch (error) {
        console.error("Error crítico iniciando Ravyn:", error);
        document.body.innerHTML = `<h2 style="color:white; text-align:center; margin-top:20vh;">Ups, no pudimos cargar esta experiencia. Verifica el enlace.</h2>`;
    }
});

// Función centralizada para cargar el CSS del tema
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