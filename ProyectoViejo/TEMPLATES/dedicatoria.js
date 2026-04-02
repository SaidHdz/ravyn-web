/* Archivo Dedicatoria JS - Coreografía y Control de Cartas */

let actualCartaIndex = 0;
let totalCartasNum = 0;
let datosDedicatoriasRaw = null; 

function iniciarDedicatorias(data) {
    datosDedicatoriasRaw = data;

    /* Inyectar Textos base */
    document.getElementById('mensaje-inicio-dedic').textContent = data.config.mensaje_inicio || "Toca el cofre para abrir...";
    
    /* Preparar el contenedor de las cartas */
    const stackContainer = document.getElementById('stack-container-dedic');
    stackContainer.innerHTML = ''; 
    totalCartasNum = 0; 

    data.cartas.forEach((carta, index) => {
        const cartaDOM = document.createElement('div');
        cartaDOM.className = 'carta'; 
        cartaDOM.id = `carta-dedic-${index}`; 
        
        cartaDOM.innerHTML = `
            <div class="carta-inner" style="border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; height: 100%;">
                <h3 class="pixel-text card-title" style="margin: 20px; font-size: 1.8rem; text-align: center;">${carta.titulo || `Carta ${index + 1}`}</h3>
                <p class="pixel-text card-description" style="margin: 0 20px 20px; font-size: 1.1rem; line-height: 1.6; overflow-y: auto; flex-grow: 1;">${carta.contenido || 'Sin mensaje...'}</p>
            </div>
        `;
        
        /* Posicion inicial de las cartas */
        cartaDOM.style.opacity = '0';
        cartaDOM.style.transform = 'translateZ(-200px) translateY(50px)';
        
        stackContainer.appendChild(cartaDOM);
        totalCartasNum++;
    });

    actualCartaIndex = 0;

    /* Eventos de interaccion */
    const paquete = document.getElementById('paquete-dedic');
    paquete.addEventListener('pointerdown', iniciarCoreografiaY2K, { once: true });

    const btnSwipe = document.getElementById('btn-swipe-dedic');
    btnSwipe.addEventListener('click', siguienteCartaDedicatoria);

    const btnReiniciar = document.getElementById('btn-reiniciar-dedic');
    btnReiniciar.addEventListener('click', reiniciarDedicatoria);
}

/* COREOGRAFIA DE ENTRADA, son puros tiempos calculados, no le muevan. */
function iniciarCoreografiaY2K() {
    const paquete = document.getElementById('paquete-dedic');
    paquete.classList.add('abriendo-cofre');

    const textoEl = document.getElementById('texto-secuencia-dedic');
    
    textoEl.className = 'header-title'; 
    textoEl.style.transition = 'none'; 
    textoEl.style.opacity = '0';
    textoEl.style.transform = 'translateY(50px) scale(0.5)';

    /* Cambio de escena 1 */
    setTimeout(() => {
        document.getElementById('escena-sobre-dedic').classList.add('oculta');
        document.getElementById('escena-sobre-dedic').classList.remove('activa');
        document.getElementById('escena-secuencia-dedic').classList.remove('oculta');
    }, 800);

    /* Aparece primer mensaje */
    setTimeout(() => {
        textoEl.textContent = datosDedicatoriasRaw.config.secuencia_1 || "Te quiero mucho..."; 
        textoEl.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'; 
        textoEl.style.opacity = '1';
        textoEl.style.transform = 'translateY(0) scale(1) rotate(-2deg)';
    }, 1000);

    /* Desaparece primer mensaje */
    setTimeout(() => {
        textoEl.style.transition = 'all 0.5s ease-in'; 
        textoEl.style.opacity = '0';
        textoEl.style.transform = 'translateY(-100px) scale(1.5)';
    }, 4000);

    setTimeout(() => {
        textoEl.style.transition = 'none'; 
        textoEl.style.transform = 'translateY(50px) scale(0.5)';
    }, 4600);

    /* Aparece segundo mensaje */
    setTimeout(() => {
        textoEl.textContent = datosDedicatoriasRaw.config.secuencia_2 || "Escribi esto para ti...";
        textoEl.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'; 
        textoEl.style.opacity = '1';
        textoEl.style.transform = 'translateY(0) scale(1) rotate(2deg)';
    }, 5000);

    /* Desaparece segundo mensaje */
    setTimeout(() => {
        textoEl.style.transition = 'all 0.5s ease-in'; 
        textoEl.style.opacity = '0';
        textoEl.style.transform = 'translateY(-100px) scale(1.5)';
    }, 8000);

    /* Escena final de las cartas */
    setTimeout(() => {
        document.getElementById('escena-secuencia-dedic').classList.add('oculta');
        
        actualizarVisualStack(); 

        document.getElementById('escena-cartas-dedic').classList.remove('oculta');
        
        if (totalCartasNum > 1) {
            document.getElementById('controles-cartas-dedic').classList.remove('oculto');
        }
        
        cargarCancionDedicatoria(0); 
        if(typeof lanzarConfetiEvasivo === 'function') lanzarConfetiEvasivo(); 

    }, 8600); 
}

/* Navegacion de las cartas */
function siguienteCartaDedicatoria() {
    if (actualCartaIndex >= totalCartasNum - 1) {
        mostrarEscenaFinalDedicatoria();
        return;
    }

    const cartaActualDOM = document.getElementById(`carta-dedic-${actualCartaIndex}`);
    
    /* Animacion de salida: Vuela a la izquierda */
    cartaActualDOM.style.transition = 'transform 0.6s cubic-bezier(0.8, -0.2, 0.2, 1.5), opacity 0.5s ease';
    cartaActualDOM.style.transform = 'translateX(-150vw) translateY(-20vh) rotate(-35deg) scale(0.8)';
    cartaActualDOM.style.opacity = '0';
    cartaActualDOM.style.pointerEvents = 'none'; 

    actualCartaIndex++;
    
    /* Cambiar cancion si la carta tiene una nueva */
    cargarCancionDedicatoria(actualCartaIndex);
    
    /* Acomodar el resto del stack */
    actualizarVisualStack();
}

/* Acomodo visual de las cartas */
function actualizarVisualStack() {
    const stack = document.querySelectorAll('#stack-container-dedic .carta');
    
    stack.forEach((carta, index) => {
        const i = index - actualCartaIndex;

        if (i < 0) return; 

        carta.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.6s ease';

        if (i === 0) {
            /* Al frente */
            carta.style.transform = 'translateZ(0) translateY(0) scale(1)';
            carta.style.opacity = '1';
            carta.style.zIndex = '10';
        } else if (i === 1) {
            /* Un paso atras */
            carta.style.transform = 'translateZ(-50px) translateY(15px) scale(0.95)';
            carta.style.opacity = '0.9'; 
            carta.style.zIndex = '5';
        } else if (i === 2) {
            /* Dos pasos atras */
            carta.style.transform = 'translateZ(-100px) translateY(30px) scale(0.9)';
            carta.style.opacity = '0.5';
            carta.style.zIndex = '2';
        } else {
            /* Muy atras o invisibles */
            carta.style.transform = 'translateZ(-150px) translateY(45px) scale(0.8)';
            carta.style.opacity = '0';
            carta.style.zIndex = '1';
        }
    });
}

function cargarCancionDedicatoria(index) {
    const urlCancion = datosDedicatoriasRaw.cartas[index].cancion;
    if (typeof cargarCancionEnReproductor === 'function' && urlCancion) {
        cargarCancionEnReproductor(urlCancion);
    }
}

/* Pantalla final */
function mostrarEscenaFinalDedicatoria() {
    const ultimaCarta = document.getElementById(`carta-dedic-${actualCartaIndex}`);
    if (ultimaCarta) {
        ultimaCarta.style.transition = 'transform 0.6s ease-in, opacity 0.5s';
        ultimaCarta.style.transform = 'translateY(-100vh) scale(0.8)';
        ultimaCarta.style.opacity = '0';
    }

    setTimeout(() => {
        document.getElementById('escena-cartas-dedic').classList.add('oculta');
        document.getElementById('controles-cartas-dedic').classList.add('oculto');
        document.getElementById('escena-final-dedic').classList.remove('oculta');
    }, 400); 
    
    if (typeof pausarReproductor === 'function') pausarReproductor();
}

function reiniciarDedicatoria() {
    actualCartaIndex = 0;
    
    document.getElementById('escena-final-dedic').classList.add('oculta');
    document.getElementById('escena-sobre-dedic').classList.remove('oculta');
    document.getElementById('escena-sobre-dedic').classList.add('activa');
    
    const paquete = document.getElementById('paquete-dedic');
    paquete.classList.remove('abriendo-cofre');
    paquete.addEventListener('pointerdown', iniciarCoreografiaY2K, { once: true });

    iniciarDedicatorias(datosDedicatoriasRaw); 
}