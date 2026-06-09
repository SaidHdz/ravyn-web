import { motion } from 'motion/react'

const ease = [0.22, 1, 0.36, 1] as const

const viewport = { once: true, amount: 0.4 }

export default function Manifiesto() {
  return (
    <section id="nosotros" className="manifiesto">
      <div className="container manifiesto-inner">



        <motion.p
          className="manifiesto-lead"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, ease, delay: 0.08 }}
        >
          Ravyn nació como un semillero: un lugar donde una idea se siembra,
          se cuida, y se cosecha como producto real.
          <br className="manifiesto-br" />
          <span className="manifiesto-lead-accent"> Algunas semillas las traen los clientes. Otras las plantamos nosotros.</span>
          {' '}Mismo método. Mismas manos.
        </motion.p>

        <motion.p
          className="manifiesto-foot"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.55, ease, delay: 0.18 }}
        >
          Operamos desde México. Construimos software que ya está corriendo —
          no presentaciones que envejecen.
        </motion.p>

      </div>

      <style>{`
        .manifiesto {
          padding: clamp(80px, 14vh, 140px) 0;
          background: var(--color-cream);
          position: relative;
        }

        .manifiesto-inner {
          max-width: 720px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .manifiesto-lead {
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 400;
          font-size: clamp(24px, 3.4vw, 36px);
          line-height: 1.4;
          letter-spacing: -0.015em;
          color: var(--color-pine);
        }

        .manifiesto-lead-accent {
          color: var(--color-radish);
        }

        .manifiesto-br { display: block; content: ''; margin-top: 0.5em; }

        .manifiesto-foot {
          font-family: var(--font-sans);
          font-size: clamp(15px, 1.4vw, 17px);
          font-weight: 400;
          line-height: 1.7;
          color: var(--text-secondary);
          max-width: 480px;
          margin-top: 48px;
          padding-top: 44px;
          border-top: 1px solid rgba(16, 52, 42, 0.15);
        }

        @media (max-width: 600px) {
          .manifiesto-br { margin-top: 0.4em; }
          .manifiesto-foot { margin-top: 36px; padding-top: 32px; }
        }
      `}</style>
    </section>
  )
}
