let datos = {};
let cartasRestantes = [];

function iniciarTarjetas(data) {
    datos = data; // Guardamos los datos globales para este módulo
    
    document.getElementById('mensaje-inicio').textContent = datos.config.mensaje_inicio;
    
    const paquete = document.getElementById('paquete-cartas');
    paquete.addEventListener('click', abrirPaquete);

    document.getElementById('btn-reiniciar').addEventListener('click', reiniciar);
}

    // --- TU FUNCIÓN INTEGRADORA DE TEMAS ---
    function loadTheme(themeName) {
        const head = document.head;
        
        // 1. Limpiar el CSS anterior si existe
        const existingLink = document.getElementById('dynamic-theme');
        if (existingLink) {
            existingLink.remove();
        }

        // 2. Crear y conectar el nuevo CSS global de tu proyecto
        const link = document.createElement('link');
        link.id = 'dynamic-theme';
        link.rel = 'stylesheet';
        link.href = `css/theme-${themeName}.css`; // Busca en tu carpeta css/
        head.appendChild(link);
        
        // 3. Aplicar las clases y atributos para que TODO funcione
        document.body.className = `theme-${themeName}`; // Para tu CSS global
        document.body.setAttribute('data-theme', themeName); // Para nuestro estilos_tarjetas.css
    }

    function inicializarApp() {
        // Ejecutamos tu función con el tema que venga del JSON
        loadTheme(datos.config.tema);

        document.getElementById('mensaje-inicio').textContent = datos.config.mensaje_inicio;
        
        // Preparar evento del cofre/paquete
        const paquete = document.getElementById('paquete-cartas');
        paquete.addEventListener('click', abrirPaquete);

        // Preparar botón de reinicio
        document.getElementById('btn-reiniciar').addEventListener('click', reiniciar);
    }

    // 2. Mecánica de Animación (Opening Pack)
    function abrirPaquete() {
        const paquete = document.getElementById('paquete-cartas');
        
        // Lógica de partículas según tema
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
            document.getElementById('escena-sobre').classList.replace('activa', 'oculta');
            document.getElementById('escena-cartas').classList.replace('oculta', 'activa');
            cargarCartasEnDOM();
        }, 1100);
    }

    // Generador de partículas
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

    // 3. Renderizado y Z-Index
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

            if (index === cartasRestantes.length - 1) {
                hacerDeslizable(cartaEl);
            }
        });
    }

    // 4. Mecánica de Interacción (Swipe Vanilla)
    function hacerDeslizable(carta) {
    let isDragging = false;
    let startX = 0;
    let startY = 0; // Añadimos rastro vertical

    carta.addEventListener('pointerdown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        carta.style.transition = 'none'; 
    });

    carta.addEventListener('pointermove', (e) => {
        if (!isDragging) return;

        let diffX = e.clientX - startX;
        let diffY = e.clientY - startY;

        // Si el usuario se mueve más hacia abajo que hacia los lados, 
        // cancelamos el drag de la carta para dejarlo scrollear la web.
        if (Math.abs(queryY) > Math.abs(diffX)) {
            isDragging = false;
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

            if (Math.abs(currentX) > limiteDescarte) {
                const direccion = currentX > 0 ? window.innerWidth : -window.innerWidth;
                carta.style.transform = `translateX(${direccion}px) rotate(${currentX * 0.1}deg)`;
                
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
        paquete.classList.remove('animacion-abrir', 'abriendo-cofre', 'abriendo-caja', 'abriendo-lujo');
    }