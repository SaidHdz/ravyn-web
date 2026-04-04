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
  const [idCartaSaliendo, setIdCartaSaliendo] = useState<string | null>(null);

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
    setIdCartaSaliendo(null);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (escena !== 'cartas' || cartasRestantes.length === 0) return;
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const diffX = e.clientX - startPos.current.x;
    setDragOffset({ x: diffX, y: 0 });
    setRotation(diffX * 0.08);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);

    const diffX = e.clientX - startPos.current.x;
    const threshold = 100;

    if (Math.abs(diffX) > threshold) {
      const direction = diffX > 0 ? 1 : -1;
      setDragOffset({ x: direction * window.innerWidth, y: 0 });
      
      const cartaActual = cartasRestantes[cartasRestantes.length - 1];
      setIdCartaSaliendo(cartaActual.id);

      setTimeout(() => {
        const nuevasCartas = [...cartasRestantes];
        nuevasCartas.pop();
        setCartasRestantes(nuevasCartas);
        setDragOffset({ x: 0, y: 0 });
        setRotation(0);
        setIdCartaSaliendo(null);
        if (nuevasCartas.length === 0) setEscena('final');
      }, 300);
    } else {
      setDragOffset({ x: 0, y: 0 });
      setRotation(0);
    }
  };

  const getTemaClase = () => {
    const tema = data.config.tema || 'aesthetic';
    switch (tema) {
      case 'minecraft': return 'abriendo-cofre';
      case 'cute-soft': return 'abriendo-caja';
      case 'aesthetic': return 'abriendo-lujo';
      default: return 'animacion-abrir';
    }
  };

  return (
    <section id="modulo-tarjetas" className="modulo-ravyn" style={{ padding: '60px 0', minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <main id="app-container">
        
        {escena === 'sobre' && (
          <section className="escena activa">
            <h1 id="mensaje-inicio" style={{ marginBottom: '40px' }}>{data.config.mensaje_inicio}</h1>
            <div 
              id="paquete-cartas" 
              className={`paquete ${abriendo ? `animacion-abrir ${getTemaClase()}` : ''}`}
              onClick={abrirPaquete}
            >
              <div className="pestillo" aria-hidden="true"></div>
            </div>
          </section>
        )}

        {escena === 'cartas' && (
          <section className="escena activa">
            <div id="stack-container" style={{ position: 'relative', width: '320px', height: '450px', margin: '0 auto' }}>
              {cartasRestantes.map((carta, index) => {
                const isTop = index === cartasRestantes.length - 1;
                const isLeaving = carta.id === idCartaSaliendo;
                const depth = cartasRestantes.length - 1 - index;
                
                if (depth > 2 && !isLeaving) return null;

                const style: React.CSSProperties = {
                  position: 'absolute', // FORZADO: Amontonadas una arriba de la otra
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: isLeaving ? 100 : index + 1,
                  transform: isTop 
                    ? `translateX(${dragOffset.x}px) rotate(${rotation}deg)` 
                    : `scale(${1 - depth * 0.05}) translateY(${depth * 15}px)`,
                  opacity: 1 - depth * 0.2,
                  transition: isDragging && isTop ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s',
                  touchAction: 'none',
                  pointerEvents: isTop ? 'auto' : 'none',
                };

                return (
                  <div 
                    key={carta.id} 
                    className={`carta ${isLeaving ? 'leaving' : ''}`} 
                    style={style}
                    onPointerDown={isTop ? handlePointerDown : undefined}
                    onPointerMove={isTop ? handlePointerMove : undefined}
                    onPointerUp={isTop ? handlePointerUp : undefined}
                    onPointerCancel={isTop ? handlePointerUp : undefined}
                  >
                    <div className="carta-inner">
                      <div className="image-container">
                        <img src={carta.imagen} alt={carta.titulo} draggable="false" />
                      </div>
                      <div className="carta-content">
                        <h3 className="card-title">{carta.titulo}</h3>
                        <p className="card-description">{carta.contenido}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {escena === 'final' && (
          <section className="escena activa">
            <h2 id="mensaje-final" style={{ marginBottom: '20px' }}>Has leído todas las cartas</h2>
            <button className="option-btn" onClick={reiniciar} style={{ width: 'auto', padding: '12px 35px' }}>Volver a leer</button>
          </section>
        )}

      </main>
    </section>
  );
};

export default Tarjetas;
