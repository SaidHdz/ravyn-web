import React, { useState, useEffect, useRef } from 'react';
import { Wrapped as WrappedType, Slide } from '@/types/pedido';

// Componente auxiliar para animar el incremento de números
const Counter: React.FC<{ value: number | string, duration?: number, active: boolean }> = ({ value, duration = 2000, active }) => {
  const [count, setCount] = useState(0);
  const target = typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g, '')) : value;

  useEffect(() => {
    if (!active) {
      setCount(0); // Reiniciar si no está activo
      return;
    }

    let startTimestamp: number | null = null;
    let requestRef: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        requestRef = window.requestAnimationFrame(step);
      }
    };
    requestRef = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(requestRef);
  }, [target, duration, active]);

  return <span>{count.toLocaleString()}{typeof value === 'string' && value.includes('k') ? 'k' : ''}</span>;
};

interface WrappedProps {
  data: WrappedType;
}

const Wrapped: React.FC<WrappedProps> = ({ data }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const { diapositivas, config } = data;
  const duration = (config.velocidad_slide_segundos || 6) * 1000;
  
  const startTimeRef = useRef<number>(0);
  const requestRef = useRef<number>();

  const nextSlide = () => {
    if (currentSlideIndex < diapositivas.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
      setProgress(0);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
      setProgress(0);
    } else {
      setProgress(0);
    }
  };

  const animate = (time: number) => {
    if (!startTimeRef.current) startTimeRef.current = time;
    const elapsed = time - startTimeRef.current;
    const newProgress = Math.min((elapsed / duration) * 100, 100);
    
    setProgress(newProgress);

    if (newProgress < 100) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      nextSlide();
    }
  };

  useEffect(() => {
    startTimeRef.current = 0;
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [currentSlideIndex]);

  // Función para convertir URL de Spotify a URL de Embed
  const formatSpotifyUrl = (url: string) => {
    if (!url) return "";
    if (url.includes('/embed/')) return url;
    return url.replace('spotify.com/track/', 'spotify.com/embed/track/');
  };

  const renderSlideContent = (slide: Slide, isActive: boolean) => {
    const { tipo, titulo, datos } = slide;
    
    const renderTitle = () => (
      tipo !== 'intro' && tipo !== 'resumen' && (
        <h2 className="header-title" style={{ fontSize: '1.8rem', marginBottom: '15px', lineHeight: '1.2' }}>{titulo}</h2>
      )
    );

    switch (tipo) {
      case 'intro':
        return (
          <div style={{ textAlign: 'center' }}>
            <div className="wrapped-loader" style={{ margin: '0 auto 20px' }}></div>
            <h2 className="header-title" style={{ fontSize: '2.5rem' }}>{titulo}</h2>
            <p className="card-description" style={{ fontSize: '1.1rem', marginTop: '5px', color: 'rgba(255,255,255,0.8)' }}>{datos.subtitulo}</p>
          </div>
        );

      case 'metricas_chat':
        return (
          <div style={{ textAlign: 'center', width: '100%' }}>
            {renderTitle()}
            <p className="card-description" style={{ margin: '0' }}>Se enviaron un total de</p>
            <div className="numero-contador" style={{ fontSize: '4rem', fontWeight: 'bold', margin: '10px 0' }}>
              <Counter value={datos.total_mensajes || 0} active={isActive} />
            </div>
            <p className="card-description" style={{ margin: '0' }}>mensajes este año.</p>
            
            <div style={{ marginTop: '30px', background: 'rgba(255,255,255,0.1)', padding: '15px 20px', borderRadius: '16px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="card-description" style={{ margin: '0 0 5px 0', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>La palabra más usada:</p>
              <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--nj-gold, #fff)' }}>"{datos.palabra_top}"</span>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '15px', justifyContent: 'center', fontSize: '2.5rem' }}>
              {datos.top_emojis?.slice(0, 3).map((e, i) => <span key={i} style={{ filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.3))' }}>{e}</span>)} 
            </div>
          </div>
        );

      case 'grafica_dona':
        const p1 = datos.valores?.[0] || 0;
        const c1 = datos.colores?.[0] || '#e31b3f';
        const c2 = datos.colores?.[1] || '#1a112c';
        return (
          <div style={{ textAlign: 'center', width: '100%' }}>
            {renderTitle()}
            <p className="card-description" style={{ marginBottom: '20px' }}>{datos.subtitulo}</p>
            <div className="wrapped-dona-container" style={{ 
              background: `conic-gradient(${c1} 0% ${p1}%, ${c2} ${p1}% 100%)`, 
              margin: '0 auto',
              width: '220px',
              height: '220px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(0,0,0,0.5)'
            }}>
              <div className="wrapped-dona-hueco" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                backgroundColor: '#1a112c',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>VS</div>
            </div>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around', marginTop: '25px' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ color: c1, fontSize: '2rem', fontWeight: 'bold' }}>{p1}%</span>
                <p className="card-description" style={{ fontSize: '0.9rem', textTransform: 'uppercase' }}>{datos.etiquetas?.[0]}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ color: '#fff', fontSize: '2rem', fontWeight: 'bold' }}>{datos.valores?.[1]}%</span>
                <p className="card-description" style={{ fontSize: '0.9rem', textTransform: 'uppercase' }}>{datos.etiquetas?.[1]}</p>
              </div>
            </div>
          </div>
        );

      case 'grafica_barras':
        return (
          <div style={{ width: '100%' }}>
            {renderTitle()}
            <p className="card-description" style={{ marginBottom: '20px' }}>{datos.subtitulo}</p>
            <div style={{ width: '100%' }}>
              {datos.items?.map((item, i) => (
                <div key={i} className="wrapped-barra-item" style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div className="wrapped-barra-etiqueta" style={{ fontSize: '0.9rem', marginBottom: '6px', width: '100%', textAlign: 'left' }}>{item.nombre}</div>
                  <div className="wrapped-barra-track" style={{ width: '100%', height: '24px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
                    <div className="wrapped-barra-fill" style={{ 
                      background: item.color, 
                      width: isActive ? `${item.porcentaje}%` : '0%', 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      paddingLeft: '12px', 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold',
                      color: '#000',
                      transition: 'width 1s ease-out'
                    }}>
                      {item.porcentaje}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'horario_pico':
        return (
          <div style={{ width: '100%', textAlign: 'center' }}>
            {renderTitle()}
            <p className="card-description" style={{ marginBottom: '30px' }}>{datos.subtitulo}</p>
            <div style={{ width: '100%', height: '150px', display: 'flex', gap: '6px', alignItems: 'flex-end', marginBottom: '15px' }}>
              {datos.valores?.map((h, i) => (
                <div key={i} style={{ 
                  flexGrow: 1, 
                  backgroundColor: 'var(--nj-gold, #e1c17e)', 
                  height: isActive ? `${h}%` : '0%', 
                  borderRadius: '10px 10px 0 0', 
                  opacity: i === 4 ? 1 : 0.4,
                  boxShadow: i === 4 ? '0 0 15px var(--nj-gold)' : 'none',
                  transition: 'height 1s ease-out'
                }}></div>
              ))}
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
              <span>Mañana</span>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>Noche ({datos.pico_hora})</span>
              <span>Madrugada</span>
            </div>
          </div>
        );

      case 'medidor_perdon':
        return (
          <div style={{ textAlign: 'center', width: '100%' }}>
            {renderTitle()}
            <p className="card-description" style={{ marginBottom: '20px' }}>{datos.subtitulo}</p>
            <div style={{ width: '180px', height: '180px', margin: '0 auto', position: 'relative' }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--nj-red-neon, #e31b3f)" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={isActive ? "180" : "251.2"} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{isActive ? datos.valor : ''}</span>
                <p style={{ fontSize: '0.6rem', opacity: 0.7, textTransform: 'uppercase', margin: 0 }}>Orgullo</p>
              </div>
            </div>
            <div style={{ marginTop: '30px', display: 'flex', gap: '15px', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '2rem' }}>👑</div>
              <p className="card-description" style={{ margin: 0, textAlign: 'left', fontSize: '0.95rem' }}>
                El primero en perdonar es: <br/>
                <span style={{ fontWeight: 'bold', color: 'var(--nj-gold, #e1c17e)', fontSize: '1.2rem' }}>{datos.perdonador_top}</span>
              </p>
            </div>
          </div>
        );

      case 'soundtrack':
        return (
          <div style={{ textAlign: 'center', width: '100%' }}>
            {renderTitle()}
            <p className="card-description" style={{ marginBottom: '20px' }}>Su energía este año sonó así...</p>
            <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
              <iframe 
                src={formatSpotifyUrl(datos.spotify_embed_url || "")} 
                width="100%" 
                height="352" 
                frameBorder="0" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
                style={{ display: 'block' }}
              ></iframe>
            </div>
          </div>
        );

      case 'superlativo_custom':
        return (
          <div style={{ textAlign: 'center' }}>
            {renderTitle()}
            <div style={{ fontSize: '5rem', margin: '20px 0', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}>{datos.icono_award}</div>
            <h3 className="header-title" style={{ fontSize: '2.5rem', margin: '10px 0', color: 'var(--nj-gold, #e1c17e)' }}>{datos.ganador}</h3>
            <p className="card-description" style={{ fontSize: '1.1rem', marginTop: '15px', color: 'rgba(255,255,255,0.9)' }}>{datos.subtitulo}</p>
          </div>
        );

      case 'resumen':
        return (
          <div style={{ textAlign: 'center', width: '100%' }}>
            <div style={{ 
              border: '2px dashed rgba(255,255,255,0.35)', 
              padding: '28px 20px', 
              borderRadius: '18px', 
              background: 'rgba(8, 8, 8, 0.9)',
              boxShadow: '0 20px 45px rgba(0,0,0,0.6)',
              color: '#f8f8f8'
            }}>
              <p style={{ fontSize: '1.2rem', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '12px' }}>{titulo}</p>
              <h1 style={{ fontSize: '4.5rem', margin: '5px 0', letterSpacing: '-0.05em' }}>
                <Counter value={datos.dias_juntos || 0} active={isActive} />
              </h1>
              <p style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '25px', opacity: 0.8 }}>Días juntos</p>

              <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontSize: '2rem', fontWeight: 600 }}>{datos.total_mensajes}</div>
                  <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.7, marginTop: '4px', letterSpacing: '0.2em' }}>Msjs enviados</p>
                </div>
                <div>
                  <div style={{ fontSize: '2rem' }}>{datos.emoji_top}</div>
                  <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.7, marginTop: '4px', letterSpacing: '0.2em' }}>Emoji top</p>
                </div>
              </div>
            </div>
            <p style={{ marginTop: '18px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)' }}>(Toma screenshot para presumir)</p>
          </div>
        );

      default:
        return <div>Tipo de slide desconocido: {tipo}</div>;
    }
  };

  return (
    <section id="modulo-wrapped" className="modulo-ravyn" style={{ padding: '20px 0', minHeight: '700px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }}>
      <div id="wrapped-ui" style={{ 
        position: 'relative', 
        width: '100%', 
        height: '650px', 
        maxHeight: '90vh',
        maxWidth: '400px', 
        margin: '0 auto', 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        color: 'white',
        borderRadius: '32px',
        border: '4px solid rgba(255,255,255,0.05)',
        boxShadow: '0 30px 60px rgba(0,0,0,0.8)'
      }}>
        
        {/* Progress Bars */}
        <div id="wrapped-progress-container" style={{ position: 'absolute', top: '15px', left: '15px', right: '15px', display: 'flex', gap: '6px', zIndex: 100 }}>
          {diapositivas.map((_, i) => (
            <div key={i} className="wrapped-bar" style={{ flexGrow: 1, height: '3px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '3px', overflow: 'hidden' }}>
              <div 
                className="wrapped-bar-fill" 
                style={{ 
                  height: '100%', 
                  backgroundColor: 'white', 
                  width: i < currentSlideIndex ? '100%' : i === currentSlideIndex ? `${progress}%` : '0%',
                  transition: i === currentSlideIndex ? 'none' : 'width 0.1s linear'
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Slides Area */}
        <div id="wrapped-slides-area" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
          {diapositivas.map((slide, i) => {
            const isActive = i === currentSlideIndex;
            return (
              <div 
                key={slide.id} 
                className={`wrapped-slide ${isActive ? 'activa' : ''}`}
                style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px 30px',
                  textAlign: 'center',
                  opacity: isActive ? 1 : 0,
                  visibility: isActive ? 'visible' : 'hidden',
                  pointerEvents: isActive ? 'auto' : 'none',
                  transition: 'opacity 0.3s ease-in-out',
                  background: 'linear-gradient(180deg, rgba(16, 10, 28, 0) 0%, rgba(16, 10, 28, 0.8) 100%)'
                }}
              >
                {renderSlideContent(slide, isActive)}
              </div>
            );
          })}
        </div>

        {/* Navigation Controls */}
        <div id="wrapped-btn-prev" onClick={prevSlide} style={{ position: 'absolute', top: 0, left: 0, width: '30%', height: '100%', zIndex: 90, cursor: 'pointer' }}></div>
        <div id="wrapped-btn-next" onClick={nextSlide} style={{ position: 'absolute', top: 0, right: 0, width: '70%', height: '100%', zIndex: 90, cursor: 'pointer' }}></div>
      </div>
    </section>
  );
};

export default Wrapped;
