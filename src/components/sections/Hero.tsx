import { motion } from 'motion/react'
import RotatingText from '@/components/animations/RotatingText'
import { useLanguage } from '@/context/LanguageContext'

const ease = [0.22, 1, 0.36, 1] as const

export default function Hero() {
  const { t, language } = useLanguage()

  return (
    <section className="hero2">
      {/* Símbolo rábano-R monumental — textura de fondo */}
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
            <span className="hero2-title-line whitespace-nowrap">{t.hero.titleLine1}</span>
            <span className="hero2-title-line whitespace-nowrap pb-[0.05em]" style={{ minHeight: '1.2em' }}>
              <RotatingText
                key={language}
                texts={t.hero.rotatingTexts}
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
            <span className="hero2-title-line whitespace-nowrap">{t.hero.titleLine3}</span>
          </motion.h1>

          <motion.p
            className="hero2-subtitle"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.18 }}
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            className="hero2-actions"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease, delay: 0.28 }}
          >
            <a href="#contacto" className="btn-primary">
              {t.hero.ctaPrimary}
            </a>
            <a href="#labs" className="btn-secondary">
              {t.hero.ctaSecondary}
            </a>
          </motion.div>

        </div>
      </div>

      <a href="#nosotros" className="hero2-scroll" aria-label={t.hero.scroll}>
        <span>{t.hero.scroll}</span>
        <span className="hero2-scroll-arrow" aria-hidden="true">↓</span>
      </a>

      <style>{`
        .hero2 {
          position: relative;
          min-height: calc(100svh - 64px);
          min-height: calc(100dvh - 64px);
          display: flex;
          align-items: center;
          overflow: hidden;
          padding-bottom: 50px;
        }

        .hero2-container { width: 100%; position: relative; z-index: 2; }

        /* Símbolo monumental — textura sutil y desplazada más hacia la izquierda en su mitad */
        .hero2-symbol {
          position: absolute;
          top: 50%;
          right: clamp(60px, 14vw, 220px);
          transform: translateY(-50%);
          width: clamp(340px, 36vw, 500px);
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

        /* Scroll hint — siempre visible en la pantalla inicial */
        .hero2-scroll {
          position: absolute;
          bottom: 14px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          font-family: var(--font-mono);
          font-size: 0.74rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-pine);
          text-decoration: none;
          opacity: 0.85;
          z-index: 10;
          transition: opacity 0.2s, color 0.2s;
          animation: hero2-bounce 2.2s ease-in-out infinite;
        }
        .hero2-scroll:hover { opacity: 1; color: var(--color-radish); }
        .hero2-scroll-arrow { font-size: 1rem; line-height: 1; color: var(--color-radish); }
        @keyframes hero2-bounce {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, 5px); }
        }

        @media (max-width: 900px) {
          .hero2 {
            min-height: calc(100svh - 64px);
            min-height: calc(100dvh - 64px);
            padding-top: 40px;
            padding-bottom: 60px;
          }
          .hero2-symbol {
            right: 6%;
            opacity: 0.045;
            width: clamp(280px, 50vw, 420px);
          }
          .hero2-subtitle { max-width: none; }
        }

        @media (max-width: 600px) {
          .hero2 {
            min-height: calc(100svh - 64px);
            min-height: calc(100dvh - 64px);
            padding-top: 30px;
            padding-bottom: 56px;
          }
          .hero2-symbol {
            right: 5%;
            opacity: 0.04;
            width: clamp(220px, 60vw, 300px);
          }
          .hero2-scroll { bottom: 10px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero2-scroll { animation: none; }
        }
      `}</style>
    </section>
  )
}
