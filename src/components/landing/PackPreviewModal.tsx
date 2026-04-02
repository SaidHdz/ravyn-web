import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pack } from '@/types/store';
import { ArrowLeft, Plus } from 'lucide-react';
import '@/styles/landing/store-modal.css';

interface PackPreviewModalProps {
  pack: Pack;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (pack: Pack, theme: string) => void;
}

const THEMES = [
  { id: 'neo-japan', name: 'Neo Japan' },
  { id: 'minecraft', name: 'Cubos' },
  { id: 'y2k-streamer', name: 'Y2K' },
  { id: 'aesthetic', name: 'Aesthetic' },
  { id: 'cute-soft', name: 'Cute' },
  { id: 'finn', name: 'Heroe' },
  { id: 'jake', name: 'Mejor Amigo' },
  { id: 'lsp', name: 'Grumos' }
];

const PackPreviewModal: React.FC<PackPreviewModalProps> = ({ pack, isOpen, onClose, onConfirm }) => {
  const [activeTheme, setActiveTheme] = useState('neo-japan');
  const [isThemeLoading, setIsThemeLoading] = useState(false);
  const [canInteract, setCanInteract] = useState(false); // Nuevo: controla pointer-events
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  // Manejar el overflow del body y resetear estado
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsIframeLoaded(false); // Resetear en cada apertura
      setCanInteract(false);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  // Cargar el iframe una sola vez al abrir
  useEffect(() => {
    if (!isOpen) return;
    
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      setIsIframeLoaded(true);
    };

    iframe.addEventListener('load', handleLoad);
    iframe.src = `/preview?pack=${pack.id}`;

    return () => {
      iframe.removeEventListener('load', handleLoad);
    };
  }, [isOpen, pack]);

  // Aplicar tema dinámicamente SOLO si el iframe está cargado
  useEffect(() => {
    if (!isOpen || !isIframeLoaded) return;
    
    const iframe = iframeRef.current;
    if (!iframe?.contentDocument) return;

    const doc = iframe.contentDocument;
    const currentThemeId = 'pack-preview-theme';

    const existingLink = doc.getElementById(currentThemeId) as HTMLLinkElement;
    if (existingLink && existingLink.href.includes(`/theme-${activeTheme}.css`)) {
      return; // El tema ya está aplicado, no hacer nada
    }

    setIsThemeLoading(true);
    
    doc.body.className = `ravyn-canvas theme-${activeTheme}`;
    doc.body.setAttribute('data-theme', activeTheme);
    
    const themeLink = existingLink || doc.createElement('link');
    if (!existingLink) {
      themeLink.id = currentThemeId;
      themeLink.rel = 'stylesheet';
      doc.head.appendChild(themeLink);
    }
    
    let cancelled = false;
    
    const onFinishLoading = () => {
      if (!cancelled) {
        setIsThemeLoading(false);
      }
    };

    const timeoutId = setTimeout(onFinishLoading, 2000);
    
    themeLink.onload = () => {
      clearTimeout(timeoutId);
      onFinishLoading();
    };
    themeLink.onerror = themeLink.onload;
    
    themeLink.href = `/css/theme-${activeTheme}.css?v=${new Date().getTime()}`;

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [activeTheme, isIframeLoaded, isOpen]);


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="pack-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="pack-modal-container"
            initial={{ y: window.innerWidth < 768 ? "100%" : 0, scale: window.innerWidth < 768 ? 1 : 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: window.innerWidth < 768 ? "100%" : 0, scale: window.innerWidth < 768 ? 1 : 0.98, opacity: 0 }}
            transition={{ 
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1]
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón de cierre rápido para móvil */}
            <div className="mobile-only mobile-close-tab" onClick={onClose}>
              <div className="tab-handle"></div>
            </div>

            {/* Barra Superior: Selector de Temas */}
            <div className="modal-theme-bar">
              <h4>Personaliza tu Skin</h4>
              <div className="theme-options">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    className={`theme-pill ${activeTheme === theme.id ? 'active' : ''}`}
                    data-theme={theme.id}
                    onClick={() => setActiveTheme(theme.id)}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Centro: Live Demo Iframe */}
            <div className="modal-demo-container">
              <AnimatePresence>
                {isThemeLoading && (
                  <motion.div 
                    className="preview-loading-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <span>Cargando skin...</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <iframe 
                ref={iframeRef}
                className="modal-demo-iframe"
                title="Ravyn Live Demo"
              />
            </div>

            {/* Barra Inferior: Acciones */}
            <div className="modal-actions-bar">
              <button className="btn-back desktop-only" onClick={onClose}>
                <ArrowLeft size={20} />
                Regresar
              </button>

              <div className="pack-info-mini">
                <span className="name">{pack.nombre}</span>
                <span className="price">${pack.precio} MXN</span>
              </div>

              <button className="btn-confirm" onClick={() => onConfirm(pack, activeTheme)}>
                <Plus size={20} />
                {window.innerWidth < 600 ? 'Agregar' : 'Confirmar y Agregar'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PackPreviewModal;
