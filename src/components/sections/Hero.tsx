import { motion } from 'motion/react'
import RotatingText from '@/components/animations/RotatingText'

const ease = [0.22, 1, 0.36, 1] as const

export default function Hero() {
  return (
    <section className="hero2">
      {/* Símbolo rábano-R monumental — textura de fondo, recortado a la derecha */}
      <img
        src="/brand/symbol-pine.png"
        alt=""
        aria-hidden="true"
        className="hero2-symbol"
      />

      <div className="container hero2-container">
        <div className="hero2-content">



          <motion.h1
            className="hero2-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease, delay: 0.08 }}
          >
            <span className="hero2-title-line whitespace-nowrap">Siembra tu</span>
            <span className="hero2-title-line whitespace-nowrap pb-[0.05em]" style={{ minHeight: '1.2em' }}>
              <RotatingText
                texts={['web', 'app', 'sistema', 'idea']}
                mainClassName="hero2-rot-pill"
                staggerFrom="last"
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-120%', opacity: 0 }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden"
                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                rotationInterval={2600}
              />
            </span>
            <span className="hero2-title-line whitespace-nowrap">con nosotros.</span>
          </motion.h1>

          <motion.p
            className="hero2-subtitle"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.18 }}
          >
            Construimos lo que tu negocio necesita — listo para usar
            desde el día uno.
          </motion.p>

          <motion.div
            className="hero2-actions"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease, delay: 0.28 }}
          >
            <a href="#contacto" className="btn-primary">
              Comienza aquí →
            </a>
            <a href="#labs" className="btn-secondary">
              Ver Labs
            </a>
          </motion.div>

        </div>
      </div>

      <a href="#nosotros" className="hero2-scroll" aria-label="Desliza para ver más">
        <span>Desliza</span>
        <span className="hero2-scroll-arrow" aria-hidden="true">↓</span>
      </a>

      <style>{`
        .hero2 {
          position: relative;
          min-height: 100svh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .hero2-container { width: 100%; position: relative; z-index: 2; }

        /* Símbolo monumental — textura, recortado por el borde derecho */
        .hero2-symbol {
          position: absolute;
          top: 50%;
          right: -8%;
          transform: translateY(-50%);
          width: clamp(360px, 42vw, 560px);
          height: auto;
          opacity: 0.06;
          pointer-events: none;
          z-index: 1;
          user-select: none;
        }

        .hero2-content {
          display: flex;
          flex-direction: column;
          gap: 28px;
          max-width: 760px;
        }

        .hero2-title {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(48px, 8vw, 104px);
          line-height: 1.02;
          letter-spacing: -0.035em;
          color: var(--color-pine);
          display: flex;
          flex-direction: column;
          gap: 0.08em;
        }

        .hero2-title-line {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.28em;
        }

        /* El pill rotativo — momento de marca */
        .hero2-rot-pill {
          display: inline-flex;
          align-items: center;
          background: var(--color-radish);
          color: var(--color-cream);
          padding: 0.04em 0.34em 0.12em;
          border-radius: 0.18em;
          line-height: 1;
          overflow: hidden;
          vertical-align: baseline;
        }

        .hero2-subtitle {
          font-family: var(--font-sans);
          font-size: clamp(15px, 1.3vw, 18px);
          color: var(--text-secondary);
          max-width: 440px;
          line-height: 1.7;
          font-weight: 400;
        }

        .hero2-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          padding-top: 6px;
        }

        /* Scroll hint */
        .hero2-scroll {
          position: absolute;
          bottom: 26px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 0.66rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--text-muted);
          text-decoration: none;
          opacity: 0.65;
          z-index: 3;
          transition: opacity 0.2s, color 0.2s;
          animation: hero2-bounce 2.4s ease-in-out infinite;
        }
        .hero2-scroll:hover { opacity: 1; color: var(--color-pine); }
        .hero2-scroll-arrow { font-size: 0.9rem; line-height: 1; }
        @keyframes hero2-bounce {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, 6px); }
        }

        @media (max-width: 900px) {
          .hero2 { min-height: auto; padding-top: 140px; padding-bottom: 80px; }
          .hero2-symbol {
            right: -22%;
            opacity: 0.045;
            width: clamp(320px, 70vw, 460px);
          }
          .hero2-subtitle { max-width: none; }
        }

        @media (max-width: 600px) {
          .hero2 { padding-top: 120px; padding-bottom: 64px; }
          .hero2-scroll { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero2-scroll { animation: none; }
        }
      `}</style>
    </section>
  )
}
