const galleryContainer = document.getElementById('history-gallery');
const modalOverlay = document.getElementById('moment-modal');
const closeModalBtn = document.getElementById('close-modal');

const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDate = document.getElementById('modal-date');
const modalLocation = document.getElementById('modal-location');
const modalText = document.getElementById('modal-text');

function loadTheme(themeName) {
    const head = document.head;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `css/theme-${themeName}.css`; 
    head.appendChild(link);

    document.body.className = `theme-${themeName}`;
}

//LÓGICA DEL EASTER EGG 
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

function unlockSecretMemory() {

    if (document.getElementById('secret-card')) return;


    const secretData = {
        id: "secret-001",
        photo_url: "https://images.unsplash.com/photo-1576063660504-890250766336?w=600", // Un control pixelado o corazón neón
        titulo: "⭐ Logro Desbloqueado",
        descripcion_corta: "Encontraste el nivel secreto...",
        texto_largo: "¡Hackeaste el sistema! Quería dejar este mensaje oculto solo para los curiosos. Gracias por recorrer esta historia conmigo, cada pixel de esto fue hecho con amor.",
        fecha: "Nivel Secreto",
        lugar: "Dentro del código"
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

    // Inyectarlo al final de la galería
    galleryContainer.insertAdjacentHTML('beforeend', secretHTML);

    // Darle el evento del modal
    const newCard = document.getElementById('secret-card');
    newCard.addEventListener('click', () => openModal(secretData));

    // Scrollear automáticamente hacia el Easter Egg suavemente
    newCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// === LÓGICA DE DATOS (FETCH) ===
function iniciarHistoria(data) {
    // Inyectar los textos globales
    document.getElementById('main-title').textContent = data.config.titulo_principal;
    document.getElementById('main-subtitle').textContent = data.config.subtitulo;

    // Renderizar galería
    renderGallery(data.memorias);
}

// === LÓGICA DE LA INTERFAZ ===
function renderGallery(memoriasArray) {
    // 1. Recuperamos el Observer para las animaciones de scroll
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

    // 2. Generamos el HTML (Limpio y sin clases atadas a un solo tema)
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
    
    // 3. Volvemos a asignar el observer a las nuevas tarjetas
    const wrappers = document.querySelectorAll('.card-wrapper');
    wrappers.forEach(wrapper => scrollObserver.observe(wrapper));

    // 4. Llamamos a la función que conecta los clics
    attachCardEvents(memoriasArray);
}
// === LÓGICA DEL MODAL ===
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

// === EVENTOS ===
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