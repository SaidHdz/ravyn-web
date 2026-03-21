/* Archivo Tarjetas JS - Logica de cartas coleccionables y swipe */

let datos = {};
let cartasRestantes = [];

function iniciarTarjetas(data) {
    datos = data; 
    
    document.getElementById('mensaje-inicio').textContent = datos.config.mensaje_inicio;
    
    const paquete = document.getElementById('paquete-cartas');
    paquete.addEventListener('click', abrirPaquete);

    document.getElementById('btn-reiniciar').addEventListener('click', reiniciar);
}

/* Cambiar el CSS segun el tema*/
function loadTheme(themeName) {
    const head = document.head;
    
    const existingLink = document.getElementById('dynamic-theme');
    if (existingLink) {
        existingLink.remove();
    }

    const link = document.createElement('link');
    link.id = 'dynamic-theme';
    link.rel = 'stylesheet';
    link.href = `css/theme-${themeName}.css`; 
    head.appendChild(link);
    
    document.body.className = `theme-${themeName}`; 
    document.body.setAttribute('data-theme', themeName); 
}

/* Animacion de apertura segun el tema que traiga el JSON */
function abrirPaquete() {
    const paquete = document.getElementById('paquete-cartas');
    
    switch (datos.config.tema) {
        case 'minecraft':
            paquete.classList.add('abriendo-cofre');
            generarParticulas('minecraft', 25);
            break;
        case 'cute-soft':
            paquete.classList.add('abriendo-caja');
            generarParticulas('cute-soft', 30);
            break;
        case 'aesthetic':
            paquete.classList.add('abriendo-lujo');
            generarParticulas('aesthetic', 20);
            break;
    }

    paquete.classList.add('animacion-abrir'); 

    /* Tiempo calculado para que coincida con la animacion del CSS */
    setTimeout(() => {
        document.getElementById('escena-sobre').classList.replace('activa', 'oculta');
        document.getElementById('escena-cartas').classList.replace('oculta', 'activa');
        cargarCartasEnDOM();
    }, 1100);
}

/* Efectos visuales al abrir. Puro decorativo. */
function generarParticulas(tipo, cantidad) {
    const container = document.getElementById('paquete-cartas');
    for (let i = 0; i < cantidad; i++) {
        const particula = document.createElement('div');
        particula.classList.add('particula');
        
        const offsetLeft = (Math.random() - 0.5) * 60; 
        const offsetTop = (Math.random() - 0.5) * 60; 
        particula.style.left = `calc(50% + ${offsetLeft}px)`;
        particula.style.top = `calc(50% + ${offsetTop}px)`;
        particula.style.animationDelay = `${Math.random() * 0.3}s`;

        switch (tipo) {
            case 'minecraft': particula.classList.add('particula-bloque'); break;
            case 'cute-soft': particula.classList.add('particula-corazon'); break;
            case 'aesthetic': particula.classList.add('particula-chispa'); break;
        }
        container.appendChild(particula);
        
        setTimeout(() => particula.remove(), 1000);
    }
}

/* Mete las cartas al contenedor y las acomoda una encima de otra */
function cargarCartasEnDOM() {
    const stack = document.getElementById('stack-container');
    stack.innerHTML = '';
    cartasRestantes = [...datos.cartas].reverse(); 

    cartasRestantes.forEach((cartaData, index) => {
        const cartaEl = document.createElement('div');
        cartaEl.classList.add('carta');
        cartaEl.style.zIndex = index + 1;
        
        cartaEl.innerHTML = `
            <div class="carta-inner">
                <img src="${cartaData.imagen}" alt="${cartaData.titulo}" draggable="false">
                <h3>${cartaData.titulo}</h3>
                <p>${cartaData.contenido}</p>
            </div>
        `;
        
        stack.appendChild(cartaEl);

        /* Solo la carta de arriba de todo se puede mover */
        if (index === cartasRestantes.length - 1) {
            hacerDeslizable(cartaEl);
        }
    });
}

/* ESTA PARTE ES SAGRADA. Controla el swipe y el scroll en moviles. No le muevan a las mates. */
function hacerDeslizable(carta) {
    let isDragging = false;
    let isScrolling = false; 
    let startX = 0;
    let startY = 0;

    carta.addEventListener('pointerdown', (e) => {
        isDragging = true;
        isScrolling = false;
        startX = e.clientX;
        startY = e.clientY; 
        carta.style.transition = 'none'; 
    });

    carta.addEventListener('pointermove', (e) => {
        if (!isDragging) return;

        let diffX = e.clientX - startX;
        let diffY = e.clientY - startY;

        /* Detectar si el usuario quiere bajar la pantalla o mover la carta */
        if (!isScrolling) {
            if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 5) {
                isScrolling = true;
                isDragging = false; 
                carta.style.transform = ''; 
                return; 
            }
        }

        if (isScrolling) return;

        /* Mover la carta con rotacion leve segun la distancia */
        const rotacion = diffX * 0.05; 
        carta.style.transform = `translateX(${diffX}px) rotate(${rotacion}deg)`;
    });

    const handlePointerUp = (e) => {
        if (!isDragging || isScrolling) return;
        isDragging = false;
        carta.style.transition = 'transform 0.4s ease-out'; 

        const limiteDescarte = window.innerWidth * 0.25; 
        let diffX = e.clientX - startX;

        /* Si la movio lo suficiente, la lanza fuera de la pantalla */
        if (Math.abs(diffX) > limiteDescarte) {
            const direccion = diffX > 0 ? window.innerWidth : -window.innerWidth;
            carta.style.transform = `translateX(${direccion}px) rotate(${diffX * 0.1}deg)`;
            
            setTimeout(() => {
                carta.remove();
                cartasRestantes.pop();
                verificarFin();
            }, 400); 
        } else {
            /* Si no, la regresa al centro */
            carta.style.transform = `translateX(0px) rotate(0deg)`;
        }
    };

    carta.addEventListener('pointerup', handlePointerUp);
    carta.addEventListener('pointercancel', () => {
        isDragging = false;
        carta.style.transform = `translateX(0px) rotate(0deg)`;
    });
}

/* Revisa si ya no quedan cartas para pasar a la pantalla final */
function verificarFin() {
    if (cartasRestantes.length === 0) {
        document.getElementById('escena-cartas').classList.replace('activa', 'oculta');
        document.getElementById('escena-final').classList.replace('oculta', 'activa');
    } else {
        /* Habilitar el movimiento en la carta que quedo abajo */
        const stack = document.getElementById('stack-container');
        const nuevaCartaArriba = stack.lastElementChild;
        if (nuevaCartaArriba) hacerDeslizable(nuevaCartaArriba);
    }
}

/* Resetear todo el modulo */
function reiniciar() {
    document.getElementById('escena-final').classList.replace('activa', 'oculta');
    document.getElementById('escena-sobre').classList.replace('oculta', 'activa');
    const paquete = document.getElementById('paquete-cartas');
    paquete.classList.remove('animacion-abrir', 'abriendo-cofre', 'abriendo-caja', 'abriendo-lujo');
}