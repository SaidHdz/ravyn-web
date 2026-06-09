import { useState, useEffect } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react'
import { Link, useLocation } from 'react-router-dom'
import { LogOut, Settings, LogIn, Menu, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import AuthModal from './AuthModal'
import AccountModal from './AccountModal'

const navLinks = [
  { label: 'Studio', anchor: 'studio' },
  { label: 'Labs',   anchor: 'labs'   },
]

export default function Navbar() {
  const { scrollYProgress } = useScroll()
  const location = useLocation()
  const { user, signOut } = useAuth()

  const [scrolled,          setScrolled]          = useState(false)
  const [visible,           setVisible]           = useState(true)
  const [lastScrollY,       setLastScrollY]       = useState(0)
  const [mobileOpen,        setMobileOpen]        = useState(false)
  const [isAuthModalOpen,   setIsAuthModalOpen]   = useState(false)
  const [isAccountOpen,     setIsAccountOpen]     = useState(false)
  const [isUserMenuOpen,    setIsUserMenuOpen]    = useState(false)

  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, restDelta: 0.001 })

  const isSubapp = location.pathname === '/ravynset' || location.pathname === '/klino'

  const resolveHref = (anchor: string) =>
    isSubapp ? `/#${anchor}` : `#${anchor}`

  // Scroll hide/show + scrolled state
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 16)

      const isMobile = window.innerWidth <= 768
      if (!isMobile) { setVisible(true); setLastScrollY(y); return }

      if (y < 10) {
        setVisible(true)
      } else if (y > lastScrollY && y > 70) {
        setVisible(false)
        setIsUserMenuOpen(false)
        setMobileOpen(false)
      } else {
        setVisible(true)
      }
      setLastScrollY(y)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lastScrollY])

  // Close user menu on outside click
  useEffect(() => {
    if (!isUserMenuOpen) return
    const close = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (!t.closest('.nb-user-anchor')) setIsUserMenuOpen(false)
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [isUserMenuOpen])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Close everything on route change
  useEffect(() => {
    setMobileOpen(false)
    setIsUserMenuOpen(false)
  }, [location.pathname])

  const handleAuthClick = () => {
    if (user) setIsUserMenuOpen(v => !v)
    else setIsAuthModalOpen(true)
  }

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX, transformOrigin: '0% 50%' }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-radish z-[600]"
      />

      {/* Nav bar */}
      <motion.nav
        animate={{ y: visible ? 0 : '-100%' }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={`nb-nav fixed top-0 left-0 right-0 z-[500] h-[72px] transition-[background,border-color,backdrop-filter] duration-300 ${
          scrolled
            ? 'bg-[rgba(250,246,238,0.92)] backdrop-blur-[14px] border-b border-[rgba(16,52,42,0.08)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="w-full max-w-[1200px] mx-auto h-full px-[var(--pad-x)] flex items-center justify-between">
        {/* Left: Logo + nav links grouped */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="nb-logo flex-shrink-0"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }}
          >
            <img
              src="/brand/logo-light.png"
              alt="Ravyn"
              className="h-[34px] w-auto block"
            />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(({ label, anchor }) => (
              <a
                key={anchor}
                href={resolveHref(anchor)}
                className="nb-link text-[0.95rem] font-medium text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors duration-150"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Right side: CTA + auth */}
        <div className="flex items-center gap-3">
          {/* CTA — hidden on smallest screens */}
          <a
            href={resolveHref('contacto')}
            className="btn-primary nb-sm-up"
          >
            Siembra tu proyecto →
          </a>

          {/* Auth button */}
          <div className="nb-user-anchor relative">
            {user ? (
              <button
                type="button"
                onClick={handleAuthClick}
                title={user.email}
                aria-label="Cuenta"
                className="w-[36px] h-[36px] rounded-full bg-[var(--color-pine)] text-[var(--color-cream)] text-[0.8rem] font-bold flex items-center justify-center transition-transform duration-150 hover:scale-105"
              >
                {(user.email?.[0] ?? '?').toUpperCase()}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAuthClick}
                aria-label="Iniciar sesión"
                className="btn-secondary nb-sm-up items-center gap-[6px]"
              >
                <LogIn className="w-[14px] h-[14px]" strokeWidth={2.25} />
                Entrar
              </button>
            )}

            {/* User dropdown */}
            <AnimatePresence>
              {isUserMenuOpen && user && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute top-[calc(100%+10px)] right-0 bg-[var(--color-pine)] border border-[rgba(250,246,238,0.12)] rounded-[18px] p-2 min-w-[220px] flex flex-col gap-1 shadow-[0_20px_50px_rgba(16,52,42,0.35)] z-[10000]"
                >
                  <div className="px-3 pt-1 pb-3">
                    <span className="block text-[0.8rem] text-[var(--color-muted)] whitespace-nowrap">{user.email}</span>
                  </div>
                  <div className="h-px bg-[rgba(250,246,238,0.10)] mx-1 mb-1" />
                  <button
                    type="button"
                    onClick={() => { setIsAccountOpen(true); setIsUserMenuOpen(false) }}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-[0.88rem] font-medium text-[var(--color-cream)] hover:bg-[rgba(250,246,238,0.06)] hover:text-[var(--color-radish)] transition-colors duration-150 text-left"
                  >
                    <Settings className="w-4 h-4 flex-shrink-0" />
                    Mi Cuenta
                  </button>
                  <button
                    type="button"
                    onClick={() => { signOut(); setIsUserMenuOpen(false) }}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-[0.88rem] font-medium text-[var(--color-cream)] hover:bg-[rgba(224,67,107,0.12)] hover:text-[var(--color-radish)] transition-colors duration-150 text-left"
                  >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    Cerrar Sesión
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="md:hidden w-[36px] h-[36px] flex items-center justify-center text-[var(--text)] rounded-[var(--radius-md)] transition-colors duration-150 hover:bg-[var(--bg-hover)]"
          >
            {mobileOpen
              ? <X className="w-5 h-5" strokeWidth={2} />
              : <Menu className="w-5 h-5" strokeWidth={2} />
            }
          </button>
        </div>
        </div>
      </motion.nav>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[450] bg-[var(--color-cream)] flex flex-col pt-[88px] px-[var(--pad-x)] pb-10"
          >
            <nav className="flex flex-col gap-1 flex-1">
              {navLinks.map(({ label, anchor }, i) => (
                <motion.a
                  key={anchor}
                  href={resolveHref(anchor)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 + 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setMobileOpen(false)}
                  className="block font-display font-semibold text-[2.4rem] leading-[1.1] tracking-[-0.03em] text-[var(--text)] py-3 border-b border-[var(--border)]"
                >
                  {label}
                </motion.a>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-3"
            >
              <a
                href={resolveHref('contacto')}
                onClick={() => setMobileOpen(false)}
                className="btn-primary justify-center text-center text-[0.95rem] py-[14px]"
              >
                Siembra tu proyecto →
              </a>
              {!user && (
                <button
                  type="button"
                  onClick={() => { setMobileOpen(false); setIsAuthModalOpen(true) }}
                  className="btn-secondary justify-center text-[0.95rem] py-[14px]"
                >
                  Entrar
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal    isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <AccountModal isOpen={isAccountOpen}   onClose={() => setIsAccountOpen(false)}   />
    </>
  )
}
