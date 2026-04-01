import React, { useState, useEffect, useRef } from 'react';
import { Historia as HistoriaType, Memoria } from '@/types/pedido';

interface HistoriaProps {
  data: HistoriaType;
}

const Historia: React.FC<HistoriaProps> = ({ data }) => {
  const [selectedMemoria, setSelectedMemoria] = useState<Memoria | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModalContent, setShowModalContent] = useState(false);
  
  const galleryRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    if (!galleryRef.current) return;
    const wrappers = galleryRef.current.querySelectorAll('.card-wrapper');
    wrappers.forEach(wrapper => {
      observer.observe(wrapper);
      
      // Forzar visibilidad inmediata (útil para previews e iframes)
      wrapper.classList.add('is-visible');
    });

    return () => {
      wrappers.forEach(wrapper => observer.unobserve(wrapper));
    };
  }, [data.memorias]);

  const openModal = (memoria: Memoria) => {
    setSelectedMemoria(memoria);
    setIsModalOpen(true);
    setTimeout(() => {
      setShowModalContent(true);
    }, 10);
  };

  const closeModal = () => {
    setShowModalContent(false);
    setTimeout(() => {
      setIsModalOpen(false);
      setSelectedMemoria(null);
    }, 300); // Tiempo para la animación de cierre
  };

  return (
    <section id="modulo-historia" className="modulo-ravyn" style={{ padding: '40px 0' }}>
      <header className="page-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="header-title" style={{ fontSize: '3rem' }}>{data.config.titulo_principal}</h1>
        <p className="header-subtitle" style={{ fontSize: '1.2rem', opacity: 0.8 }}>{data.config.subtitulo}</p>
      </header>

      <main ref={galleryRef} id="history-gallery" className="gallery-container">
        {data.memorias.map((memoria, index) => {
          const sideClass = (index % 2 === 0) ? 'from-left' : 'from-right';
          return (
            <div key={memoria.id} className={`card-wrapper ${sideClass}`}>
              <article 
                className="memory-card" 
                onClick={() => openModal(memoria)}
                style={{ cursor: 'pointer' }}
              >
                <div className="image-wrapper">
                  <img 
                    src={memoria.photo_url} 
                    alt={memoria.titulo} 
                    className="card-image" 
                    loading="lazy"
                  />
                </div>
                <div className="card-details">
                  <h3 className="card-title">{memoria.titulo}</h3>
                  <p className="card-description">{memoria.descripcion_corta}</p>
                </div>
              </article>
            </div>
          );
        })}
      </main>

      {/* Modal de Detalles */}
      {isModalOpen && selectedMemoria && (
        <div 
          className={`modal-overlay ${showModalContent ? 'show-modal' : ''}`}
          onClick={closeModal}
          style={{ zIndex: 1000 }}
        >
          <div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="close-btn" 
              onClick={closeModal}
            >&times;</button>
            <img 
              src={selectedMemoria.photo_url} 
              alt={selectedMemoria.titulo} 
              className="modal-image"
            />
            <div className="modal-details">
              <h2 className="card-title">{selectedMemoria.titulo}</h2>
              <div className="modal-meta">
                <span>{selectedMemoria.fecha}</span> | <span>{selectedMemoria.lugar}</span>
              </div>
              <hr className="pixel-divider" />
              <p className="card-description">{selectedMemoria.texto_largo}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Historia;
