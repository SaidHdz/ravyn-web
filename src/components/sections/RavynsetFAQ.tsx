import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

const faqs = [
  {
    pregunta: "¿Necesito saber de tecnología para usar RavynSet?",
    respuesta: "No. Nosotros nos encargamos de toda la configuración técnica. Tú solo nos das la información de tu clínica y nosotros hacemos el resto. Para el día a día, el sistema es tan simple como revisar tu agenda."
  },
  {
    pregunta: "¿Mis datos y los de mis pacientes están seguros?",
    respuesta: "Sí. El sistema trabaja directamente con tu propio Google Calendar — los datos de tus citas y pacientes nunca pasan por nuestros servidores. Cumplimos con la LFPDPPP para el manejo de datos personales."
  },
  {
    pregunta: "¿Puedo cancelar cuando quiera?",
    respuesta: "Sí, sin penalizaciones ni compromisos a largo plazo. Con un aviso de 30 días el servicio se da de baja y te entregamos toda tu información."
  },
  {
    pregunta: "¿Funciona solo para clínicas dentales?",
    respuesta: "No. RavynSet funciona para cualquier negocio que maneje citas: spas, centros de bienestar, psicólogos, nutriólogos, fisioterapeutas y más. El sistema se adapta a tu giro."
  },
  {
    pregunta: "¿Cuánto tiempo tarda la implementación?",
    respuesta: "Entre 2 y 4 semanas desde que nos das tu información. Una vez lanzado, todo corre de forma automática sin que tengas que hacer nada."
  },
  {
    pregunta: "¿Qué pasa si algo deja de funcionar?",
    respuesta: "Tienes soporte directo por WhatsApp con nuestro equipo en México. Respondemos el mismo día en horario de oficina. La mensualidad cubre el mantenimiento continuo del sistema."
  },
  {
    pregunta: "¿Qué incluye la mensualidad exactamente?",
    respuesta: "Hosting de tu web y tu CRM en nuestros servidores, costos de las APIs de automatización, mantenimiento técnico y cambios menores a tu web cuando los necesites."
  }
]

export default function RavynsetFAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const midIndex = Math.ceil(faqs.length / 2)
  const leftCol = faqs.slice(0, midIndex)
  const rightCol = faqs.slice(midIndex)

  const renderItem = (faq: (typeof faqs)[0], globalIndex: number) => (
    <motion.div
      key={globalIndex}
      className="rfaq-item"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease, delay: globalIndex * 0.05 }}
    >
      <button
        className={`rfaq-question ${activeIndex === globalIndex ? 'is-active' : ''}`}
        onClick={() => setActiveIndex(activeIndex === globalIndex ? null : globalIndex)}
      >
        <span className="rfaq-question-text">{faq.pregunta}</span>
        <ChevronDown className="rfaq-icon" />
      </button>

      <AnimatePresence initial={false}>
        {activeIndex === globalIndex && (
          <motion.div
            className="rfaq-answer-wrapper"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease }}
          >
            <div className="rfaq-answer">{faq.respuesta}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )

  return (
    <section className="rfaq">
      <div className="container">
        <motion.span
          className="rfaq-label"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease }}
        >
          Preguntas frecuentes
        </motion.span>

        <div className="rfaq-grid">
          <div className="rfaq-col">{leftCol.map((f, i) => renderItem(f, i))}</div>
          <div className="rfaq-col">{rightCol.map((f, i) => renderItem(f, i + midIndex))}</div>
        </div>
      </div>

      <style>{`
        .rfaq { padding: clamp(80px, 12vh, 130px) 0 clamp(100px, 14vh, 150px); background: var(--color-cream); }
        .rfaq-label {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 48px;
        }
        .rfaq-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0 80px;
          align-items: start;
        }
        .rfaq-col { display: flex; flex-direction: column; }
        .rfaq-item { border-bottom: 1px solid rgba(16, 52, 42, 0.12); }
        .rfaq-question {
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
        .rfaq-question-text { max-width: 90%; }
        .rfaq-question:hover, .rfaq-question.is-active { color: var(--color-radish); }
        .rfaq-icon {
          width: 17px;
          height: 17px;
          transition: transform 0.4s var(--ease-out);
          opacity: 0.4;
          flex-shrink: 0;
        }
        .rfaq-question.is-active .rfaq-icon { transform: rotate(180deg); opacity: 1; }
        .rfaq-answer-wrapper { overflow: hidden; }
        .rfaq-answer {
          padding-bottom: 22px;
          font-family: var(--font-sans);
          color: var(--text-secondary);
          font-size: 0.92rem;
          line-height: 1.65;
        }
        @media (max-width: 1024px) {
          .rfaq-grid { grid-template-columns: 1fr; gap: 0; }
        }
      `}</style>
    </section>
  )
}
