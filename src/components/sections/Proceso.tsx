import { motion } from 'motion/react'
import TiltCard from '@/components/TiltCard'
import BorderGlow from '@/components/BorderGlow/BorderGlow'

const ease = [0.16, 1, 0.3, 1] as const

const pasos = [
  {
    num: '01',
    title: 'Brief',
    desc: 'Nos reunimos contigo. Entendemos qué quieres construir, para quién y en cuánto tiempo.',
    glowColor: '213 94 68',
    colors: ['#60a5fa', '#3b82f6', '#93c5fd'],
  },
  {
    num: '02',
    title: 'Propuesta',
    desc: 'Te entregamos un documento con el alcance, diseño preliminar y presupuesto en menos de 48 horas.',
    glowColor: '142 71 65',
    colors: ['#4ade80', '#22c55e', '#86efac'],
  },
  {
    num: '03',
    title: 'Desarrollo',
    desc: 'Iteraciones rápidas con comunicación directa. Ves avances reales durante todo el proceso.',
    glowColor: '38 92 50',
    colors: ['#f59e0b', '#d97706', '#fcd34d'],
  },
  {
    num: '04',
    title: 'Entrega',
    desc: 'Despliegue, documentación y soporte post-entrega. No desaparecemos después de entregar.',
    glowColor: '252 87 77',
    colors: ['#a78bfa', '#8b5cf6', '#c4b5fd'],
  },
]

export default function Proceso() {
  return (
    <section className="section proceso-section">
      <div className="container">
        <motion.p
          className="section-label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4 }}
        >
          Proceso
        </motion.p>

        <div className="proceso-grid">
          {pasos.map((p, i) => (
            <motion.div
              key={p.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease, delay: i * 0.08 }}
            >
              <TiltCard amplitude={10} scaleOnHover={1.04} style={{ height: '100%' }}>
                <BorderGlow
                  glowColor={p.glowColor}
                  colors={p.colors}
                  backgroundColor="var(--bg-surface)"
                  borderRadius={12}
                  glowRadius={70}
                  edgeSensitivity={5}
                  glowIntensity={3}
                  coneSpread={30}
                >
                  <div className="proceso-card-content">
                    <span className="proceso-card-num">{p.num}</span>
                    <h3 className="proceso-card-title">{p.title}</h3>
                    <p className="proceso-card-desc">{p.desc}</p>
                  </div>
                </BorderGlow>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
