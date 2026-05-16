import { motion } from 'motion/react'
import ShinyText from '../animations/ShinyText'
import BlurText from '../animations/BlurText'

const ease = [0.16, 1, 0.3, 1] as const

export default function RavynsetHero() {
  return (
    <section className="ravynset-hero">
      <div className="hero-dots" />
      <div className="container">
        <div className="ravynset-hero-content">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-12"
          >
            <ShinyText 
              text="RavynSet · Sistema de gestión para clínicas" 
              disabled={false} 
              speed={3} 
              className="ravynset-hero-tag" 
            />
          </motion.div>

          <BlurText
            text="Tu clínica pierde citas todos los días. Nosotros las recuperamos."
            className="ravynset-hero-title"
            delay={50}
            animateBy="words"
            direction="top"
          />

          <BlurText
            text="RavynSet automatiza tu agenda, tus recordatorios y tu reputación en Google — para que tú solo te preocupes por atender a tus pacientes."
            className="ravynset-hero-subtitle"
            delay={30}
            animateBy="words"
            direction="top"
          />

          <motion.div 
            className="ravynset-hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.3 }}
          >
            <button className="btn-primary py-4 px-8 text-base" onClick={() => document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth' })}>
              Ver planes →
            </button>
            <button className="btn-secondary py-4 px-8 text-base" onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}>
              Hablar con nosotros
            </button>
          </motion.div>
        </div>
      </div>

      <style>{`
        .ravynset-hero {
          position: relative;
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 80px;
          background-color: var(--bg);
          overflow: hidden;
        }

        .hero-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, var(--dot-color) 1px, transparent 1px);
          background-size: 40px 40px;
          -webkit-mask-image: radial-gradient(circle at center, black, transparent 80%);
          mask-image: radial-gradient(circle at center, black, transparent 80%);
          opacity: 0.3;
        }

        .ravynset-hero-content {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }

        .ravynset-hero-tag {
          font-family: var(--font-sans); /* Cambiado de var(--font-mono) a var(--font-sans) */
          font-size: 1.1rem; /* Ajustado para coincidir con escala de subtítulos */
          font-weight: 500;
          letter-spacing: -0.01em;
          padding: 8px 0;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          display: inline-block;
        }

        .ravynset-hero-title {
          font-size: clamp(2.2rem, 8vw, 5.5rem);
          line-height: 1.05;
          font-weight: 800;
          letter-spacing: -0.04em;
          margin-bottom: 2rem;
          color: var(--text);
          display: flex;
          justify-content: center;
          text-align: center;
        }

        .ravynset-hero-subtitle {
          font-size: clamp(1rem, 2vw, 1.35rem);
          color: var(--text-secondary);
          margin-bottom: 3.5rem;
          line-height: 1.6;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          display: flex;
          justify-content: center;
          text-align: center;
        }

        .ravynset-hero-actions {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .ravynset-hero {
            padding-top: 160px !important;
            padding-bottom: 60px;
            min-height: auto;
          }
          .ravynset-hero-actions {
            flex-direction: column;
            width: 100%;
            padding: 0 20px;
          }
          .ravynset-hero-actions button {
            width: 100%;
          }
          .ravynset-hero-tag {
            font-size: 0.95rem;
          }
        }
        
        @media (max-width: 480px) {
           .ravynset-hero-title {
             font-size: 2rem;
           }
        }
      `}</style>
    </section>
  )
}
