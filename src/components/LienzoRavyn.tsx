import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pedido } from '@/types/pedido';
import Contador from '@/components/modules/Contador';
import Hero from '@/components/modules/Hero';
import Evasivo from '@/components/modules/Evasivo';
import Historia from '@/components/modules/Historia';
import Tarjetas from '@/components/modules/Tarjetas';
import Trivia from '@/components/modules/Trivia';
import Wrapped from '@/components/modules/Wrapped';
import Dedicatorias from '@/components/modules/Dedicatorias';

interface LienzoRavynProps {
  pedido: Pedido;
  packFilter?: string; // Nuevo: ID del pack para previsualización
  isStandalone?: boolean; // Define si aplica el tema al body o localmente
}

const LienzoRavyn: React.FC<LienzoRavynProps> = ({ pedido, packFilter, isStandalone = true }) => {
  const { configuracion_global } = pedido;
  const lienzoRef = React.useRef<HTMLDivElement>(null);

  // Si hay un filtro de pack, usamos sus módulos. Si no, usamos el orden del JSON.
  const getModulosAMostrar = () => {
    if (!packFilter) return configuracion_global.orden;

    const packsModulos: Record<string, string[]> = {
      'pack-semilla': ['historia', 'contador', 'tarjetas'],
      'pack-rabanito': ['historia', 'trivia', 'evasivo', 'dedicatorias'],
      'pack-cosecha': ['historia', 'contador', 'tarjetas', 'trivia', 'evasivo', 'dedicatorias', 'wrapped']
    };

    return packsModulos[packFilter] || configuracion_global.orden;
  };

  const modulosAMostrar = getModulosAMostrar().map(m => m.replace('modulo-', ''));

  // Efecto para aplicar el tema
  useEffect(() => {
    const tema = pedido.configuracion_global.tema || pedido.wrapped?.config.tema || 'aesthetic';
    
    if (isStandalone) {
      const existingThemeLink = document.getElementById('ravyn-theme-link');
      if (existingThemeLink) existingThemeLink.remove();

      const link = document.createElement('link');
      link.id = 'ravyn-theme-link';
      link.rel = 'stylesheet';
      link.href = `/css/theme-${tema}.css`;
      document.head.appendChild(link);

      document.body.className = `ravyn-canvas theme-${tema}`;
      document.body.setAttribute('data-theme', tema);
    }

    return () => {
      if (isStandalone) {
        document.body.className = '';
      }
    };
  }, [pedido, isStandalone]);

  const renderModulo = (nombre: string) => {
    let component = null;
    switch (nombre) {
      case 'contador':
        component = pedido.contador ? <Contador data={pedido.contador} /> : null;
        break;
      case 'evasivo':
        component = pedido.evasivo ? <Evasivo data={pedido.evasivo} /> : null;
        break;
      case 'historia':
        const historiaData = pedido.historia || pedido.nuestra_historia;
        component = historiaData ? <Historia data={historiaData} /> : null;
        break;
      case 'tarjetas':
        component = pedido.tarjetas ? <Tarjetas data={pedido.tarjetas} /> : null;
        break;
      case 'trivia':
        component = pedido.trivia ? <Trivia data={pedido.trivia} /> : null;
        break;
      case 'wrapped':
        component = pedido.wrapped ? <Wrapped data={pedido.wrapped} /> : null;
        break;
      case 'dedicatorias':
        component = pedido.dedicatorias ? <Dedicatorias data={pedido.dedicatorias} /> : null;
        break;
      default:
        component = <div key={nombre}>[Módulo {nombre} no reconocido]</div>;
    }

    if (!component) return null;

    return (
      <motion.section 
        key={nombre}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ 
          layout: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.4 }
        }}
        className="modulo-ravyn"
      >
        {component}
      </motion.section>
    );
  };

  const lienzoClasses = `lienzo-container ravyn-canvas theme-${pedido.configuracion_global.tema || 'aesthetic'}`;

  return (
    <div 
      ref={lienzoRef} 
      className={lienzoClasses} 
      data-theme={pedido.configuracion_global.tema || 'aesthetic'}
      style={{ minHeight: '100vh' }}
    >
      <Hero data={pedido.bienvenida} />
      <AnimatePresence mode="popLayout">
        {modulosAMostrar.map((nombreModulo) => renderModulo(nombreModulo))}
      </AnimatePresence>
    </div>
  );
};

export default LienzoRavyn;
