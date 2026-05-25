import { motion } from 'motion/react'
import { useState, useEffect } from 'react'
import TiltCard from '@/components/TiltCard'
import BorderGlow from '@/components/BorderGlow/BorderGlow'
import SplitText from '../animations/SplitText'

const ease = [0.16, 1, 0.3, 1] as const

type Paso = {
  num: string
  title: string
  desc: string
  glowColor: string
  colors: string[]
  startAngle: number
  sweepDirection?: -1 | 1
}

const BLUE_GLOW = '213 94 68'
const BLUE_COLORS = ['#60a5fa', '#3b82f6', '#93c5fd']
const AMBER_GLOW = '38 92 50'
const AMBER_COLORS = ['#f59e0b', '#d97706', '#fcd34d']

const pasosPlan: Paso[] = [
  {
    num: '01',
    title: 'Eliges tu plan',
    desc: 'Te registras, eliges Esencial o Completo y nos cuentas de tu negocio: marca, servicios, horarios y a quién atiendes.',
    glowColor: BLUE_GLOW,
    colors: BLUE_COLORS,
    startAngle: 135,
    sweepDirection: -1,
  },
  {
    num: '02',
    title: 'Diseño a la medida',
    desc: 'Diseñamos tu web con tu identidad y te la presentamos para que la apruebes antes de publicarla.',
    glowColor: BLUE_GLOW,
    colors: BLUE_COLORS,
    startAngle: 225,
  },
  {
    num: '03',
    title: 'Configuración',
    desc: 'Cargamos tu información en el CRM/agenda, conectamos WhatsApp y Google Calendar y dejamos todo listo para operar.',
    glowColor: BLUE_GLOW,
    colors: BLUE_COLORS,
    startAngle: 45,
  },
  {
    num: '04',
    title: 'A operar',
    desc: 'Publicamos tu sitio y empiezas a recibir reservas. Hosting, soporte y mantenimiento siempre incluidos.',
    glowColor: BLUE_GLOW,
    colors: BLUE_COLORS,
    startAngle: 315,
    sweepDirection: -1,
  },
]

const pasosCustom: Paso[] = [
  {
    num: '01',
    title: 'Brief',
    desc: 'Nos reunimos contigo. Entendemos qué quieres construir, para quién y en cuánto tiempo.',
    glowColor: AMBER_GLOW,
    colors: AMBER_COLORS,
    startAngle: 135,
    sweepDirection: -1,
  },
  {
    num: '02',
    title: 'Propuesta',
    desc: 'Te entregamos un documento con el alcance, diseño preliminar y presupuesto en menos de 48 horas.',
    glowColor: AMBER_GLOW,
    colors: AMBER_COLORS,
    startAngle: 225,
  },
  {
    num: '03',
    title: 'Desarrollo',
    desc: 'Iteraciones rápidas con comunicación directa. Ves avances reales durante todo el proceso.',
    glowColor: AMBER_GLOW,
    colors: AMBER_COLORS,
    startAngle: 45,
  },
  {
    num: '04',
    title: 'Entrega',
    desc: 'Despliegue, documentación y soporte post-entrega. No desaparecemos después de entregar.',
    glowColor: AMBER_GLOW,
    colors: AMBER_COLORS,
    startAngle: 315,
    sweepDirection: -1,
  },
]

function Track({ pasos, isMobile, indexOffset = 0 }: { pasos: Paso[]; isMobile: boolean; indexOffset?: number }) {
  return (
    <div className="proceso-grid proceso-grid--stack">
      {pasos.map((p, i) => (
        <motion.div
          key={p.num}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease, delay: i * 0.08 }}
        >
          <TiltCard amplitude={10} scaleOnHover={1.04} style={{ height: '100%' }} disabled={isMobile}>
            <BorderGlow
              glowColor={p.glowColor}
              colors={p.colors}
              backgroundColor="var(--bg-surface)"
              borderRadius={12}
              glowRadius={isMobile ? 30 : 70}
              edgeSensitivity={5}
              glowIntensity={isMobile ? 1.2 : 3}
              coneSpread={30}
              autoLoop={true}
              loopDelay={isMobile ? 2000 : 1000}
              initialDelay={(indexOffset + i) * 800}
              startAngle={p.startAngle}
              sweepDirection={p.sweepDirection ?? 1}
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
  )
}

export default function Proceso() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 600)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 600)
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section className="section proceso-section">
      <div className="container">
        <SplitText
          text="Proceso"
          className="section-label"
          delay={50}
          duration={0.8}
          tag="p"
        />

        <div className="proceso-tracks">
          <div className="proceso-track proceso-track--plan">
            <div className="proceso-track-header">
              <div className="proceso-track-eyebrow">
                <span className="proceso-track-eyebrow-bar" aria-hidden="true" />
                <span className="proceso-track-eyebrow-text">Si eliges un plan</span>
              </div>
              <h3 className="proceso-track-title">
                Esencial o Completo — incluye web a la medida
              </h3>
              <p className="proceso-track-sub">
                Aunque sea un servicio en suscripción, tu sitio se diseña, se aprueba y se publica con tu identidad.
              </p>
            </div>
            <Track pasos={pasosPlan} isMobile={isMobile} indexOffset={0} />
          </div>

          <div className="proceso-track-divider" aria-hidden="true" />

          <div className="proceso-track proceso-track--custom">
            <div className="proceso-track-header">
              <div className="proceso-track-eyebrow">
                <span className="proceso-track-eyebrow-bar" aria-hidden="true" />
                <span className="proceso-track-eyebrow-text">Si necesitas algo a la medida</span>
              </div>
              <h3 className="proceso-track-title">
                Web, app, sistema, IoT o automatización
              </h3>
              <p className="proceso-track-sub">
                Cuando lo tuyo no entra en un plan: hardware, software o ambos — definimos alcance, cotizamos y construimos contigo.
              </p>
            </div>
            <Track pasos={pasosCustom} isMobile={isMobile} indexOffset={4} />
          </div>
        </div>
      </div>

      <style>{`
        .proceso-section .section-label {
          margin-bottom: 0;
        }

        .proceso-tracks {
          display: grid;
          grid-template-columns: 1fr 1px 1fr;
          gap: 48px;
          margin-top: 40px;
          align-items: start;
        }

        .proceso-track {
          min-width: 0;
          padding: 20px;
          border-radius: 16px;
          border: 1px solid transparent;
        }

        .proceso-track--plan {
          background: linear-gradient(180deg, rgba(59,130,246,0.06) 0%, rgba(59,130,246,0.01) 100%);
          border-color: rgba(59,130,246,0.18);
        }

        .proceso-track--custom {
          background: linear-gradient(180deg, rgba(217,119,6,0.07) 0%, rgba(217,119,6,0.01) 100%);
          border-color: rgba(217,119,6,0.22);
        }

        .proceso-grid--stack {
          grid-template-columns: 1fr !important;
          max-width: 100% !important;
          gap: 14px;
        }

        .proceso-track .proceso-card-content {
          padding: 18px 22px 20px;
          min-height: 0;
          gap: 6px;
        }

        .proceso-track-header {
          margin: 0 0 20px;
          text-align: left;
        }

        .proceso-track-eyebrow {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
        }

        .proceso-track-eyebrow-bar {
          display: block;
          width: 28px;
          height: 2px;
          background: currentColor;
        }

        .proceso-track-eyebrow-text {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          color: inherit;
        }

        .proceso-track--plan .proceso-track-eyebrow {
          color: #93c5fd;
        }

        .proceso-track--custom .proceso-track-eyebrow {
          color: #fbbf24;
        }

        .proceso-track-title {
          font-size: clamp(1.25rem, 2.2vw, 1.65rem);
          font-weight: 700;
          letter-spacing: -0.025em;
          color: var(--text);
          margin: 0 0 8px;
          line-height: 1.2;
        }

        .proceso-track-sub {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
        }

        .proceso-track-divider {
          width: 1px;
          background: var(--border);
          align-self: stretch;
          opacity: 0.5;
        }

        @media (max-width: 768px) {
          .proceso-track .proceso-card-content {
            padding: 16px 18px 18px;
            column-gap: 10px;
            row-gap: 8px;
          }
          .proceso-track .proceso-card-num {
            font-size: 0.95rem;
          }
          .proceso-track .proceso-card-title {
            font-size: 1.05rem;
          }
          .proceso-track .proceso-card-desc {
            font-size: 0.88rem;
            line-height: 1.55;
          }
        }

        @media (max-width: 900px) {
          .proceso-tracks {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .proceso-track-divider {
            width: auto;
            height: 1px;
            max-width: 480px;
            margin: 0 auto;
          }
          .proceso-track-header {
            text-align: center;
            margin-bottom: 18px;
          }
        }
      `}</style>
    </section>
  )
}
