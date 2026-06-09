import { motion } from 'motion/react'

const ease = [0.22, 1, 0.36, 1] as const
const viewport = { once: true, amount: 0.4 }

const pasos = [
  { num: '01', title: 'Hablas', desc: 'Inicias la consulta como siempre. Klino escucha en segundo plano, sin interrumpir.' },
  { num: '02', title: 'Genera', desc: 'Al terminar, Klino arma la nota clínica estructurada: antecedentes, exploración y diagnóstico.' },
  { num: '03', title: 'Revisas', desc: 'Lees, ajustas lo que haga falta y firmas. La última palabra siempre es tuya.' },
  { num: '04', title: 'Guarda', desc: 'La nota queda en el expediente del paciente, conforme a NOM-004 y NOM-024.' },
]

export default function KlinoProceso() {
  return (
    <section id="proceso" className="kproc">
      <div className="container kproc-inner">
        <motion.span
          className="kproc-label"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.4, ease }}
        >
          Cómo funciona
        </motion.span>
        <motion.h2
          className="kproc-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, ease, delay: 0.06 }}
        >
          De la consulta<br />a la nota firmada.
        </motion.h2>

        <div className="kproc-timeline">
          <motion.span
            className="kproc-stem"
            aria-hidden="true"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0, 0, 0.2, 1], delay: 0.1 }}
          />
          {pasos.map((p, i) => (
            <motion.div
              key={p.num}
              className="kproc-node"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease, delay: 0.35 + i * 0.12 }}
            >
              <div className="kproc-rail">
                <span className="kproc-marker" />
                <span className="kproc-num">{p.num}</span>
              </div>
              <div className="kproc-content">
                <h3 className="kproc-name">{p.title}</h3>
                <p className="kproc-desc">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .kproc { padding: clamp(80px, 12vh, 130px) 0; background: var(--color-cream); }
        .kproc-inner { max-width: 680px; }
        .kproc-label {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 24px;
        }
        .kproc-heading {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(32px, 4.2vw, 52px);
          line-height: 1.04;
          letter-spacing: -0.03em;
          color: var(--color-pine);
          margin-bottom: 64px;
        }
        .kproc-timeline { position: relative; padding-left: 60px; }
        .kproc-stem {
          position: absolute;
          left: 75px;
          top: 10px;
          bottom: 10px;
          width: 2px;
          background: var(--color-pine);
          transform-origin: top center;
          z-index: 1;
        }
        .kproc-node {
          position: relative;
          display: grid;
          grid-template-columns: 32px 1fr;
          gap: 28px;
          padding-bottom: 48px;
        }
        .kproc-node:last-child { padding-bottom: 0; }
        .kproc-rail {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
        }
        .kproc-marker {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--color-cream);
          border: 2px solid var(--color-pine);
          margin-top: 4px;
        }
        .kproc-num {
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
        .kproc-content { padding-top: 1px; max-width: 480px; }
        .kproc-name {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(22px, 2.6vw, 28px);
          letter-spacing: -0.02em;
          color: var(--color-pine);
          line-height: 1.1;
          margin-bottom: 8px;
        }
        .kproc-desc {
          font-family: var(--font-sans);
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.65;
        }
        @media (max-width: 600px) {
          .kproc-timeline { padding-left: 48px; }
          .kproc-stem { left: 63px; }
          .kproc-heading { margin-bottom: 48px; }
          .kproc-node { gap: 20px; padding-bottom: 40px; }
        }
      `}</style>
    </section>
  )
}
