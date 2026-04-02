/* Archivo Evasivo JS - El boton que huye */

function iniciarEvasivo(data) {
    /* Inyectar textos de la pregunta y botones */
    document.getElementById('evasivo-pregunta').textContent = data.pregunta || "¿Quieres ser mi novia?";
    document.getElementById('btn-si').textContent = data.texto_si || "Sí";
    document.getElementById('btn-no').textContent = data.texto_no || "No";
    
    if(data.mensaje_exito) {
        document.getElementById('evasivo-mensaje-final').textContent = data.mensaje_exito;
    }

    const recuadroNo = document.getElementById('btn-no'); 
    const btnSi = document.getElementById('btn-si');
    const contenedorBotones = document.getElementById('contenedor-botones');

    let escalaActual = 1.0; 

    /* Logica para calcular el salto del boton. Alch no se como pero jala y que no le muevan. */
    const moverRecuadro = (e) => {
        /* Evita clics fantasma en celulares */
        if (e && e.type === 'touchstart') e.preventDefault(); 
        
        /* El boton se hace mas chico cada vez que intentan picarle */
        if (escalaActual > 0.25) { 
            escalaActual -= 0.09; 
        }
        recuadroNo.style.transform = `scale(${escalaActual})`;

        const areaWidth = contenedorBotones.offsetWidth;
        const areaHeight = contenedorBotones.offsetHeight;
        
        const btnWidth = recuadroNo.offsetWidth * escalaActual; 
        const btnHeight = recuadroNo.offsetHeight * escalaActual;

        const siRect = btnSi.getBoundingClientRect();
        const containerRect = contenedorBotones.getBoundingClientRect();
        
        const siLeft = siRect.left - containerRect.left;
        const siTop = siRect.top - containerRect.top;
        const siRight = siLeft + siRect.width;
        const siBottom = siTop + siRect.height;

        const margenSeguridad = 15; 

        let randomX, randomY;
        let empalmado = true;
        let intentos = 0;

        /* Busca un lugar libre donde no tape al boton del SI (igual lo  tapa ksjkajs) */
        while (empalmado && intentos < 30) { 
            randomX = Math.floor(Math.random() * (areaWidth - btnWidth));
            randomY = Math.floor(Math.random() * (areaHeight - btnHeight));

            const noRight = randomX + btnWidth;
            const noBottom = randomY + btnHeight;

            if (
                randomX < siRight + margenSeguridad &&
                noRight > siLeft - margenSeguridad &&
                randomY < siBottom + margenSeguridad &&
                noBottom > siTop - margenSeguridad
            ) {
                empalmado = true;
                intentos++;
            } else {
                empalmado = false; 
            }
        }

        recuadroNo.style.right = 'auto'; 
        recuadroNo.style.left = `${randomX}px`;
        recuadroNo.style.top = `${randomY}px`;
    };

    /* Eventos para PC y moviles */
    recuadroNo.addEventListener('mouseover', moverRecuadro); 
    recuadroNo.addEventListener('touchstart', moverRecuadro, { passive: false }); 
    recuadroNo.addEventListener('pointerdown', moverRecuadro); 

    /* Cuando por fin le pican al SI */
    btnSi.addEventListener('click', () => {
        document.getElementById('evasivo-contenido').classList.add('oculto');
        document.getElementById('evasivo-exito').classList.remove('oculto');
        lanzarConfetiEvasivo();
    });
}

/* Efecto de confeti casero */
function lanzarConfetiEvasivo() {
    const carta = document.getElementById('carta-evasiva');
    for (let i = 0; i < 30; i++) {
        const confeti = document.createElement('div');
        confeti.style.position = 'absolute';
        confeti.style.width = '10px';
        confeti.style.height = '10px';
        confeti.style.backgroundColor = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#ff69b4'][Math.floor(Math.random() * 5)];
        confeti.style.left = '50%';
        confeti.style.top = '50%';
        confeti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confeti.style.pointerEvents = 'none';
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        /* Animacion de explosion de colores */
        confeti.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
        ], { duration: 1000 + Math.random() * 1000, easing: 'cubic-bezier(0.25, 1, 0.5, 1)', fill: 'forwards' });
        
        carta.appendChild(confeti);
        setTimeout(() => confeti.remove(), 2000);
    }
}