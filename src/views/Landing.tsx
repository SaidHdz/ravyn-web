import { useEffect } from 'react'
import { useTheme } from '@/hooks/useTheme'
import Navbar from '@/components/Navbar'
import Hero from '@/components/sections/Hero'
import Servicios from '@/components/sections/Servicios'
import Proceso from '@/components/sections/Proceso'
import QuienesSomos from '@/components/sections/QuienesSomos'
import Contacto from '@/components/sections/Contacto'

export default function Landing() {
  const { theme, toggle } = useTheme()

  useEffect(() => {
    document.title = 'Ravyn Studio'
  }, [])

  return (
    <>
      <Navbar theme={theme} onToggle={toggle} />
      <Hero />
      <Servicios />
      <Proceso />
      <QuienesSomos />
      <Contacto />
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <span className="footer-logo">Ravyn Studio<span>.</span></span>
            <span className="footer-copy">© {new Date().getFullYear()} Todos los derechos reservados</span>
          </div>
        </div>
      </footer>
    </>
  )
}
