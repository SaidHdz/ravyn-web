import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ThemeManager from '@/components/ThemeManager';
import Contador from '@/components/modules/Contador';
import Historia from '@/components/modules/Historia';
import Tarjetas from '@/components/modules/Tarjetas';
import Trivia from '@/components/modules/Trivia';
import Evasivo from '@/components/modules/Evasivo';
import Wrapped from '@/components/modules/Wrapped';
import Dedicatorias from '@/components/modules/Dedicatorias';

const MODULE_TITLES: Record<string, string> = {
  contador: 'Contador de Tiempo',
  historia: 'Historia',
  tarjetas: 'Tarjetas Interactivas',
  trivia: 'Trivia de Pareja',
  evasivo: 'Botón Evasivo',
  wrapped: 'Wrapped Anual',
  dedicatorias: 'Dedicatorias Especiales',
};

const ModuleViewer: React.FC = () => {
  const { moduleType, theme: forcedTheme } = useParams<{ moduleType: string; theme?: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const moduleLabel = moduleType ? (MODULE_TITLES[moduleType] || `Módulo ${moduleType}`) : 'Módulo sin identificar';

  useEffect(() => {
    fetch('/pedidos/webejemplo/data.json')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading module data:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    document.title = moduleLabel ? `${moduleLabel} | Ravyn Studio` : 'Ravyn Studio';
  }, [moduleLabel]);

  if (loading) return <div>Cargando módulo...</div>;
  if (!data) return <div>Error cargando datos.</div>;

  const getModuleData = () => {
    switch (moduleType) {
      case 'contador': return { component: <Contador data={data.contador} />, theme: data.contador?.config?.tema };
      case 'historia': return { component: <Historia data={data.nuestra_historia} />, theme: data.nuestra_historia?.config?.tema };
      case 'tarjetas': return { component: <Tarjetas data={data.tarjetas} />, theme: data.tarjetas?.config?.tema };
      case 'trivia': return { component: <Trivia data={data.trivia} />, theme: data.trivia?.config?.tema };
      case 'evasivo': return { component: <Evasivo data={data.evasivo} />, theme: data.evasivo?.config?.tema };
      case 'wrapped': return { component: <Wrapped data={data.wrapped} />, theme: data.wrapped?.config?.tema };
      case 'dedicatorias': return { component: <Dedicatorias data={data.dedicatorias} />, theme: data.dedicatorias?.config?.tema };
      default: return { component: <div>Módulo no encontrado: {moduleType}</div>, theme: 'aesthetic' };
    }
  };

  const { component, theme } = getModuleData();
  const resolvedTheme = forcedTheme || theme || 'aesthetic';

  return (
    <div className="module-viewer-isolated" style={{ minHeight: '100vh', width: '100vw' }}>
      <ThemeManager theme={resolvedTheme} />
      {component}
    </div>
  );
};

export default ModuleViewer;
