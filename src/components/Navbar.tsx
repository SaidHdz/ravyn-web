import { useState } from 'react'
import GooeyNav from './animations/GooeyNav'
import { motion, useScroll, useSpring, AnimatePresence, type Variants } from 'motion/react'
import { Link, useLocation } from 'react-router-dom'
import { User, LogOut, Settings } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import AuthModal from './AuthModal'
import AccountModal from './AccountModal'

interface NavbarProps {
  theme?: string
  onToggle?: () => void
}

const ease = [0.16, 1, 0.3, 1] as const

const fillVariants: Variants = {
  rest:  { clipPath: 'circle(0% at 50% 50%)',   transition: { duration: 0.4, ease } },
  hover: { clipPath: 'circle(150% at 50% 50%)', transition: { duration: 0.7, ease } },
}

export default function Navbar({ }: NavbarProps) {
  const { scrollYProgress } = useScroll()
  const location = useLocation()
  const { user, signOut } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  })

  const isRavynset = location.pathname === '/ravynset'

  const baseItems = isRavynset 
    ? [
        { label: 'Home', href: '/ravynset' },
        { label: 'Planes', href: '#planes' }
      ]
    : [
        { label: 'Home', href: '/' },
        { label: 'Contacto', href: '#contacto' }
      ]

  const navItems = [
    ...baseItems,
    { 
      label: <User className={`w-5 h-5 ${user ? 'text-accent' : 'text-white'}`} />, 
      href: '#profile',
      isIcon: true,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        if (user) {
          setIsUserMenuOpen(!isUserMenuOpen);
        } else {
          setIsAuthModalOpen(true);
        }
      }
    }
  ]

  return (
    <nav className="nav-gooey-wrapper">
      <motion.div className="scroll-progress" style={{ scaleX, zIndex: 1000 }} />
      
      <div className="nav-gooey-container">
        <Link 
          to={isRavynset ? "/ravynset" : "/"} 
          className={`nav-logo-simple desktop-only ${!isRavynset ? 'is-active-root' : ''}`}
          onClick={(e) => {
            if (location.pathname === '/' || location.pathname === '/ravynset') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          {isRavynset ? 'Ravynset' : 'Ravyn'}<span>.</span>
        </Link>
        
        <div className="nav-center-menu">
          <GooeyNav
            key={location.pathname + (user ? '-logged' : '-guest')}
            items={navItems}
            particleCount={12}
            particleDistances={[60, 5]}
            particleR={80}
            initialActiveIndex={0}
          />

          <div className="nav-user-menu-anchor">
            <AnimatePresence>
              {isUserMenuOpen && user && (
                <motion.div 
                  className="nav-user-menu-floating"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                >
                  <div className="user-menu-header">
                    <span className="user-email">{user.email}</span>
                  </div>
                  <div className="user-menu-divider" />
                  <button 
                    className="user-menu-item" 
                    type="button" 
                    onClick={() => {
                      setIsAccountModalOpen(true);
                      setIsUserMenuOpen(false);
                    }}
                  >
                    <Settings className="w-4 h-4" />
                    Mi Cuenta
                  </button>
                  <button className="user-menu-item logout" type="button" onClick={() => { signOut(); setIsUserMenuOpen(false); }}>
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <Link 
          to={isRavynset ? "/" : "/ravynset"} 
          className="nav-cta-link"
        >
          <motion.button
            className={`nav-cta-premium ${isRavynset ? 'is-ravynset-active' : ''}`}
            initial="rest"
            whileHover="hover"
            whileTap="rest"
            type="button"
          >
            <motion.span className="cta-btn-fill" variants={fillVariants} />
            <span className="cta-btn-label">
              {isRavynset ? 'Ravyn' : 'Ravynset'}
            </span>
          </motion.button>
        </Link>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />

      <style>{`
        .nav-gooey-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 999;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .nav-gooey-container {
          display: flex;
          align-items: center;
          gap: 2rem;
          background: var(--bg-surface);
          padding: 0.5rem 1.5rem;
          border-radius: 100vw;
          border: 1px solid var(--border);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          pointer-events: auto;
          margin-top: 1rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .nav-center-menu {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 5;
        }

        .nav-user-menu-anchor {
          position: absolute;
          top: 100%;
          right: 32px; 
          width: 0;
          height: 0;
          display: flex;
          justify-content: center;
          pointer-events: none;
        }

        .nav-user-menu-floating {
          position: absolute;
          top: 15px;
          left: 50%;
          transform: translateX(-50%); 
          display: flex !important;
          flex-direction: column !important;
          height: auto !important;
          min-height: min-content !important;
          background: #111111 !important;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 16px !important; 
          min-width: 220px;
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: 1000;
          pointer-events: auto;
        }

        .nav-logo-simple {
          font-size: 1.2rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--text);
          cursor: pointer;
          position: relative;
          display: flex;
          z-index: 10;
        }

        .nav-logo-simple span {
          color: var(--accent);
        }

        .user-menu-header {
          padding: 4px 8px 12px;
          text-align: center;
        }

        .user-email {
          font-size: 0.85rem;
          color: var(--text-secondary);
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-menu-divider {
          height: 1px;
          background: rgba(255,255,255,0.1);
          margin: 4px 0 12px;
          width: 100%;
        }

        .user-menu-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #fff;
          transition: all 0.2s;
          text-align: left;
          background: transparent;
          border: none;
          cursor: pointer;
          margin-bottom: 4px;
        }

        .user-menu-item:hover {
          background: rgba(255,255,255,0.08);
          color: var(--accent);
        }

        .user-menu-item.logout:hover {
          color: #f87171;
          background: rgba(239, 68, 68, 0.1);
        }

        .nav-cta-link {
          text-decoration: none;
          z-index: 10;
          display: flex;
        }

        /* Restauración del diseño del botón */
        .nav-cta-premium {
          position: relative;
          padding: 10px 24px;
          font-size: 0.85rem;
          font-weight: 700;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: #fff !important; /* Forzado texto blanco solicitado */
          border-radius: 100vw !important; /* Forzado redondeado solicitado */
          overflow: hidden;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .cta-btn-fill {
          position: absolute;
          inset: 0;
          background: #fff;
          z-index: 0;
          pointer-events: none;
        }

        .cta-btn-label {
          position: relative;
          z-index: 1;
          color: #fff;
          transition: color 0.3s ease;
        }

        .nav-cta-premium:hover .cta-btn-label {
          color: #000;
        }

        .nav-cta-premium.is-ravynset-active {
           background: rgba(255, 255, 255, 0.15);
        }

        @media (max-width: 768px) {
          .nav-gooey-wrapper {
            height: 80px;
          }
          
          .nav-gooey-container {
            gap: 0.4rem;
            padding: 0.4rem 0.6rem;
            width: auto;
            max-width: 98vw;
            margin-top: 0.5rem;
            justify-content: center;
          }

          .desktop-only {
            display: none !important;
          }

          .nav-cta-premium {
            padding: 8px 16px;
            font-size: 0.72rem;
            flex-shrink: 0;
            background: rgba(255, 255, 255, 0.08) !important;
            border-radius: 100vw !important; /* Garantiza redondeado en móvil */
          }

          .nav-cta-premium .cta-btn-fill {
             display: none !important;
          }
          
          .nav-center-menu {
            transform: scale(0.9);
            flex-shrink: 1;
          }

          .nav-user-menu-anchor {
             right: 32px;
          }

          .nav-user-menu-floating {
             background: #0d0d0d !important;
             min-width: 180px;
             padding: 12px !important;
             display: flex !important;
             flex-direction: column !important;
             height: auto !important;
             min-height: 180px; 
          }
        }

        @media (max-width: 480px) {
          .nav-gooey-container {
            gap: 0.2rem;
            padding: 0.3rem 0.5rem;
          }
          .nav-center-menu {
            transform: scale(0.8);
          }
          .nav-cta-premium {
            padding: 7px 12px;
            font-size: 0.68rem;
          }
          .nav-user-menu-anchor {
            right: 50%;
          }
        }
      `}</style>
    </nav>
  )
}
