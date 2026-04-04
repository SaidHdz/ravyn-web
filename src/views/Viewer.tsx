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
        // 1. CAMBIAMOS 'payload' por 'config_json' que es tu columna real
        const { data, error: supabaseError } = await supabase
          .from('pedidos')
          .select('config_json') 
          .eq('slug', slug)
          .single();

        if (supabaseError) {
          console.error('❌ Error de Supabase:', supabaseError);
          throw new Error('Experiencia no encontrada');
        }

        // 2. VERIFICAMOS 'config_json' en lugar de 'payload'
        if (!data || !data.config_json) {
          console.warn('⚠️ No se recibieron datos para este slug.');
          throw new Error('Experiencia no encontrada');
        }

        // 3. PASAMOS LOS DATOS CON COMPATIBILIDAD HACIA ATRÁS
        // Verificamos si los datos están envueltos en un ".body" (pedidos antiguos)
        if (data.config_json.body) {
          console.log('✅ Datos recibidos (Formato Antiguo con .body):', data.config_json.body);
          setPedidoData(data.config_json.body);
        } else {
          console.log('✅ Datos recibidos (Formato Nuevo Directo):', data.config_json);
          setPedidoData(data.config_json);
        }

      } catch (err: any) {
        console.error('❌ Error capturado:', err.message);
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
