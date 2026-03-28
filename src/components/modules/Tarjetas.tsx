import React, { useState, useRef } from 'react';
import { Tarjetas as TarjetasType, Tarjeta } from '@/types/pedido';
import '@@/estilos_tarjetas.css';

interface TarjetasProps {
  data: TarjetasType;
}

const Tarjetas: React.FC<TarjetasProps> = ({ data }) => {
  const [escena, setEscena] = useState<'sobre' | 'cartas' | 'final'>('sobre');
  const [cartasRestantes, setCartasRestantes] = useState<Tarjeta[]>([...data.cartas].reverse());
  const [abriendo, setAbriendo] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);

  const startPos = useRef({ x: 0, y: 0 });

  const abrirPaquete = () => {
    setAbriendo(true);
    setTimeout(() => {
      setEscena('cartas');
      setAbriendo(false);
    }, 1100);
  };

  const reiniciar = () => {
    setCartasRestantes([...data.cartas].reverse());
    setEscena('sobre');
    setAbriendo(false);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (escena !== 'cartas' || cartasRestantes.length === 0) return;
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    
    const diffX = e.clientX - startPos.current.x;
    const diffY = e.clientY - startPos.current.y;

    // Si el movimiento es mayoritariamente vertical, dejamos que el scroll actúe
    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 10) {
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
      setRotation(0);
      return;
    }

    setDragOffset({ x: diffX, y: 0 }); // Solo movimiento horizontal
    setRotation(diffX * 0.05);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    const diffX = e.clientX - startPos.current.x;
    const threshold = window.innerWidth * 0.25;

    if (Math.abs(diffX) > threshold) {
      const direction = diffX > 0 ? 1 : -1;
      // Lanzar carta fuera
      setDragOffset({ x: direction * window.innerWidth, y: 0 });
      setRotation(diffX * 0.1);

      setTimeout(() => {
        const nuevasCartas = [...cartasRestantes];
        nuevasCartas.pop();
        setCartasRestantes(nuevasCartas);
        setDragOffset({ x: 0, y: 0 });
        setRotation(0);
        
        if (nuevasCartas.length === 0) {
          setEscena('final');
        }
      }, 400);
    } else {
      // Regresar al centro
      setDragOffset({ x: 0, y: 0 });
      setRotation(0);
    }
  };

  const getTemaClase = () => {
    switch (data.config.tema) {
      case 'minecraft': return 'abriendo-cofre';
      case 'cute-soft': return 'abriendo-caja';
      case 'aesthetic': return 'abriendo-lujo';
      default: return '';
    }
  };

  return (
    <section id="modulo-tarjetas" className="modulo-ravyn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <main id="app-container">
        
        {/* ESCENA: SOBRE / PAQUETE */}
        {escena === 'sobre' && (
          <section id="escena-sobre" className="escena activa" style={{ textAlign: 'center' }}>
            <h1 id="mensaje-inicio" style={{ marginBottom: '30px', color: 'white' }}>{data.config.mensaje_inicio}</h1>
            <div 
              id="paquete-cartas" 
              className={`paquete ${abriendo ? `animacion-abrir ${getTemaClase()}` : ''}`}
              onClick={abrirPaquete}
              style={{ cursor: 'pointer', margin: '0 auto' }}
            >
              <div className="pestillo" aria-hidden="true"></div>
              <div className="destello"></div>
            </div>
          </section>
        )}

        {/* ESCENA: CARTAS / STACK */}
        {escena === 'cartas' && (
          <section id="escena-cartas" className="escena activa">
            <div id="stack-container" style={{ position: 'relative', width: '300px', height: '450px', margin: '0 auto' }}>
              {cartasRestantes.map((carta, index) => {
                const isTop = index === cartasRestantes.length - 1;
                const style: React.CSSProperties = {
                  zIndex: index + 1,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  transition: isDragging ? 'none' : 'transform 0.4s ease-out',
                  transform: isTop 
                    ? `translateX(${dragOffset.x}px) rotate(${rotation}deg)` 
                    : `scale(${1 - (cartasRestantes.length - 1 - index) * 0.05}) translateY(${(cartasRestantes.length - 1 - index) * -10}px)`,
                  touchAction: 'none'
                };

                return (
                  <div 
                    key={carta.id} 
                    className="carta" 
                    style={style}
                    onPointerDown={isTop ? handlePointerDown : undefined}
                    onPointerMove={isTop ? handlePointerMove : undefined}
                    onPointerUp={isTop ? handlePointerUp : undefined}
                    onPointerCancel={isTop ? handlePointerUp : undefined}
                  >
                    <div className="carta-inner" style={{ pointerEvents: 'none' }}>
                      <div className="image-container">
                        <img src={carta.imagen} alt={carta.titulo} draggable="false" />
                      </div>
                      <h3 className="card-title">{carta.titulo}</h3>
                      <p className="card-description">{carta.contenido}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ESCENA: FINAL */}
        {escena === 'final' && (
          <section id="escena-final" className="escena activa" style={{ textAlign: 'center' }}>
            <h2 id="mensaje-final" style={{ color: 'white', marginBottom: '20px' }}>Has leído todas las cartas</h2>
            <button id="btn-reiniciar" className="option-btn" onClick={reiniciar}>Volver a leer</button>
          </section>
        )}

      </main>
    </section>
  );
};

export default Tarjetas;
