import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Pack, MODULE_PRICES } from '@/types/store';
import { 
  BookOpen, 
  Clock, 
  Layers, 
  Gamepad2, 
  MousePointer2, 
  Mail, 
  BarChart3,
  X,
  GripVertical,
  Trash2,
  Heart,
  ChevronDown,
  ChevronUp,
  ShoppingCart
} from 'lucide-react';
import '@/styles/landing/visual-cart.css';

interface VisualCartProps {
  selectedPack: Pack | null;
  modules: string[];
  total: number;
  selectedTheme: string;
  onReorder: (newOrder: string[]) => void;
  onRemoveModule: (id: string) => void;
  onRemove: () => void;
  onCheckout: () => void;
}

const MODULE_ICONS: Record<string, React.ReactNode> = {
  'historia': <BookOpen size={18} />,
  'contador': <Clock size={18} />,
  'tarjetas': <Layers size={18} />,
  'trivia': <Gamepad2 size={18} />,
  'evasivo': <MousePointer2 size={18} />,
  'wrapped': <BarChart3 size={18} />,
  'dedicatorias': <Heart size={18} />,
};

const VisualCart: React.FC<VisualCartProps> = ({ 
  selectedPack, 
  modules, 
  total,
  selectedTheme, 
  onReorder, 
  onRemoveModule,
  onRemove,
  onCheckout
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  if (modules.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className={`visual-cart-container ${isMinimized ? 'minimized' : ''}`}
        initial={{ y: 100, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 100, opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        <div className="visual-cart-header" onClick={() => setIsMinimized(!isMinimized)} style={{ cursor: 'pointer' }}>
          <div className="header-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={18} className="cart-icon-main" />
              <h3>Tu Arquitectura</h3>
            </div>
            <span className="pack-name-small">
              {selectedPack ? selectedPack.nombre : 'Personalizada'} • {modules.length} {modules.length === 1 ? 'módulo' : 'módulos'}
            </span>
          </div>
          
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button className="minimize-btn" onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex' }}>
              {isMinimized ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            <button className="remove-cart-btn" onClick={(e) => { e.stopPropagation(); onRemove(); }} title="Vaciar Carrito" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{ 
            height: isMinimized ? 0 : 'auto',
            opacity: isMinimized ? 0 : 1
          }}
          transition={{ duration: 0.3 }}
          style={{ overflow: 'hidden' }}
        >
          <div className="cart-instructions">
            Ordena y ajusta tu experiencia
          </div>

          <div className="cart-stack-wrapper">
            <Reorder.Group axis="y" values={modules} onReorder={onReorder} className="cart-stack">
              <AnimatePresence mode="popLayout">
                {modules.map((moduloId) => (
                  <Reorder.Item key={moduloId} value={moduloId} className={`cart-module-block theme-accent-${selectedTheme}`}>
                    <div className="drag-handle"><GripVertical size={16} /></div>
                    <div className="block-icon">{MODULE_ICONS[moduloId] || <Layers size={18} />}</div>
                    <div className="block-info">
                      <span className="block-name">{moduloId.charAt(0).toUpperCase() + moduloId.slice(1)}</span>
                      <span className="block-price">${MODULE_PRICES[moduloId] || 0} MXN</span>
                    </div>
                    <button className="delete-module-btn" onClick={() => onRemoveModule(moduloId)}><Trash2 size={14} /></button>
                  </Reorder.Item>
                ))}
              </AnimatePresence>
            </Reorder.Group>
          </div>
        </motion.div>

        <div className="cart-footer">
          <div className="cart-summary">
            <div className="total-row">
              <span className="label">Total:</span>
              <span className="price-label">${total} MXN</span>
            </div>
          </div>
          <motion.button 
            className="checkout-btn" 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            onClick={onCheckout}
          >
            Continuar al Pago
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VisualCart;
