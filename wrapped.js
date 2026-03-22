/* wrapped.js - el motor de las historias */

let slidesData = [];
let slideActual = 0;
let tiempoPorSlide = 6000; /* 6 segs por default */
let animacionBarra;
let inicioTiempo;

function iniciarWrapped(dataWrapped) {
    if (!dataWrapped || !dataWrapped.diapositivas) return;
    
    slidesData = dataWrapped.diapositivas;
    tiempoPorSlide = (dataWrapped.config?.velocidad_slide_segundos || 6) * 1000;
    slideActual = 0;

    renderizarEstructura();
    mostrarSlide(0);
    
    /* clics para moverle a las historias */
    document.getElementById('wrapped-btn-prev').onclick = retrocederSlide;
    document.getElementById('wrapped-btn-next').onclick = avanzarSlide;
}

function renderizarEstructura() {
    const progressContainer = document.getElementById('wrapped-progress-container');
    const slidesArea = document.getElementById('wrapped-slides-area');
    
    progressContainer.innerHTML = '';
    slidesArea.innerHTML = '';

    slidesData.forEach((slide, index) => {
        /* las barritas de arriba */
        const bar = document.createElement('div');
        bar.className = 'wrapped-bar';
        bar.innerHTML = `<div class="wrapped-bar-fill" id="fill-${index}"></div>`;
        progressContainer.appendChild(bar);

        const slideDiv = document.createElement('div');
        slideDiv.className = 'wrapped-slide';
        slideDiv.id = `slide-ui-${index}`;
        
        let contenidoHTML = ``;

        /* titulo compacto */
        if(slide.tipo !== 'intro' && slide.tipo !== 'resumen') {
            contenidoHTML += `<h2 class="header-title" style="font-size: 1.8rem; margin-bottom: 10px; line-height: 1.2;">${slide.titulo}</h2>`;
        }
        
        /* generador de cada slide segun el tipo */
        switch(slide.tipo) {
            
            case 'intro':
                contenidoHTML += `
                    <div class="wrapped-loader"></div>
                    <h2 class="header-title" style="font-size: 2.5rem;">${slide.titulo}</h2>
                    <p class="card-description" style="font-size: 1.1rem; margin-top: 5px;">${slide.datos.subtitulo}</p>
                `;
                break;

            case 'metricas_chat':
                const emojisHTML = slide.datos.top_emojis.slice(0, 3).map(e => `<span>${e}</span>`).join(' ');
                contenidoHTML += `
                    <p class="card-description" style="margin: 0;">Se enviaron un total de</p>
                    <div class="numero-contador" data-target="${slide.datos.total_mensajes}">0</div>
                    <p class="card-description" style="margin: 0;">mensajes este año.</p>
                    
                    <div style="margin-top: 20px; background: rgba(0,0,0,0.2); padding: 10px 20px; border-radius: 12px; backdrop-filter: blur(5px);">
                        <p class="card-description" style="margin: 0; font-size: 0.8rem; text-transform: uppercase;">La palabra más usada:</p>
                        <span style="font-size: 1.8rem; font-weight: bold; color: inherit;">"${slide.datos.palabra_top}"</span>
                    </div>

                    <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: center; font-size: 2.2rem;">
                        ${emojisHTML} 
                    </div>
                `;
                break;

            case 'grafica_dona':
                const p1_dona = slide.datos.valores[0];
                const c1_dona = slide.datos.colores[0];
                const c2_dona = slide.datos.colores[1];
                contenidoHTML += `
                    <p class="card-description" style="margin-bottom: 10px;">${slide.datos.subtitulo}</p>
                    <div class="wrapped-dona-container" style="background: conic-gradient(${c1_dona} 0% ${p1_dona}%, ${c2_dona} ${p1_dona}% 100%);">
                        <div class="wrapped-dona-hueco">VS</div>
                    </div>
                    <div style="display: flex; width: 100%; justify-content: space-around; margin-top: 10px;">
                        <div style="text-align: center;">
                            <span style="color: ${c1_dona}; font-size: 1.8rem; font-weight: bold;">${p1_dona}%</span>
                            <p class="card-description" style="font-size: 0.9rem;">${slide.datos.etiquetas[0]}</p>
                        </div>
                        <div style="text-align: center;">
                            <span style="color: ${c2_dona}; font-size: 1.8rem; font-weight: bold;">${slide.datos.valores[1]}%</span>
                            <p class="card-description" style="font-size: 0.9rem;">${slide.datos.etiquetas[1]}</p>
                        </div>
                    </div>
                `;
                break;

            case 'grafica_barras':
                let barrasHTML = '';
                slide.datos.items.forEach(item => {
                    barrasHTML += `
                        <div class="wrapped-barra-item">
                            <div class="wrapped-barra-etiqueta" style="font-size: 0.9rem;">${item.nombre}</div>
                            <div class="wrapped-barra-track">
                                <div class="wrapped-barra-fill" style="background: ${item.color}; width: ${item.porcentaje}%;">
                                    ${item.porcentaje}%
                                </div>
                            </div>
                        </div>
                    `;
                });
                contenidoHTML += `
                    <p class="card-description" style="margin-bottom: 15px;">${slide.datos.subtitulo}</p>
                    <div style="width: 100%;">${barrasHTML}</div>
                `;
                break;

            case 'horario_pico':
                let ondasHTML = '';
                const picos = slide.datos.valores; 
                picos.forEach(h => {
                    ondasHTML += `<div style="flex-grow: 1; background: var(--nj-red-neon, var(--y2k-pink-neon, var(--mc-text-green, var(--cute-accent-blue, var(--accent-glow, #fff))))); height: ${h}%; border-radius: 10px; transition: height 1s ease-out; opacity: 0.6;"></div>`;
                });
                
                contenidoHTML += `
                    <p class="card-description" style="margin-bottom: 20px;">${slide.datos.subtitulo}</p>
                    <div style="width: 100%; height: 120px; display: flex; gap: 4px; align-items: flex-end; margin-bottom: 10px;">
                        ${ondasHTML}
                    </div>
                    <div style="width: 100%; display: flex; justify-content: space-between; font-size: 0.8rem; color: #aaa;">
                        <span>Mañana</span>
                        <span>Tarde</span>
                        <span style="color: #fff; font-weight:bold;">Noche (${slide.datos.pico_hora})</span>
                        <span>Madrugada</span>
                    </div>
                `;
                break;

            case 'medidor_perdon':
                contenidoHTML += `
                    <p class="card-description" style="margin-bottom: 15px;">${slide.datos.subtitulo}</p>
                    <div style="width: 160px; height: 160px; margin: 0 auto; position: relative;">
                        <svg viewBox="0 0 100 100" style="width: 100%; height: 100%; position: absolute; top:0; left:0;">
                            <path d="M 15 80 A 45 45 0 1 1 85 80" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="10" stroke-linecap="round"/>
                        </svg>
                        <svg viewBox="0 0 100 100" style="width: 100%; height: 100%; position: absolute; top:0; left:0; transform: rotate(-90deg); transform-origin: center;">
                            <path id="perdon-perimetro" d="M 50 10 A 40 40 0 0 1 50 90 A 40 40 0 0 1 50 10" fill="none" stroke="var(--nj-gold, var(--y2k-cyan, var(--mc-text-green, var(--cute-accent-blue, var(--accent-glow, #fff)))))" stroke-width="10" stroke-linecap="round" stroke-dasharray="251.2" stroke-dashoffset="125.6"/>
                        </svg>
                        <div style="position: absolute; top: 60%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                            <span style="font-size: 2.2rem; font-weight: bold; color: inherit;">${slide.datos.valor}</span>
                            <p style="font-size: 0.7rem; opacity: 0.7; text-transform: uppercase;">Ataques de orgullo</p>
                        </div>
                    </div>
                    <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: center; background: rgba(0,0,0,0.2); padding: 10px 20px; border-radius: 12px; backdrop-filter: blur(5px);">
                        <div style="font-size: 1.5rem;">👑</div>
                        <p class="card-description" style="margin: 0; font-size: 1rem;">El primero en perdonar es: <span style="font-weight:bold; color:#fff;">${slide.datos.perdonador_top}</span></p>
                    </div>
                `;
                break;

            case 'soundtrack':
                contenidoHTML += `
                    <p class="card-description" style="margin: 0;">Su energía este año sonó así...</p>
                    <iframe class="spotify-embed" src="${slide.datos.spotify_embed_url}" allow="encrypted-media"></iframe>
                `;
                break;

            case 'superlativo_custom':
                contenidoHTML += `
                    <div style="font-size: 4rem; margin: 15px 0;">${slide.datos.icono_award}</div>
                    <h3 class="header-title" style="font-size: 2.2rem; margin: 5px 0;">${slide.datos.ganador}</h3>
                    <p class="card-description" style="font-size: 1rem; margin-top: 10px;">${slide.datos.subtitulo}</p>
                `;
                break;
                
            case 'resumen':
                contenidoHTML += `
                    <div style="border: 2px dashed rgba(255,255,255,0.3); padding: 15px 10px; border-radius: 15px; background: rgba(0,0,0,0.3);">
                        <h2 class="header-title" style="font-size: 1.5rem; margin-bottom: 5px;">${slide.titulo}</h2>
                        <h1 style="font-size: 3.5rem; margin: 5px 0; line-height: 1;">${slide.datos.dias_juntos}</h1>
                        <p class="card-description" style="font-size: 0.8rem;">DÍAS JUNTOS</p>
                        <div class="pixel-divider" style="margin: 10px 0;"></div>
                        <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                            <div>
                                <span style="font-size: 1.8rem; font-weight: bold; color: inherit;">${slide.datos.total_mensajes}</span>
                                <p style="font-size: 0.7rem; opacity: 0.7; margin:0; text-transform: uppercase;">Msjs Enviados</p>
                            </div>
                            <div>
                                <span style="font-size: 1.8rem;">${slide.datos.emoji_top}</span>
                                <p style="font-size: 0.7rem; opacity: 0.7; margin:0; text-transform: uppercase;">Emoji Top</p>
                            </div>
                        </div>
                    </div>
                    <p class="card-description" style="margin-top: 15px; font-size: 0.8rem;">(Toma screenshot para presumir)</p>
                `;
                break;
        }

        slideDiv.innerHTML = contenidoHTML;
        slidesArea.appendChild(slideDiv);
    });
}

/* esta madre hace que el numero suba pro. alch no se como pero jala y no le muevan. */
function animarContadores(contenedor) {
    const contadores = contenedor.querySelectorAll('.numero-contador');
    contadores.forEach(contador => {
        const target = parseInt(contador.getAttribute('data-target'));
        const count = +contador.innerText.replace(/,/g, ''); 
        
        if (count === target) return; 

        const speed = 80; 
        const inc = target / speed;

        function updateCount() {
            const current = +contador.innerText.replace(/,/g, ''); 
            if (current < target) {
                const nuevoValor = Math.ceil(current + inc);
                contador.innerText = nuevoValor.toLocaleString('es-MX');
                setTimeout(updateCount, 15);
            } else {
                contador.innerText = target.toLocaleString('es-MX');
            }
        }
        updateCount();
    });
}

function mostrarSlide(index) {
    document.querySelectorAll('.wrapped-slide').forEach(el => el.classList.remove('activa'));
    slidesData.forEach((_, i) => {
        const fill = document.getElementById(`fill-${i}`);
        if (i < index) fill.style.width = '100%';
        if (i > index) fill.style.width = '0%';
    });

    const slideActualDOM = document.getElementById(`slide-ui-${index}`);
    if(slideActualDOM) {
        slideActualDOM.classList.add('activa');
        /* alch aqui empieza la magia del contador */
        animarContadores(slideActualDOM); 
    }

    iniciarBarraProgreso(index);
}

function iniciarBarraProgreso(index) {
    cancelAnimationFrame(animacionBarra);
    const fill = document.getElementById(`fill-${index}`);
    inicioTiempo = performance.now();

    function animar(tiempoActual) {
        const progreso = tiempoActual - inicioTiempo;
        const porcentaje = Math.min((progreso / tiempoPorSlide) * 100, 100);
        fill.style.width = `${porcentaje}%`;

        if (porcentaje < 100) {
            animacionBarra = requestAnimationFrame(animar);
        } else {
            avanzarSlide();
        }
    }
    animacionBarra = requestAnimationFrame(animar);
}

function avanzarSlide() {
    if (slideActual < slidesData.length - 1) {
        slideActual++;
        mostrarSlide(slideActual);
    }
}

function retrocederSlide() {
    if (slideActual > 0) {
        slideActual--;
        mostrarSlide(slideActual);
    } else {
        mostrarSlide(0);
    }
}