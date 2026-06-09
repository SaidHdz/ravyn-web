import { motion } from 'motion/react'

const ease = [0.22, 1, 0.36, 1] as const
const viewport = { once: true, amount: 0.3 }

export default function Arquitectura() {
  return (
    <section className="arq" aria-label="Arquitectura de marca">

      {/* Divisor central radish */}
      <span className="arq-divider" aria-hidden="true" />

      {/* Studio — pine */}
      <motion.a
        href="#studio"
        className="arq-col arq-col--studio"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.6, ease }}
      >
        <div className="arq-body">
          <span className="arq-label arq-label--radish">Studio</span>
          <h2 className="arq-title arq-title--cream">A la medida<br />de tu negocio.</h2>
          <p className="arq-desc arq-desc--cream">
            Desarrollamos sistemas web, apps de gestión y automatizaciones
            para clínicas y negocios de servicios. Sin equipo interno propio.
          </p>
          <span className="arq-cta arq-cta--cream">
            Ver qué construimos <span aria-hidden="true">→</span>
          </span>
        </div>
      </motion.a>

      {/* Labs — cream-2 */}
      <motion.a
        href="#labs"
        className="arq-col arq-col--labs"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.6, ease, delay: 0.1 }}
      >
        <div className="arq-body">
          <span className="arq-label arq-label--muted">Labs</span>
          <h2 className="arq-title arq-title--pine">Productos que<br />sembramos nosotros.</h2>
          <p className="arq-desc arq-desc--muted">
            Klino, Ravynset, Shield Sense. Proyectos propios construidos
            con el mismo método que aplicamos para clientes.
          </p>
          <span className="arq-cta arq-cta--pine">
            Ver productos <span aria-hidden="true">→</span>
          </span>
        </div>
      </motion.a>

      <style>{`
        .arq {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 1fr;
          width: 100%;
          overflow: hidden;
          border-top: 1px solid rgba(16, 52, 42, 0.08);
          border-bottom: 1px solid rgba(16, 52, 42, 0.08);
        }

        .arq-col {
          display: flex;
          align-items: center;
          min-height: clamp(420px, 56vh, 560px);
          padding: clamp(48px, 6vw, 96px) clamp(28px, 5vw, 88px);
          text-decoration: none;
          transition: filter 0.3s ease;
        }
        .arq-col:hover { filter: brightness(1.04); }
        .arq-col--studio { background: var(--color-pine); justify-content: flex-end; }
        .arq-col--labs   { background: var(--color-cream-2); justify-content: flex-start; }

        .arq-body {
          display: flex;
          flex-direction: column;
          max-width: 380px;
        }

        .arq-label {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 28px;
        }
        .arq-label--radish { color: var(--color-radish); }
        .arq-label--muted  { color: var(--text-muted); }

        .arq-title {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(30px, 3.6vw, 46px);
          line-height: 1.05;
          letter-spacing: -0.03em;
          margin-bottom: 20px;
        }
        .arq-title--cream { color: var(--color-cream); }
        .arq-title--pine  { color: var(--color-pine); }

        .arq-desc {
          font-family: var(--font-sans);
          font-size: 0.95rem;
          line-height: 1.65;
          margin-bottom: 28px;
        }
        .arq-desc--cream  { color: rgba(250, 246, 238, 0.72); }
        .arq-desc--muted  { color: var(--text-secondary); }

        .arq-cta {
          font-family: var(--font-sans);
          font-size: 0.85rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: gap 0.22s ease;
        }
        .arq-cta span { transition: transform 0.22s ease; }
        .arq-col:hover .arq-cta span { transform: translateX(4px); }
        .arq-cta--cream { color: var(--color-cream); }
        .arq-cta--pine  { color: var(--color-pine); }

        /* Divisor central radish */
        .arq-divider {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 1px;
          background: var(--color-radish);
          transform: translateX(-50%);
          z-index: 2;
          pointer-events: none;
        }

        @media (max-width: 760px) {
          .arq { grid-template-columns: 1fr; }
          .arq-divider { display: none; }
          .arq-col {
            min-height: auto;
            justify-content: flex-start !important;
            padding: clamp(48px, 12vw, 72px) var(--pad-x);
          }
          .arq-body { max-width: 460px; }
        }
      `}</style>
    </section>
  )
}
