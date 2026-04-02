import React from 'react';
import { Bienvenida } from '@/types/pedido';

interface HeroProps {
  data: Bienvenida;
}

const Hero: React.FC<HeroProps> = ({ data }) => {
  return (
    <section 
      id="modulo-bienvenida" 
      className="modulo-ravyn" 
      style={{ 
        textAlign: 'center', 
        padding: '60px 20px', 
        zIndex: 10, 
        marginBottom: '-20px' 
      }}
    >
      <h1 
        className="header-title" 
        style={{ 
          fontSize: '3.5rem', 
          marginBottom: '15px' 
        }}
      >
        {data.pareja}
      </h1>
      <p 
        className="card-description" 
        style={{ 
          fontSize: '1.2rem', 
          maxWidth: '600px', 
          margin: '0 auto', 
          lineHeight: '1.6' 
        }}
      >
        {data.mensaje}
      </p>
    </section>
  );
};

export default Hero;
