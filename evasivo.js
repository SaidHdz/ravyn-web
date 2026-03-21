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

    // 2. Lógica para esquivar (Optimizada para PC y Móvil usando toda la pantalla)
    const moverBoton = (e) => {
        if (e) e.preventDefault(); // Evita clics fantasma

        // Cambiamos el botón a fixed para que pueda viajar por toda la pantalla
        btnNo.style.position = 'fixed';
        btnNo.style.margin = '0';
        btnNo.style.transform = 'none'; // Quitamos el transform por si lo tenía

        // Calculamos el espacio seguro (Tamaño de la pantalla menos el tamaño del botón)
        // Le restamos 20px extra para que no se pegue a los bordes exactos
        const anchoSeguro = window.innerWidth - btnNo.offsetWidth - 20;
        const altoSeguro = window.innerHeight - btnNo.offsetHeight - 20;

        // Generamos coordenadas aleatorias dentro de la pantalla
        const randomX = Math.floor(Math.random() * anchoSeguro) + 10;
        const randomY = Math.floor(Math.random() * altoSeguro) + 10;

        // Movemos el botón
        btnNo.style.left = `${randomX}px`;
        btnNo.style.top = `${randomY}px`;
    };

    // 3. Atrapamos TODOS los eventos
    btnNo.addEventListener('mouseover', moverBoton); // Para PC
    btnNo.addEventListener('touchstart', moverBoton, { passive: false }); // Para Móviles
    btnNo.addEventListener('click', moverBoton); // MAGIA: Si logras darle clic, huye de todos modos

    // 4. Lógica para cuando dicen "Sí"
    btnSi.addEventListener('click', () => {
        document.getElementById('evasivo-contenido').classList.add('oculto');
        document.getElementById('evasivo-exito').classList.remove('oculto');
        
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