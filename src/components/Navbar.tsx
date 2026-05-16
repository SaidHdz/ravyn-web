import { useState, useEffect } from 'react'
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
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  
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
// Lógica de Ocultar/Mostrar Navbar según Scroll (Solo Móvil)
useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY
    const isMobile = window.innerWidth <= 768

    if (!isMobile) {
      setVisible(true)
      setLastScrollY(currentScrollY)
      return
    }

    if (currentScrollY < 10) {
      setVisible(true)
    } else if (currentScrollY > lastScrollY && currentScrollY > 70) {
      // Scrolling down
      setVisible(false)
      setIsUserMenuOpen(false)
    } else {
      // Scrolling up
      setVisible(true)
    }
    setLastScrollY(currentScrollY)
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  return () => window.removeEventListener('scroll', handleScroll)
}, [lastScrollY])
  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const closeMenu = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.nav-user-menu-anchor') && !(e.target as HTMLElement).closest('.nav-center-menu')) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener('click', closeMenu);
    }
    return () => document.removeEventListener('click', closeMenu);
  }, [isUserMenuOpen]);

  return (
    <>
      <nav className={`nav-gooey-wrapper ${visible ? 'is-visible' : 'is-hidden'}`}>
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
                    initial={{ opacity: 0, y: 10, scale: 0.95, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                    exit={{ opacity: 0, y: 10, scale: 0.95, x: "-50%" }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
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
      </nav>

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
          z-index: 500; 
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          width: 100%;
          overflow: visible; 
          background: transparent;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .nav-gooey-wrapper.is-hidden { transform: translateY(-110%); }
        .nav-gooey-wrapper.is-visible { transform: translateY(0); }

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
          max-width: 95%;
          box-sizing: border-box;
          flex-shrink: 1;
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
          left: 50%;
          width: 0;
          height: 0;
          pointer-events: none;
        }

        .nav-user-menu-floating {
          position: absolute;
          top: 20px;
          background: #0d0d0d; 
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 16px;
          min-width: 220px;
          width: max-content;
          display: flex !important;
          flex-direction: column !important;
          height: auto !important; /* Forzado altura dinámica */
          box-shadow: 0 20px 50px rgba(0,0,0,0.7);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          z-index: 10000;
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

        .nav-logo-simple span { color: var(--accent); }

        .user-menu-header { padding: 4px 8px 12px; }
        .user-email { font-size: 0.85rem; color: var(--text-secondary); display: block; white-space: nowrap; }
        .user-menu-divider { height: 1px; background: rgba(255,255,255,0.08); margin: 4px 0 12px; }

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
          white-space: nowrap;
          flex-shrink: 0;
        }

        .user-menu-item:hover { background: rgba(255,255,255,0.05); color: var(--accent); }
        .user-menu-item.logout:hover { color: #f87171; background: rgba(239, 68, 68, 0.1); }

        .nav-cta-link { text-decoration: none; z-index: 10; display: flex; flex-shrink: 0; }
        .nav-cta-premium {
          position: relative;
          padding: 10px 24px;
          font-size: 0.85rem;
          font-weight: 700;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: #fff !important;
          border-radius: 100vw !important;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .cta-btn-fill { position: absolute; inset: 0; background: #fff; z-index: 0; pointer-events: none; }
        .cta-btn-label { position: relative; z-index: 1; color: #fff; transition: color 0.3s ease; }
        .nav-cta-premium:hover .cta-btn-label { color: #000; }

        @media (max-width: 768px) {
          .nav-gooey-wrapper { height: 80px; transform: translate3d(0,0,0); backface-visibility: hidden; }
          .nav-gooey-container { gap: 0.5rem; padding: 0.4rem 0.8rem; width: auto; max-width: 95%; margin-top: 0.5rem; justify-content: space-between; }
          .desktop-only { display: none !important; }
          .nav-cta-premium { padding: 8px 12px; font-size: 0.7rem; flex-shrink: 0; }
          .nav-center-menu { transform: scale(0.9); flex-shrink: 1; min-width: 0; }
          .nav-user-menu-floating { background: #0a0a0a !important; min-width: 200px; border-radius: 20px; padding: 12px !important; }
        }

        @media (max-width: 480px) {
          .nav-gooey-container { gap: 0.3rem; padding: 0.3rem 0.5rem; }
          .nav-center-menu { transform: scale(0.8); }
          .nav-cta-premium { padding: 7px 10px; font-size: 0.65rem; }
        }
      `}</style>
    </>
  )
}
