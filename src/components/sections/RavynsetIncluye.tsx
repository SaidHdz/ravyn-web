import { motion } from 'motion/react'

const ease = [0.22, 1, 0.36, 1] as const
const viewport = { once: true, amount: 0.3 }

const funciones = [
  {
    num: '01',
    title: 'Web y Agenda 24/7',
    desc: 'Diseño con tu identidad. Tus pacientes agendan en línea y se sincroniza directo con tu Google Calendar.',
  },
  {
    num: '02',
    title: 'Recordatorios automáticos',
    desc: 'El sistema envía confirmaciones y recordatorios por WhatsApp para que tus pacientes no olviden su cita.',
  },
  {
    num: '03',
    title: 'Expediente centralizado',
    desc: 'Panel de control con todas tus citas, historial de pacientes y datos de contacto en un solo lugar.',
  },
  {
    num: '04',
    title: 'Motor de reputación',
    desc: 'Mensajes automáticos de agradecimiento post-visita con invitación a dejar reseña en Google Maps.',
  },
]

export default function RavynsetIncluye() {
  return (
    <section id="incluye" className="rinc">
      <div className="container rinc-grid">

        <div className="rinc-left">
          <motion.span
            className="rinc-label"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.4, ease }}
          >
            Qué incluye
          </motion.span>
          <motion.h2
            className="rinc-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.6, ease, delay: 0.06 }}
          >
            Cuatro herramientas.<br />Una sola plataforma.
          </motion.h2>
          <motion.p
            className="rinc-intro"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.55, ease, delay: 0.14 }}
          >
            Ravynset unifica tu agenda, la información de tus pacientes y tus recordatorios en un solo flujo. Sin integraciones extrañas.
          </motion.p>
        </div>

        <div className="rinc-list">
          {funciones.map((f, i) => (
            <motion.div
              key={f.num}
              className="rinc-row"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.5, ease, delay: i * 0.08 }}
            >
              <div className="rinc-row-text">
                <h3 className="rinc-row-title">{f.title}</h3>
                <p className="rinc-row-desc">{f.desc}</p>
              </div>
              <span className="rinc-row-num">{f.num}</span>
            </motion.div>
          ))}
        </div>

      </div>

      <style>{`
        .rinc { padding: clamp(80px, 12vh, 130px) 0; background: var(--color-cream); }
        .rinc-grid {
          display: grid;
          grid-template-columns: 40% 1fr;
          gap: clamp(40px, 6vw, 88px);
          align-items: start;
        }
        .rinc-left { position: sticky; top: 100px; }
        .rinc-label {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 24px;
        }
        .rinc-heading {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(32px, 4.2vw, 52px);
          line-height: 1.04;
          letter-spacing: -0.03em;
          color: var(--color-pine);
        }
        .rinc-intro {
          font-family: var(--font-sans);
          font-size: clamp(15px, 1.3vw, 16px);
          color: var(--text-secondary);
          line-height: 1.7;
          max-width: 320px;
          margin-top: 24px;
        }
        .rinc-list { display: flex; flex-direction: column; }
        .rinc-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          padding: 28px 0;
          border-top: 1px solid rgba(16, 52, 42, 0.12);
        }
        .rinc-row:last-of-type { border-bottom: 1px solid rgba(16, 52, 42, 0.12); }
        .rinc-row-title {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(20px, 2.4vw, 26px);
          letter-spacing: -0.02em;
          color: var(--color-pine);
          line-height: 1.15;
        }
        .rinc-row-desc {
          font-family: var(--font-sans);
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.6;
          max-width: 360px;
          margin-top: 8px;
        }
        .rinc-row-num {
          font-family: var(--font-mono);
          font-size: 0.74rem;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          flex-shrink: 0;
          padding-top: 6px;
        }
        @media (max-width: 860px) {
          .rinc-grid { grid-template-columns: 1fr; gap: 44px; }
          .rinc-left { position: static; }
          .rinc-intro { max-width: none; }
          .rinc-row-desc { max-width: none; }
        }
      `}</style>
    </section>
  )
}
