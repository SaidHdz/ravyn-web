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
    const diffY = e.clientY - startPos.current.y;

    // Relajamos la restricción vertical: solo cancela si el movimiento vertical es MUCHO mayor que el horizontal
    if (Math.abs(diffY) > Math.abs(diffX) * 1.5 && Math.abs(diffY) > 20) {
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
      setRotation(0);
      return;
    }

    setDragOffset({ x: diffX, y: 0 });
    setRotation(diffX * 0.08); // Aumentamos un poco la rotación para más feedback
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);

    const diffX = e.clientX - startPos.current.x;
    const threshold = window.innerWidth * 0.15; // Umbral más sensible (15%)

    if (Math.abs(diffX) > threshold) {
      const direction = diffX > 0 ? 1 : -1;
      setDragOffset({ x: direction * window.innerWidth, y: 0 });
      setRotation(diffX * 0.1);
      
      const cartaActual = cartasRestantes[cartasRestantes.length - 1];
      setIdCartaSaliendo(cartaActual.id);

      setTimeout(() => {
        const nuevasCartas = [...cartasRestantes];
        nuevasCartas.pop();
        setCartasRestantes(nuevasCartas);
        setDragOffset({ x: 0, y: 0 });
        setRotation(0);
        setIdCartaSaliendo(null);
        
        if (nuevasCartas.length === 0) {
          setEscena('final');
        }
      }, 400);
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
      case 'finn': return 'animacion-abrir';
      case 'jake': return 'animacion-abrir';
      case 'lsp': return 'animacion-abrir';
      case 'neo-japan': return 'animacion-abrir';
      default: return 'animacion-abrir';
    }
  };

  return (
    <section id="modulo-tarjetas" className="modulo-ravyn" style={{ padding: '60px 0', minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <main id="app-container" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* ESCENA: SOBRE / PAQUETE */}
        {escena === 'sobre' && (
          <section id="escena-sobre" className="escena activa">
            <h1 id="mensaje-inicio">{data.config.mensaje_inicio}</h1>
            <div 
              id="paquete-cartas" 
              className={`paquete ${abriendo ? `animacion-abrir ${getTemaClase()}` : ''}`}
              onClick={abrirPaquete}
            >
              <div className="pestillo" aria-hidden="true"></div>
            </div>
          </section>
        )}

        {/* ESCENA: CARTAS / STACK */}
        {escena === 'cartas' && (
          <section id="escena-cartas" className="escena activa">
            <div id="stack-container">
              {cartasRestantes.map((carta, index) => {
                const isTop = index === cartasRestantes.length - 1;
                const isLeaving = carta.id === idCartaSaliendo;
                
                const style: React.CSSProperties = {
                  zIndex: isLeaving ? 100 : index + 1,
                  transform: isTop 
                    ? `translateX(${dragOffset.x}px) rotate(${rotation}deg)` 
                    : `scale(${1 - (cartasRestantes.length - 1 - index) * 0.05}) translateY(${(cartasRestantes.length - 1 - index) * 10}px)`,
                  transition: isDragging ? 'none' : 'transform 0.4s ease-out',
                  touchAction: 'none', // CLAVE: Evita scroll del navegador al arrastrar
                  pointerEvents: isTop ? 'auto' : 'none', // Asegura que solo la de arriba sea interactiva
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
                        <img 
                          src={carta.imagen} 
                          alt={carta.titulo} 
                          draggable="false" 
                          loading="lazy"
                        />
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

        {/* ESCENA: FINAL */}
        {escena === 'final' && (
          <section id="escena-final" className="escena activa">
            <h2 id="mensaje-final">Has leído todas las cartas</h2>
            <button id="btn-reiniciar" className="option-btn" onClick={reiniciar} style={{ width: 'auto', padding: '10px 30px' }}>Volver a leer</button>
          </section>
        )}

      </main>
    </section>
  );
};

export default Tarjetas;
