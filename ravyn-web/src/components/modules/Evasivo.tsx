import React, { useState, useRef } from 'react';
import { Evasivo as EvasivoType } from '@/types/pedido';

interface EvasivoProps {
  data: EvasivoType;
}

const Evasivo: React.FC<EvasivoProps> = ({ data }) => {
  const [esExito, setEsExito] = useState(false);
  const [noPos, setNoPos] = useState({ left: 'auto', top: '20px', right: '15%' });
  const [escalaNo, setEscalaNo] = useState(1.0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const btnSiRef = useRef<HTMLButtonElement>(null);
  const btnNoRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const moverBotonNo = () => {
    if (escalaNo > 0.25) {
      setEscalaNo(prev => prev - 0.09);
    }

    if (!containerRef.current || !btnSiRef.current || !btnNoRef.current) return;

    const areaWidth = containerRef.current.offsetWidth;
    const areaHeight = containerRef.current.offsetHeight;
    
    const btnWidth = btnNoRef.current.offsetWidth * (escalaNo - 0.09); 
    const btnHeight = btnNoRef.current.offsetHeight * (escalaNo - 0.09);

    const siRect = btnSiRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    const siLeft = siRect.left - containerRect.left;
    const siTop = siRect.top - containerRect.top;
    const siRight = siLeft + siRect.width;
    const siBottom = siTop + siRect.height;

    const margenSeguridad = 15; 

    let randomX = 0, randomY = 0;
    let empalmado = true;
    let intentos = 0;

    while (empalmado && intentos < 30) { 
      randomX = Math.floor(Math.random() * (areaWidth - btnWidth));
      randomY = Math.floor(Math.random() * (areaHeight - btnHeight));

      const noRight = randomX + btnWidth;
      const noBottom = randomY + btnHeight;

      if (
        randomX < siRight + margenSeguridad &&
        noRight > siLeft - margenSeguridad &&
        randomY < siBottom + margenSeguridad &&
        noBottom > siTop - margenSeguridad
      ) {
        empalmado = true;
        intentos++;
      } else {
        empalmado = false; 
      }
    }

    setNoPos({
      left: `${randomX}px`,
      top: `${randomY}px`,
      right: 'auto'
    });
  };

  const lanzarConfeti = () => {
    if (!cardRef.current) return;
    
    const colors = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#ff69b4'];
    
    for (let i = 0; i < 30; i++) {
      const confeti = document.createElement('div');
      Object.assign(confeti.style, {
        position: 'absolute',
        width: '10px',
        height: '10px',
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        left: '50%',
        top: '50%',
        borderRadius: Math.random() > 0.5 ? '50%' : '0',
        pointerEvents: 'none',
        zIndex: 100
      });
      
      const angle = Math.random() * Math.PI * 2;
      const velocity = 50 + Math.random() * 100;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;
      
      confeti.animate([
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
      ], { 
        duration: 1000 + Math.random() * 1000, 
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)', 
        fill: 'forwards' 
      });
      
      cardRef.current.appendChild(confeti);
      setTimeout(() => confeti.remove(), 2000);
    }
  };

  const manejarSi = () => {
    setEsExito(true);
    lanzarConfeti();
    
    if ((window as any).confetti) {
      (window as any).confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <section className="modulo-ravyn" style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
      <div 
        ref={cardRef}
        id="carta-evasiva" 
        className="memory-card" 
        style={{ 
          textAlign: 'center', 
          padding: '60px 20px', 
          maxWidth: '700px', 
          width: '90%', 
          minHeight: '450px', 
          position: 'relative', 
          zIndex: 10, 
          display: 'flex', 
          flexDirection: 'column' 
        }}
      >
        {!esExito ? (
          <div id="evasivo-contenido" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <h2 className="card-title" style={{ fontSize: '2.5rem', marginBottom: '30px' }}>
              {data.pregunta}
            </h2>
            
            <div 
              ref={containerRef}
              id="contenedor-botones" 
              style={{ position: 'relative', flexGrow: 1, minHeight: '250px', width: '100%' }}
            >
              <button 
                ref={btnSiRef}
                id="btn-si" 
                className="option-btn" 
                style={{ position: 'absolute', left: '15%', top: '20px', width: '130px', fontSize: '1.2rem' }}
                onClick={manejarSi}
              >
                {data.texto_si}
              </button>
              
              <div 
                ref={btnNoRef}
                id="btn-no" 
                className="option-btn" 
                style={{ 
                  position: 'absolute', 
                  right: noPos.right, 
                  left: noPos.left, 
                  top: noPos.top, 
                  width: '130px', 
                  fontSize: '1.2rem', 
                  transition: 'all 0.15s ease-out', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer', 
                  userSelect: 'none',
                  transform: `scale(${escalaNo})`
                }}
                onMouseOver={() => moverBotonNo()}
                onTouchStart={() => moverBotonNo()}
                onPointerDown={() => moverBotonNo()}
              >
                {data.texto_no}
              </div>
            </div>
          </div>
        ) : (
          <div id="evasivo-exito" style={{ margin: 'auto 0' }}>
            <h2 className="card-title" style={{ fontSize: '2.5rem', color: '#ff4757' }}>
              ¡Sabía que dirías que sí!
            </h2>
            <p className="card-description" style={{ marginTop: '15px', fontSize: '1.5rem' }}>
              {data.mensaje_exito}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Evasivo;
