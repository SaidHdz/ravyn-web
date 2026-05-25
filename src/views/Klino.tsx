import { useEffect } from 'react'
import { useTheme } from '@/hooks/useTheme'
import Navbar from '@/components/Navbar'
import KlinoHero from '@/components/sections/KlinoHero'
import KlinoProblema from '@/components/sections/KlinoProblema'
import KlinoIncluye from '@/components/sections/KlinoIncluye'
import KlinoPlanes from '@/components/sections/KlinoPlanes'
import KlinoProceso from '@/components/sections/KlinoProceso'
import KlinoFAQ from '@/components/sections/KlinoFAQ'

export default function KlinoPage() {
  const { theme, toggle } = useTheme()

  useEffect(() => {
    document.title = 'Klino | Ravyn Studio'
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Navbar theme={theme} onToggle={toggle} />
      <main style={{ overflowX: 'hidden' }}>
        <KlinoHero />
        <KlinoProblema />
        <KlinoIncluye />
        <KlinoPlanes />
        <KlinoProceso />
        <KlinoFAQ />
      </main>
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
