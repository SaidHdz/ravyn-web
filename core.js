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

/* Funcion para ejecutar y ordenar los modulos */
function ejecutarModulos(data) {
    /* Detecta el tema buscando en cada modulo */
    const tema = data.nuestra_historia?.config?.tema || 
                 data.trivia?.config?.tema || 
                 data.tarjetas?.config?.tema || 
                 data.evasivo?.config?.tema || 
                 data.contador?.config?.tema || 
                 data.dedicatorias?.config?.tema || "aesthetic"; 
    
    cargarTemaGlobal(tema);

    /* Iniciar musica */
    const cancionURL = data.nuestra_historia?.config?.cancion || 
                       data.trivia?.config?.cancion || 
                       data.tarjetas?.config?.cancion;
                       
    if (cancionURL && typeof iniciarReproductor === 'function') {
        iniciarReproductor(cancionURL);
    }
    /* Llenar el módulo de bienvenida fijo */
    if (data.bienvenida) {
        const elPareja = document.getElementById('bienvenida-pareja');
        const elMensaje = document.getElementById('bienvenida-mensaje');
        
        if (elPareja) elPareja.textContent = data.bienvenida.pareja;
        if (elMensaje) elMensaje.textContent = data.bienvenida.mensaje;
    }
    
    /*YA JALOOO*/
    const lienzo = document.getElementById('lienzo-ravyn');
    // Agregue un array en n8n que nos da el orden de los modulos en el html
    const orden = data.configuracion_global?.orden || [];

    // Iteramos sobre el array para activar y mover cada sección en el orden dictado
    orden.forEach(idModulo => {
        const mod = document.getElementById(idModulo);
        if (!mod) return;

        // 1. Lo hacemos visible
        mod.classList.remove('oculto');

        // 2. MAGIA NEGRA (pq soy moreno): Lo reinsertamos en el lienzo. 
        // js automáticamente lo moverá a la última posición actual del contenedor.
        if (lienzo) {
            lienzo.appendChild(mod);
        }

        // 3. Encendemos el script que le corresponde
        if (idModulo === 'modulo-historia' && data.nuestra_historia && typeof iniciarHistoria === 'function') {
            iniciarHistoria(data.nuestra_historia);
        }
        if (idModulo === 'modulo-trivia' && data.trivia && typeof iniciarTrivia === 'function') {
            iniciarTrivia(data.trivia);
        }
        if (idModulo === 'modulo-tarjetas' && data.tarjetas && typeof iniciarTarjetas === 'function') {
            iniciarTarjetas(data.tarjetas);
        }
        if (idModulo === 'modulo-evasivo' && data.evasivo && typeof iniciarEvasivo === 'function') {
            iniciarEvasivo(data.evasivo);
        }
        if (idModulo === 'modulo-contador' && data.contador && typeof iniciarContador === 'function') {
            iniciarContador(data.contador);
        }
        if (idModulo === 'modulo-dedicatorias' && data.dedicatorias && typeof iniciarDedicatorias === 'function') {
            iniciarDedicatorias(data.dedicatorias);
        }
        if (idModulo === 'modulo-wrapped' && data.wrapped && typeof iniciarWrapped === 'function') {
            iniciarWrapped(data.wrapped);
        }
    });
}
/*mlp js jeje*/

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