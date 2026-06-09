import { motion } from 'motion/react'

const ease = [0.22, 1, 0.36, 1] as const
const viewport = { once: true, amount: 0.4 }

const pasos = [
  { num: '01', title: 'Confirmas', desc: 'Eliges tu plan y nos contactas. Te respondemos el mismo día para iniciar.' },
  { num: '02', title: 'Kickoff', desc: 'Una llamada corta de 30 minutos. Nos compartes tu logo, colores y lista de servicios.' },
  { num: '03', title: 'Construimos', desc: 'En 2 a 4 semanas tu CRM y automatizaciones quedan listas y probadas. Tú solo esperas.' },
  { num: '04', title: 'Go live', desc: 'Lanzamos juntos. Y no desaparecemos, cuentas con nuestro soporte continuo.' },
]

export default function RavynsetProceso() {
  return (
    <section id="proceso" className="rproc">
      <div className="container rproc-inner">
        <motion.span
          className="rproc-label"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.4, ease }}
        >
          Cómo empezamos
        </motion.span>
        <motion.h2
          className="rproc-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, ease, delay: 0.06 }}
        >
          Del primer mensaje<br />al sistema en vivo.
        </motion.h2>

        <div className="rproc-timeline">
          <motion.span
            className="rproc-stem"
            aria-hidden="true"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0, 0, 0.2, 1], delay: 0.1 }}
          />
          {pasos.map((p, i) => (
            <motion.div
              key={p.num}
              className="rproc-node"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease, delay: 0.35 + i * 0.12 }}
            >
              <div className="rproc-rail">
                <span className="rproc-marker" />
                <span className="rproc-num">{p.num}</span>
              </div>
              <div className="rproc-content">
                <h3 className="rproc-name">{p.title}</h3>
                <p className="rproc-desc">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .rproc { padding: clamp(80px, 12vh, 130px) 0; background: var(--color-cream); }
        .rproc-inner { max-width: 680px; }
        .rproc-label {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 24px;
        }
        .rproc-heading {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(32px, 4.2vw, 52px);
          line-height: 1.04;
          letter-spacing: -0.03em;
          color: var(--color-pine);
          margin-bottom: 64px;
        }
        .rproc-timeline { position: relative; padding-left: 60px; }
        .rproc-stem {
          position: absolute;
          left: 75px;
          top: 10px;
          bottom: 10px;
          width: 2px;
          background: var(--color-pine);
          transform-origin: top center;
          z-index: 1;
        }
        .rproc-node {
          position: relative;
          display: grid;
          grid-template-columns: 32px 1fr;
          gap: 28px;
          padding-bottom: 48px;
        }
        .rproc-node:last-child { padding-bottom: 0; }
        .rproc-rail {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
        }
        .rproc-marker {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--color-cream);
          border: 2px solid var(--color-pine);
          margin-top: 4px;
        }
        .rproc-num {
          position: absolute;
          right: 100%;
          margin-right: 16px;
          top: 0;
          font-family: var(--font-mono);
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--color-radish);
          line-height: 1;
        }
        .rproc-content { padding-top: 1px; max-width: 480px; }
        .rproc-name {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(22px, 2.6vw, 28px);
          letter-spacing: -0.02em;
          color: var(--color-pine);
          line-height: 1.1;
          margin-bottom: 8px;
        }
        .rproc-desc {
          font-family: var(--font-sans);
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.65;
        }
        @media (max-width: 600px) {
          .rproc-timeline { padding-left: 48px; }
          .rproc-stem { left: 63px; }
          .rproc-heading { margin-bottom: 48px; }
          .rproc-node { gap: 20px; padding-bottom: 40px; }
        }
      `}</style>
    </section>
  )
}
