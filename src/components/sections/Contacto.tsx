import { useState } from 'react'
import { motion } from 'motion/react'
import ContactModal from '../ContactModal'

const ease = [0.22, 1, 0.36, 1] as const
const viewport = { once: true, amount: 0.4 }

export default function Contacto() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <section id="contacto" className="cierre">
      {/* Símbolo rábano-R monumental — espejo del Hero, recortado por el borde inferior */}
      <img
        src="/brand/symbol-cream.png"
        alt=""
        aria-hidden="true"
        className="cierre-symbol"
      />

      <div className="container cierre-inner">
        <motion.h2
          className="cierre-heading"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.65, ease }}
        >
          ¿Qué quieres<br />construir?
        </motion.h2>

        <motion.p
          className="cierre-sub"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
        >
          Cuéntanos. Si no sabes por dónde empezar, también.
          Para eso estamos.
        </motion.p>

        <motion.div
          className="cierre-actions"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.55, ease, delay: 0.2 }}
        >
          <button type="button" className="cierre-btn-primary" onClick={() => setModalOpen(true)}>
            Siembra tu proyecto →
          </button>
        </motion.div>
      </div>

      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      <style>{`
        .cierre {
          position: relative;
          padding: clamp(80px, 14vh, 130px) 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-pine);
          overflow: hidden;
          text-align: center;
        }

        /* Símbolo monumental — espejo del Hero, recortado por abajo */
        .cierre-symbol {
          position: absolute;
          bottom: -14%;
          left: 50%;
          transform: translateX(-50%);
          width: clamp(420px, 60vw, 680px);
          height: auto;
          opacity: 0.04;
          pointer-events: none;
          user-select: none;
          z-index: 1;
        }

        .cierre-inner {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .cierre-heading {
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 600;
          font-size: clamp(44px, 8vw, 84px);
          line-height: 1.0;
          letter-spacing: -0.03em;
          color: var(--color-cream);
          max-width: 11ch;
        }

        .cierre-sub {
          font-family: var(--font-sans);
          font-size: clamp(15px, 1.5vw, 18px);
          color: rgba(250, 246, 238, 0.62);
          line-height: 1.65;
          max-width: 420px;
          margin-top: 28px;
        }

        .cierre-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
          margin-top: 44px;
        }

        .cierre-btn-primary {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-sans);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-cream);
          background: var(--color-radish);
          padding: 14px 30px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--color-radish);
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
          white-space: nowrap;
        }
        .cierre-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }

        .cierre-btn-secondary {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-sans);
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--color-cream);
          background: transparent;
          padding: 14px 28px;
          border-radius: var(--radius-pill);
          border: 1px solid rgba(250, 246, 238, 0.30);
          text-decoration: none;
          transition: border-color 0.2s, background 0.2s, transform 0.2s;
          white-space: nowrap;
        }
        .cierre-btn-secondary:hover {
          border-color: var(--color-cream);
          background: rgba(250, 246, 238, 0.06);
          transform: translateY(-1px);
        }

        @media (max-width: 600px) {
          .cierre-sub { max-width: none; }
          .cierre-actions { flex-direction: column; width: 100%; }
          .cierre-btn-primary, .cierre-btn-secondary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  )
}
