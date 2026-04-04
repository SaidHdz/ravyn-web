import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Monitor, Eye, Maximize } from 'lucide-react';
import LienzoRavyn from '@/components/LienzoRavyn';
import ModulePreviewFrame from '@/components/landing/ModulePreviewFrame';
import { transformFormToLienzo } from '@/utils/mapeadorPedido';

interface LivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectConfig: any;
  activeModules: string[];
}

const LivePreviewModal: React.FC<LivePreviewModalProps> = ({ isOpen, onClose, projectConfig, activeModules }) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'fullscreen'>(
    window.innerWidth < 768 ? 'mobile' : 'desktop'
  );

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const pedidoData = useMemo(() => {
    return transformFormToLienzo(projectConfig, activeModules);
  }, [projectConfig, activeModules]);

  if (!isOpen) return null;

  const theme = pedidoData.configuracion_global.tema || 'aesthetic';

  console.log("JSON TRANSFORMADO:", pedidoData);

  return (
    <AnimatePresence>
      <div 
        className="pack-modal-overlay live-preview-overlay-fixed" 
        style={{ 
          backdropFilter: 'blur(40px)', 
          WebkitBackdropFilter: 'blur(40px)',
          background: 'radial-gradient(circle at center, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
          zIndex: 9999 
        }}
      >
        <motion.div 
          className="pack-modal-container live-preview-main-container"
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          style={{ 
            background: 'transparent', 
            border: 'none',
            boxShadow: 'none',
            height: '100vh',
            maxHeight: '100vh',
            width: '100vw',
            maxWidth: '100vw',
            borderRadius: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header Superior Flotante */}
          <div className="pack-modal-header live-preview-header" style={{ borderBottom: 'none', padding: '1.5rem', background: 'transparent', zIndex: 100, position: 'relative' }}>
            <div style={{ visibility: 'hidden' }}><X size={20} /></div>

            {/* Device Selector Pill */}
            <div 
              className="view-mode-selector" 
              style={{ 
                position: 'absolute', 
                left: '50%', 
                transform: 'translateX(-50%)', 
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
                borderRadius: '9999px',
                padding: '4px',
                display: 'flex',
                gap: '4px',
                border: '1px solid rgba(255,255,255,0.05)',
                zIndex: 150
              }}
            >
              <button 
                className={viewMode === 'desktop' ? 'active' : ''} 
                onClick={() => setViewMode('desktop')}
                style={{ 
                  color: viewMode === 'desktop' ? '#fff' : 'rgba(255,255,255,0.4)',
                  background: viewMode === 'desktop' ? 'rgba(255,255,255,0.1)' : 'transparent',
                  borderRadius: '9999px',
                  padding: '8px 16px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Monitor size={16} />
                <span className="desktop-only" style={{ fontSize: '0.85rem', fontWeight: 500 }}>Web</span>
              </button>
              <button 
                className={viewMode === 'mobile' ? 'active' : ''} 
                onClick={() => setViewMode('mobile')}
                style={{ 
                  color: viewMode === 'mobile' ? '#fff' : 'rgba(255,255,255,0.4)',
                  background: viewMode === 'mobile' ? 'rgba(255,255,255,0.1)' : 'transparent',
                  borderRadius: '9999px',
                  padding: '8px 16px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Smartphone size={16} />
                <span className="desktop-only" style={{ fontSize: '0.85rem', fontWeight: 500 }}>Móvil</span>
              </button>
              <button 
                className={viewMode === 'fullscreen' ? 'active' : ''} 
                onClick={() => setViewMode('fullscreen')}
                style={{ 
                  color: viewMode === 'fullscreen' ? '#fff' : 'rgba(255,255,255,0.4)',
                  background: viewMode === 'fullscreen' ? 'rgba(255,255,255,0.1)' : 'transparent',
                  borderRadius: '9999px',
                  padding: '8px 16px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Pantalla Completa"
              >
                <Maximize size={16} />
                <span className="desktop-only" style={{ fontSize: '0.85rem', fontWeight: 500 }}>Completa</span>
              </button>
            </div>

            {/* Botón Cerrar Vibrante */}
            <button 
              className="pack-close-btn" 
              onClick={onClose} 
              title="Cerrar Previsualización" 
              style={{ 
                background: '#ef4444', 
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
                transition: 'all 0.2s',
                zIndex: 150
              }}
              onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.2)'}
              onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
            >
              <X size={18} strokeWidth={3} />
            </button>
          </div>

          {/* Cuerpo - El Lienzo */}
          <div className="pack-modal-body live-preview-body" style={{ flex: 1, paddingTop: '5rem', paddingBottom: '6rem', paddingLeft: '2rem', paddingRight: '2rem', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            <div className={`platform-canvas ${viewMode}`} style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {viewMode === 'desktop' ? (
                <div className={`browser-mockup-v2 theme-${theme}`} style={{ width: '100%', maxWidth: '1200px', height: '80vh', maxHeight: '800px', display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', backgroundColor: 'var(--bg-primary, #0f172a)' }}>
                  <div className="browser-bar-v2" style={{ background: 'rgba(15,23,42,0.9)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="dots-v2">
                      <span style={{ background: '#ff5f56' }}></span>
                      <span style={{ background: '#ffbd2e' }}></span>
                      <span style={{ background: '#27c93f' }}></span>
                    </div>
                    <div className="url-bar-v2" style={{ background: 'rgba(0,0,0,0.3)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      ravynstudio.mx/preview/{pedidoData.bienvenida.pareja.toLowerCase().replace(/\s/g, '-') || 'tu-historia'}
                    </div>
                  </div>
                  <div className="browser-content-v2" style={{ flex: 1, background: 'transparent', padding: 0, margin: 0, overflow: 'hidden' }}>
                    <ModulePreviewFrame theme={theme}>
                      <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
                        <LienzoRavyn pedido={pedidoData} isStandalone={false} />
                      </div>
                    </ModulePreviewFrame>
                  </div>
                </div>
              ) : viewMode === 'mobile' ? (
                <div className={`smartphone-mockup-v2 theme-${theme}`} style={{ height: '75vh', maxHeight: '720px', width: '340px', maxWidth: '100%', borderRadius: '40px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '8px solid #1e293b', backgroundColor: 'var(--bg-primary, #0f172a)', position: 'relative' }}>
                  <div className="smartphone-notch-v2" style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '120px', height: '25px', background: '#1e293b', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', zIndex: 50 }}></div>
                  <div className="smartphone-content-v2" style={{ width: '100%', height: '100%', padding: 0, margin: 0, overflow: 'hidden', borderRadius: '32px' }}>
                    <ModulePreviewFrame theme={theme}>
                      <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
                        <LienzoRavyn pedido={pedidoData} isStandalone={false} />
                      </div>
                    </ModulePreviewFrame>
                  </div>
                </div>
              ) : (
                <div className={`fullscreen-mockup-v2 theme-${theme}`} style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 900, backgroundColor: 'var(--bg-primary, #0f172a)', overflow: 'hidden' }}>
                  <ModulePreviewFrame theme={theme}>
                    <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
                      <LienzoRavyn pedido={pedidoData} isStandalone={false} />
                    </div>
                  </ModulePreviewFrame>
                </div>
              )}
            </div>
          </div>

          {/* Footer - Read Only Sutil */}
          <div className="pack-modal-footer live-preview-footer" style={{ justifyContent: 'center', background: 'transparent', padding: '1rem', borderTop: 'none' }}>
            <div className="sync-info" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '3px', fontSize: '0.65rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase' }}>
              <Eye size={12} />
              <span>Vista previa en tiempo real • Modo solo lectura</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LivePreviewModal;
