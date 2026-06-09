import { motion } from 'motion/react'

const ease = [0.22, 1, 0.36, 1] as const
const viewport = { once: true, amount: 0.4 }

export default function RavynsetProblema() {
  return (
    <section id="problema" className="rprob">
      <div className="container rprob-inner">
        <motion.p
          className="rprob-lead"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, ease, delay: 0.08 }}
        >
          La gestión de pacientes no debería vivir en un cuaderno, en un archivo de Excel,
          ni en el WhatsApp personal del recepcionista.
        </motion.p>

        <motion.p
          className="rprob-body"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.55, ease, delay: 0.16 }}
        >
          Las clínicas pierden tiempo respondiendo mensajes a deshoras, pierden citas por no enviar 
          recordatorios a tiempo, y pierden el seguimiento de sus pacientes porque la información está dispersa.
        </motion.p>

        <motion.p
          className="rprob-punch"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.55, ease, delay: 0.24 }}
        >
          Ravynset centraliza todo.
        </motion.p>
      </div>

      <style>{`
        .rprob {
          padding: clamp(80px, 13vh, 130px) 0;
          background: var(--color-cream);
        }
        .rprob-inner {
          max-width: 660px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin: 0 auto;
        }
        .rprob-lead {
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 400;
          font-size: clamp(24px, 3.4vw, 34px);
          line-height: 1.4;
          letter-spacing: -0.015em;
          color: var(--color-pine);
        }
        .rprob-body {
          font-family: var(--font-sans);
          font-size: clamp(15px, 1.4vw, 17px);
          color: var(--text-secondary);
          line-height: 1.75;
          max-width: 520px;
          margin-top: 28px;
        }
        .rprob-punch {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(22px, 2.8vw, 30px);
          letter-spacing: -0.025em;
          color: var(--color-radish);
          margin-top: 40px;
          padding-top: 36px;
          border-top: 1px solid rgba(16, 52, 42, 0.15);
        }
        @media (max-width: 600px) {
          .rprob-body { max-width: none; }
        }
      `}</style>
    </section>
  )
}
