import { useEffect } from 'react'
import { useTheme } from '@/hooks/useTheme'
import Navbar from '@/components/Navbar'
import RavynsetHero from '@/components/sections/RavynsetHero'
import RavynsetProblema from '@/components/sections/RavynsetProblema'
import RavynsetIncluye from '@/components/sections/RavynsetIncluye'
import RavynsetPlanes from '@/components/sections/RavynsetPlanes'
import RavynsetProceso from '@/components/sections/RavynsetProceso'
import RavynsetFAQ from '@/components/sections/RavynsetFAQ'

export default function RavynsetPage() {
  const { theme, toggle } = useTheme()

  useEffect(() => {
    document.title = 'RavynSet | Sistema de Gestión para Clínicas'
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Navbar theme={theme} onToggle={toggle} />
      <main style={{ overflowX: 'hidden' }}>
        <RavynsetHero />
        <RavynsetProblema />
        <RavynsetIncluye />
        <RavynsetPlanes />
        <RavynsetProceso />
        <RavynsetFAQ />
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
