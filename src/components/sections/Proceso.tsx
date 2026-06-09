import { motion } from 'motion/react'

const ease = [0.22, 1, 0.36, 1] as const
const viewport = { once: true, amount: 0.3 }

const pasos = [
  {
    num: '01',
    nombre: 'Semilla',
    lead: 'Entendemos el problema.',
    desc: 'Sin presentaciones, sin humo. Nos reunimos, escuchamos y definimos qué vamos a construir — y qué no.',
  },
  {
    num: '02',
    nombre: 'Cultivo',
    lead: 'Construimos en iteraciones cortas.',
    desc: 'Ves avances reales durante todo el proceso. Comunicación directa con quien construye, no con un intermediario.',
  },
  {
    num: '03',
    nombre: 'Cosecha',
    lead: 'Entregamos algo que ya está corriendo.',
    desc: 'No una promesa ni un diseño en Figma. Código funcionando, desplegado, listo para operar.',
  },
  {
    num: '04',
    nombre: 'Raíz',
    lead: 'El producto sigue creciendo contigo.',
    desc: 'Soporte vivo después de la entrega. No desaparecemos cuando terminamos.',
  },
]

export default function Proceso() {
  return (
    <section id="proceso" className="proceso2">
      <div className="container proceso2-inner">



        <motion.h2
          className="proceso2-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, ease, delay: 0.06 }}
        >
          De la semilla<br />a la raíz.
        </motion.h2>

        {/* Tallo + nodos */}
        <div className="proceso2-timeline">
          <motion.span
            className="proceso2-stem"
            aria-hidden="true"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0, 0, 0.2, 1], delay: 0.1 }}
          />

          {pasos.map((p, i) => (
            <motion.div
              key={p.num}
              className="proceso2-node"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease, delay: 0.35 + i * 0.12 }}
            >
              <div className="proceso2-rail">
                <span className="proceso2-marker" />
                <span className="proceso2-num">{p.num}</span>
              </div>
              <div className="proceso2-content">
                <h3 className="proceso2-name">{p.nombre}</h3>
                <p className="proceso2-lead">{p.lead}</p>
                <p className="proceso2-desc">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .proceso2 {
          padding: clamp(80px, 12vh, 130px) 0;
          background: var(--color-cream);
        }

        .proceso2-inner {
          max-width: 680px;
        }

        .proceso2-heading {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(34px, 4.4vw, 56px);
          line-height: 1.03;
          letter-spacing: -0.03em;
          color: var(--color-pine);
          margin-bottom: 64px;
        }

        /* Timeline */
        .proceso2-timeline {
          position: relative;
          padding-left: 60px;
        }

        /* El tallo — crece de arriba a abajo */
        .proceso2-stem {
          position: absolute;
          left: 75px;
          top: 10px;
          bottom: 10px;
          width: 2px;
          background: var(--color-pine);
          transform-origin: top center;
          z-index: 1;
        }

        .proceso2-node {
          position: relative;
          display: grid;
          grid-template-columns: 32px 1fr;
          gap: 28px;
          padding-bottom: 48px;
        }
        .proceso2-node:last-child { padding-bottom: 0; }

        .proceso2-rail {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .proceso2-marker {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--color-cream);
          border: 2px solid var(--color-pine);
          margin-top: 4px;
          flex-shrink: 0;
        }

        .proceso2-num {
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

        .proceso2-content {
          padding-top: 1px;
          max-width: 480px;
        }

        .proceso2-name {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(22px, 2.6vw, 28px);
          letter-spacing: -0.02em;
          color: var(--color-pine);
          line-height: 1.1;
          margin-bottom: 10px;
        }

        .proceso2-lead {
          font-family: var(--font-sans);
          font-size: clamp(15px, 1.4vw, 17px);
          font-weight: 500;
          color: var(--color-pine);
          line-height: 1.45;
          margin-bottom: 6px;
        }

        .proceso2-desc {
          font-family: var(--font-sans);
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.65;
        }

        @media (max-width: 600px) {
          .proceso2-timeline { padding-left: 48px; }
          .proceso2-stem { left: 63px; }
          .proceso2-heading { margin-bottom: 48px; }
          .proceso2-node { gap: 20px; padding-bottom: 40px; }
        }
      `}</style>
    </section>
  )
}
