import { motion } from 'motion/react'
import { Check, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import AuthModal from '../AuthModal'

const ease = [0.22, 1, 0.36, 1] as const
const viewport = { once: true, amount: 0.3 }

const planes = [
  {
    id: 'esencial',
    name: 'Plan Esencial',
    price: '$900',
    period: 'MXN / mes',
    recommended: false,
    includes: [
      'Sitio web personalizado',
      'Agenda online 24/7',
      'Recordatorios automáticos por WhatsApp',
      'Sincronización con Google Calendar',
      'Motor de reputación Google Maps',
      'Hosting y mantenimiento incluidos',
    ],
    excludes: ['CRM completo con historial'],
    cta: 'Empieza hoy →',
  },
  {
    id: 'completo',
    name: 'Plan Completo',
    price: '$1,400',
    period: 'MXN / mes',
    badge: 'Recomendado',
    recommended: true,
    includes: [
      'Todo lo del plan Esencial',
      'CRM completo con historial de pacientes',
      'Gestión de usuarios y staff',
      'Recordatorios manuales desde el panel',
      'Modificación y creación de citas',
      'Soporte por WhatsApp prioritario',
    ],
    cta: 'Empieza hoy →',
  },
]

export default function RavynsetPlanes() {
  const { user } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const handlePlanClick = () => {
    if (!user) {
      setIsAuthModalOpen(true)
    }
  }

  return (
    <section id="planes" className="rpl">
      <div className="container">
        <motion.span
          className="rpl-label"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.4, ease }}
        >
          Nuestros planes
        </motion.span>
        <motion.h2
          className="rpl-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, ease, delay: 0.06 }}
        >
          Comienza cuando quieras.<br />Cancela cuando quieras.
        </motion.h2>

        <div className="rpl-grid">
          {planes.map((plan, i) => (
            <motion.div
              key={plan.id}
              className={`rpl-card ${plan.recommended ? 'is-recommended' : ''}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.6, ease, delay: i * 0.1 }}
            >
              {plan.badge && (
                <span className="rpl-badge">{plan.badge}</span>
              )}

              <p className="rpl-plan-name">{plan.name}</p>
              <div className="rpl-price-row">
                <span className="rpl-price">{plan.price}</span>
                <span className="rpl-period">{plan.period}</span>
              </div>

              <div className="rpl-divider" />

              <ul className="rpl-list">
                {plan.includes.map((item, idx) => (
                  <li key={idx} className="rpl-item">
                    <Check style={{ width: 15, height: 15, color: 'var(--color-sprout)', flexShrink: 0, marginTop: 3 }} />
                    <span>{item}</span>
                  </li>
                ))}
                {plan.excludes?.map((item, idx) => (
                  <li key={idx} className="rpl-item is-excluded">
                    <X style={{ width: 15, height: 15, color: 'var(--text-muted)', flexShrink: 0, marginTop: 3, opacity: 0.5 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`rpl-btn ${plan.recommended ? 'rpl-btn-primary' : 'rpl-btn-secondary'}`}
                onClick={handlePlanClick}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView="signup"
      />

      <style>{`
        .rpl { padding: clamp(80px, 12vh, 130px) 0; background: var(--color-cream); }
        .rpl-label {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 24px;
        }
        .rpl-heading {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(32px, 4.2vw, 52px);
          line-height: 1.04;
          letter-spacing: -0.03em;
          color: var(--color-pine);
          margin-bottom: 56px;
        }
        .rpl-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          max-width: 960px;
        }
        .rpl-card {
          position: relative;
          border: 1.5px solid rgba(16,52,42,0.12);
          border-radius: var(--radius-lg);
          background: var(--color-cream-2);
          padding: 40px 36px;
          display: flex;
          flex-direction: column;
        }
        .rpl-card.is-recommended {
          border-color: var(--color-pine);
        }
        .rpl-badge {
          position: absolute;
          top: -12px;
          left: 36px;
          background: var(--color-radish);
          color: var(--color-cream);
          padding: 4px 14px;
          border-radius: var(--radius-pill);
          font-family: var(--font-mono);
          font-size: 0.62rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.14em;
        }
        .rpl-plan-name {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--text-secondary);
          margin-bottom: 14px;
        }
        .rpl-price-row { display: flex; align-items: baseline; gap: 10px; margin-bottom: 8px; }
        .rpl-price {
          font-family: var(--font-display);
          font-size: 3rem;
          font-weight: 600;
          letter-spacing: -0.04em;
          color: var(--color-pine);
          line-height: 1;
        }
        .rpl-period { font-size: 0.9rem; color: var(--text-muted); }
        .rpl-divider { height: 1px; background: rgba(16,52,42,0.12); margin: 24px 0; }
        .rpl-list { list-style: none; display: flex; flex-direction: column; gap: 12px; flex: 1; margin-bottom: 40px; }
        .rpl-item {
          display: flex;
          gap: 12px;
          font-family: var(--font-sans);
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .rpl-item.is-excluded { color: var(--text-muted); opacity: 0.6; }
        
        .rpl-btn {
          width: 100%;
          padding: 14px;
          border-radius: var(--radius-pill);
          font-family: var(--font-sans);
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s, background 0.2s, color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid transparent;
        }
        .rpl-btn-primary {
          background: var(--color-pine);
          color: var(--color-cream);
          border-color: var(--color-pine);
        }
        .rpl-btn-primary:hover { opacity: 0.88; }
        .rpl-btn-secondary {
          background: transparent;
          color: var(--color-pine);
          border-color: var(--border-strong);
        }
        .rpl-btn-secondary:hover {
          background: var(--color-pine);
          color: var(--color-cream);
        }
        @media (max-width: 768px) {
          .rpl-grid { grid-template-columns: 1fr; }
          .rpl-card { padding: 32px 24px; }
          .rpl-badge { left: 24px; }
        }
      `}</style>
    </section>
  )
}
