// core.js - El Director de Orquesta de Ravyn

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Extraer el cliente de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const cliente = urlParams.get('cliente');

    console.log("🔍 Cliente detectado en URL:", cliente);

    // 2. Definir la ruta. 
    // Si no hay cliente, buscamos un 'data.json' de ejemplo en la raíz.
    // Si hay cliente, entramos a la carpeta pedidos/nombre-del-cliente/data.json
    const rutaJson = cliente ? `./pedidos/${cliente}/data.json` : './data.json';

    console.log("📂 Intentando hacer fetch a:", rutaJson);

    try {
        const response = await fetch(rutaJson);
        
        if (!response.ok) {
            throw new Error(`No se encontró el archivo en: ${rutaJson} (Error ${response.status})`);
        }

        const dataCompleta = await response.json();
        console.log("✅ Datos cargados con éxito:", dataCompleta);

        // --- Aquí sigue tu lógica de cargarTemaGlobal e iniciar los módulos ---
        ejecutarModulos(dataCompleta);

    } catch (error) {
        console.error("❌ Error crítico:", error);
        document.body.innerHTML = `
            <div style="color:white; text-align:center; margin-top:20vh; font-family: sans-serif;">
                <h2>Ups, algo salió mal</h2>
                <p>${error.message}</p>
                <small>Asegúrate de que la URL sea: tuweb.com/?cliente=${cliente || 'nombre-del-carpeta'}</small>
            </div>`;
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