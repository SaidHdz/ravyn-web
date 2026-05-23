import { motion } from 'motion/react'
import { useState, useEffect } from 'react'
import Folder from '../animations/Folder'
import SplitText from '../animations/SplitText'
import ProjectModal from '../ProjectModal'

const ease = [0.16, 1, 0.3, 1] as const

const proyectos = [
  {
    id: 'ravynset',
    title: 'Ravynset',
    color: '#10b981', // Verde esmeralda para salud/automatización
    description: 'Sistema de gestión integral para clínicas que automatiza la agenda, recordatorios por WhatsApp y reputación en Google Maps.',
    problem: 'Pérdida constante de citas por inasistencia, carga administrativa excesiva en recepción y falta de presencia digital profesional.',
    solution: 'Implementación de agenda inteligente 24/7 sincronizada con WhatsApp, CRM de pacientes y motor automático de reseñas en Google.',
    result: 'Agendado 100% autónomo y gestión centralizada de pacientes mediante CRM, mejorando la organización de la clínica.',
    tech: ['React', 'n8n', 'WhatsApp API', 'Google Maps API', 'CRM'],
    images: [],
    papers: [
      <div className="paper-label">Caso de Éxito</div>,
      <div className="paper-label">Healthcare SaaS</div>,
      <div className="paper-label project-main-name">Ravynset</div>,
    ]
  },
  {
    id: 'shield-sense',
    title: 'Shield Sense',
    color: '#3b82f6',
    description: 'Wearable inteligente para la detección de impactos en adultos mayores, con alertas en tiempo real para cuidadores.',
    problem: 'Los adultos mayores sufren caídas y golpes en la cabeza sin que cuidadores o familiares sean notificados a tiempo, aumentando el riesgo de lesiones graves.',
    solution: 'Wearable integrado con sensores de impacto que detectan y miden la intensidad de los golpes, enviando alertas automáticas.',
    result: '1er Lugar Innovatec Local 2026 — Área de Salud.',
    tech: ['IoT', 'Sensores de impacto', 'App Móvil', 'Alertas en tiempo real', 'Expo', 'Three.js'],
    images: [
      '/projects/shield-sense/Home.jpg',
      '/projects/shield-sense/Alertas.jpg',
      '/projects/shield-sense/Ajustes.jpg'
    ],
    papers: [
      <div className="paper-label">Caso de Éxito</div>,
      <div className="paper-label">Innovatec Local — 1er Lugar</div>,
      <div className="paper-label project-main-name">Shield Sense</div>,
    ]
  },
  {
    id: 'klino',
    title: 'Klino',
    color: '#8b5cf6',
    description: 'Plataforma que digitaliza notas clínicas mediante voz durante la consulta médica, reduciendo el tiempo administrativo y permitiendo al médico enfocarse en el paciente.',
    problem: 'Los médicos destinan gran parte de su tiempo a escribir notas clínicas durante la consulta, reduciendo la atención al paciente y aumentando la carga administrativa.',
    solution: 'Plataforma que transcribe y digitaliza automáticamente las notas clínicas mediante voz durante la consulta, generando expedientes estructurados sin intervención manual.',
    result: '2do Lugar Innovatec Local 2026 — Área de Salud. 4 médicos en fase piloto reportaron menos tiempo dedicado a documentación, liberando más atención al paciente.',
    tech: ['Speech-to-Text', 'IA', 'Web App', 'Expediente Digital', 'Expo', 'n8n', 'Supabase'],
    images: [
      '/projects/klino/Home.jpg',
      '/projects/klino/Expedientes.jpg',
      '/projects/klino/Hardware.jpg',
      '/projects/klino/Ajustes.jpg'
    ],
    papers: [
      <div className="paper-label">Caso de Éxito</div>,
      <div className="paper-label">Innovatec Local — 2do Lugar</div>,
      <div className="paper-label project-main-name">Klino</div>,
    ]
  }
]

export default function Proyectos() {
  const [isMobile, setIsMobile] = useState(false)
  const [selectedProject, setSelectedProject] = useState<typeof proyectos[0] | null>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <section id="proyectos" className="section projects-section-custom">
      <div className="container">
        <SplitText
          text="Nuestros Proyectos"
          className="section-label"
          delay={50}
          duration={0.8}
          tag="p"
        />

        <div className="proyectos-grid">
          {proyectos.map((p, i) => (
            <motion.div
              key={p.id}
              className="proyecto-folder-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease, delay: i * 0.15 }}
            >
              <div className="folder-container">
                <Folder 
                  color={p.color} 
                  size={isMobile ? 1.4 : 2.2} 
                  items={p.papers}
                  isOpen={selectedProject?.id === p.id}
                  onToggle={(isOpen) => {
                    if (isOpen) setSelectedProject(p)
                    else setSelectedProject(null)
                  }}
                />
                <motion.h3 
                  className="proyecto-title-under"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  {p.title}
                </motion.h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ProjectModal 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
        project={selectedProject}
      />

      <style>{`
        .projects-section-custom {
          overflow: visible;
          padding-top: 160px;
        }

        @media (max-width: 768px) {
          .projects-section-custom {
            padding-top: 40px;
          }
        }

        .proyectos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 160px 40px;
          margin-top: 200px;
          justify-items: center;
          padding-bottom: 80px;
        }

        .folder-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
          position: relative;
        }

        .proyecto-title-under {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-secondary);
          letter-spacing: -0.01em;
          margin-top: 20px;
        }

        .paper-label {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-sans);
          font-size: 10px;
          font-weight: 700;
          color: #1a1a1a;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 10px;
          text-align: center;
        }

        .project-main-name {
          color: var(--accent);
          font-size: 12px;
        }

        @media (max-width: 768px) {
          .proyectos-grid {
            grid-template-columns: 1fr;
            gap: 120px 20px;
            margin-top: 40px;
          }
          .proyecto-title-under {
            font-size: 1rem;
          }
        }
      `}</style>
    </section>
  )
}
