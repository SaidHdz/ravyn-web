import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle } from 'lucide-react';
import '@/styles/landing/custom-banner.css';

const CustomProjectBanner: React.FC = () => {
  const handleContactClick = () => {
    // Aquí podrías poner el link directo a WhatsApp Business
    window.open('https://wa.me/tu-numero-aqui', '_blank');
  };

  return (
    <section className="custom-banner-section">
      <motion.div 
        className="custom-banner-container"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="custom-tag">
          <Sparkles size={14} style={{ marginRight: '8px' }} />
          Ravyn Studio
        </div>

        <h2 className="custom-title">
          ¿Buscas algo fuera<br />de este mundo?
        </h2>

        <p className="custom-description">
          Si tu visión requiere módulos exclusivos, integraciones especiales o una dirección de arte única, nuestro equipo de arquitectura premium lo hará realidad.
        </p>

        <motion.button 
          className="custom-cta-btn"
          onClick={handleContactClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle size={24} />
          Cotizar Proyecto Especial
        </motion.button>
      </motion.div>
    </section>
  );
};

export default CustomProjectBanner;
