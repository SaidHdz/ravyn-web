import React, { useEffect } from 'react';
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
}

const LienzoRavyn: React.FC<LienzoRavynProps> = ({ pedido }) => {
  const { configuracion_global } = pedido;

  // Efecto para aplicar el tema global
  useEffect(() => {
    const tema = pedido.configuracion_global.tema || pedido.wrapped?.config.tema || 'aesthetic';
    
    // Eliminar links de temas previos para evitar conflictos
    const existingThemeLink = document.getElementById('ravyn-theme-link');
    if (existingThemeLink) {
      existingThemeLink.remove();
    }

    // Crear y añadir el nuevo link del tema
    const link = document.createElement('link');
    link.id = 'ravyn-theme-link';
    link.rel = 'stylesheet';
    link.href = `/css/theme-${tema}.css`;
    document.head.appendChild(link);

    // Aplicar clase de tema al body
    document.body.className = `ravyn-canvas theme-${tema}`;
    document.body.setAttribute('data-theme', tema);

    return () => {
      // Opcional: limpiar al desmontar si es necesario
    };
  }, [pedido]);

  const renderModulo = (nombre: string) => {
    // A medida que añadamos componentes, los registraremos aquí
    switch (nombre) {
      case 'modulo-contador':
        return pedido.contador ? <Contador key={nombre} data={pedido.contador} /> : null;
      case 'modulo-evasivo':
        return pedido.evasivo ? <Evasivo key={nombre} data={pedido.evasivo} /> : null;
      case 'modulo-historia':
        return pedido.nuestra_historia ? <Historia key={nombre} data={pedido.nuestra_historia} /> : null;
      case 'modulo-tarjetas':
        return pedido.tarjetas ? <Tarjetas key={nombre} data={pedido.tarjetas} /> : null;
      case 'modulo-trivia':
        return pedido.trivia ? <Trivia key={nombre} data={pedido.trivia} /> : null;
      case 'modulo-wrapped':
        return pedido.wrapped ? <Wrapped key={nombre} data={pedido.wrapped} /> : null;
      case 'modulo-dedicatorias':
        return pedido.dedicatorias ? <Dedicatorias key={nombre} data={pedido.dedicatorias} /> : null;
      default:
        return <div key={nombre}>[Módulo {nombre} no reconocido]</div>;
    }
  };


  return (
    <div className="lienzo-container">
      {/* El Hero/Bienvenida siempre es el primero o según lógica de UI */}
      <Hero data={pedido.bienvenida} />

      {/* Renderizado dinámico según el orden del JSON */}
      {configuracion_global.orden.map((nombreModulo) => renderModulo(nombreModulo))}
    </div>
  );
};

export default LienzoRavyn;
