import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import BlurText from '../animations/BlurText'

const ease = [0.16, 1, 0.3, 1] as const

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
    respuesta: "Tienes soporte directo por WhatsApp con nuestro equipo en Reynosa, Tamaulipas. Respondemos el mismo día en horario de oficina. La mensualidad cubre el mantenimiento continuo del sistema."
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

  const renderFaqItem = (faq: any, globalIndex: number) => (
    <motion.div 
      key={globalIndex}
      className="faq-item"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease, delay: globalIndex * 0.05 }}
    >
      <button 
        className={`faq-question ${activeIndex === globalIndex ? 'is-active' : ''}`}
        onClick={() => setActiveIndex(activeIndex === globalIndex ? null : globalIndex)}
      >
        <span className="faq-question-text">{faq.pregunta}</span>
        <ChevronDown className="faq-icon" />
      </button>
      
      <AnimatePresence initial={false}>
        {activeIndex === globalIndex && (
          <motion.div
            className="faq-answer-wrapper"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease }}
          >
            <div className="faq-answer">
              {faq.respuesta}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )

  return (
    <section className="section ravynset-faq">
      <div className="container">
        <div className="mb-20">
          <BlurText
            text="Preguntas frecuentes"
            className="section-label"
            delay={50}
            animateBy="letters"
            direction="top"
          />
        </div>

        <div className="faq-grid-custom">
          <div className="faq-column">
            {leftCol.map((faq, i) => renderFaqItem(faq, i))}
          </div>
          <div className="faq-column">
            {rightCol.map((faq, i) => renderFaqItem(faq, i + midIndex))}
          </div>
        </div>
      </div>

      <style>{`
        .ravynset-faq {
          padding: 120px 0 160px;
          background: transparent;
          min-height: 800px;
        }

        .faq-grid-custom {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0 80px;
          align-items: start;
        }

        .faq-column {
          display: flex;
          flex-direction: column;
        }

        .faq-item {
          border-bottom: 1px solid var(--border);
        }

        .faq-question {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 0;
          text-align: left;
          font-size: clamp(0.95rem, 1.2vw, 1.15rem);
          font-weight: 600;
          color: var(--text);
          background: transparent;
          cursor: pointer;
          transition: color 0.3s ease;
          gap: 15px;
        }
        
        .faq-question-text {
          max-width: 90%;
        }

        .faq-question:hover {
          color: var(--accent);
        }

        .faq-question.is-active {
          color: var(--accent);
        }

        .faq-icon {
          width: 18px;
          height: 18px;
          transition: transform 0.4s var(--ease-out);
          opacity: 0.5;
          flex-shrink: 0;
        }

        .faq-question.is-active .faq-icon {
          transform: rotate(180deg);
          opacity: 1;
        }

        .faq-answer-wrapper {
          overflow: hidden;
        }

        .faq-answer {
          padding-bottom: 24px;
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
        }

        @media (max-width: 1024px) {
          .faq-grid-custom {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .ravynset-faq {
            min-height: auto;
          }
        }

        @media (max-width: 768px) {
          .ravynset-faq {
            padding: 60px 0;
          }
          .faq-question {
            padding: 20px 0;
          }
          .faq-answer {
            font-size: 0.9rem;
          }
        }
        
        /* Ajuste extremo para dispositivos muy pequeños */
        @media (max-width: 320px) {
          .faq-question {
             font-size: 0.85rem;
          }
        }
      `}</style>
    </section>
  )
}
