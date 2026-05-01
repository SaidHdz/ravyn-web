import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring, type Variants } from 'motion/react'

interface NavbarProps {
  theme?: string
  onToggle?: () => void
}

const ease = [0.16, 1, 0.3, 1] as const

const fillVariants: Variants = {
  rest:  { clipPath: 'circle(0% at 50% 50%)',   transition: { duration: 0.5, ease } },
  hover: { clipPath: 'circle(150% at 50% 50%)', transition: { duration: 0.9, ease } },
}

export default function Navbar({ }: NavbarProps) {
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

      <div className="nav-logo" onClick={() => scrollTo('root')} style={{ cursor: 'pointer' }}>
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
