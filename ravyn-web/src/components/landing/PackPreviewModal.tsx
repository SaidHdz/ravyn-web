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
  { id: 'neo-japan', name: 'Neo-Japan' },
  { id: 'minecraft', name: 'Cubos' },
  { id: 'y2k-streamer', name: 'Y2K' },
  { id: 'aesthetic', name: 'Aesthetic' },
  { id: 'cute-soft', name: 'Soft' },
];

const PackPreviewModal: React.FC<PackPreviewModalProps> = ({ pack, isOpen, onClose, onConfirm }) => {
  const [activeTheme, setActiveTheme] = useState('neo-japan');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !iframeRef.current) return;
    const demoUrl = `/preview?theme=${activeTheme}&pack=${pack.id}`;
    iframeRef.current.src = demoUrl;
  }, [isOpen, activeTheme, pack]);

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
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ 
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1] // Curve de suavizado premium
            }}
          >
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
              <iframe 
                ref={iframeRef}
                className="modal-demo-iframe"
                title="Ravyn Live Demo"
              />
            </div>

            {/* Barra Inferior: Acciones */}
            <div className="modal-actions-bar">
              <button className="btn-back" onClick={onClose}>
                <ArrowLeft size={20} />
                Regresar
              </button>

              <div className="pack-info-mini">
                <span className="name">{pack.nombre}</span>
                <span className="price">${pack.precio} MXN</span>
              </div>

              <button className="btn-confirm" onClick={() => onConfirm(pack, activeTheme)}>
                <Plus size={20} />
                Confirmar y Agregar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PackPreviewModal;
