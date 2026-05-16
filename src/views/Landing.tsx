import { useEffect } from 'react'
import { useTheme } from '@/hooks/useTheme'
import Navbar from '@/components/Navbar'
import Hero from '@/components/sections/Hero'
import Servicios from '@/components/sections/Servicios'
import Proyectos from '@/components/sections/Proyectos'
import Ravynset from '@/components/sections/Ravynset'
import Proceso from '@/components/sections/Proceso'
import QuienesSomos from '@/components/sections/QuienesSomos'
import Contacto from '@/components/sections/Contacto'
import RotatingText from '@/components/animations/RotatingText'

export default function Landing() {
  const { theme, toggle } = useTheme()

  useEffect(() => {
    document.title = 'Ravyn Studio | Desarrollo de Software & Hardware'
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Navbar theme={theme} onToggle={toggle} />
      <main>
        <Hero />
        <div className="services-group">
          <Servicios />
          
          {/* Sección de Confianza: Diseño Original Restaurado y Centrado */}
          <section className="section section-trust-restored">
            <div className="container">
              <div className="trust-phrase-layout">
                <span className="trust-static-text">Deja en nuestras manos tu</span>
                <RotatingText
                  texts={['web', 'app', 'sistema', 'automatización']}
                  mainClassName="trust-pill"
                  staggerFrom={"last"}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-120%", opacity: 0 }}
                  staggerDuration={0.025}
                  splitLevelClassName="overflow-hidden"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={2500}
                />
              </div>
            </div>
          </section>
        </div>

        <Ravynset />
        <Proyectos />
        <Proceso />
        <QuienesSomos />
        <Contacto />
      </main>

      <style>{`
        .services-group {
          background: transparent;
        }

        .section-trust-restored {
          padding: 100px 0 160px; /* Espaciado generoso para impacto */
          margin-top: -60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .trust-phrase-layout {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center; /* Centrado original */
          gap: 0.3em 0.5em;
          text-align: center;
        }

        .trust-static-text {
          font-family: var(--font-sans);
          font-size: clamp(1.8rem, 5vw, 4rem); /* 30% más pequeño que 6rem */
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--text-secondary);
          line-height: 1;
        }

        .trust-pill {
          font-family: var(--font-sans);
          font-size: clamp(1.8rem, 5vw, 4rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          background: var(--accent);
          color: #000;
          padding: 0.1em 0.4em;
          border-radius: 0.15em;
          line-height: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: 0 10px 40px -10px var(--accent-glow);
        }

        @media (max-width: 768px) {
          .section-trust-restored {
            padding: 60px 0 100px;
            margin-top: -20px;
          }
          .trust-phrase-layout {
            flex-direction: column;
            gap: 0.4em;
          }
        }
      `}</style>
      
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
