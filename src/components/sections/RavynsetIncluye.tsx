import { motion } from 'motion/react'
import MagicBento from '../animations/MagicBento'
import { Globe, Calendar, Users, Star } from 'lucide-react'
import BlurText from '../animations/BlurText'

const ease = [0.16, 1, 0.3, 1] as const

const funcionalidades = [
  {
    icon: <Globe className="w-6 h-6 text-blue-400" />,
    title: "Web de autoridad",
    description: "Diseño personalizado con tu identidad, SEO local para aparecer en Google y formulario de agendamiento integrado. Tu primera impresión, profesional desde el día uno.",
    label: "Identidad"
  },
  {
    icon: <Calendar className="w-6 h-6 text-green-400" />,
    title: "Agenda inteligente",
    description: "Tus pacientes agendan 24/7 desde tu web. Confirmaciones y recordatorios por WhatsApp automáticos. Sincronización directa con tu Google Calendar — tu agenda de siempre, solo mejorada.",
    label: "Automatización"
  },
  {
    icon: <Users className="w-6 h-6 text-purple-400" />,
    title: "CRM completo",
    description: "Panel de control con todas tus citas, historial de pacientes, creación y modificación de citas, recordatorios manuales cuando los necesites y gestión de usuarios para tu equipo.",
    label: "Gestión"
  },
  {
    icon: <Star className="w-6 h-6 text-amber-400" />,
    title: "Motor de reputación",
    description: "Mensaje automático de agradecimiento al paciente tras su visita, con invitación directa a dejar su reseña en Google Maps. Más reseñas reales, más pacientes nuevos.",
    label: "Reputación"
  }
]

export default function RavynsetIncluye() {
  return (
    <section className="section ravynset-incluye">
      <div className="container">
        <div className="max-w-4xl mb-24 text-left">
          <BlurText
            text="Conoce RavynSet"
            className="section-label"
            delay={50}
            animateBy="letters"
            direction="top"
          />
        </div>

        <div className="magic-bento-wrapper ravynset-bento">
          <MagicBento 
            items={funcionalidades}
            enableSpotlight={true}
            enableBorderGlow={true}
            glowColor="96, 165, 250"
          />
        </div>
      </div>

      <style>{`
        .ravynset-incluye {
          padding: 120px 0;
          background: transparent;
        }
        
        .magic-bento-wrapper {
          position: relative;
          z-index: 1;
        }

        /* Layout personalizado: 3 arriba, 1 largo abajo */
        @media (min-width: 1024px) {
          .ravynset-bento .card-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }

          /* Solo para las 3 de arriba */
          .ravynset-bento .magic-bento-card:nth-child(-n+3) {
            aspect-ratio: 4/5 !important;
            min-height: 320px !important;
          }

          .ravynset-bento .magic-bento-card:nth-child(1) {
            grid-column: 1 !important;
            grid-row: 1 !important;
          }
          .ravynset-bento .magic-bento-card:nth-child(2) {
            grid-column: 2 !important;
            grid-row: 1 !important;
          }
          .ravynset-bento .magic-bento-card:nth-child(3) {
            grid-column: 3 !important;
            grid-row: 1 !important;
          }

          /* Tarjeta larga de abajo */
          .ravynset-bento .magic-bento-card:nth-child(4) {
            grid-column: 1 / span 3 !important;
            grid-row: 2 !important;
            aspect-ratio: auto !important;
            min-height: 180px !important;
          }
        }

        @media (max-width: 768px) {
          .ravynset-incluye {
            padding: 80px 0;
          }
        }
      `}</style>
    </section>
  )
}
