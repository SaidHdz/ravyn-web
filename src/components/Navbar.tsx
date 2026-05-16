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

  // Items base de navegación
  const baseItems = isRavynset 
    ? [
        { label: 'Home', href: '/ravynset' },
        { label: 'Planes', href: '#planes' }
      ]
    : [
        { label: 'Home', href: '/' },
        { label: 'Contacto', href: '#contacto' }
      ]

  // Añadimos el icono de perfil al final de los navItems para que GooeyNav lo maneje
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

          {/* Menú de Usuario (desplegable) */}
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

        <Link 
          to={isRavynset ? "/" : "/ravynset"} 
          className="nav-cta-link"
        >
          <motion.button
            className={`nav-cta-premium ${isRavynset ? 'is-ravynset-active' : ''}`}
            initial="rest"
            animate={isRavynset ? "hover" : "rest"}
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

        .nav-left-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .nav-center-menu {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 5;
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

        .nav-logo-simple.is-active-root::after {
           content: '';
           position: absolute;
           bottom: -4px;
           left: 0;
           width: 100%;
           height: 2px;
           background: var(--accent);
           border-radius: 2px;
        }

        .nav-user-menu-floating {
          position: absolute;
          top: calc(100% + 15px);
          right: 0;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 8px;
          min-width: 220px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          backdrop-filter: blur(15px);
          z-index: 100;
        }

        .user-menu-header {
          padding: 12px 16px;
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
          background: var(--border);
          margin: 4px 8px;
        }

        .user-menu-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text);
          transition: all 0.2s;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
        }

        .user-menu-item:hover {
          background: var(--bg-raised);
          color: var(--accent);
        }

        .user-menu-item.logout:hover {
          color: #f87171;
          background: rgba(239, 68, 68, 0.05);
        }

        .nav-cta-link {
          text-decoration: none;
          z-index: 10;
          display: flex;
        }

        .nav-cta-premium {
          position: relative;
          padding: 10px 24px;
          font-size: 0.85rem;
          font-weight: 700;
          border: 1px solid transparent;
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          border-radius: 100vw;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s ease;
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
            background: var(--bg-surface);
            border: 1px solid var(--border);
            backdrop-filter: blur(12px);
          }

          .desktop-only {
            display: none !important;
          }

          .nav-cta-premium {
            padding: 8px 12px;
            font-size: 0.72rem;
            flex-shrink: 0;
            background: rgba(255, 255, 255, 0.08) !important;
          }

          .nav-cta-premium .cta-btn-fill {
             display: none !important;
          }
          
          .nav-center-menu {
            transform: scale(0.9);
            flex-shrink: 1;
          }

          .nav-user-menu-floating {
             right: 50%;
             transform: translateX(50%);
             top: calc(100% + 10px);
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
            padding: 7px 10px;
            font-size: 0.68rem;
          }
        }
      `}</style>
    </nav>
  )
}
