import { useState, useEffect, useRef } from 'react'
import GooeyNav from './animations/GooeyNav'
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, Settings, ChevronDown, LogIn } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import AuthModal from './AuthModal'
import AccountModal from './AccountModal'

interface NavbarProps {
  theme?: string
  onToggle?: () => void
}

export default function Navbar({ }: NavbarProps) {
  const { scrollYProgress } = useScroll()
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isServiciosOpen, setIsServiciosOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const serviciosAnchorRef = useRef<HTMLDivElement>(null)

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  })

  const isRavynset = location.pathname === '/ravynset'
  const isKlino = location.pathname === '/klino'
  const isSubapp = isRavynset || isKlino

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Contacto', href: '#contacto' },
    {
      label: (
        <span className="nav-servicios-label">
          Servicios <ChevronDown className="w-3.5 h-3.5" strokeWidth={2.5} />
        </span>
      ),
      href: '#servicios-menu',
      isIcon: false,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault()
        setIsServiciosOpen(v => !v)
        setIsUserMenuOpen(false)
      },
    },
  ]

  // Hide/show on scroll (mobile only)
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
        setVisible(false)
        setIsUserMenuOpen(false)
        setIsServiciosOpen(false)
      } else {
        setVisible(true)
      }
      setLastScrollY(currentScrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Close menus on outside click
  useEffect(() => {
    const closeMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.nav-user-menu-anchor') && !target.closest('.nav-login-trigger')) {
        setIsUserMenuOpen(false)
      }
      if (!target.closest('.nav-servicios-anchor') && !target.closest('.nav-center-menu')) {
        setIsServiciosOpen(false)
      }
    }
    if (isUserMenuOpen || isServiciosOpen) {
      document.addEventListener('click', closeMenu)
    }
    return () => document.removeEventListener('click', closeMenu)
  }, [isUserMenuOpen, isServiciosOpen])

  // Close dropdowns on route change
  useEffect(() => {
    setIsServiciosOpen(false)
    setIsUserMenuOpen(false)
  }, [location.pathname])

  const handleLoginClick = () => {
    if (user) {
      setIsUserMenuOpen(v => !v)
      setIsServiciosOpen(false)
    } else {
      setIsAuthModalOpen(true)
    }
  }

  const goToService = (path: string) => {
    setIsServiciosOpen(false)
    navigate(path)
  }

  return (
    <>
      <nav className={`nav-gooey-wrapper ${visible ? 'is-visible' : 'is-hidden'}`}>
        <motion.div className="scroll-progress" style={{ scaleX, zIndex: 1000 }} />

        <div className="nav-gooey-container">
          <Link
            to="/"
            className="nav-logo-simple desktop-only"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }}
          >
            Ravyn<span>.</span>
          </Link>

          <div className="nav-center-menu">
            <GooeyNav
              key={location.pathname + (user ? '-logged' : '-guest')}
              items={navItems}
              particleCount={12}
              particleDistances={[60, 5]}
              particleR={80}
              initialActiveIndex={isSubapp ? 2 : 0}
            />

            <div className="nav-servicios-anchor" ref={serviciosAnchorRef}>
              <AnimatePresence>
                {isServiciosOpen && (
                  <motion.div
                    className="nav-dropdown-floating nav-servicios-floating"
                    initial={{ opacity: 0, y: 10, scale: 0.95, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
                    exit={{ opacity: 0, y: 10, scale: 0.95, x: '-50%' }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    <button
                      className={`dropdown-item ${isRavynset ? 'is-active' : ''}`}
                      type="button"
                      onClick={() => goToService('/ravynset')}
                    >
                      <span className="dropdown-item-title">Ravynset</span>
                      <span className="dropdown-item-desc">Sistema de gestión para clínicas</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="nav-login-wrapper">
            {user ? (
              <button
                type="button"
                className="nav-login-trigger is-logged"
                onClick={handleLoginClick}
                aria-label="Cuenta"
                title={user.email}
              >
                <span className="nav-avatar">
                  {(user.email?.[0] ?? '?').toUpperCase()}
                </span>
              </button>
            ) : (
              <button
                type="button"
                className="nav-login-trigger is-guest"
                onClick={handleLoginClick}
                aria-label="Iniciar sesión"
              >
                <LogIn className="w-4 h-4" strokeWidth={2.25} />
                <span className="nav-login-label">Entrar</span>
              </button>
            )}

            <div className="nav-user-menu-anchor">
              <AnimatePresence>
                {isUserMenuOpen && user && (
                  <motion.div
                    className="nav-dropdown-floating nav-user-menu-floating"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    <div className="user-menu-header">
                      <span className="user-email">{user.email}</span>
                    </div>
                    <div className="user-menu-divider" />
                    <button
                      className="user-menu-item"
                      type="button"
                      onClick={() => {
                        setIsAccountModalOpen(true)
                        setIsUserMenuOpen(false)
                      }}
                    >
                      <Settings className="w-4 h-4" />
                      Mi Cuenta
                    </button>
                    <button
                      className="user-menu-item logout"
                      type="button"
                      onClick={() => {
                        signOut()
                        setIsUserMenuOpen(false)
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <AccountModal isOpen={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} />

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

        .nav-servicios-label {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .nav-servicios-anchor,
        .nav-user-menu-anchor {
          position: absolute;
          top: 100%;
          left: 50%;
          width: 0;
          height: 0;
          pointer-events: none;
        }

        .nav-dropdown-floating {
          position: absolute;
          top: 16px;
          background: #0d0d0d;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 8px;
          min-width: 240px;
          width: max-content;
          display: flex;
          flex-direction: column;
          gap: 2px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.7);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          z-index: 10000;
          pointer-events: auto;
        }

        .nav-servicios-floating {
          left: 0;
        }

        .nav-user-menu-floating {
          right: 0;
          left: auto;
          transform: none !important;
          min-width: 220px;
        }

        .dropdown-item {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
          width: 100%;
          padding: 12px 14px;
          border-radius: 14px;
          background: transparent;
          border: none;
          color: #fff;
          text-align: left;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }

        .dropdown-item:hover { background: rgba(255,255,255,0.06); }
        .dropdown-item.is-active { background: rgba(255,255,255,0.04); }
        .dropdown-item.is-active .dropdown-item-title { color: var(--accent); }

        .dropdown-item-title { font-size: 0.95rem; font-weight: 600; line-height: 1.2; }
        .dropdown-item-desc { font-size: 0.78rem; color: var(--text-secondary); line-height: 1.2; }

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

        .nav-login-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          flex-shrink: 0;
          z-index: 10;
        }

        .nav-login-trigger {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          height: 38px;
          border-radius: 100vw;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.2s;
          font-family: inherit;
        }

        .nav-login-trigger.is-guest {
          padding: 0 14px 0 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          color: #fff;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: -0.01em;
        }

        .nav-login-trigger.is-guest:hover {
          background: #fff;
          color: #000;
          border-color: #fff;
        }

        .nav-login-trigger.is-logged {
          width: 38px;
          height: 38px;
          padding: 0;
          background: var(--accent);
          border: 1px solid var(--accent);
          color: #000;
        }

        .nav-login-trigger.is-logged:hover {
          transform: scale(1.05);
          box-shadow: 0 0 0 3px rgba(255,255,255,0.08);
        }

        .nav-avatar {
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0;
          line-height: 1;
          color: #000;
          text-transform: uppercase;
        }

        .nav-login-label {
          line-height: 1;
        }

        .user-menu-header { padding: 4px 8px 12px; }
        .user-email { font-size: 0.85rem; color: var(--text-secondary); display: block; white-space: nowrap; }
        .user-menu-divider { height: 1px; background: rgba(255,255,255,0.08); margin: 4px 0 8px; }

        .user-menu-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
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
        }

        .user-menu-item:hover { background: rgba(255,255,255,0.05); color: var(--accent); }
        .user-menu-item.logout:hover { color: #f87171; background: rgba(239, 68, 68, 0.1); }

        @media (max-width: 768px) {
          .nav-gooey-wrapper { height: 80px; transform: translate3d(0,0,0); backface-visibility: hidden; }
          .nav-gooey-container { gap: 0.5rem; padding: 0.4rem 0.8rem; width: auto; max-width: 95%; margin-top: 0.5rem; justify-content: space-between; }
          .desktop-only { display: none !important; }
          .nav-center-menu { transform: scale(0.9); flex-shrink: 1; min-width: 0; }
          .nav-login-trigger { height: 34px; }
          .nav-login-trigger.is-logged { width: 34px; }
          .nav-login-trigger.is-guest { padding: 0 12px 0 10px; font-size: 0.78rem; }
          .nav-login-label { display: inline; }
          .nav-dropdown-floating { background: #0a0a0a !important; min-width: 200px; border-radius: 18px; padding: 8px !important; }
        }

        @media (max-width: 480px) {
          .nav-gooey-container { gap: 0.3rem; padding: 0.3rem 0.5rem; }
          .nav-center-menu { transform: scale(0.8); }
          .nav-login-trigger { height: 32px; }
          .nav-login-trigger.is-logged { width: 32px; }
          .nav-login-trigger.is-guest { padding: 0 10px; }
          .nav-login-label { display: none; }
        }
      `}</style>
    </>
  )
}
