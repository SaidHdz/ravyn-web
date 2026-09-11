import { motion } from 'motion/react'
import { useLanguage } from '@/context/LanguageContext'

const ease = [0.22, 1, 0.36, 1] as const
const viewport = { once: true, amount: 0.3 }

export default function KlinoIncluye() {
  const { t } = useLanguage()

  return (
    <section id="incluye" className="kinc">
      <div className="container kinc-grid">

        <div className="kinc-left">
          <motion.h2
            className="kinc-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.6, ease, delay: 0.06 }}
          >
            {t.klino.incluyeHeadingLine1}<br />{t.klino.incluyeHeadingLine2}
          </motion.h2>
          <motion.p
            className="kinc-intro"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.55, ease, delay: 0.14 }}
          >
            {t.klino.incluyeIntro}
          </motion.p>
        </div>

        <div className="kinc-list">
          {t.klino.incluyeItems.map((f, i) => (
            <motion.div
              key={f.num}
              className="kinc-row"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.5, ease, delay: i * 0.08 }}
            >
              <div className="kinc-row-text">
                <h3 className="kinc-row-title">{f.title}</h3>
                <p className="kinc-row-desc">{f.desc}</p>
              </div>
              <span className="kinc-row-num">{f.num}</span>
            </motion.div>
          ))}
        </div>

      </div>

      <style>{`
        .kinc { padding: clamp(80px, 12vh, 130px) 0; background: var(--color-cream); }
        .kinc-grid {
          display: grid;
          grid-template-columns: 40% 1fr;
          gap: clamp(40px, 6vw, 88px);
          align-items: start;
        }
        .kinc-left { position: sticky; top: 100px; }
        .kinc-label {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 24px;
        }
        .kinc-heading {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(32px, 4.2vw, 52px);
          line-height: 1.04;
          letter-spacing: -0.03em;
          color: var(--color-pine);
        }
        .kinc-intro {
          font-family: var(--font-sans);
          font-size: clamp(15px, 1.3vw, 16px);
          color: var(--text-secondary);
          line-height: 1.7;
          max-width: 320px;
          margin-top: 24px;
        }
        .kinc-list { display: flex; flex-direction: column; }
        .kinc-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          padding: 28px 0;
          border-top: 1px solid rgba(16, 52, 42, 0.12);
        }
        .kinc-row:last-of-type { border-bottom: 1px solid rgba(16, 52, 42, 0.12); }
        .kinc-row-title {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(20px, 2.4vw, 26px);
          letter-spacing: -0.02em;
          color: var(--color-pine);
          line-height: 1.15;
        }
        .kinc-row-desc {
          font-family: var(--font-sans);
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.6;
          max-width: 360px;
          margin-top: 8px;
        }
        .kinc-row-num {
          font-family: var(--font-mono);
          font-size: 0.74rem;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          flex-shrink: 0;
          padding-top: 6px;
        }
        @media (max-width: 860px) {
          .kinc-grid { grid-template-columns: 1fr; gap: 44px; }
          .kinc-left { position: static; }
          .kinc-intro { max-width: none; }
          .kinc-row-desc { max-width: none; }
        }
      `}</style>
    </section>
  )
}
