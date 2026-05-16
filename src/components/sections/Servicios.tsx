import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import SplitText from '../animations/SplitText'

const ease = [0.16, 1, 0.3, 1] as const

const TAG_COLORS = ['blue', 'green', 'amber'] as const

const servicios = [
  {
    num: '01',
    title: 'Desarrollo Web & Apps',
    desc: 'Landing pages, sitios corporativos y aplicaciones web a medida. Rápido de implementar, fácil de mantener y diseñado para convertir.',
    tags: ['React', 'Next.js', 'Diseño custom'],
    value: 'Desde 6,000 MXN',
  },
  {
    num: '02',
    title: 'Soluciones IoT',
    desc: 'Hardware + software a la medida para automatización, monitoreo remoto y control de procesos industriales.',
    tags: ['Embebidos', 'Dashboards', 'Sensores'],
    value: 'Desde 8,000 MXN',
  },
  {
    num: '03',
    title: 'Sistemas de Gestión Personalizados',
    desc: 'Plataformas internas para administrar tu negocio: inventarios, clientes, reportes y flujos de trabajo automatizados.',
    tags: ['Web', 'APIs', 'Automatización'],
    value: 'Desde 10,000 MXN',
  },
]

export default function Servicios() {
  const [active, setActive] = useState<number>(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(!window.matchMedia('(hover: hover)').matches)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

        <div className="servicios-list">
          {servicios.map((s, i) => (
            <motion.div
              key={s.num}
              className={`servicio-item${active === i ? ' is-active' : ''}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, ease, delay: i * 0.08 }}
              onHoverStart={() => !isMobile && setActive(i)}
              onClick={() => setActive(active === i ? -1 : i)}
            >
              <div className="servicio-row">
                <motion.span
                  className="servicio-num"
                  animate={active === i ? { scale: 1.25 } : { scale: 1 }}
                  transition={{ duration: 0.22, ease }}
                  style={{ display: 'inline-block', transformOrigin: 'left center' }}
                >
                  {s.num}
                </motion.span>

                <div className="servicio-title-group">
                  <motion.span
                    className="servicio-title"
                    animate={active === i ? { scale: 1.04 } : { scale: 1 }}
                    transition={{ duration: 0.22, ease }}
                    style={{ display: 'inline-block', transformOrigin: 'left center' }}
                  >
                    {s.title}
                  </motion.span>

                  <motion.span
                    className="servicio-price font-mono text-[0.7rem] uppercase tracking-wider"
                    animate={active === i ? { scale: 1.07, color: 'var(--text)' } : { scale: 1, color: '#fff' }}
                    transition={{ duration: 0.22, ease }}
                    style={{ display: 'inline-block' }}
                  >
                    {s.value}
                  </motion.span>
                </div>

                <span className="servicio-line" aria-hidden="true" />

                <span className="servicio-tags-row">
                  {s.tags.map((tag, ti) => (
                    <span
                      key={tag}
                      className={`tag-pill tag-pill--${TAG_COLORS[ti % TAG_COLORS.length]}`}
                    >
                      {tag}
                    </span>
                  ))}
                </span>

                <motion.span
                  className="servicio-arrow"
                  animate={active === i ? { x: 5 } : { x: 0 }}
                  transition={{ duration: 0.22, ease }}
                >
                  →
                </motion.span>
              </div>

              <AnimatePresence initial={false}>
                {active === i && (
                  <motion.div
                    className="servicio-desc-expand"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: 'auto', 
                      opacity: 1, 
                      transition: { height: { duration: 0.4, ease }, opacity: { duration: 0.25, delay: 0.1 } } 
                    }}
                    exit={{ 
                      height: 0, 
                      opacity: 0, 
                      transition: { height: { duration: 0.35, ease }, opacity: { duration: 0.2 } } 
                    }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="servicio-desc-tags">
                      {s.tags.map((tag, ti) => (
                        <span
                          key={tag}
                          className={`tag-pill tag-pill--${TAG_COLORS[ti % TAG_COLORS.length]}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="servicio-desc-text">{s.desc}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        .servicios-section-custom {
          padding-bottom: 40px;
          min-height: 850px; /* Altura mínima aumentada para estabilizar */
        }
        .servicios-list {
          min-height: 600px; /* Altura mínima para la lista */
        }
        @media (max-width: 1024px) {
          .servicios-section-custom {
            min-height: 950px;
          }
        }
        @media (max-width: 768px) {
          .servicios-section-custom {
            min-height: auto;
          }
        }
      `}</style>
    </section>
  )
}
