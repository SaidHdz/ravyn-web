import React, { useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import ModuleShowcase from '@/components/landing/ModuleShowcase';
import '@/styles/landing/landing-base.css';

const Landing: React.FC = () => {
  useEffect(() => {
    document.title = 'Ravyn Studio';
  }, []);

  return (
    <div className="landing-container">
      {/* Navbar simple */}
      <nav className="landing-nav">
        <div className="logo">Ravyn</div>
        <div className="nav-links">
          <button className="cart-btn" title="Carrito de compras" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingCart size={20} strokeWidth={2.5} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <p className="hero-tagline">No es una página. Es su historia</p>
        <h1 className="hero-title">Convertimos tus recuerdos<br />en una experiencia interactiva</h1>
      </section>

      {/* Grid de Módulos (Interactivo) */}
      <ModuleShowcase />

      {/* Footer / CTA final */}
      <footer className="landing-footer">
        <button className="cta-btn-footer">Get in Touch →</button>
      </footer>
    </div>
  );
};

export default Landing;
