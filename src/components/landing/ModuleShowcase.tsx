import React, { useState, useEffect } from 'react';
import { Gamepad2, BookOpen, Layers, BarChart3, Clock, MousePointer2, Heart } from 'lucide-react';
import Contador from '@/components/modules/Contador';
import Historia from '@/components/modules/Historia';
import Tarjetas from '@/components/modules/Tarjetas';
import Trivia from '@/components/modules/Trivia';
import Evasivo from '@/components/modules/Evasivo';
import Wrapped from '@/components/modules/Wrapped';
import Dedicatorias from '@/components/modules/Dedicatorias';
import ModulePreviewFrame from '@/components/landing/ModulePreviewFrame';

const ModuleShowcase: React.FC = () => {
  const [activeModule, setActiveModule] = useState<any>(null);
  const [activeTheme, setActiveTheme] = useState('neo-japan');
  const [currentPage, setCurrentPage] = useState(0);
  const [showcaseModules, setShowcaseModules] = useState<any[]>([]);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const itemsPerPage = 4;

  const themes = [
    { id: 'y2k-streamer', label: 'Y2K' },
    { id: 'neo-japan', label: 'Neo Japan' },
    { id: 'minecraft', label: 'Minecraft' },
    { id: 'cute-soft', label: 'Cute Soft' },
    { id: 'aesthetic', label: 'Aesthetic' }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/pedidos/webejemplo/data.json');
        const data = await response.json();
        
        const modules = [
          {
            id: 'contador',
            icono: <Clock size={24} />,
            titulo: 'Contador de Tiempo',
            descripcion: 'Muestra cuánto tiempo ha pasado desde ese día especial con precisión de segundos.',
            tipo: 'contador',
            mockData: data.contador
          },
          {
            id: 'historia',
            icono: <BookOpen size={24} />,
            titulo: 'Galería de Memorias',
            descripcion: 'Un recorrido visual cronológico por sus fotos y momentos más importantes.',
            tipo: 'historia',
            mockData: data.nuestra_historia
          },
          {
            id: 'trivia',
            icono: <Gamepad2 size={24} />,
            titulo: 'Trivia de Pareja',
            descripcion: '¿Qué tan bien se conocen? Un juego divertido con resultados personalizados.',
            tipo: 'trivia',
            mockData: data.trivia
          },
          {
            id: 'evasivo',
            icono: <MousePointer2 size={24} />,
            titulo: 'Botón Evasivo',
            descripcion: 'El clásico botón de "No" que huye cuando intentas presionarlo. ¡Imposible decir que no!',
            tipo: 'evasivo',
            mockData: data.evasivo
          },
          {
            id: 'tarjetas',
            icono: <Layers size={24} />,
            titulo: 'Cartas de Amor',
            descripcion: 'Un mazo de cartas interactivas que se deslizan para revelar mensajes profundos.',
            tipo: 'tarjetas',
            mockData: data.tarjetas
          },
          {
            id: 'wrapped',
            icono: <BarChart3 size={24} />,
            titulo: 'Wrapped Anual',
            descripcion: 'Toda su relación resumida en gráficas y datos curiosos al estilo Spotify.',
            tipo: 'wrapped',
            mockData: data.wrapped
          },
          {
            id: 'dedicatorias',
            icono: <Heart size={24} />,
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

    const getModuleComponent = () => {
      const { tipo, mockData } = activeModule;
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
    };

    return (
      <ModulePreviewFrame
        theme={activeTheme}
        onThemeLoadStateChange={setIsPreviewLoading}
      >
        <React.Fragment key={activeModule?.id}>
          {getModuleComponent()}
        </React.Fragment>
      </ModulePreviewFrame>
    );
  };

  const handleThemeSelect = (themeId: string) => {
    if (themeId === activeTheme) return;
    setActiveTheme(themeId);
    setIsPreviewLoading(true);
  };

  return (
    <section className="showcase-section">
      {/* FILA SUPERIOR: SELECTOR DE TEMAS (Fuera del container para no romper el grid) */}
      <div className="theme-selector-wrapper">
        <div className="theme-selector-container">
          {themes.map((t) => (
            <div 
              key={t.id} 
              className={`theme-card ${activeTheme === t.id ? 'active' : ''}`}
              data-theme={t.id}
              onClick={() => handleThemeSelect(t.id)}
            >
              {t.label}
            </div>
          ))}
        </div>
      </div>

      <div className="showcase-container">
        {/* LADO IZQUIERDO: SELECTOR DE MÓDULOS */}
        <div className="showcase-menu-container">
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
                </div>
              </div>
            ))}
          </div>

          {/* PAGINACIÓN */}
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
            <span className="pagination-info">
              Página {currentPage + 1} de {totalPages}
            </span>
          </div>
        </div>

        {/* LADO DERECHO: PREVIEW */}
        <div className="showcase-preview">
          <div className="preview-window">
            <div className="preview-header">
              <div className="dots"><span></span><span></span><span></span></div>
              <div className="url-bar">ravyn.me/demo/{activeModule?.id}?theme={activeTheme}</div>
            </div>
            <div 
              className={`preview-content ${isPreviewLoading ? 'is-loading' : ''}`}
            >
              {renderPreview()}
              <div className="preview-loading-overlay">
                <div className="preview-loading-card">
                  <p className="preview-loading-title">Aplicando tema</p>
                  <p className="preview-loading-subtitle">Dale un segundo, estamos vistiendo el módulo.</p>
                  <div className="preview-loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Efecto de resplandor de fondo */}
          <div className="preview-glow"></div>
        </div>
      </div>
    </section>
  );
};

export default ModuleShowcase;
