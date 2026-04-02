import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2 as GamepadIcon, 
  BookOpen as BookIcon, 
  Layers as LayersIcon, 
  BarChart3 as ChartIcon, 
  Clock as ClockIcon, 
  MousePointer2 as CursorIcon, 
  Heart as HeartIcon 
} from 'lucide-react';
import Contador from '@/components/modules/Contador';
import Historia from '@/components/modules/Historia';
import Tarjetas from '@/components/modules/Tarjetas';
import Trivia from '@/components/modules/Trivia';
import Evasivo from '@/components/modules/Evasivo';
import Wrapped from '@/components/modules/Wrapped';
import Dedicatorias from '@/components/modules/Dedicatorias';
import ModulePreviewFrame from '@/components/landing/ModulePreviewFrame';
import { MODULE_PRICES } from '@/types/store';

interface ModuleShowcaseProps {
  activeTheme: string;
  onThemeChange: (theme: string) => void;
  onAddModule: (moduleId: string) => void;
}

const ModuleShowcase: React.FC<ModuleShowcaseProps> = ({ activeTheme, onThemeChange, onAddModule }) => {
  const [activeModule, setActiveModule] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showcaseModules, setShowcaseModules] = useState<any[]>([]);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const itemsPerPage = 4;

  const themes = [
    { id: 'y2k-streamer', label: 'Y2K' },
    { id: 'neo-japan', label: 'Neo Japan' },
    { id: 'minecraft', label: 'Cubos' },
    { id: 'cute-soft', label: 'Cute' },
    { id: 'aesthetic', label: 'Aesthetic' },
    { id: 'finn', label: 'Heroe' },
    { id: 'jake', label: 'Mejor Amigo' },
    { id: 'lsp', label: 'Grumos' }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/pedidos/webejemplo/data.json');
        const data = await response.json();
        
        const modules = [
          {
            id: 'contador',
            icono: <ClockIcon size={24} />,
            titulo: 'Contador de Tiempo',
            descripcion: 'Muestra cuánto tiempo ha pasado desde ese día especial con precisión de segundos.',
            tipo: 'contador',
            mockData: data.contador
          },
          {
            id: 'historia',
            icono: <BookIcon size={24} />,
            titulo: 'Galería de Memorias',
            descripcion: 'Un recorrido visual cronológico por tus fotos y momentos más importantes.',
            tipo: 'historia',
            mockData: data.nuestra_historia
          },
          {
            id: 'trivia',
            icono: <GamepadIcon size={24} />,
            titulo: 'Trivia de Pareja',
            descripcion: '¿Qué tan bien se conocen? Un juego divertido con resultados personalizados.',
            tipo: 'trivia',
            mockData: data.trivia
          },
          {
            id: 'evasivo',
            icono: <CursorIcon size={24} />,
            titulo: 'Botón Evasivo',
            descripcion: 'El clásico botón de "No" que huye cuando intentas presionarlo. ¡Imposible decir que no!',
            tipo: 'evasivo',
            mockData: data.evasivo
          },
          {
            id: 'tarjetas',
            icono: <LayersIcon size={24} />,
            titulo: 'Cartas de Amor',
            descripcion: 'Un mazo de cartas interactivas que se deslizan para revelar mensajes profundos.',
            tipo: 'tarjetas',
            mockData: data.tarjetas
          },
          {
            id: 'wrapped',
            icono: <ChartIcon size={24} />,
            titulo: 'Wrapped Anual',
            descripcion: 'Toda tu relación resumida en gráficas y datos curiosos al estilo Spotify.',
            tipo: 'wrapped',
            mockData: data.wrapped
          },
          {
            id: 'dedicatorias',
            icono: <HeartIcon size={24} />,
            titulo: 'Dedicatorias Especiales',
            descripcion: 'Un cofre virtual con mensajes secuenciales y cartas apiladas con música.',
            tipo: 'dedicatorias',
            mockData: data.dedicatorias
          }
        ];
        
        setShowcaseModules(modules);
        setActiveModule(modules[0]);
      } catch (error) {
        console.error("Error cargando el JSON de webejemplo:", error);
      }
    };
    
    loadData();
  }, []);

  if (showcaseModules.length === 0) return null;

  const totalPages = Math.ceil(showcaseModules.length / itemsPerPage);
  const paginatedModules = showcaseModules.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const renderPreview = () => {
    if (!activeModule) return null;

    const { tipo, mockData } = activeModule;
    
    return (
      <ModulePreviewFrame
        theme={activeTheme}
        onThemeLoadStateChange={setIsPreviewLoading}
      >
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeModule.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className={`ravyn-canvas theme-${activeTheme}`} 
            data-theme={activeTheme} 
            style={{ minHeight: '100%' }}
          >
            <section className="modulo-ravyn">
              {(() => {
                switch (tipo) {
                  case 'contador': return <Contador data={mockData} />;
                  case 'historia': return <Historia data={mockData} />;
                  case 'tarjetas': return <Tarjetas data={mockData} />;
                  case 'trivia': return <Trivia data={mockData} />;
                  case 'evasivo': return <Evasivo data={mockData} />;
                  case 'wrapped': return <Wrapped data={mockData} />;
                  case 'dedicatorias': return <Dedicatorias data={mockData} />;
                  default: return <div style={{ padding: '40px', textAlign: 'center' }}>Módulo en desarrollo</div>;
                }
              })()}
            </section>
          </motion.div>
        </AnimatePresence>
      </ModulePreviewFrame>
    );
  };

  const handleThemeSelect = (themeId: string) => {
    if (themeId === activeTheme) return;
    onThemeChange(themeId);
  };

  return (
    <section className="showcase-section">
      {/* Selector de Temas */}
      <motion.div 
        className="theme-selector-wrapper"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="theme-selector-container">
          {themes.map((t) => (
            <div 
              key={t.id} 
              className={`theme-card theme-card-${t.id} ${activeTheme === t.id ? 'active' : ''}`}
              data-theme={t.id}
              onClick={() => handleThemeSelect(t.id)}
            >
              {t.label}
            </div>
          ))}
        </div>
      </motion.div>

      <div className="showcase-container">
        {/* 1. Menú de Módulos (Izquierda en PC, Abajo en móvil) */}
        <motion.div 
          className="showcase-menu-container"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="showcase-menu">
            {paginatedModules.map((mod) => (
              <div 
                key={mod.id} 
                className={`showcase-card ${activeModule?.id === mod.id ? 'active' : ''}`}
                onClick={() => setActiveModule(mod)}
              >
                <div className="showcase-card-icon">
                  {mod.icono}
                </div>
                <div className="showcase-card-content">
                  <h4>{mod.titulo}</h4>
                  <p>{mod.descripcion}</p>
                  <div className="module-visual-actions">
                    <span className="module-price-visual">
                      ${MODULE_PRICES[mod.tipo] || 0} MXN
                    </span>
                    <button 
                      className="add-module-btn-visual"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddModule(mod.tipo);
                      }}
                    >
                      + Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="showcase-pagination">
            <button 
              className={`pagination-btn ${currentPage === 0 ? 'disabled' : ''}`}
              onClick={prevPage}
              disabled={currentPage === 0}
            >
              Anterior
            </button>
            <button 
              className={`pagination-btn ${currentPage === totalPages - 1 ? 'disabled' : ''}`}
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
            >
              Siguiente
            </button>
          </div>
        </motion.div>

        {/* 2. Preview (Derecha en PC, Centro en móvil) */}
        <motion.div 
          className="showcase-preview"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="preview-window">
            <div className="preview-header">
              <div className="dots"><span></span><span></span><span></span></div>
              <div className="url-bar">ravyn.me/demo/{activeModule?.id}</div>
            </div>
            <div 
              className={`preview-content ${isPreviewLoading ? 'is-loading' : ''}`}
            >
              {renderPreview()}

              <AnimatePresence>
                {isPreviewLoading && (
                  <motion.div 
                    className="preview-loading-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="preview-loading-card">
                      <div className="loading-spinner-ravyn"></div>
                      <p className="preview-loading-title">Personalizando...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ModuleShowcase;
