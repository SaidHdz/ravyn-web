function iniciarEvasivo(data) {
    document.getElementById('evasivo-pregunta').textContent = data.pregunta || "¿Quieres ser mi novia?";
    document.getElementById('btn-si').textContent = data.texto_si || "Sí";
    document.getElementById('btn-no').textContent = data.texto_no || "No";
    
    if(data.mensaje_exito) {
        document.getElementById('evasivo-mensaje-final').textContent = data.mensaje_exito;
    }

    const btnNo = document.getElementById('btn-no');
    const btnSi = document.getElementById('btn-si');
    const contenedorBotones = document.getElementById('contenedor-botones');

    const moverBoton = (e) => {
        if (e) e.preventDefault(); 
        
        // Calculamos el tamaño del área de juego
        const areaWidth = contenedorBotones.offsetWidth;
        const areaHeight = contenedorBotones.offsetHeight;
        
        // Calculamos el tamaño del botón para que no se desborde
        const btnWidth = btnNo.offsetWidth;
        const btnHeight = btnNo.offsetHeight;

        // Coordenadas aleatorias dentro de la caja fuerte
        const randomX = Math.floor(Math.random() * (areaWidth - btnWidth));
        const randomY = Math.floor(Math.random() * (areaHeight - btnHeight));

        // Rompemos la alineación original (right) y aplicamos las nuevas coordenadas
        btnNo.style.right = 'auto'; 
        btnNo.style.left = `${randomX}px`;
        btnNo.style.top = `${randomY}px`;
    };

    // Atrapamos cualquier intento de darle clic
    btnNo.addEventListener('mouseover', moverBoton);
    btnNo.addEventListener('touchstart', moverBoton, { passive: false });
    btnNo.addEventListener('click', moverBoton);

    btnSi.addEventListener('click', () => {
        document.getElementById('evasivo-contenido').classList.add('oculto');
        document.getElementById('evasivo-exito').classList.remove('oculto');
        lanzarConfetiEvasivo();
    });
}

// (Deja tu función lanzarConfetiEvasivo() exactamente igual abajo de esto)
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