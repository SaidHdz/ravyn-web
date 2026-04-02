import React, { useState, useEffect, useRef } from 'react';
import { Wrapped as WrappedType, Slide } from '@/types/pedido';

const Counter: React.FC<{ value: number | string, duration?: number, active: boolean }> = ({ value, duration = 2000, active }) => {
  const [count, setCount] = useState(0);
  const target = typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g, '')) : value;

  useEffect(() => {
    if (!active) {
      setCount(0);
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

  const formatSpotifyUrl = (url: string) => {
    if (!url) return "";
    if (url.includes('/embed/')) return url;
    return url.replace('spotify.com/track/', 'spotify.com/embed/track/');
  };

  const renderSlideContent = (slide: Slide, isActive: boolean) => {
    const { tipo, titulo, datos } = slide;
    
    const renderTitle = () => (
      tipo !== 'intro' && tipo !== 'resumen' && (
        <h2 className="wrapped-header-title">{titulo}</h2>
      )
    );

    switch (tipo) {
      case 'intro':
        return (
          <div className="wrapped-slide-content">
            <div className="wrapped-custom-loader"></div>
            <h2 className="wrapped-header-title wrapped-title-large">{titulo}</h2>
            <p className="card-description" style={{ opacity: 0.8 }}>{datos.subtitulo}</p>
          </div>
        );

      case 'metricas_chat':
        return (
          <div style={{ width: '100%' }} className="wrapped-slide-content">
            {renderTitle()}
            <p className="card-description">Se enviaron un total de</p>
            <div className="wrapped-counter-display">
              <Counter value={datos.total_mensajes || 0} active={isActive} />
            </div>
            <p className="card-description">mensajes este año.</p>
            
            <div className="wrapped-info-box">
              <p className="wrapped-info-label">Palabra más usada:</p>
              <span className="wrapped-info-value">"{datos.palabra_top}"</span>
            </div>

            <div className="wrapped-emoji-row">
              {datos.top_emojis?.slice(0, 3).map((e, i) => <span key={i} className="wrapped-emoji-item">{e}</span>)} 
            </div>
          </div>
        );

      case 'grafica_dona':
        const p1 = datos.valores?.[0] || 0;
        const c1 = 'var(--w-accent)';
        const c2 = 'var(--w-accent-secondary, rgba(255,255,255,0.2))'; 
        return (
          <div style={{ width: '100%' }}>
            {renderTitle()}
            <p className="card-description" style={{ marginBottom: '30px' }}>{datos.subtitulo}</p>
            <div className="wrapped-dona-visual" style={{ 
              background: `conic-gradient(${c1} 0% ${p1}%, ${c2} ${p1}% 100%)`, 
            }}>
              <div className="wrapped-dona-center">VS</div>
            </div>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around', marginTop: '40px' }}>
              <div>
                <span style={{ color: 'var(--w-accent)', fontSize: '2.5rem', fontWeight: 900 }}>{p1}%</span>
                <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', opacity: 0.6 }}>{datos.etiquetas?.[0]}</p>
              </div>
              <div>
                <span style={{ color: 'var(--w-accent-secondary, inherit)', fontSize: '2.5rem', fontWeight: 900 }}>{datos.valores?.[1]}%</span>
                <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', opacity: 0.6 }}>{datos.etiquetas?.[1]}</p>
              </div>
            </div>
          </div>
        );

      case 'grafica_barras':
        return (
          <div style={{ width: '100%' }}>
            {renderTitle()}
            <p className="card-description" style={{ marginBottom: '30px' }}>{datos.subtitulo}</p>
            <div style={{ width: '100%' }}>
              {datos.items?.map((item, i) => (
                <div key={i} style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.9rem', marginBottom: '8px', textAlign: 'left', fontWeight: 600 }}>{item.nombre}</div>
                  <div className="bar-track-custom">
                    <div className="bar-fill-custom" style={{ 
                      background: 'var(--w-accent)', 
                      width: isActive ? `${item.porcentaje}%` : '0%',
                      transition: 'width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
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
          <div style={{ width: '100%' }}>
            {renderTitle()}
            <p className="card-description" style={{ marginBottom: '40px' }}>{datos.subtitulo}</p>
            <div style={{ width: '100%', height: '180px', display: 'flex', gap: '8px', alignItems: 'flex-end', marginBottom: '25px' }}>
              {datos.valores?.map((h, i) => (
                <div key={i} className={`wrapped-peak-bar ${i === 4 ? 'is-peak' : ''}`} style={{ 
                  flexGrow: 1, 
                  height: isActive ? `${h}%` : '0%', 
                  borderRadius: '12px 12px 4px 4px', 
                  transition: 'height 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}></div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.6 }}>
              <span>Mañana</span>
              <span style={{ color: 'inherit', fontWeight: 800 }}>Pico: {datos.pico_hora}</span>
              <span>Noche</span>
            </div>
          </div>
        );

      case 'medidor_perdon':
        const circumference = 263.8;
        const valorNumerico = parseInt(datos.valor) || 50;
        const offset = circumference - (circumference * valorNumerico) / 100;

        return (
          <div style={{ width: '100%' }}>
            {renderTitle()}
            <p className="card-description" style={{ marginBottom: '30px' }}>{datos.subtitulo}</p>
            <div style={{ width: '200px', height: '200px', margin: '0 auto', position: 'relative' }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--w-accent-secondary, rgba(255,255,255,0.1))" strokeWidth="10" />
                <circle 
                  cx="50" cy="50" r="42" fill="none" 
                  stroke="var(--w-accent)" 
                  strokeWidth="10" 
                  strokeDasharray={circumference} 
                  strokeDashoffset={isActive ? offset : circumference} 
                  strokeLinecap="round" 
                  style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} 
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '3.5rem', fontWeight: 900 }}>{isActive ? datos.valor : ''}</span>
                <p style={{ fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>Nivel</p>
              </div>
            </div>
            <div style={{ 
              marginTop: '40px', 
              display: 'flex', 
              gap: '20px', 
              alignItems: 'center', 
              background: 'rgba(255,255,255,0.05)', 
              padding: '20px', 
              borderRadius: '24px', 
              border: '1px solid rgba(255,255,255,0.1)' 
            }}>
              <div style={{ fontSize: '2.5rem' }}>🏆</div>
              <p style={{ margin: 0, textAlign: 'left', fontSize: '1rem', lineHeight: '1.4' }}>
                <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>El primero en perdonar:</span><br/>
                <span style={{ fontWeight: 900, color: 'var(--w-accent)', fontSize: '1.3rem' }} className="wrapped-highlight-text">{datos.perdonador_top}</span>
              </p>
            </div>
          </div>
        );

      case 'soundtrack':
        return (
          <div style={{ width: '100%' }}>
            {renderTitle()}
            <p className="card-description" style={{ marginBottom: '25px' }}>Su energía este año sonó así...</p>
            <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
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
            <div style={{ fontSize: '6rem', margin: '30px 0' }}>{datos.icono_award}</div>
            <h3 style={{ fontSize: '3rem', fontWeight: 900, margin: '15px 0', color: 'var(--w-accent)' }} className="wrapped-highlight-text">{datos.ganador}</h3>
            <p className="card-description" style={{ fontSize: '1.2rem', marginTop: '20px' }}>{datos.subtitulo}</p>
          </div>
        );

      case 'resumen':
        return (
          <div style={{ width: '100%' }}>
            <div className="wrapped-summary-card">
              <p style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '3px', marginBottom: '15px', opacity: 0.6, textTransform: 'uppercase' }}>{titulo}</p>
              <h1 style={{ fontSize: '6rem', margin: '10px 0', fontWeight: 900, letterSpacing: '-2px' }}>
                <Counter value={datos.dias_juntos || 0} active={isActive} />
              </h1>
              <p style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '6px', marginBottom: '40px', opacity: 0.8 }}>Días de Amor</p>

              <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{datos.total_mensajes}</div>
                  <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.5, marginTop: '5px', letterSpacing: '2px' }}>Mensajes</p>
                </div>
                <div>
                  <div style={{ fontSize: '3rem' }}>{datos.emoji_top}</div>
                  <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.5, marginTop: '5px', letterSpacing: '2px' }}>Top Emoji</p>
                </div>
              </div>
            </div>
            <p style={{ marginTop: '25px', fontSize: '0.85rem', opacity: 0.5 }}>Toma screenshot y compártelo ✨</p>
          </div>
        );

      default:
        return <div>Tipo de slide desconocido: {tipo}</div>;
    }
  };

  return (
    <section id="modulo-wrapped" className="modulo-wrapped-container">
      <div className="wrapped-card-ui">
        
        {/* Progress Bars */}
        <div className="wrapped-progress-bar-container">
          {diapositivas.map((_, i) => (
            <div key={i} className="wrapped-progress-track">
              <div 
                className="wrapped-progress-fill" 
                style={{ 
                  width: i < currentSlideIndex ? '100%' : i === currentSlideIndex ? `${progress}%` : '0%',
                  transition: i === currentSlideIndex ? 'none' : 'width 0.1s linear'
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Slides Area */}
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          {diapositivas.map((slide, i) => {
            const isActive = i === currentSlideIndex;
            return (
              <div 
                key={slide.id} 
                className={`wrapped-slide-wrapper ${isActive ? 'active' : ''}`}
              >
                {renderSlideContent(slide, isActive)}
              </div>
            );
          })}
        </div>

        {/* Navigation Controls */}
        <div onClick={prevSlide} style={{ position: 'absolute', top: 0, left: 0, width: '35%', height: '100%', zIndex: 90, cursor: 'pointer' }}></div>
        <div onClick={nextSlide} style={{ position: 'absolute', top: 0, right: 0, width: '65%', height: '100%', zIndex: 90, cursor: 'pointer' }}></div>
      </div>
    </section>
  );
};

export default Wrapped;
