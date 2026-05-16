import { Globe, Calendar, Users, Star } from 'lucide-react'
import BlurText from '../animations/BlurText'
import SpotlightCard from '../animations/SpotlightCard'
import GradientText from '../animations/GradientText'
import { motion } from 'motion/react'

const ease = [0.16, 1, 0.3, 1] as const

const problemas = [
  {
    icon: <Globe className="w-6 h-6 text-blue-400" />,
    text: "Pacientes que no llegan a su cita y nunca avisaron",
    bgText: "FALTAS"
  },
  {
    icon: <Calendar className="w-6 h-6 text-green-400" />,
    text: "Tu recepcionista llamando uno por uno para confirmar",
    bgText: "TIEMPO"
  },
  {
    icon: <Users className="w-6 h-6 text-purple-400" />,
    text: "Pacientes que no saben dónde estás ni pueden agendar en línea",
    bgText: "PRESENCIA"
  },
  {
    icon: <Star className="w-6 h-6 text-amber-400" />,
    text: "Sin control de quién vino, qué se atendió ni cuándo regresa",
    bgText: "CONTROL"
  }
]

export default function RavynsetProblema() {
  return (
    <section className="section ravynset-problema-encapsulado">
      <div className="container">
        <div className="max-w-4xl mb-20 text-left">
          <BlurText
            text="¿Te suena familiar?"
            className="section-label"
            delay={50}
            animateBy="letters"
            direction="top"
          />
        </div>

        <div className="problemas-grid-encapsulado">
          {problemas.map((prob, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease, delay: i * 0.1 }}
            >
              <SpotlightCard 
                className="problema-card-encapsulada" 
                spotlightColor="rgba(96, 165, 250, 0.1)"
              >
                {/* Texto de fondo encapsulado solo en la tarjeta */}
                <span className="card-bg-text-encapsulado" aria-hidden="true">
                  {prob.bgText}
                </span>

                <div className="card-content-stats relative z-10">
                  <div className="problema-icon-wrapper-stats">{prob.icon}</div>
                  <p className="problema-text-stats">
                    {prob.text}
                  </p>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        <div className="solucion-wrapper mt-32">
          <div className="flex items-center gap-4 md:gap-6 flex-wrap justify-center">
            <GradientText
              colors={["#40ffaa", "#4ade80", "#40ffaa", "#22c55e", "#40ffaa"]}
              animationSpeed={3}
              showBorder={false}
              className="text-xl md:text-3xl font-bold text-center"
            >
              RavynSet resuelve todo eso — de forma automática.
            </GradientText>
          </div>
        </div>
      </div>

      <style>{`
        .ravynset-problema-encapsulado {
          position: relative;
          padding: 120px 0;
          background: transparent;
        }

        .problemas-grid-encapsulado {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          width: 100%;
        }

        .problema-card-encapsulada {
          position: relative;
          background: var(--bg-surface) !important;
          border: 1px solid var(--border) !important;
          padding: 48px 32px !important;
          border-radius: 24px !important;
          display: flex !important;
          flex-direction: column !important;
          min-height: 280px !important;
          justify-content: flex-start !important;
          overflow: hidden !important; 
          transition: all 0.3s ease !important;
        }

        .problema-card-encapsulada:hover {
          background: var(--bg-raised) !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
        }

        .card-bg-text-encapsulado {
          position: absolute;
          bottom: -10px;
          right: -10px;
          font-size: 5rem;
          font-weight: 900;
          line-height: 1;
          color: rgba(255, 255, 255, 0.03);
          white-space: nowrap;
          pointer-events: none;
          z-index: 0;
          letter-spacing: -0.04em;
          transform: rotate(-10deg);
          user-select: none;
        }

        .card-content-stats {
          display: flex;
          flex-direction: column;
          gap: 24px;
          height: 100%;
        }

        .problema-icon-wrapper-stats {
          width: 48px;
          height: 48px;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .problema-text-stats {
          font-size: 1.1rem;
          font-weight: 500;
          line-height: 1.5;
          color: var(--text-secondary);
        }

        .solucion-wrapper {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        @media (max-width: 1100px) {
          .problemas-grid-encapsulado {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .ravynset-problema-encapsulado {
            padding: 80px 0;
          }
          .problemas-grid-encapsulado {
            grid-template-columns: 1fr;
          }
          .problema-card-encapsulada {
            min-height: auto !important;
            padding: 40px 28px !important;
          }
          .card-bg-text-encapsulado {
            font-size: 4rem;
          }
        }
      `}</style>
    </section>
  )
}
