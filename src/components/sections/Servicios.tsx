import { motion } from 'motion/react'

const ease = [0.22, 1, 0.36, 1] as const
const viewport = { once: true, amount: 0.3 }

const servicios = [
  {
    num: '01',
    title: 'Sitios y sistemas web',
    desc: 'Para negocios que necesitan crecer online y que los encuentren.',
  },
  {
    num: '02',
    title: 'Apps de gestión interna',
    desc: 'Reemplaza cuadernos, Excel y WhatsApp con algo que corre solo.',
  },
  {
    num: '03',
    title: 'Automatización e IoT',
    desc: 'Procesos que corren sin que nadie los empuje. Hardware y software.',
  },
]

export default function Servicios() {
  return (
    <section id="studio" className="studio2">
      <div className="container studio2-grid">

        {/* Izquierda — ancla + CTA */}
        <div className="studio2-left">


          <motion.h2
            className="studio2-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.6, ease, delay: 0.06 }}
          >
            Software propio<br />sin equipo<br />propio.
          </motion.h2>

          <motion.p
            className="studio2-intro"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.55, ease, delay: 0.14 }}
          >
            Trabajamos directo con quien nos contrata. Si ya sabes qué construir,
            perfecto. Si solo sabes qué problema tienes, también.
          </motion.p>

          <motion.a
            href="https://wa.me/528361168007"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary studio2-cta"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.5, ease, delay: 0.22 }}
          >
            Cotiza tu proyecto →
          </motion.a>
        </div>

        {/* Derecha — lista editorial */}
        <div className="studio2-list">
          {servicios.map((s, i) => (
            <motion.div
              key={s.num}
              className="studio2-row"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.5, ease, delay: i * 0.08 }}
            >
              <div className="studio2-row-text">
                <h3 className="studio2-row-title">{s.title}</h3>
                <p className="studio2-row-desc">{s.desc}</p>
              </div>
              <span className="studio2-row-num">{s.num}</span>
            </motion.div>
          ))}

          <motion.p
            className="studio2-note"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewport}
            transition={{ duration: 0.6, ease, delay: 0.3 }}
          >
            Las tecnologías varían según el proyecto. El método no.
          </motion.p>
        </div>

      </div>

      <style>{`
        .studio2 {
          padding: clamp(80px, 12vh, 130px) 0;
          background: var(--color-cream);
        }

        .studio2-grid {
          display: grid;
          grid-template-columns: 40% 1fr;
          gap: clamp(40px, 6vw, 88px);
          align-items: start;
        }

        /* Izquierda */
        .studio2-left {
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 100px;
        }

        .studio2-heading {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(34px, 4.4vw, 56px);
          line-height: 1.03;
          letter-spacing: -0.03em;
          color: var(--color-pine);
        }

        .studio2-intro {
          font-family: var(--font-sans);
          font-size: clamp(15px, 1.3vw, 16px);
          color: var(--text-secondary);
          line-height: 1.7;
          max-width: 340px;
          margin-top: 28px;
        }

        .studio2-cta {
          margin-top: 36px;
          align-self: flex-start;
        }

        /* Derecha — lista */
        .studio2-list {
          display: flex;
          flex-direction: column;
        }

        .studio2-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          padding: 28px 0;
          border-top: 1px solid rgba(16, 52, 42, 0.12);
        }
        .studio2-row:last-of-type {
          border-bottom: 1px solid rgba(16, 52, 42, 0.12);
        }

        .studio2-row-title {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(22px, 2.6vw, 30px);
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--color-pine);
          transition: color 0.22s ease;
        }

        .studio2-row-desc {
          font-family: var(--font-sans);
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.6;
          max-width: 280px;
          margin-top: 8px;
        }

        .studio2-row-num {
          font-family: var(--font-mono);
          font-size: 0.74rem;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          flex-shrink: 0;
          padding-top: 6px;
          transition: color 0.22s ease;
        }

        .studio2-row:hover .studio2-row-num { color: var(--color-radish); }
        .studio2-row:hover .studio2-row-title { color: var(--color-radish); }

        .studio2-note {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.04em;
          color: var(--text-muted);
          margin-top: 28px;
        }

        @media (max-width: 860px) {
          .studio2-grid { grid-template-columns: 1fr; gap: 48px; }
          .studio2-left { position: static; top: auto; }
          .studio2-intro { max-width: none; }
        }

        @media (max-width: 600px) {
          .studio2-row { gap: 16px; padding: 22px 0; }
          .studio2-row-desc { max-width: none; }
        }
      `}</style>
    </section>
  )
}
