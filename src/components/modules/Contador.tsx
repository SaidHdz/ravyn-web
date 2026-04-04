import React, { useState, useEffect } from 'react';
import { Contador as ContadorType } from '@/types/pedido';

interface ContadorProps {
  data: ContadorType;
}

const Contador: React.FC<ContadorProps> = ({ data }) => {
  const [timeLeft, setTimeLeft] = useState({
    anios: '00',
    meses: '00',
    dias: '00',
    horas: '00',
    minutos: '00',
    segundos: '00',
  });
  const [mensajeFinal] = useState(data.mensaje);

  useEffect(() => {
    const fechaObjetivo = new Date(data.fecha + 'T00:00:00');

    const actualizarReloj = () => {
      const ahora = new Date();
      const diferenciaBruta = fechaObjetivo.getTime() - ahora.getTime();
      const diferencia = Math.abs(diferenciaBruta);
      
      const segundosTotales = Math.floor(diferencia / 1000);
      const minutosTotales = Math.floor(segundosTotales / 60);
      const horasTotales = Math.floor(minutosTotales / 60);
      const diasTotales = Math.floor(horasTotales / 24);

      const anios = Math.floor(diasTotales / 365);
      const meses = Math.floor((diasTotales % 365) / 30);
      const dias = Math.floor((diasTotales % 365) % 30);

      const horas = horasTotales % 24;
      const minutos = minutosTotales % 60;
      const segundos = segundosTotales % 60;

      setTimeLeft({
        anios: anios.toString().padStart(2, '0'),
        meses: meses.toString().padStart(2, '0'),
        dias: dias.toString().padStart(2, '0'),
        horas: horas.toString().padStart(2, '0'),
        minutos: minutos.toString().padStart(2, '0'),
        segundos: segundos.toString().padStart(2, '0'),
      });
    };

    actualizarReloj();
    const intervalo = setInterval(actualizarReloj, 1000);

    return () => clearInterval(intervalo);
  }, [data.fecha]);

  const CounterBox = ({ value, label }: { value: string, label: string }) => {
    return (
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.8)', 
        padding: '20px 10px', 
        borderRadius: '20px', 
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(139, 92, 246, 0.2)', // Borde morado tenue
        width: '100%',
        boxShadow: '0 8px 20px rgba(0,0,0,0.05)'
      }}>
        <span style={{ 
          fontSize: '2.8rem', 
          fontWeight: 900, // Black / Ultra Bold
          display: 'block', 
          lineHeight: 1, 
          letterSpacing: '-1px',
          color: '#1A4073' // Azul Ravyn
        }}>
          {value}
        </span>
        <span style={{ 
          fontSize: '0.75rem', 
          textTransform: 'uppercase', 
          fontWeight: 700, 
          letterSpacing: '1.5px', 
          marginTop: '6px', 
          color: '#64748b' 
        }}>
          {label}
        </span>
      </div>
    );
  };

  return (
    <section className="modulo-ravyn" style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
      <div className="memory-card" style={{ 
        textAlign: 'center', 
        padding: '50px 25px', 
        maxWidth: '500px', // Reducido para mayor verticalidad
        width: '92%', 
        position: 'relative', 
        zIndex: 10,
        borderRadius: '40px',
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        
        <h2 className="card-title" style={{ 
          fontSize: '2.4rem', 
          marginBottom: '5px', 
          fontWeight: 800,
          color: '#1A4073' 
        }}>{data.titulo}</h2>
        
        <p className="card-description" style={{ 
          marginBottom: '25px', // Acercado al bloque del contador
          fontSize: '1.1rem', 
          fontWeight: 500,
          color: '#64748b' 
        }}>{mensajeFinal}</p>

        <div className="counter-grid-container" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', // 2 Columnas
          gap: '12px',
          width: '100%'
        }}>
          {/* Fila 1: Años y Meses */}
          <CounterBox value={timeLeft.anios} label="Años" />
          <CounterBox value={timeLeft.meses} label="Meses" />

          {/* Fila 2: Días y Horas */}
          <CounterBox value={timeLeft.dias} label="Días" />
          <CounterBox value={timeLeft.horas} label="Horas" />

          {/* Fila 3: Minutos y Segundos */}
          <CounterBox value={timeLeft.minutos} label="Min" />
          <CounterBox value={timeLeft.segundos} label="Seg" />
        </div>

      </div>
    </section>
  );
};

export default Contador;
