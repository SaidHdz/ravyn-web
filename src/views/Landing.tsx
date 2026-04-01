import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, HelpCircle, CheckCircle2, Layout, Zap } from 'lucide-react';
import ModuleShowcase from '@/components/landing/ModuleShowcase';
import PackSelector from '@/components/landing/PackSelector';
import PackPreviewModal from '@/components/landing/PackPreviewModal';
import VisualCart from '@/components/landing/VisualCart';
import CustomProjectBanner from '@/components/landing/CustomProjectBanner';
import ThemeManager from '@/components/ThemeManager';
import { Pack, MODULE_PRICES } from '@/types/store';
import '@/styles/landing/landing-base.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [activeTheme, setActiveTheme] = useState('neo-japan');
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado del Carrito
  const [cartPack, setCartPack] = useState<Pack | null>(null);
  const [cartTheme, setCartTheme] = useState<string>('neo-japan');
  const [cartModules, setCartModules] = useState<string[]>([]);
  const [cartTotal, setCartTotal] = useState<number>(0);

  useEffect(() => {
    document.title = 'Ravyn Studio | Arquitectura de Memorias';
  }, []);

  const handlePackSelect = (pack: Pack) => {
    setSelectedPack(pack);
    setIsModalOpen(true);
  };

  const handleConfirmPack = (pack: Pack, theme: string) => {
    setCartPack(pack);
    setCartTheme(theme);
    setCartModules([...pack.modulos]);
    setCartTotal(pack.precio);
    setIsModalOpen(false);
  };

  const handleAddModuleToCart = (moduleId: string) => {
    if (cartModules.includes(moduleId)) {
      alert('Este módulo ya está en tu arquitectura.');
      return;
    }
    
    setCartModules(prev => [...prev, moduleId]);
    const price = MODULE_PRICES[moduleId] || 0;
    setCartTotal(prev => prev + price);
  };

  const handleRemoveFromCart = () => {
    setCartPack(null);
    setCartModules([]);
    setCartTotal(0);
  };

  const handleRemoveModule = (moduloId: string) => {
    const price = MODULE_PRICES[moduloId] || 0;
    setCartModules(prev => {
      const newModules = prev.filter(id => id !== moduloId);
      if (newModules.length === 0) {
        setCartPack(null);
        setCartTotal(0);
      }
      return newModules;
    });
    setCartTotal(prev => Math.max(0, prev - price));
  };

  const handleReorderModules = (newOrder: string[]) => {
    setCartModules(newOrder);
  };

  const handleCheckout = () => {
    if (cartModules.length === 0) return;
    
    navigate('/configurator', {
      state: {
        selectedPack: cartPack,
        modules: cartModules,
        selectedTheme: cartTheme,
        total: cartTotal
      }
    });
  };

  return (
    <div className="landing-container">
      <ThemeManager theme={activeTheme} isStandalone={false} />
      
      <nav className="landing-nav">
        <div className="logo">Ravyn Studio</div>
        <div className="nav-links">
          <button className="cart-btn" title="Carrito de compras" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingCart size={20} strokeWidth={2.5} />
            {cartModules.length > 0 && <span className="cart-dot"></span>}
          </button>
        </div>
      </nav>

      <section className="hero-section">
        <p className="hero-tagline">No es una página. Es tu arquitectura.</p>
        <h1 className="hero-title">Convertimos emociones<br />en experiencias digitales</h1>
      </section>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
      >
        <ModuleShowcase 
          activeTheme={activeTheme} 
          onThemeChange={setActiveTheme} 
          onAddModule={handleAddModuleToCart}
        />
      </motion.div>

      <motion.section 
        className="how-it-works-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.h2 className="section-title" variants={fadeUp}>¿Cómo construimos tu espacio?</motion.h2>
        <motion.div 
          className="steps-grid"
          variants={staggerContainer}
        >
          <motion.div className="step-card" variants={fadeUp}>
            <div className="step-number">1</div>
            <h3>Elige tu cimiento</h3>
            <p>Selecciona el pack que mejor se adapte a lo que buscas o construye uno a medida con los módulos disponibles.</p>
          </motion.div>
          <motion.div className="step-card" variants={fadeUp}>
            <div className="step-number">2</div>
            <h3>Diseña tu espacio</h3>
            <p>Usa el configurador premium para añadir tus fotos, historias, juegos y mensajes secretos.</p>
          </motion.div>
          <motion.div className="step-card" variants={fadeUp}>
            <div className="step-number">3</div>
            <h3>Entrega la llave</h3>
            <p>Recibe un link único y un código QR personalizado para que tu pareja acceda a su nueva arquitectura digital.</p>
          </motion.div>
        </motion.div>
      </motion.section>

      <PackSelector onPackSelect={handlePackSelect} />

      <motion.section 
        className="testimonials-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
      >
        <motion.h2 className="section-title" variants={fadeUp}>Rabanitos Satisfechos</motion.h2>
        <div className="testimonials-grid">
          <motion.div className="testimonial-card" variants={fadeUp}>
            <p className="testimonial-text">"El mejor regalo que le he dado a mi novia, el contador de días es lo primero que vemos al despertar. ¡Increíble!"</p>
            <div className="testimonial-author">Said - México</div>
          </motion.div>
          <motion.div className="testimonial-card" variants={fadeUp}>
            <p className="testimonial-text">"Buscaba algo diferente y Ravyn superó mis expectativas. La trivia personalizada nos hizo reír muchísimo."</p>
            <div className="testimonial-author">Coco - España</div>
          </motion.div>
          <motion.div className="testimonial-card" variants={fadeUp}>
            <p className="testimonial-text">"La calidad visual es de otro nivel. No parece una web cualquiera, se siente como una app premium hecha solo para nosotros."</p>
            <div className="testimonial-author">Antonio - Argentina</div>
          </motion.div>
        </div>
      </motion.section>

      <CustomProjectBanner />

      <motion.section 
        className="faq-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
      >
        <motion.h2 className="section-title" variants={fadeUp}>Preguntas Frecuentes</motion.h2>
        <div className="faq-grid">
          <motion.div className="faq-item" variants={fadeUp}>
            <h4><HelpCircle size={20} /> ¿Necesito saber programar?</h4>
            <p>No, absolutamente nada. Nuestro equipo de arquitectura se encarga de todo el despliegue técnico. Tú solo diseñas el contenido.</p>
          </motion.div>
          <motion.div className="faq-item" variants={fadeUp}>
            <h4><Layout size={20} /> ¿Cuánto tiempo dura mi página activa?</h4>
            <p>Para siempre. Una vez construida, tu arquitectura digital permanecerá en nuestros servidores de forma permanente.</p>
          </motion.div>
          <motion.div className="faq-item" variants={fadeUp}>
            <h4><Zap size={20} /> ¿Cuándo recibo mi link?</h4>
            <p>Inmediatamente después de completar el pago y la configuración, tu experiencia estará lista para ser entregada.</p>
          </motion.div>
        </div>
      </motion.section>

      <VisualCart 
        selectedPack={cartPack} 
        modules={cartModules}
        total={cartTotal}
        selectedTheme={cartTheme} 
        onReorder={handleReorderModules}
        onRemoveModule={handleRemoveModule}
        onRemove={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      {selectedPack && (
        <PackPreviewModal 
          pack={selectedPack}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmPack}
        />
      )}

      <footer className="landing-footer">
        <p>© 2026 Ravyn Studio. Hecho para rabanitos.</p>
      </footer>
    </div>
  );
};

export default Landing;

