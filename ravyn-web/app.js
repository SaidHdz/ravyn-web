/* Archivo App JS - Logica principal de la interfaz */

const galleryContainer = document.getElementById('history-gallery');
const modalOverlay = document.getElementById('moment-modal');
const closeModalBtn = document.getElementById('close-modal');

const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDate = document.getElementById('modal-date');
const modalLocation = document.getElementById('modal-location');
const modalText = document.getElementById('modal-text');

/* Cargador de temas */
function loadTheme(themeName) {
    const head = document.head;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `css/theme-${themeName}.css`; 
    head.appendChild(link);

    document.body.className = `theme-${themeName}`;
}

/* LOGICA DEL EASTER EGG (Tres clics y sale la sorpresa) */
const subtitleElement = document.querySelector('.page-header p');
let secretClicks = 0;

if(subtitleElement) {
    subtitleElement.classList.add('easter-egg-trigger'); 
    
    subtitleElement.addEventListener('click', () => {
        secretClicks++;
        
        if (secretClicks === 3) {
            secretClicks = 0; 
            unlockSecretMemory();
        }
    });
}

/* Funcion para mostrar la carta oculta, ni uso esta madre pero quedo gud */
function unlockSecretMemory() {
    if (document.getElementById('secret-card')) return;

    const secretData = {
        id: "secret-001",
        photo_url: "https://images.unsplash.com/photo-1576063660504-890250766336?w=600", 
        titulo: "Logro Desbloqueado",
        descripcion_corta: "Encontraste el nivel secreto...",
        texto_largo: "Hackeaste el sistema. Queria dejar este mensaje oculto solo para los curiosos. Gracias por recorrer esta historia conmigo, cada pixel de esto fue hecho con amor.",
        fecha: "Nivel Secreto",
        lugar: "Dentro del codigo"
    };

    const secretHTML = `
        <div class="card-wrapper is-visible">
            <article class="memory-card secret-card" data-id="secret" id="secret-card">
                <div class="image-wrapper skeleton">
                    <img src="${secretData.photo_url}" alt="${secretData.titulo}" class="card-image" loading="lazy" 
                         onload="this.parentElement.classList.remove('skeleton'); this.style.opacity=1;">
                </div>
                <div class="card-details">
                    <h3 class="pixel-text card-title">${secretData.titulo}</h3>
                    <p class="pixel-text card-description">${secretData.descripcion_corta}</p>
                </div>
            </article>
        </div>
    `;

    /* Inyectarlo al final de la galeria */
    galleryContainer.insertAdjacentHTML('beforeend', secretHTML);

    /* Darle el evento del modal */
    const newCard = document.getElementById('secret-card');
    newCard.addEventListener('click', () => openModal(secretData));

    /* Scrollear automaticamente hacia el Easter Egg suavemente. Alch no se como pero jala y que no le muevan. */
    newCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* Inicializador con los datos del JSON */
function iniciarHistoria(data) {
    document.getElementById('main-title').textContent = data.config.titulo_principal;
    document.getElementById('main-subtitle').textContent = data.config.subtitulo;

    renderGallery(data.memorias);
}

/* RENDER DE LA GALERIA Y SCROLL */
function renderGallery(memoriasArray) {
    /* Alch no se como pero jala esta madre asi que no le muevan */
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    /* Generador del HTML de las tarjetas */
    const cardsHTML = memoriasArray.map((memoria, index) => {
        const sideClass = (index % 2 === 0) ? 'from-left' : 'from-right';
        
        return `
            <div class="card-wrapper ${sideClass}">
                <article class="memory-card" data-id="${memoria.id}">
                    <div class="image-wrapper skeleton">
                        <img src="${memoria.photo_url}" alt="${memoria.titulo}" class="card-image" loading="lazy" 
                             onload="this.parentElement.classList.remove('skeleton'); this.style.opacity=1;">
                    </div>
                    <div class="card-details">
                        <h3 class="card-title">${memoria.titulo}</h3>
                        <p class="card-description">${memoria.descripcion_corta}</p>
                    </div>
                </article>
            </div>
        `;
    }).join('');

    document.getElementById('history-gallery').innerHTML = cardsHTML;
    
    /* Asignar el observer a las nuevas tarjetas */
    const wrappers = document.querySelectorAll('.card-wrapper');
    wrappers.forEach(wrapper => scrollObserver.observe(wrapper));

    /* Conectar los clics de cada tarjeta */
    attachCardEvents(memoriasArray);
}

/* LOGICA DEL MODAL */
function openModal(memoria) {
    modalImg.src = memoria.photo_url;
    modalImg.alt = memoria.titulo;
    modalTitle.textContent = memoria.titulo;
    modalDate.textContent = memoria.fecha;
    modalLocation.textContent = memoria.lugar;
    modalText.textContent = memoria.texto_largo;

    modalOverlay.classList.remove('hidden'); 
    setTimeout(() => {
        modalOverlay.classList.add('show-modal');
    }, 10);
    
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modalOverlay.classList.remove('show-modal');
    setTimeout(() => {
        modalOverlay.classList.add('hidden');
        document.body.style.overflow = ''; 
    }, 300);
}

/* EVENTOS DEL MODAL Y TARJETAS */
closeModalBtn.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('show-modal')) closeModal();
});

function attachCardEvents(memoriasArray) {
    const cards = document.querySelectorAll('.memory-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            const memoriaSeleccionada = memoriasArray.find(m => m.id === id);
            if (memoriaSeleccionada) openModal(memoriaSeleccionada);
        });
    });
}
/*Te oido deyanira pero gracias por mostrarme los modals deidad*/