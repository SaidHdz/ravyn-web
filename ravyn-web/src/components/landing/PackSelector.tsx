import React from 'react';
<<<<<<< HEAD
import '@/styles/landing/store.css';

const TEMPORAL_PACKS = [
  { id: 1, nombre: 'Prueba Semilla', precio: 249 },
  { id: 2, nombre: 'Prueba Rabanito', precio: 389 },
  { id: 3, nombre: 'Prueba Cosecha', precio: 799 },
];

const PackSelector: React.FC<{ onPackSelect: any }> = ({ onPackSelect }) => {
  return (
    <section className="packs-section" style={{ border: '5px solid red', background: 'white', color: 'black' }}>
      <h2 style={{ color: 'black' }}>DEBUG: SELECTOR DE PACKS</h2>
      <div className="packs-grid">
        {TEMPORAL_PACKS.map((pack) => (
          <div key={pack.id} className="pack-card" onClick={() => onPackSelect(pack)} style={{ background: '#eee', padding: '20px', margin: '10px' }}>
            <h3>{pack.nombre}</h3>
            <p>${pack.precio}</p>
          </div>
        ))}
      </div>
=======
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
>>>>>>> 6fc9480732c08144cbc4357cc24d64c5d7d54913
    </section>
  );
};

export default PackSelector;
