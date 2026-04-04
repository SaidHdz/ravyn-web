import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ExternalLink, Heart, Home } from 'lucide-react';

const SuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    if (location.state?.pedido) {
      setOrderData(location.state.pedido);
    } else {
      const timer = setTimeout(() => navigate('/'), 5000);
      return () => clearTimeout(timer);
    }
  }, [location, navigate]);

  const finalUrl = `https://ravyn.studio/experience/${orderData?.order_id || 'tu-historia'}`;

  return (
    <div className="success-page-container" style={{
      minHeight: '100vh',
      background: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      color: '#1A4073',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <motion.div 
        className="success-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          padding: '4rem 2rem',
          borderRadius: '40px',
          textAlign: 'center',
          maxWidth: '550px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
          position: 'relative',
          zIndex: 10
        }}
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.3 }}
          style={{
            width: '90px',
            height: '90px',
            background: '#10b981', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
            boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)'
          }}
        >
          <Check size={45} strokeWidth={3} color="white" />
        </motion.div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em', color: '#1A4073' }}>
          ¡Experiencia Lista!
        </h1>
        
        <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: '1.6' }}>
          Tus recuerdos han sido procesados. Tu historia digital ya vive en la nube y está lista para ser compartida.
        </p>

        <div className="order-summary-mini" style={{
          background: '#f8fafc',
          borderRadius: '24px',
          padding: '1.5rem',
          marginBottom: '3rem',
          textAlign: 'left',
          border: '1px solid rgba(0, 0, 0, 0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: '#64748b', fontWeight: 500 }}>Protagonistas:</span>
            <strong style={{ color: '#1A4073' }}>{orderData?.bienvenida?.pareja || 'Cargando...'}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b', fontWeight: 500 }}>ID de Acceso:</span>
            <code style={{ color: '#ef4444', fontWeight: 700 }}>{orderData?.order_id || 'RAV-PRO'}</code>
          </div>
        </div>

        <div className="success-actions" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <a 
            href={finalUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              background: '#ef4444',
              color: '#ffffff',
              padding: '1.25rem',
              borderRadius: '16px',
              fontWeight: 700,
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              textDecoration: 'none',
              transition: 'all 0.2s',
              boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.2)'
            }}
          >
            Abrir Mi Experiencia <ExternalLink size={20} />
          </a>
          
          <button 
            onClick={() => navigate('/')}
            style={{
              background: 'transparent',
              color: '#64748b',
              border: 'none',
              padding: '1rem',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Home size={18} /> Volver al Inicio
          </button>
        </div>

        <div style={{ 
          marginTop: '3rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '8px', 
          color: '#94a3b8', 
          fontSize: '0.85rem'
        }}>
          <Heart size={14} fill="#ef4444" color="#ef4444" />
          <span>Ravyn Studio • Arquitectura de Memorias</span>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
