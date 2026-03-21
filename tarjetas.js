let datos = {};
let cartasRestantes = [];

// === INICIALIZACIÓN ===
function iniciarTarjetas(data) {
    datos = data; 
    
    document.getElementById('mensaje-inicio').textContent = datos.config.mensaje_inicio;
    
    const paquete = document.getElementById('paquete-cartas');
    // Re-vinculamos el evento por seguridad
    paquete.replaceWith(paquete.cloneNode(true));
    document.getElementById('paquete-cartas').addEventListener('click', abrirPaquete);

    const btnReiniciar = document.getElementById('btn-reiniciar');
    if(btnReiniciar) {
        btnReiniciar.replaceWith(btnReiniciar.cloneNode(true));
        document.getElementById('btn-reiniciar').addEventListener('click', reiniciar);
    }
}

// === ANIMACIÓN DEL PAQUETE ===
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

    setTimeout(() => {
        const escenaSobre = document.getElementById('escena-sobre');
        const escenaCartas = document.getElementById('escena-cartas');
        if(escenaSobre) escenaSobre.classList.replace('activa', 'oculta');
        if(escenaCartas) escenaCartas.classList.replace('oculta', 'activa');
        cargarCartasEnDOM();
    }, 1100);
}

// === SISTEMA DE PARTÍCULAS ===
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

// === RENDERIZAR LAS CARTAS ===
function cargarCartasEnDOM() {
    const stack = document.getElementById('stack-container');
    if(!stack) return;
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

        if (index === cartasRestantes.length - 1) {
            hacerDeslizable(cartaEl);
        }
    });
}

// === LÓGICA DE SWIPE (TACTO) ===
function hacerDeslizable(carta) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    carta.addEventListener('pointerdown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        carta.style.transition = 'none'; 
        carta.setPointerCapture(e.pointerId);
    });

    carta.addEventListener('pointermove', (e) => {
        if (!isDragging) return;

        let diffX = e.clientX - startX;
        let diffY = e.clientY - startY;

        // EL SECRETO PARA EL S22: Si mueve el dedo más en Y que en X, déjalo hacer scroll
        if (Math.abs(diffY) > Math.abs(diffX)) {
            return; 
        }

        const rotacion = diffX * 0.05; 
        carta.style.transform = `translateX(${diffX}px) rotate(${rotacion}deg)`;
    });

    const handlePointerUp = (e) => {
        if (!isDragging) return;
        isDragging = false;
        carta.style.transition = 'transform 0.4s ease-out'; 

        const limiteDescarte = window.innerWidth * 0.25; 
        let diffX = e.clientX - startX;

        if (Math.abs(diffX) > limiteDescarte) {
            const direccion = diffX > 0 ? window.innerWidth : -window.innerWidth;
            carta.style.transform = `translateX(${direccion}px) rotate(${diffX * 0.1}deg)`;
            
            setTimeout(() => {
                carta.remove();
                cartasRestantes.pop();
                verificarFin();
            }, 400); 
        } else {
            carta.style.transform = `translateX(0px) rotate(0deg)`;
        }
    };

    carta.addEventListener('pointerup', handlePointerUp);
    carta.addEventListener('pointercancel', handlePointerUp);
}

// === FINAL Y REINICIO ===
function verificarFin() {
    if (cartasRestantes.length === 0) {
        document.getElementById('escena-cartas').classList.replace('activa', 'oculta');
        document.getElementById('escena-final').classList.replace('oculta', 'activa');
    } else {
        const stack = document.getElementById('stack-container');
        const nuevaCartaArriba = stack.lastElementChild;
        if (nuevaCartaArriba) hacerDeslizable(nuevaCartaArriba);
    }
}

function reiniciar() {
    document.getElementById('escena-final').classList.replace('activa', 'oculta');
    document.getElementById('escena-sobre').classList.replace('oculta', 'activa');
    const paquete = document.getElementById('paquete-cartas');
    if(paquete) paquete.classList.remove('animacion-abrir', 'abriendo-cofre', 'abriendo-caja', 'abriendo-lujo');
}
