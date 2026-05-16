import { motion } from 'motion/react'
import { useState, useEffect } from 'react'
import TiltCard from '@/components/TiltCard'
import BorderGlow from '@/components/BorderGlow/BorderGlow'
import BlurText from '../animations/BlurText'

const ease = [0.16, 1, 0.3, 1] as const

const pasos = [
  {
    num: '01',
    title: 'Confirmas',
    desc: 'Eliges tu plan y nos escribes por WhatsApp o el formulario de contacto. Te respondemos el mismo día.',
    glowColor: '213 94 68',
    colors: ['#60a5fa', '#3b82f6', '#93c5fd'],
    startAngle: 135,
    sweepDirection: -1 as const,
  },
  {
    num: '02',
    title: 'Kickoff',
    desc: 'Una sesión de 30 minutos. Nos compartes tu logo, colores, servicios y datos de tu clínica. Eso es todo lo que necesitamos.',
    glowColor: '142 71 65',
    colors: ['#4ade80', '#22c55e', '#86efac'],
    startAngle: 225,
  },
  {
    num: '03',
    title: 'Construimos',
    desc: 'En 2 a 4 semanas tu web, CRM y automatizaciones quedan listos y probados. Tú solo esperas.',
    glowColor: '38 92 50',
    colors: ['#f59e0b', '#d97706', '#fcd34d'],
    startAngle: 45,
  },
  {
    num: '04',
    title: 'Go live',
    desc: 'Lanzamos juntos. Las primeras 2 semanas tienes soporte prioritario por si surge cualquier ajuste.',
    glowColor: '252 87 77',
    colors: ['#a78bfa', '#8b5cf6', '#c4b5fd'],
    startAngle: 315,
    sweepDirection: -1 as const,
  },
]

export default function RavynsetProceso() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 600)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 600)
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section id="proceso" className="section ravynset-proceso overflow-hidden">
      <div className="container">
        <div className="mb-20 text-left">
          <BlurText
            text="Proceso"
            className="section-label"
            delay={50}
            animateBy="letters"
            direction="top"
          />
        </div>

        <div className="proceso-grid-fixed">
          {pasos.map((p, i) => (
            <motion.div
              key={p.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease, delay: i * 0.08 }}
              className="proceso-card-wrapper-fixed"
            >
              <TiltCard amplitude={10} scaleOnHover={1.04} style={{ height: '100%' }} disabled={isMobile}>
                  <BorderGlow
                    glowColor={p.glowColor}
                    colors={p.colors}
                    backgroundColor="var(--bg-surface)"
                    borderRadius={24}
                    glowRadius={isMobile ? 30 : 70}
                    edgeSensitivity={5}
                    glowIntensity={isMobile ? 1.2 : 3}
                    coneSpread={30}
                    autoLoop={true}
                    loopDelay={isMobile ? 2000 : 1000}
                    initialDelay={i * 800}
                    startAngle={p.startAngle}
                    sweepDirection={p.sweepDirection ?? 1}
                  >
                  <div className="proceso-card-content-minimal">
                    <span className="proceso-card-num-huge">{p.num}</span>
                    <h3 className="proceso-card-title-new">{p.title}</h3>
                    <p className="proceso-card-desc-new">{p.desc}</p>
                  </div>
                </BorderGlow>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        .ravynset-proceso {
          padding: 120px 0 160px;
          background: transparent;
        }

        .proceso-grid-fixed {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          width: 100%;
        }

        .proceso-card-content-minimal {
          padding: 40px 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          height: 100%;
          min-height: 280px; /* Reducido de 380px para evitar espacio muerto */
          position: relative;
        }

        .proceso-card-num-huge {
          font-family: var(--font-sans);
          font-size: 3.5rem;
          font-weight: 900;
          line-height: 1;
          color: var(--text);
          opacity: 0.05;
          position: absolute;
          top: 20px;
          right: 20px;
        }

        .proceso-card-title-new {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.02em;
        }

        .proceso-card-desc-new {
          font-size: 1rem;
          line-height: 1.6;
          color: var(--text-secondary);
        }

        @media (max-width: 1100px) {
          .proceso-grid-fixed {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .proceso-grid-fixed {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .proceso-card-content-minimal {
            min-height: auto;
            padding: 32px 24px;
          }
        }
      `}</style>
    </section>
  )
}
