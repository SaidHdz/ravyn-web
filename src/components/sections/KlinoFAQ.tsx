import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

const faqs = [
  {
    pregunta: '¿Klino reemplaza mi criterio médico?',
    respuesta:
      'No. Klino documenta lo que ocurre en la consulta; tú revisas, ajustas y firmas. La última palabra siempre es del médico.',
  },
  {
    pregunta: '¿Las notas cumplen con la normativa?',
    respuesta:
      'Sí. Klino genera la nota clínica estructurada conforme a NOM-004 y NOM-024, lista para auditoría.',
  },
  {
    pregunta: '¿Y si la transcripción se equivoca?',
    respuesta:
      'Revisas y editas la nota antes de guardarla. Klino propone; tú confirmas. Nada se guarda sin tu visto bueno.',
  },
  {
    pregunta: '¿En qué dispositivos funciona?',
    respuesta:
      'Klino funciona en celular y tableta con micrófono, y desde computadora para consultar el expediente. Sin instalaciones complejas.',
  },
  {
    pregunta: '¿Están seguros los datos de mis pacientes?',
    respuesta:
      'Sí. La información se almacena cifrada y nunca se comparte con terceros. Cumplimos con la LFPDPPP.',
  },
  {
    pregunta: '¿Qué necesito para empezar?',
    respuesta:
      'Un dispositivo con micrófono y tu cuenta de beta. Te acompañamos en la configuración inicial en una llamada corta.',
  },
]

export default function KlinoFAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const midIndex = Math.ceil(faqs.length / 2)
  const leftCol = faqs.slice(0, midIndex)
  const rightCol = faqs.slice(midIndex)

  const renderItem = (faq: (typeof faqs)[0], globalIndex: number) => (
    <motion.div
      key={globalIndex}
      className="kfaq-item"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease, delay: globalIndex * 0.05 }}
    >
      <button
        className={`kfaq-question ${activeIndex === globalIndex ? 'is-active' : ''}`}
        onClick={() => setActiveIndex(activeIndex === globalIndex ? null : globalIndex)}
      >
        <span className="kfaq-question-text">{faq.pregunta}</span>
        <ChevronDown className="kfaq-icon" />
      </button>

      <AnimatePresence initial={false}>
        {activeIndex === globalIndex && (
          <motion.div
            className="kfaq-answer-wrapper"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease }}
          >
            <div className="kfaq-answer">{faq.respuesta}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )

  return (
    <section className="kfaq">
      <div className="container">
        <motion.span
          className="kfaq-label"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease }}
        >
          Preguntas frecuentes
        </motion.span>

        <div className="kfaq-grid">
          <div className="kfaq-col">{leftCol.map((f, i) => renderItem(f, i))}</div>
          <div className="kfaq-col">{rightCol.map((f, i) => renderItem(f, i + midIndex))}</div>
        </div>
      </div>

      <style>{`
        .kfaq { padding: clamp(80px, 12vh, 130px) 0 clamp(100px, 14vh, 150px); background: var(--color-cream); }
        .kfaq-label {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 48px;
        }
        .kfaq-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0 80px;
          align-items: start;
        }
        .kfaq-col { display: flex; flex-direction: column; }
        .kfaq-item { border-bottom: 1px solid rgba(16, 52, 42, 0.12); }
        .kfaq-question {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 0;
          text-align: left;
          font-family: var(--font-display);
          font-size: clamp(1rem, 1.3vw, 1.15rem);
          font-weight: 600;
          letter-spacing: -0.01em;
          color: var(--color-pine);
          background: transparent;
          cursor: pointer;
          transition: color 0.3s;
          gap: 15px;
        }
        .kfaq-question-text { max-width: 90%; }
        .kfaq-question:hover, .kfaq-question.is-active { color: var(--color-radish); }
        .kfaq-icon {
          width: 17px;
          height: 17px;
          transition: transform 0.4s var(--ease-out);
          opacity: 0.4;
          flex-shrink: 0;
        }
        .kfaq-question.is-active .kfaq-icon { transform: rotate(180deg); opacity: 1; }
        .kfaq-answer-wrapper { overflow: hidden; }
        .kfaq-answer {
          padding-bottom: 22px;
          font-family: var(--font-sans);
          color: var(--text-secondary);
          font-size: 0.92rem;
          line-height: 1.65;
        }
        @media (max-width: 1024px) {
          .kfaq-grid { grid-template-columns: 1fr; gap: 0; }
        }
      `}</style>
    </section>
  )
}
