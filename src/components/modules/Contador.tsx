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

      // Usamos el valor absoluto para que funcione tanto como cuenta regresiva 
      // como para contar tiempo transcurrido desde una fecha pasada
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

  return (
    <section className="modulo-ravyn" style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
      <div className="memory-card" style={{ textAlign: 'center', padding: '40px 20px', maxWidth: '600px', width: '90%', position: 'relative', zIndex: 10 }}>
        
        <h2 className="card-title" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{data.titulo}</h2>
        <p className="card-description" style={{ marginBottom: '30px', fontSize: '1.2rem' }}>{mensajeFinal}</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
          <div style={{ background: 'rgba(0,0,0,0.15)', padding: '15px', borderRadius: '12px', minWidth: '90px', backdropFilter: 'blur(5px)' }}>
            <span style={{ fontSize: '3rem', fontWeight: 'bold', display: 'block', lineHeight: 1 }}>{timeLeft.anios}</span>
            <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Años</span>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.15)', padding: '15px', borderRadius: '12px', minWidth: '90px', backdropFilter: 'blur(5px)' }}>
            <span style={{ fontSize: '3rem', fontWeight: 'bold', display: 'block', lineHeight: 1 }}>{timeLeft.meses}</span>
            <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Meses</span>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.15)', padding: '15px', borderRadius: '12px', minWidth: '90px', backdropFilter: 'blur(5px)' }}>
            <span style={{ fontSize: '3rem', fontWeight: 'bold', display: 'block', lineHeight: 1 }}>{timeLeft.dias}</span>
            <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Días</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(0,0,0,0.1)', padding: '10px', borderRadius: '8px', minWidth: '70px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', display: 'block', lineHeight: 1 }}>{timeLeft.horas}</span>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Horas</span>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.1)', padding: '10px', borderRadius: '8px', minWidth: '70px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', display: 'block', lineHeight: 1 }}>{timeLeft.minutos}</span>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Min</span>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.1)', padding: '10px', borderRadius: '8px', minWidth: '70px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', display: 'block', lineHeight: 1 }}>{timeLeft.segundos}</span>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Seg</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Contador;
