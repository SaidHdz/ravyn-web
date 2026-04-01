import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Evasivo as EvasivoType } from '@/types/pedido';

interface EvasivoProps {
  data: EvasivoType;
}

const Evasivo: React.FC<EvasivoProps> = ({ data }) => {
  const [esExito, setEsExito] = useState(false);
  const [noPos, setNoPos] = useState({ left: '70%', top: '20px' });
  const [escalaNo, setEscalaNo] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [stretch, setStretch] = useState({ x: 1, y: 1 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const btnSiRef = useRef<HTMLButtonElement>(null);
  const btnNoRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const moverBotonNo = (e?: React.MouseEvent | React.PointerEvent) => {
    if (!containerRef.current || !btnSiRef.current || !btnNoRef.current) return;

    // Reducción de escala y rotación
    if (escalaNo > 0.3) setEscalaNo(prev => prev - 0.08);
    setRotation((Math.random() - 0.5) * 30);

    const areaWidth = containerRef.current.offsetWidth;
    const areaHeight = containerRef.current.offsetHeight;
    const btnWidth = btnNoRef.current.offsetWidth;
    const btnHeight = btnNoRef.current.offsetHeight;

    // Obtener posición del mouse respecto al botón
    let mouseRelX = 0.5;
    let mouseRelY = 0.5;

    if (e && 'nativeEvent' in e) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      mouseRelX = (e.clientX - rect.left) / rect.width;
      mouseRelY = (e.clientY - rect.top) / rect.height;
    }

    // LÓGICA DE ESTIRADO (SÓLO JAKE)
    const currentTheme = document.body.getAttribute('data-theme') || '';
    if (currentTheme === 'jake') {
      const isHorizontalEscape = Math.random() > 0.5;
      if (isHorizontalEscape) {
        setStretch({ x: 1.5, y: 0.7 });
      } else {
        setStretch({ x: 0.7, y: 1.5 });
      }
      setTimeout(() => setStretch({ x: 1, y: 1 }), 300);
    } else {
      setStretch({ x: 1, y: 1 });
    }

    // Definir zonas de huida (opuestas al mouse)
    const minX = mouseRelX < 0.5 ? areaWidth * 0.5 : 0;
    const maxX = mouseRelX < 0.5 ? areaWidth - btnWidth : areaWidth * 0.5;
    
    const minY = mouseRelY < 0.5 ? areaHeight * 0.5 : 0;
    const maxY = mouseRelY < 0.5 ? areaHeight - btnHeight : areaHeight * 0.5;

    let randomX = 0, randomY = 0;
    let empalmado = true;
    let intentos = 0;

    const siRect = btnSiRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const siLeft = siRect.left - containerRect.left;
    const siTop = siRect.top - containerRect.top;
    const siRight = siLeft + siRect.width;
    const siBottom = siTop + siRect.height;

    while (empalmado && intentos < 50) {
      randomX = minX + Math.random() * (maxX - minX);
      randomY = minY + Math.random() * (maxY - minY);

      const currentLeft = parseFloat(noPos.left);
      const currentTop = parseFloat(noPos.top);
      const dist = Math.sqrt(Math.pow(randomX - currentLeft, 2) + Math.pow(randomY - currentTop, 2));

      if (dist < 150 && intentos < 40) {
        intentos++;
        continue;
      }

      const colisionaConSi = (
        randomX < siRight + 40 &&
        randomX + btnWidth > siLeft - 40 &&
        randomY < siBottom + 40 &&
        randomY + btnHeight > siTop - 40
      );

      if (colisionaConSi) {
        intentos++;
      } else {
        empalmado = false;
      }
    }

    setNoPos({
      left: `${randomX}px`,
      top: `${randomY}px`
    });
  };

  const manejarSi = () => {
    setEsExito(true);
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
        <AnimatePresence mode="wait">
          {!esExito ? (
            <motion.div 
              key="pregunta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              id="evasivo-contenido" 
              style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
            >
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
                
                <motion.div 
                  ref={btnNoRef}
                  id="btn-no" 
                  className="option-btn" 
                  animate={{ 
                    left: noPos.left, 
                    top: noPos.top,
                    scale: escalaNo,
                    scaleX: stretch.x,
                    scaleY: stretch.y,
                    rotate: rotation
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 1000, 
                    damping: 35,
                    mass: 0.5
                  }}
                  style={{ 
                    position: 'absolute', 
                    width: '130px', 
                    fontSize: '1.2rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    cursor: 'pointer', 
                    userSelect: 'none',
                    transition: 'none !important' 
                  }}
                  onMouseEnter={(e) => moverBotonNo(e)}
                  onPointerDown={(e) => moverBotonNo(e)}
                  onClick={(e) => moverBotonNo(e)}
                >
                  {data.texto_no}
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="exito"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              id="evasivo-exito" 
              style={{ margin: 'auto 0' }}
            >
              <h2 className="card-title" style={{ fontSize: '2.5rem', color: '#ff4757' }}>
                ¡Sabía que dirías que sí!
              </h2>
              <p className="card-description" style={{ marginTop: '15px', fontSize: '1.5rem' }}>
                {data.mensaje_exito}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Evasivo;
