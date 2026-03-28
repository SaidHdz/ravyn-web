import React from 'react';
import { motion } from 'framer-motion';
import { Pack, PACKS_CONFIG } from '@/types/store';
import '@/styles/landing/store.css';

interface PackSelectorProps {
  onPackSelect: (pack: Pack) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] // Ease out expo para mayor suavidad
    }
  }
};

const PackSelector: React.FC<PackSelectorProps> = ({ onPackSelect }) => {
  return (
    <section className="packs-section">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4, margin: "0px 0px -50px 0px" }} // Requiere 40% de visibilidad
        variants={containerVariants}
      >
        <motion.h2 className="packs-title" variants={itemVariants}>
          Arquitectura de Memorias
        </motion.h2>
        <motion.p className="packs-subtitle" variants={itemVariants}>
          Sustituye regalos efímeros por una experiencia web interactiva permanente. Diseñada para rabanitos exigentes.
        </motion.p>
        
        <div className="packs-grid">
          {PACKS_CONFIG.map((pack) => (
            <motion.div 
              key={pack.id} 
              className={`pack-card ${pack.rareza}`}
              onClick={() => onPackSelect(pack)}
              style={{ '--aura-color': pack.colorAura } as React.CSSProperties}
              variants={itemVariants}
              whileHover={{ 
                y: -15,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="pack-aura"></div>
              <div className="pack-tag">{pack.etiqueta}</div>
              
              <div className="pack-name-container">
                <h3 className="pack-name">{pack.nombre}</h3>
                <span className="pack-sub">{pack.subtitulo}</span>
              </div>

              <div className="pack-price">
                <span className="currency">$</span>
                {pack.precio}
              </div>

              <p className="pack-description">{pack.descripcion}</p>

              <ul className="pack-features">
                {pack.modulos.map((modulo, idx) => (
                  <li key={idx}>
                    {modulo.charAt(0).toUpperCase() + modulo.slice(1)}
                  </li>
                ))}
              </ul>

              <motion.button 
                className="select-pack-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                Configurar Experiencia
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default PackSelector;
