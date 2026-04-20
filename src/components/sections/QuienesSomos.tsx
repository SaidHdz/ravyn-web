import { motion } from 'motion/react'
import CountUp from '../CountUp/CountUp'

const ease = [0.16, 1, 0.3, 1] as const

const stats = [
  { type: 'countup', to: 10, suffix: '+', label: 'proyectos entregados' },
  { type: 'text', value: '< 48h', label: 'tiempo de respuesta' },
  { type: 'countup', to: 4, suffix: '', label: 'servicios especializados' },
]

export default function QuienesSomos() {
  return (
    <section className="section quienes-section">
      <div className="container">
        <motion.p
          className="section-label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4 }}
        >
          Nosotros
        </motion.p>
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
                <span className="quienes-stat-value">
                  {s.type === 'countup'
                    ? <><CountUp from={0} to={s.to!} duration={1.8} />{s.suffix}</>
                    : s.value
                  }
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
