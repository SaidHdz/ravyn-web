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
          
          {/* Sección de Confianza: Compactada y vinculada a Servicios */}
          <section className="section section-trust-integrated">
            <div className="container">
              <div className="trust-phrase-original">
                <span className="trust-phrase-text">Deja en nuestras manos tu</span>
                <RotatingText
                  texts={['web', 'app', 'sistema', 'automatización']}
                  mainClassName="trust-rotating-pill"
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

        .section-trust-integrated {
          padding-top: 0 !important;
          padding-bottom: 80px !important;
          margin-top: -100px; /* Reducción drástica del espacio muerto */
          position: relative;
          z-index: 2;
        }

        .trust-phrase-original {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 0.25em 0.4em;
          text-align: center;
          max-width: 1400px;
          margin: 0 auto;
        }

        .trust-phrase-text {
          font-size: clamp(1.8rem, 4vw, 4.2rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--text-secondary);
          line-height: 1.1;
        }

        .trust-rotating-pill {
          font-size: clamp(1.8rem, 4vw, 4.2rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          background: var(--accent);
          color: #000;
          padding: 0.1em 0.35em;
          border-radius: 0.15em;
          line-height: 1.1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: 0 10px 40px -10px var(--accent-glow);
        }

        @media (max-width: 1024px) {
           .section-trust-integrated {
             margin-top: -60px;
           }
        }

        @media (max-width: 768px) {
          .section-trust-integrated {
            padding-bottom: 60px !important;
            margin-top: -40px;
          }
          .trust-phrase-original {
            flex-direction: column;
            gap: 0.3em;
          }
          .trust-phrase-text {
             font-size: clamp(1.6rem, 8vw, 2.5rem);
          }
          .trust-rotating-pill {
             font-size: clamp(1.6rem, 8vw, 2.5rem);
             padding: 0.1em 0.3em;
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
