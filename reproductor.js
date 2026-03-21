/* musica.js - reproductor pro */

const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let reproductorYT = null;
let apiYTLista = false;

/* aviso de que la api ya cargo */
function onYouTubeIframeAPIReady() {
    apiYTLista = true;
}

function iniciarReproductor(url) {
    cargarCancionEnReproductor(url);
}

function cargarCancionEnReproductor(url) {
    const contenedor = document.getElementById('reproductor-contenedor');
    const flotante = document.getElementById('reproductor-flotante');

    if (!contenedor || !url) return;

    flotante.classList.remove('oculto');
    contenedor.innerHTML = ''; 
    pausarReproductorYT(); 

    /* spotify */
    if (url.includes('spotify.com')) {
        const trackId = extraerIDSpotify(url);
        if (trackId) {
            contenedor.innerHTML = `
                <iframe style="border-radius:12px" 
                src="https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0" 
                width="100%" height="80" frameBorder="0" allowfullscreen="" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy">
                </iframe>`;
        }
    } 
    /* youtube o music */
    else if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = extraerIDYouTube(url);
        if (videoId) {
            /* ui del reproductor */
            contenedor.innerHTML = `
                <div style="position: relative; display: flex; align-items: center; background: rgba(30, 30, 30, 0.85); backdrop-filter: blur(10px); padding: 10px 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); width: 100%; box-shadow: 0 10px 25px rgba(0,0,0,0.5); overflow: hidden;">
                    
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; opacity: 0.01; pointer-events: none;">
                        <div id="yt-player-hidden"></div>
                    </div>
                    
                    <button id="btn-yt-play" style="background: #ff66cc; border: none; border-radius: 50%; width: 45px; height: 45px; display: flex; justify-content: center; align-items: center; cursor: pointer; margin-right: 15px; z-index: 1;">
                        <span id="yt-icon" style="color: white; font-size: 1.2rem; margin-left: 3px;">▶</span>
                    </button>
                    
                    <div style="flex-grow: 1; display: flex; flex-direction: column; z-index: 1;">
                        <span style="color: white; font-family: 'Inter', sans-serif; font-size: 0.85rem; font-weight: bold;">Música de Fondo</span>
                        <span id="yt-status" style="color: #ffb3e6; font-family: 'Inter', sans-serif; font-size: 0.7rem;">YouTube Audio (Vol 30%)</span>
                    </div>
                </div>
            `;
            iniciarAPIYouTube(videoId);
        }
    }
}
/* Tanto tiempo haciendo esta madre como para que salga que tienen copi las canciones vtalv jasajja */


/* controlador de la api de yt */
function iniciarAPIYouTube(videoId) {
    if (!apiYTLista) {
        setTimeout(() => iniciarAPIYouTube(videoId), 500);
        return;
    }


    if (reproductorYT && typeof reproductorYT.destroy === 'function') {
        reproductorYT.destroy();
    }

    reproductorYT = new YT.Player('yt-player-hidden', {
        height: '240', // Tamaño mínimo sugerido para que YT no bloquee la música
        width: '320',  
        videoId: videoId,
        playerVars: {
            'autoplay': 1,
            'controls': 0,
            'playsinline': 1,
            'rel': 0,
            'enablejsapi': 1,
            'origin': window.location.origin
        },
        events: {
            'onReady': (e) => {
                e.target.setVolume(30); 
                e.target.playVideo();
            },
            'onStateChange': onPlayerStateChange,
            'onError': (e) => {
                // Capturar el error para saber si la disquera bloqueó el iframe
                console.error("Error de YT API:", e.data);
                const statusElement = document.getElementById('yt-status');
                if (e.data === 101 || e.data === 150) {
                    if(statusElement) statusElement.textContent = "Error: Canción protegida por Copyright";
                } else {
                    if(statusElement) statusElement.textContent = "Error al reproducir video";
                }
            }
        }
    });

    /* play y pausa manual (Se mantiene igual) */
    document.getElementById('btn-yt-play').addEventListener('click', () => {
        if (reproductorYT && typeof reproductorYT.getPlayerState === 'function') {
            const estado = reproductorYT.getPlayerState();
            if (estado === 1) { 
                reproductorYT.pauseVideo();
            } else {
                reproductorYT.playVideo();
            }
        }
    });
}

function onPlayerStateChange(event) {
    const icon = document.getElementById('yt-icon');
    if (!icon) return;
    icon.textContent = (event.data === 1) ? '||' : '▶';
}

function pausarReproductor() {
    pausarReproductorYT();
}

function pausarReproductorYT() {
    if (reproductorYT && typeof reproductorYT.pauseVideo === 'function') {
        reproductorYT.pauseVideo();
    }
}

/* sacar id de spotify */
function extraerIDSpotify(url) {
    const match = url.match(/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
}

/* sacar id de youtube y music */
function extraerIDYouTube(url) {
    /* saca el id incluso de links music.youtube */
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}