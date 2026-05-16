import { motion } from 'motion/react'
import { Check, X } from 'lucide-react'
import BlurText from '../animations/BlurText'
import ShinyText from '../animations/ShinyText'
import BorderGlow from '../BorderGlow/BorderGlow'

const ease = [0.16, 1, 0.3, 1] as const

const planes = [
  {
    id: 'esencial',
    name: 'Plan Esencial',
    price: '$900',
    period: 'MXN / mes',
    glowColor: '213 94 68',
    colors: ['#60a5fa', '#3b82f6', '#93c5fd'],
    includes: [
      'Sitio web personalizado',
      'Agenda online 24/7',
      'Recordatorios automáticos por WhatsApp',
      'Sincronización con Google Calendar',
      'Motor de reputación Google Maps',
      'Hosting y mantenimiento incluidos'
    ],
    excludes: [
      'CRM completo con historial'
    ],
    cta: 'Quiero el plan Esencial →',
    recommended: false
  },
  {
    id: 'completo',
    name: 'Plan Completo',
    price: '$1,400',
    period: 'MXN / mes',
    badge: 'Recomendado',
    glowColor: '45 100 60',
    colors: ['#F59E0B', '#D97706', '#FBBF24'],
    includes: [
      'Todo lo del plan Esencial',
      'CRM completo con historial de pacientes',
      'Gestión de usuarios y staff',
      'Recordatorios manuales desde el panel',
      'Modificación y creación de citas',
      'Soporte por WhatsApp prioritario'
    ],
    cta: 'Quiero el plan Completo →',
    recommended: true
  }
]

export default function RavynsetPlanes() {
  return (
    <section id="planes" className="section ravynset-planes">
      <div className="container">
        <div className="text-left max-w-4xl mb-24">
          <BlurText
            text="Nuestros planes"
            className="section-label"
            delay={50}
            animateBy="letters"
            direction="top"
          />
        </div>

        <div className="planes-grid-container">
          {planes.map((plan, i) => (
            <motion.div 
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease, delay: i * 0.1 }}
              className="plan-card-wrapper"
            >
              {plan.badge && (
                <div className="plan-badge">
                  {plan.badge}
                </div>
              )}
              
              <BorderGlow
                glowColor={plan.glowColor}
                colors={plan.colors}
                backgroundColor="var(--bg-surface)"
                borderRadius={32}
                glowRadius={60}
                edgeSensitivity={20}
                glowIntensity={plan.recommended ? 2.0 : 1.2}
                animated={true}
                className="plan-border-glow"
              >
                <div className="plan-card-content">
                  <div className="plan-header">
                    <ShinyText 
                      text={plan.name} 
                      disabled={false} 
                      speed={3} 
                      className="plan-name" 
                    />
                    <div className="plan-price-row">
                      <span className="plan-price">{plan.price}</span>
                      <span className="plan-period">{plan.period}</span>
                    </div>
                  </div>

                  <div className="plan-divider" />

                  <ul className="plan-list">
                    {plan.includes.map((item, idx) => (
                      <li key={idx} className="plan-item">
                        <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                    {plan.excludes?.map((item, idx) => (
                      <li key={idx} className="plan-item is-excluded">
                        <X className="w-5 h-5 text-red-400/50 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <button className={`plan-button ${plan.recommended ? 'btn-primary' : 'btn-secondary'}`} 
                          style={plan.recommended ? { background: '#D97706', color: '#fff' } : {}}>
                    {plan.cta}
                  </button>
                </div>
              </BorderGlow>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .ravynset-planes {
          padding: 120px 0;
          background: transparent;
        }

        .planes-grid-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 48px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .plan-card-wrapper {
          position: relative;
          padding-top: 20px;
        }

        .plan-border-glow {
          overflow: visible !important;
        }

        .plan-card-content {
          position: relative;
          padding: 48px;
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 600px;
        }

        .plan-badge {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #D97706;
          color: #fff;
          padding: 10px 28px;
          border-radius: 100vw;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          box-shadow: 0 10px 25px -5px rgba(217, 119, 6, 0.5);
          z-index: 100;
          white-space: nowrap;
        }

        .plan-name {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 24px;
          display: inline-block;
        }

        .plan-price-row {
          display: flex;
          align-items: baseline;
          gap: 12px;
        }

        .plan-price {
          font-size: 4.5rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--text);
          line-height: 1;
        }

        .plan-period {
          font-size: 1.1rem;
          color: var(--text-muted);
        }

        .plan-divider {
          height: 1px;
          background: var(--border);
          margin: 40px 0;
        }

        .plan-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 56px;
          flex: 1;
        }

        .plan-item {
          display: flex;
          gap: 16px;
          font-size: 1.05rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .plan-item.is-excluded {
          color: var(--text-muted);
          opacity: 0.5;
        }

        .plan-button {
          width: 100%;
          justify-content: center;
          font-size: 1rem;
          padding: 20px;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
        }

        @media (max-width: 768px) {
          .planes-grid-container {
            grid-template-columns: 1fr;
            gap: 64px;
          }
          .ravynset-planes {
            padding: 80px 0;
          }
          .plan-card-content {
            padding: 40px 30px;
            min-height: auto;
          }
          .plan-price {
            font-size: 3.5rem;
          }
        }
      `}</style>
    </section>
  )
}
