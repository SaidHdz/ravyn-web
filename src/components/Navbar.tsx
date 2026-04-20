import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring, type Variants } from 'motion/react'
import { Theme } from '@/hooks/useTheme'

interface NavbarProps {
  theme: Theme
  onToggle: () => void
}

const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
  </svg>
)

const ease = [0.16, 1, 0.3, 1] as const

const fillVariants: Variants = {
  rest:  { clipPath: 'circle(0% at 50% 50%)',   transition: { duration: 0.5, ease } },
  hover: { clipPath: 'circle(150% at 50% 50%)', transition: { duration: 0.9, ease } },
}

export default function Navbar({ theme, onToggle }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
      <motion.div className="scroll-progress" style={{ scaleX }} />

      <div className="nav-logo">
        Ravyn Studio<span>.</span>
      </div>
      <div className="nav-links">
        {/* <button
          className="theme-toggle"
          onClick={onToggle}
          title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button> */}
        <motion.button
          className="btn-primary nav-cta"
          initial="rest"
          whileHover="hover"
          onClick={() => scrollTo('contacto')}
          style={{ padding: '8px 18px', fontSize: '0.82rem' }}
        >
          <motion.span className="hero-btn-fill" variants={fillVariants} />
          <span className="hero-btn-label">Hablemos</span>
        </motion.button>
      </div>
    </nav>
  )
}
