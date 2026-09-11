import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

const ease = [0.22, 1, 0.36, 1] as const

export default function RavynsetFAQ() {
  const { t } = useLanguage()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const faqs = t.ravynset.faqs
  const midIndex = Math.ceil(faqs.length / 2)
  const leftCol = faqs.slice(0, midIndex)
  const rightCol = faqs.slice(midIndex)

  const renderItem = (faq: { pregunta: string; respuesta: string }, globalIndex: number) => (
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
        <motion.h2
          className="rfaq-heading"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
        >
          {t.ravynset.faqTag}
        </motion.h2>

        <div className="rfaq-grid">
          <div className="rfaq-col">{leftCol.map((f, i) => renderItem(f, i))}</div>
          <div className="rfaq-col">{rightCol.map((f, i) => renderItem(f, i + midIndex))}</div>
        </div>
      </div>

      <style>{`
        .rfaq { padding: clamp(80px, 12vh, 130px) 0 clamp(100px, 14vh, 150px); background: var(--color-cream); }
        .rfaq-heading {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(30px, 3.8vw, 48px);
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: var(--color-pine);
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
