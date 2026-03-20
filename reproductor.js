// reproductor.js - Módulo de Música Multiplataforma

function iniciarReproductor(urlCancion) {
    if (!urlCancion) return; // Si no hay canción, no hacemos nada

    const contenedor = document.getElementById('reproductor-contenedor');
    const reproductorDOM = document.getElementById('reproductor-flotante');
    let iframeSrc = '';
    let altura = '80'; // Altura estándar para reproductores pequeños

    // 1. Detectar si es Spotify
    if (urlCancion.includes('spotify.com')) {
        // Convierte: open.spotify.com/track/... -> open.spotify.com/embed/track/...
        iframeSrc = urlCancion.replace('spotify.com/', 'spotify.com/embed/');
        altura = '80';
    } 
    // 2. Detectar si es Apple Music
    else if (urlCancion.includes('music.apple.com')) {
        // Convierte: music.apple.com/... -> embed.music.apple.com/...
        iframeSrc = urlCancion.replace('music.apple.com', 'embed.music.apple.com');
        altura = '150'; // Apple Music necesita un poco más de altura
    } 
    // 3. Detectar si es YouTube o YouTube Music
    else if (urlCancion.includes('youtube.com') || urlCancion.includes('youtu.be') || urlCancion.includes('music.youtube.com')) {
        let videoId = '';
        if (urlCancion.includes('v=')) {
            videoId = urlCancion.split('v=')[1].split('&')[0];
        } else if (urlCancion.includes('youtu.be/')) {
            videoId = urlCancion.split('youtu.be/')[1].split('?')[0];
        }
        // Crea el link embed de YouTube
        iframeSrc = `https://www.youtube.com/embed/${videoId}?rel=0`;
        altura = '80'; // Ocultamos el video dejándolo bajito, solo mostramos controles
    }

    // 4. Inyectar el Iframe si encontramos una URL válida
    if (iframeSrc) {
        contenedor.innerHTML = `
            <iframe 
                src="${iframeSrc}" 
                width="100%" 
                height="${altura}" 
                frameborder="0" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                style="border-radius: 8px;">
            </iframe>
        `;
        reproductorDOM.classList.remove('oculto');
    }
}