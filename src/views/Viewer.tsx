import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import LienzoRavyn from '@/components/LienzoRavyn';

const Viewer: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [pedidoData, setPedidoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperience = async () => {
      if (!slug) return;

      console.log(`📡 Iniciando fetching para el slug: ${slug}`);
      setLoading(true);
      setError(null);

      try {
        const { data, error: supabaseError } = await supabase
          .from('pedidos')
          .select('payload')
          .eq('slug', slug)
          .single();

        if (supabaseError) {
          console.error('❌ Error de Supabase:', supabaseError);
          throw new Error('Experiencia no encontrada');
        }

        if (!data || !data.payload) {
          console.warn('⚠️ No se recibieron datos para este slug.');
          throw new Error('Experiencia no encontrada');
        }

        console.log('✅ Datos recibidos de Supabase:', data.payload);
        setPedidoData(data.payload.body);

      } catch (err: any) {
        setError(err.message || 'Error al cargar la experiencia');
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#1A4073' }}>
        <p>Cargando experiencia...</p>
      </div>
    );
  }

  if (error || !pedidoData) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#ef4444' }}>
        <h2>Error: {error || 'Experiencia no encontrada'}</h2>
      </div>
    );
  }

  // Extraemos el tema para la clase dinámica
  const tema = pedidoData.configuracion_global?.tema || 'aesthetic';

  return (
    <div className={`theme-${tema} ravyn-canvas`} style={{ minHeight: '100vh' }}>
      {/* Integración con el motor de renderizado real de Ravyn */}
      <LienzoRavyn pedido={pedidoData} isStandalone={true} />
      
      {/* Debug visual solo si es necesario (puedes borrarlo luego) */}
      {tema === 'minecraft' && (
        <h1 style={{ color: '#3adb3a', position: 'fixed', top: 20, right: 20, fontSize: '1rem', fontFamily: 'monospace', zIndex: 1000 }}>
          MINE-MODE ON
        </h1>
      )}
    </div>
  );
};

export default Viewer;
