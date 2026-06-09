import { motion } from 'motion/react'

const ease = [0.22, 1, 0.36, 1] as const
const viewport = { once: true, amount: 0.4 }

export default function KlinoProblema() {
  return (
    <section id="problema" className="kprob">
      <div className="container kprob-inner">
        <motion.span
          className="kprob-label"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.4, ease }}
        >
          El problema
        </motion.span>

        <motion.p
          className="kprob-lead"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, ease, delay: 0.08 }}
        >
          Son las once. Tu sexto paciente del día.
          Mientras te habla, tú escribes — antecedentes, exploración, diagnóstico.
        </motion.p>

        <motion.p
          className="kprob-body"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.55, ease, delay: 0.16 }}
        >
          La norma exige que todo quede documentado. Pero cada minuto en el teclado
          es un minuto que no miras a quien tienes enfrente. La documentación clínica
          te roba lo más valioso de la consulta: la atención.
        </motion.p>

        <motion.p
          className="kprob-punch"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.55, ease, delay: 0.24 }}
        >
          Klino documenta por ti.
        </motion.p>
      </div>

      <style>{`
        .kprob {
          padding: clamp(80px, 13vh, 130px) 0;
          background: var(--color-cream);
        }
        .kprob-inner {
          max-width: 660px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .kprob-label {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 36px;
        }
        .kprob-lead {
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 400;
          font-size: clamp(24px, 3.4vw, 34px);
          line-height: 1.4;
          letter-spacing: -0.015em;
          color: var(--color-pine);
        }
        .kprob-body {
          font-family: var(--font-sans);
          font-size: clamp(15px, 1.4vw, 17px);
          color: var(--text-secondary);
          line-height: 1.75;
          max-width: 520px;
          margin-top: 28px;
        }
        .kprob-punch {
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
          .kprob-body { max-width: none; }
        }
      `}</style>
    </section>
  )
}
