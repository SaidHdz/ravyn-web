import { useState } from 'react'
import { motion } from 'motion/react'
import { Check, X } from 'lucide-react'
import SplitText from '../animations/SplitText'
import ShinyText from '../animations/ShinyText'
import BorderGlow from '../BorderGlow/BorderGlow'
import AuthModal from '../AuthModal'
import { useAuth } from '@/hooks/useAuth'

const ease = [0.16, 1, 0.3, 1] as const

/*
// === CONTENIDO ANTERIOR: lista expandible de servicios ===
// Se conserva comentado por si se necesita restaurar en el futuro.
//
// import { useState, useEffect } from 'react'
// import { motion, AnimatePresence } from 'motion/react'
// import SplitText from '../animations/SplitText'
//
// const ease = [0.16, 1, 0.3, 1] as const
//
// const TAG_COLORS = ['blue', 'green', 'amber'] as const
//
// const servicios = [
//   {
//     num: '01',
//     title: 'Desarrollo Web & Apps',
//     desc: 'Landing pages, sitios corporativos y aplicaciones web a medida. Rápido de implementar, fácil de mantener y diseñado para convertir.',
//     tags: ['React', 'Next.js', 'Diseño custom'],
//     value: 'Desde 6,000 MXN',
//   },
//   {
//     num: '02',
//     title: 'Soluciones IoT',
//     desc: 'Hardware + software a la medida para automatización, monitoreo remoto y control de procesos industriales.',
//     tags: ['Embebidos', 'Dashboards', 'Sensores'],
//     value: 'Desde 8,000 MXN',
//   },
//   {
//     num: '03',
//     title: 'Sistemas de Gestión Personalizados',
//     desc: 'Plataformas internas para administrar tu negocio: inventarios, clientes, reportes y flujos de trabajo automatizados.',
//     tags: ['Web', 'APIs', 'Automatización'],
//     value: 'Desde 10,000 MXN',
//   },
// ]
//
// export default function Servicios() {
//   const [active, setActive] = useState<number>(0)
//   const [isMobile, setIsMobile] = useState(false)
//
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(!window.matchMedia('(hover: hover)').matches)
//     }
//     checkMobile()
//     window.addEventListener('resize', checkMobile)
//     return () => window.removeEventListener('resize', checkMobile)
//   }, [])
//
//   return (
//     <section id="servicios" className="section servicios-section-custom">
//       <div className="container">
//         <SplitText
//           text="Servicios"
//           className="section-label"
//           delay={50}
//           duration={0.8}
//           tag="p"
//         />
//
//         <div className="servicios-list">
//           {servicios.map((s, i) => (
//             <motion.div
//               key={s.num}
//               className={`servicio-item${active === i ? ' is-active' : ''}`}
//               initial={{ opacity: 0, y: 10 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true, margin: '-40px' }}
//               transition={{ duration: 0.4, ease, delay: i * 0.08 }}
//               onHoverStart={() => !isMobile && setActive(i)}
//               onClick={() => setActive(active === i ? -1 : i)}
//             >
//               <div className="servicio-row">
//                 <motion.span
//                   className="servicio-num"
//                   animate={active === i ? { scale: 1.25 } : { scale: 1 }}
//                   transition={{ duration: 0.22, ease }}
//                   style={{ display: 'inline-block', transformOrigin: 'left center' }}
//                 >
//                   {s.num}
//                 </motion.span>
//
//                 <div className="servicio-title-group">
//                   <motion.span
//                     className="servicio-title"
//                     animate={active === i ? { scale: 1.04 } : { scale: 1 }}
//                     transition={{ duration: 0.22, ease }}
//                     style={{ display: 'inline-block', transformOrigin: 'left center' }}
//                   >
//                     {s.title}
//                   </motion.span>
//
//                   <motion.span
//                     className="servicio-price font-mono text-[0.7rem] uppercase tracking-wider"
//                     animate={active === i ? { scale: 1.07, color: 'var(--text)' } : { scale: 1, color: '#fff' }}
//                     transition={{ duration: 0.22, ease }}
//                     style={{ display: 'inline-block' }}
//                   >
//                     {s.value}
//                   </motion.span>
//                 </div>
//
//                 <span className="servicio-line" aria-hidden="true" />
//
//                 <span className="servicio-tags-row">
//                   {s.tags.map((tag, ti) => (
//                     <span
//                       key={tag}
//                       className={`tag-pill tag-pill--${TAG_COLORS[ti % TAG_COLORS.length]}`}
//                     >
//                       {tag}
//                     </span>
//                   ))}
//                 </span>
//
//                 <motion.span
//                   className="servicio-arrow"
//                   animate={active === i ? { x: 5 } : { x: 0 }}
//                   transition={{ duration: 0.22, ease }}
//                 >
//                   →
//                 </motion.span>
//               </div>
//
//               <AnimatePresence initial={false}>
//                 {active === i && (
//                   <motion.div
//                     className="servicio-desc-expand"
//                     initial={{ height: 0, opacity: 0 }}
//                     animate={{
//                       height: 'auto',
//                       opacity: 1,
//                       transition: { height: { duration: 0.4, ease }, opacity: { duration: 0.25, delay: 0.1 } }
//                     }}
//                     exit={{
//                       height: 0,
//                       opacity: 0,
//                       transition: { height: { duration: 0.35, ease }, opacity: { duration: 0.2 } }
//                     }}
//                     style={{ overflow: 'hidden' }}
//                   >
//                     <div className="servicio-desc-tags">
//                       {s.tags.map((tag, ti) => (
//                         <span
//                           key={tag}
//                           className={`tag-pill tag-pill--${TAG_COLORS[ti % TAG_COLORS.length]}`}
//                         >
//                           {tag}
//                         </span>
//                       ))}
//                     </div>
//                     <p className="servicio-desc-text">{s.desc}</p>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }
*/

const planes = [
  {
    id: 'esencial',
    name: 'Plan Esencial',
    price: '$900',
    period: 'MXN / mes',
    glowColor: '213 94 68',
    colors: ['#60a5fa', '#3b82f6', '#93c5fd'],
    includes: [
      'Sitio web personalizado para tu negocio',
      'Agenda online para que tus clientes reserven solos',
      'Sincronización con tu Google Calendar',
      'Recordatorios automáticos por WhatsApp',
      'Sistema para conseguir reseñas en Google',
      'Hosting y mantenimiento incluidos'
    ],
    excludes: [
      'Panel CRM con historial de clientes'
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
      'Panel CRM con historial completo de clientes',
      'Gestión de citas desde tu panel (crear, editar, reagendar)',
      'Roles y accesos para tu equipo',
      'Envío de recordatorios personalizados bajo demanda',
      'Soporte por WhatsApp'
    ],
    cta: 'Quiero el plan Completo →',
    recommended: true
  }
]

export default function Servicios() {
  const { user } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const handlePlanClick = (planId: string) => {
    if (!user) {
      setIsAuthModalOpen(true)
    } else {
      console.log('Procediendo al pago del plan:', planId)
    }
  }

  return (
    <section id="servicios" className="section servicios-section-custom">
      <div className="container">
        <SplitText
          text="Servicios"
          className="section-label"
          delay={50}
          duration={0.8}
          tag="p"
        />

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

              {plan.recommended ? (
                <BorderGlow
                  glowColor={plan.glowColor}
                  colors={plan.colors}
                  backgroundColor="var(--bg-surface)"
                  borderRadius={32}
                  glowRadius={60}
                  edgeSensitivity={20}
                  glowIntensity={1.5}
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

                  <button
                    className="plan-button plan-button--primary"
                    onClick={() => handlePlanClick(plan.id)}
                  >
                    {plan.cta}
                  </button>
                </div>
                </BorderGlow>
              ) : (
                <div className="plan-card-static">
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

                    <button
                      className="plan-button plan-button--ghost"
                      onClick={() => handlePlanClick(plan.id)}
                    >
                      {plan.cta}
                    </button>
                  </div>
                </div>
              )}
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
        .servicios-section-custom {
          padding-bottom: 40px;
        }

        .planes-grid-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          max-width: 1100px;
          margin: 32px auto 0;
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
          padding: 36px;
          display: flex;
          flex-direction: column;
          height: 100%;
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
          margin-bottom: 16px;
          display: inline-block;
        }

        .plan-price-row {
          display: flex;
          align-items: baseline;
          gap: 12px;
        }

        .plan-price {
          font-size: 3.25rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--text);
          line-height: 1;
        }

        .plan-period {
          font-size: 1rem;
          color: var(--text-muted);
        }

        .plan-divider {
          height: 1px;
          background: var(--border);
          margin: 24px 0;
        }

        .plan-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 32px;
          flex: 1;
        }

        .plan-item {
          display: flex;
          gap: 14px;
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .plan-item.is-excluded {
          color: var(--text-muted);
          opacity: 0.5;
        }

        .plan-card-static {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 32px;
          height: 100%;
        }

        .plan-button {
          width: 100%;
          justify-content: center;
          font-size: 0.95rem;
          padding: 14px;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
          cursor: pointer;
          border-radius: 100vw;
        }

        .plan-button--primary {
          background: #D97706;
          color: #fff;
          border: 1px solid #D97706;
          font-weight: 600;
        }

        .plan-button--primary:hover {
          background: #B45309;
          border-color: #B45309;
        }

        .plan-button--ghost {
          background: transparent;
          color: var(--text);
          border: 1px solid var(--border);
        }

        .plan-button--ghost:hover {
          background: var(--bg-hover, rgba(255,255,255,0.04));
          border-color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .planes-grid-container {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .plan-card-content {
            padding: 32px 24px;
          }
          .plan-price {
            font-size: 2.75rem;
          }
        }
      `}</style>
    </section>
  )
}
