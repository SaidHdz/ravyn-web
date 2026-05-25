import { motion } from 'motion/react'
import BorderGlow from '../BorderGlow/BorderGlow'

const ease = [0.16, 1, 0.3, 1] as const

export default function SolucionPersonalizada() {
  return (
    <section className="section solucion-personalizada-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          <BorderGlow
            glowColor="45 100 60"
            colors={['#F59E0B', '#D97706', '#FBBF24']}
            backgroundColor="var(--bg-surface)"
            borderRadius={20}
            glowRadius={40}
            edgeSensitivity={20}
            glowIntensity={1}
            animated={true}
          >
            <div className="custom-card">
              <div className="custom-text">
                <h3 className="custom-title">¿Necesitas una solución personalizada?</h3>
                <p className="custom-subtitle">
                  Si tu negocio requiere algo distinto a nuestros planes, agendemos una reunión: definimos juntos el alcance, te entregamos una propuesta y cotización a la medida.
                </p>
              </div>
              <a href="#contacto" className="custom-cta">
                Agendar reunión →
              </a>
            </div>
          </BorderGlow>
        </motion.div>
      </div>

      <style>{`
        .solucion-personalizada-section {
          padding: 40px 0 20px;
        }

        .custom-card {
          padding: 28px 36px;
          display: flex;
          align-items: center;
          gap: 32px;
          justify-content: space-between;
        }

        .custom-text {
          flex: 1;
          min-width: 0;
        }

        .custom-title {
          font-family: var(--font-sans);
          font-size: clamp(1.15rem, 1.8vw, 1.5rem);
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin: 0 0 6px;
        }

        .custom-subtitle {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
          max-width: 640px;
        }

        .custom-cta {
          background: #D97706;
          color: #fff;
          padding: 12px 24px;
          border-radius: 100vw;
          font-size: 0.95rem;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.2s ease;
          box-shadow: 0 6px 20px -6px rgba(217, 119, 6, 0.5);
          flex-shrink: 0;
        }

        .custom-cta:hover {
          background: #B45309;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .custom-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
            padding: 24px;
          }
          .custom-cta {
            width: 100%;
            text-align: center;
            padding: 14px 24px;
          }
        }
      `}</style>
    </section>
  )
}
