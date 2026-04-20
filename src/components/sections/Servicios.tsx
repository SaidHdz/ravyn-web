import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import RotatingText from '@/components/RotatingText/RotatingText'

const ease = [0.16, 1, 0.3, 1] as const

const WA_HREF = 'https://wa.me/526441234567?text=Hola%2C%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20sus%20servicios'

const WhatsAppIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
)
const TAG_COLORS = ['blue', 'green', 'amber'] as const

const servicios = [
  {
    num: '01',
    title: 'Experiencias Web',
    desc: 'Mini-sitios personalizados para eventos, regalos digitales y páginas especiales. Cada entrega es única.',
    tags: ['React', 'Animaciones', 'Diseño custom'],
    price: 'desde $2,500 MXN',
  },
  {
    num: '02',
    title: 'Soluciones IoT',
    desc: 'Hardware + software a la medida para automatización, monitoreo remoto y control de procesos industriales.',
    tags: ['Embedded', 'Dashboards', 'Sensores'],
    price: 'desde $8,000 MXN',
  },
  {
    num: '03',
    title: 'Desarrollo Web & Apps',
    desc: 'Landing pages, sistemas internos y aplicaciones para negocios locales. Rápido de implementar, fácil de mantener.',
    tags: ['Web', 'Mobile', 'APIs'],
    price: 'desde $5,000 MXN',
  },
]

export default function Servicios() {
  const [active, setActive] = useState<number>(0)

  return (
    <section id="servicios" className="section">
      <div className="container">
        <motion.p
          className="section-label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4 }}
        >
          Servicios
        </motion.p>

        <div className="servicios-list">
          {servicios.map((s, i) => (
            <motion.div
              key={s.num}
              className={`servicio-item${active === i ? ' is-active' : ''}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, ease, delay: i * 0.08 }}
              onHoverStart={() => setActive(i)}
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

                <motion.span
                  className="servicio-title"
                  animate={active === i ? { scale: 1.04 } : { scale: 1 }}
                  transition={{ duration: 0.22, ease }}
                  style={{ display: 'inline-block', transformOrigin: 'left center' }}
                >
                  {s.title}
                </motion.span>

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
                  className="servicio-price"
                  animate={active === i ? { scale: 1.07 } : { scale: 1 }}
                  transition={{ duration: 0.22, ease }}
                  style={{ display: 'inline-block' }}
                >
                  {s.price}
                </motion.span>

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
                    animate={{ height: 'auto', opacity: 1, transition: { duration: 0.28, ease } }}
                    exit={{ height: 0, opacity: 0, transition: { duration: 0 } }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p className="servicio-desc-text">{s.desc}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <p className="servicios-rotating-text">
          Deja en nuestras manos tu{' '}
          <RotatingText
            texts={['web', 'app', 'sistema', 'automatización']}
            mainClassName="servicios-rotating-pill"
            splitLevelClassName="servicios-rotating-split"
            staggerFrom="last"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-120%' }}
            staggerDuration={0.025}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            rotationInterval={2000}
          />
        </p>

        <a
          href={WA_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="servicio-cta"
        >
          <span className="servicio-cta-label">
            <WhatsAppIcon />
            Quiero saber más
          </span>
        </a>
      </div>
    </section>
  )
}
