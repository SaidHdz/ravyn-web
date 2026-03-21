function iniciarContador(data) {
    document.getElementById('contador-titulo').textContent = data.titulo || "Nuestro Tiempo";
    const mensajeEl = document.getElementById('contador-mensaje');
    mensajeEl.textContent = data.mensaje || "Cada instante a tu lado es especial.";

    const fechaObjetivo = new Date(data.fecha + 'T00:00:00');
    let intervaloReloj; // Guardamos el intervalo para poder detenerlo

    function actualizarReloj() {
        const ahora = new Date();
        const diferenciaBruta = fechaObjetivo - ahora; // Positivo si es futuro, negativo si es pasado

        // VARIABLES DE TIEMPO
        let diasTotales, horas, minutos, segundos;

        if (diferenciaBruta <= 0 && data.es_futuro) {
            // EL EVENTO FUTURO YA LLEGÓ (¡Llegó a cero!)
            clearInterval(intervaloReloj);
            
            document.getElementById('cont-anios').textContent = "00";
            document.getElementById('cont-meses').textContent = "00";
            document.getElementById('cont-dias').textContent = "00";
            document.getElementById('cont-horas').textContent = "00";
            document.getElementById('cont-minutos').textContent = "00";
            document.getElementById('cont-segundos').textContent = "00";
            
            mensajeEl.textContent = "¡El momento ha llegado! 🎉";
            mensajeEl.style.color = "#ff4757";
            mensajeEl.style.fontWeight = "bold";
            
            // Reutilizamos la función de confeti si existe
            if(typeof lanzarConfetiEvasivo === 'function') lanzarConfetiEvasivo();
            return;
        }

        // Si es pasado (cuenta cuánto llevan) o futuro (aún no llega)
        const diferencia = Math.abs(diferenciaBruta);
        const segundosTotales = Math.floor(diferencia / 1000);
        const minutosTotales = Math.floor(segundosTotales / 60);
        const horasTotales = Math.floor(minutosTotales / 60);
        diasTotales = Math.floor(horasTotales / 24);

        const anios = Math.floor(diasTotales / 365);
        const meses = Math.floor((diasTotales % 365) / 30);
        const dias = Math.floor((diasTotales % 365) % 30);

        horas = horasTotales % 24;
        minutos = minutosTotales % 60;
        segundos = segundosTotales % 60;

        // Inyectar al DOM
        document.getElementById('cont-anios').textContent = anios.toString().padStart(2, '0');
        document.getElementById('cont-meses').textContent = meses.toString().padStart(2, '0');
        document.getElementById('cont-dias').textContent = dias.toString().padStart(2, '0');
        document.getElementById('cont-horas').textContent = horas.toString().padStart(2, '0');
        document.getElementById('cont-minutos').textContent = minutos.toString().padStart(2, '0');
        document.getElementById('cont-segundos').textContent = segundos.toString().padStart(2, '0');
        
        // Etiquetamos en el objeto si es un evento futuro para la próxima iteración
        if(diferenciaBruta > 0) data.es_futuro = true;
    }

    actualizarReloj();
    intervaloReloj = setInterval(actualizarReloj, 1000);
}