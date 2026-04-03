import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Monitor, Zap, ChevronLeft } from 'lucide-react';
import { Pedido } from '@/types/pedido';
import LienzoRavyn from '@/components/LienzoRavyn';
import ModulePreviewFrame from '@/components/landing/ModulePreviewFrame';

interface LivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pedidoData: Pedido;
}

const LivePreviewModal: React.FC<LivePreviewModalProps> = ({ isOpen, onClose, pedidoData }) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>(
    window.innerWidth < 768 ? 'mobile' : 'desktop'
  );

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const theme = pedidoData.configuracion_global.tema || 'aesthetic';

  return (
    <AnimatePresence>
      <div className="pack-modal-overlay live-preview-overlay-fixed">
        <motion.div 
          className="pack-modal-container live-preview-main-container"
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
        >
          {/* Header Superior */}
          <div className="pack-modal-header live-preview-header">
            <div className="preview-header-left">
              <div className="view-mode-selector">
                <button 
                  className={viewMode === 'desktop' ? 'active' : ''} 
                  onClick={() => setViewMode('desktop')}
                >
                  <Monitor size={18} />
                  <span className="desktop-only">Web</span>
                </button>
                <button 
                  className={viewMode === 'mobile' ? 'active' : ''} 
                  onClick={() => setViewMode('mobile')}
                >
                  <Smartphone size={18} />
                  <span className="desktop-only">Móvil</span>
                </button>
              </div>
              <div className="live-badge">
                <span className="live-dot"></span>
                PREVIEW REAL
              </div>
            </div>
            
            <button className="pack-close-btn" onClick={onClose} title="Cerrar Previsualización">
              <X size={20} />
            </button>
          </div>

          {/* Cuerpo - El Lienzo */}
          <div className="pack-modal-body live-preview-body">
            <div className={`platform-canvas ${viewMode}`}>
              {viewMode === 'desktop' ? (
                <div className="browser-mockup-v2">
                  <div className="browser-bar-v2">
                    <div className="dots-v2"><span></span><span></span><span></span></div>
                    <div className="url-bar-v2">ravyn.studio/historia/{pedidoData.bienvenida.pareja.toLowerCase().replace(/\s/g, '-') || 'preview'}</div>
                  </div>
                  <div className="browser-content-v2">
                    <ModulePreviewFrame theme={theme}>
                      <LienzoRavyn pedido={pedidoData} isStandalone={false} />
                    </ModulePreviewFrame>
                  </div>
                </div>
              ) : (
                <div className="smartphone-mockup-v2">
                  <div className="smartphone-notch-v2"></div>
                  <div className="smartphone-content-v2">
                    <ModulePreviewFrame theme={theme}>
                      <LienzoRavyn pedido={pedidoData} isStandalone={false} />
                    </ModulePreviewFrame>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer - Acciones */}
          <div className="pack-modal-footer live-preview-footer">
            <div className="sync-info">
              <Zap size={14} className="zap-icon" />
              <span>Sincronizado con tu configuración</span>
            </div>
            <button className="btn-return-edit" onClick={onClose}>
              <ChevronLeft size={18} /> Volver a Editar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LivePreviewModal;
