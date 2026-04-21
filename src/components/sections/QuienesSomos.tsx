import { motion } from 'motion/react'
import CountUp from '../CountUp/CountUp'
import LogoLoop from '../animations/LogoLoop'
import SplitText from '../animations/SplitText'

const ease = [0.16, 1, 0.3, 1] as const

const techLogos = [
  { src: 'https://cdn.simpleicons.org/tailwindcss/white', alt: 'Tailwind CSS' },
  { src: 'https://cdn.simpleicons.org/astro/white', alt: 'Astro' },
  { src: 'https://cdn.simpleicons.org/react/white', alt: 'React' },
  { src: 'https://cdn.simpleicons.org/n8n/white', alt: 'n8n' },
]

const stats = [
  { type: 'countup', to: 100, suffix: '%', label: 'tasa de éxito' },
  { type: 'countup', prefix: '< ', to: 48, suffix: 'h', label: 'tiempo de respuesta', highlight: true },
  { type: 'countup', prefix: '+', to: 500, suffix: 'h', label: 'de automatización' },
]

export default function QuienesSomos() {
  return (
    <section className="section quienes-section">
      <div className="container">
        <SplitText
          text="Nosotros"
          className="section-label"
          delay={50}
          duration={0.8}
          tag="p"
        />
        <div className="quienes-layout">
          <motion.h2
            className="quienes-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease }}
          >
            Hacemos lo que<br />
            otros explican<br />
            <em>en PowerPoint.</em>
          </motion.h2>
          <motion.div
            className="quienes-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease, delay: 0.1 }}
          >
            <p>
              Un equipo enfocado, no disperso. Trabajamos directo con quien nos contrata — sin intermediarios. Si ya sabes lo que quieres construir, perfecto. Si solo sabes qué problema tienes, también.
            </p>
          </motion.div>
        </div>
        
        <div className="mt-16 mb-12">
          <LogoLoop 
            logos={techLogos} 
            speed={60} 
            direction="left" 
            logoHeight={40} 
            gap={80} 
            fadeOut={true}
            fadeOutColor="var(--bg)"
          />
        </div>

        <motion.p
          className="quienes-closing"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease, delay: 0.2 }}
        >
          <strong><em>De la idea al producto.</em></strong>
        </motion.p>
      </div>
      <div className="quienes-stats-strip">
        <div className="container">
          <div className="quienes-stats">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className="quienes-stat"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, ease, delay: 0.1 + i * 0.08 }}
              >
                <span className={`quienes-stat-value ${s.highlight ? 'text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]' : ''}`}>
                  {s.type === 'countup' ? (
                    <>
                      {s.prefix}
                      <CountUp from={0} to={s.to!} duration={1.8} />
                      {s.suffix}
                    </>
                  ) : (
                    s.value
                  )}
                </span>
                <span className="quienes-stat-label">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
