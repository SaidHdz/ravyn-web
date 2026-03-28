import React, { useState } from 'react';
import { Dedicatorias as DedicatoriasType } from '@/types/pedido';

interface DedicatoriasProps {
  data: DedicatoriasType;
}

const Dedicatorias: React.FC<DedicatoriasProps> = ({ data }) => {
  const [scene, setScene] = useState<'sobre' | 'secuencia' | 'cartas' | 'final'>('sobre');
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageAnimClass, setMessageAnimClass] = useState('');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isBoxOpening, setIsBoxOpening] = useState(false);
  const [isCardFlying, setIsCardFlying] = useState(false);

  const startChoreography = () => {
    setIsBoxOpening(true);

    // Cambio de escena 1 (Ocultar sobre, mostrar secuencia)
    setTimeout(() => {
      setScene('secuencia');
      
      // Primer mensaje
      setTimeout(() => {
        setCurrentMessage(data.config.secuencia_1 || data.config.secuencia?.[0] || "Te quiero mucho...");
        setMessageAnimClass('show');
      }, 200);

      // Desaparecer primer mensaje
      setTimeout(() => {
        setMessageAnimClass('hide');
      }, 3200);

      // Segundo mensaje
      setTimeout(() => {
        setCurrentMessage(data.config.secuencia_2 || data.config.secuencia?.[1] || "Escribí esto para ti...");
        setMessageAnimClass('show');
      }, 4200);

      // Desaparecer segundo mensaje
      setTimeout(() => {
        setMessageAnimClass('hide');
      }, 7200);

      // Escena final de las cartas
      setTimeout(() => {
        setScene('cartas');
      }, 7800);

    }, 800);
  };

  const nextCard = () => {
    if (currentCardIndex < data.cartas.length - 1) {
      setIsCardFlying(true);
      setTimeout(() => {
        setCurrentCardIndex(prev => prev + 1);
        setIsCardFlying(false);
      }, 600);
    } else {
      setIsCardFlying(true);
      setTimeout(() => {
        setScene('final');
        setIsCardFlying(false);
      }, 600);
    }
  };

  const restart = () => {
    setCurrentCardIndex(0);
    setScene('sobre');
    setIsBoxOpening(false);
    setIsCardFlying(false);
  };

  return (
    <section id="modulo-dedicatorias" className="modulo-ravyn" style={{ padding: '40px 0', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <main id="app-container-dedic" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* ESCENA: SOBRE */}
        {scene === 'sobre' && (
          <section id="escena-sobre-dedic" className="escena activa" style={{ textAlign: 'center' }}>
            <h1 id="mensaje-inicio-dedic" className="header-title" style={{ fontSize: '2rem', marginBottom: '50px' }}>
              {data.config.mensaje_inicio}
            </h1>
            <div 
              id="paquete-dedic" 
              className={`paquete ${isBoxOpening ? 'abriendo-cofre' : ''}`}
              onPointerDown={startChoreography}
              style={{ cursor: 'pointer' }}
            >
              <div className="pestillo">?</div>
              <div className="destello"></div>
            </div>
          </section>
        )}

        {/* ESCENA: SECUENCIA DE MENSAJES */}
        {scene === 'secuencia' && (
          <section id="escena-secuencia-dedic" style={{ textAlign: 'center', padding: '0 20px' }}>
            <h2 
              className={`header-title message-sequence ${messageAnimClass}`} 
              style={{ 
                fontSize: '3rem',
                opacity: messageAnimClass === 'show' ? 1 : 0,
                transform: messageAnimClass === 'show' ? 'translateY(0) scale(1) rotate(-2deg)' : 
                           messageAnimClass === 'hide' ? 'translateY(-100px) scale(1.5)' : 'translateY(50px) scale(0.5)',
                transition: messageAnimClass === 'show' ? 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 
                           messageAnimClass === 'hide' ? 'all 0.5s ease-in' : 'none'
              }}
            >
              {currentMessage}
            </h2>
          </section>
        )}

        {/* ESCENA: CARTAS / STACK */}
        {scene === 'cartas' && (
          <section id="escena-cartas-dedic" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div id="stack-container-dedic" style={{ position: 'relative', width: '85vw', maxWidth: '360px', height: '60vh', maxHeight: '550px', perspective: '1000px' }}>
              {data.cartas.map((carta, index) => {
                const i = index - currentCardIndex;
                if (i < 0 && !(i === -1 && isCardFlying)) return null;

                const isLeaving = i === -1 && isCardFlying;
                const isCurrent = i === 0;

                const style: React.CSSProperties = {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '20px',
                  backgroundColor: 'white',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  opacity: isLeaving ? 0 : 
                           i === 0 ? 1 : 
                           i === 1 ? 0.9 : 
                           i === 2 ? 0.5 : 0,
                  transform: isLeaving ? 'translateX(-150vw) translateY(-20vh) rotate(-35deg) scale(0.8)' :
                             i === 0 ? 'translateZ(0) translateY(0) scale(1)' :
                             i === 1 ? 'translateZ(-50px) translateY(15px) scale(0.95)' :
                             i === 2 ? 'translateZ(-100px) translateY(30px) scale(0.9)' : 
                             'translateZ(-150px) translateY(45px) scale(0.8)',
                  zIndex: isLeaving ? 20 : 10 - i,
                  pointerEvents: isCurrent ? 'auto' : 'none',
                  overflow: 'hidden'
                };

                return (
                  <div key={index} className="carta-dedic" style={style}>
                    <h3 className="card-title" style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '15px' }}>
                      {carta.titulo || `Carta ${index + 1}`}
                    </h3>
                    <div className="card-description" style={{ fontSize: '1.1rem', lineHeight: '1.6', overflowY: 'auto', flexGrow: 1 }}>
                      {carta.contenido}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div id="controles-cartas-dedic" style={{ display: 'flex', gap: '20px', marginTop: '30px', zIndex: 50, justifyContent: 'center' }}>
              <button className="option-btn" onClick={nextCard} style={{ padding: '10px 30px' }}>
                Siguiente Carta ➔
              </button>
            </div>
          </section>
        )}

        {/* ESCENA: FINAL */}
        {scene === 'final' && (
          <section id="escena-final-dedic" style={{ textAlign: 'center' }}>
            <h2 className="header-title" style={{ marginBottom: '20px' }}>Has leído todas las cartas</h2>
            <button className="option-btn" onClick={restart}>Volver a leer</button>
          </section>
        )}
        
      </main>
    </section>
  );
};

export default Dedicatorias;
