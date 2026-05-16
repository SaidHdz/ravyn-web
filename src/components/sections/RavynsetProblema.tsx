import { motion } from 'motion/react'
import { Globe, Calendar, Users, Star, CheckCircle2 } from 'lucide-react'
import BlurText from '../animations/BlurText'
import SpotlightCard from '../animations/SpotlightCard'
import GradientText from '../animations/GradientText'

const ease = [0.16, 1, 0.3, 1] as const

const problemas = [
  {
    icon: <Globe className="w-6 h-6 text-blue-400" />,
    text: "Pacientes que no llegan a su cita y nunca avisaron"
  },
  {
    icon: <Calendar className="w-6 h-6 text-green-400" />,
    text: "Tu recepcionista llamando uno por uno para confirmar"
  },
  {
    icon: <Users className="w-6 h-6 text-purple-400" />,
    text: "Pacientes que no saben dónde estás ni pueden agendar en línea"
  },
  {
    icon: <Star className="w-6 h-6 text-amber-400" />,
    text: "Sin control de quién vino, qué se atendió ni cuándo regresa"
  }
]

export default function RavynsetProblema() {
  return (
    <section className="section ravynset-problema">
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

        <div className="problemas-grid-container">
          {problemas.map((prob, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease, delay: i * 0.1 }}
            >
              <SpotlightCard 
                className="problema-card-spotlight" 
                spotlightColor="rgba(96, 165, 250, 0.2)"
              >
                <div className="problema-icon-wrapper">{prob.icon}</div>
                <p className="text-base lg:text-lg text-white/90 font-medium leading-snug">
                  {prob.text}
                </p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        <div className="solucion-wrapper">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="flex items-center gap-4 md:gap-6 flex-wrap justify-center"
          >
            <GradientText
              colors={["#40ffaa", "#4ade80", "#40ffaa", "#22c55e", "#40ffaa"]}
              animationSpeed={3}
              showBorder={false}
              className="text-lg md:text-3xl font-bold text-center"
            >
              RavynSet resuelve todo eso — de forma automática.
            </GradientText>
          </motion.div>
        </div>
      </div>

      <style>{`
        .ravynset-problema {
          position: relative;
          padding: 120px 0;
          background: transparent;
        }

        .problemas-grid-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          width: 100%;
          margin-top: 60px;
          margin-bottom: 60px;
        }

        .solucion-wrapper {
          display: flex;
          justify-content: center;
          width: 100%;
          margin-top: 40px;
          padding: 0 20px;
        }

        .problema-card-spotlight {
          background: var(--bg-surface) !important;
          border: 1px solid var(--border) !important;
          padding: 40px 32px !important;
          border-radius: 24px !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 24px !important;
          transition: background 0.3s ease !important;
          min-height: 280px !important;
          justify-content: flex-start !important;
          width: 100% !important;
          --spotlight-color: rgba(96, 165, 250, 0.15) !important;
        }

        .problema-card-spotlight:hover {
          background: var(--bg-raised) !important;
        }

        .problema-icon-wrapper {
          width: 48px;
          height: 48px;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        @media (max-width: 1024px) {
          .problemas-grid-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .ravynset-problema {
            padding: 80px 0;
          }
          .problemas-grid-container {
            grid-template-columns: 1fr;
            margin-top: 40px;
            margin-bottom: 40px;
          }
          .problema-card-spotlight {
            min-height: auto !important;
            padding: 32px 24px !important;
          }
        }
      `}</style>
    </section>
  )
}
