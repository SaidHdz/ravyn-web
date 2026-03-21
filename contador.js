/* Archivo Contador JS */

function iniciarContador(data) {
    /* Textos base */
    document.getElementById('contador-titulo').textContent = data.titulo || "Nuestro Tiempo";
    const mensajeEl = document.getElementById('contador-mensaje');
    mensajeEl.textContent = data.mensaje || "Cada instante a tu lado es especial.";

    const fechaObjetivo = new Date(data.fecha + 'T00:00:00');
    let intervaloReloj; 

    function actualizarReloj() {
        const ahora = new Date();
        const diferenciaBruta = fechaObjetivo - ahora; 

        let diasTotales, horas, minutos, segundos;

        /* Si el evento ya llego a cero, apaga el reloj y tira confeti */
        if (diferenciaBruta <= 0 && data.es_futuro) {
            clearInterval(intervaloReloj);
            
            document.getElementById('cont-anios').textContent = "00";
            document.getElementById('cont-meses').textContent = "00";
            document.getElementById('cont-dias').textContent = "00";
            document.getElementById('cont-horas').textContent = "00";
            document.getElementById('cont-minutos').textContent = "00";
            document.getElementById('cont-segundos').textContent = "00";
            
            mensajeEl.textContent = "¡El momento ha llegado!";
            mensajeEl.style.color = "#ff4757";
            mensajeEl.style.fontWeight = "bold";
            
            /* Si existe la funcion de confeti la llama, sino ni modo */
            if(typeof lanzarConfetiEvasivo === 'function') lanzarConfetiEvasivo();
            return;
        }

        /* Matematicas para calcular el tiempo exacto */
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

        /* Inyectar valores al HTML */
        document.getElementById('cont-anios').textContent = anios.toString().padStart(2, '0');
        document.getElementById('cont-meses').textContent = meses.toString().padStart(2, '0');
        document.getElementById('cont-dias').textContent = dias.toString().padStart(2, '0');
        document.getElementById('cont-horas').textContent = horas.toString().padStart(2, '0');
        document.getElementById('cont-minutos').textContent = minutos.toString().padStart(2, '0');
        document.getElementById('cont-segundos').textContent = segundos.toString().padStart(2, '0');
        
        /* Etiqueta para saber si es un evento futuro en la siguiente vuelta */
        if(diferenciaBruta > 0) data.es_futuro = true;
    }

    actualizarReloj();
    intervaloReloj = setInterval(actualizarReloj, 1000);
}