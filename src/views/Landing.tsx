import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import ModuleShowcase from '@/components/landing/ModuleShowcase';
import PackSelector from '@/components/landing/PackSelector';
import PackPreviewModal from '@/components/landing/PackPreviewModal';
import VisualCart from '@/components/landing/VisualCart';
import CustomProjectBanner from '@/components/landing/CustomProjectBanner';
import ThemeManager from '@/components/ThemeManager';
import { Pack, MODULE_PRICES } from '@/types/store';
import '@/styles/landing/landing-base.css';

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
        <p className="hero-tagline">No es una página. Es vuestra arquitectura.</p>
        <h1 className="hero-title">Convertimos emociones<br />en experiencias digitales</h1>
      </section>

      <ModuleShowcase 
        activeTheme={activeTheme} 
        onThemeChange={setActiveTheme} 
        onAddModule={handleAddModuleToCart}
      />

      <PackSelector onPackSelect={handlePackSelect} />

      <CustomProjectBanner />

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
