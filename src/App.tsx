import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Pedido } from '@/types/pedido';
import LienzoRavyn from '@/components/LienzoRavyn';

function App() {
  const { id } = useParams<{ id: string }>();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si no hay ID, usamos webejemplo por defecto
    const pedidoId = id || 'webejemplo';
    
    fetch(`/pedidos/${pedidoId}/data.json`)
      .then((res) => {
        if (!res.ok) throw new Error('No se pudo cargar el pedido');
        return res.json();
      })
      .then((data) => setPedido(data))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>Error: {error}</div>;
  if (!pedido) return <div style={{ textAlign: 'center', padding: '20px' }}>Cargando experiencia...</div>;

  return (
    <div className="app-main">
      <LienzoRavyn pedido={pedido} />
    </div>
  );
}

export default App;
