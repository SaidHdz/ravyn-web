function iniciarEvasivo(data) {
    // 1. Inyectar los textos personalizables
    document.getElementById('evasivo-pregunta').textContent = data.pregunta || "¿Quieres ser mi novia?";
    document.getElementById('btn-si').textContent = data.texto_si || "Sí";
    document.getElementById('btn-no').textContent = data.texto_no || "No";
    
    if(data.mensaje_exito) {
        document.getElementById('evasivo-mensaje-final').textContent = data.mensaje_exito;
    }

    const btnNo = document.getElementById('btn-no');
    const btnSi = document.getElementById('btn-si');
    const contenedorBotones = document.getElementById('contenedor-botones');

    // 2. Lógica para esquivar (Computadora: mouseover | Celular: touchstart)
    const moverBoton = (e) => {
        e.preventDefault(); // Evita el clic fantasma en móviles
        
        // Obtener dimensiones seguras para moverse
        const contenedorRect = contenedorBotones.getBoundingClientRect();
        const btnRect = btnNo.getBoundingClientRect();
        
        // Hacemos que pueda salirse del contenedor local y moverse por toda la tarjeta
        const maxX = 250; 
        const maxY = 150; 

        // Generar coordenadas aleatorias (positivas o negativas)
        const randomX = Math.floor(Math.random() * maxX) - (maxX / 2);
        const randomY = Math.floor(Math.random() * maxY) - (maxY / 2);

        btnNo.style.transform = `translate(${randomX}px, ${randomY}px)`;
    };

    // Eventos para desktop y mobile
    btnNo.addEventListener('mouseover', moverBoton);
    btnNo.addEventListener('touchstart', moverBoton, { passive: false });

    // 3. Lógica para cuando dicen "Sí"
    btnSi.addEventListener('click', () => {
        document.getElementById('evasivo-contenido').classList.add('oculto');
        document.getElementById('evasivo-exito').classList.remove('oculto');
        
        // Efecto de confeti casero
        lanzarConfetiEvasivo();
    });
}

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
        
        confeti.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
        ], { duration: 1000 + Math.random() * 1000, easing: 'cubic-bezier(0.25, 1, 0.5, 1)', fill: 'forwards' });
        
        carta.appendChild(confeti);
        setTimeout(() => confeti.remove(), 2000);
    }
}