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
    description: 'CRM para clínicas que centraliza la gestión de citas y pacientes en un solo lugar, con agenda inteligente y comunicación automática por WhatsApp.',
    problem: 'La gestión de citas y pacientes vive dispersa entre cuadernos, WhatsApp del recepcionista y hojas de Excel. Las clínicas pierden tiempo, citas y seguimiento de pacientes por no tener un sistema central.',
    solution: 'Un CRM diseñado específicamente para clínicas: agenda 24/7 sincronizada con WhatsApp, expedientes de pacientes centralizados y motor automático de reseñas en Google Maps para construir reputación digital sin esfuerzo manual.',
    result: 'Plataforma diseñada para resolver los puntos reales de fricción en la operación diaria de una clínica.',
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
    description: 'Wearable IoT integrado en un gorro que detecta impactos en la cabeza de adultos mayores y alerta al cuidador en tiempo real.',
    problem: 'Los golpes en la cabeza son la lesión más peligrosa en caídas de adultos mayores, pero los wearables tradicionales (relojes, pulseras) detectan el movimiento del cuerpo, no el impacto real en el cráneo. Cuando un cuidador se entera, ya pasaron minutos críticos.',
    solution: 'Sensores de impacto colocados directamente sobre la cabeza, integrados de forma discreta en un gorro. Detectan la intensidad del golpe y envían la alerta vía Bluetooth al celular del cuidador — funciona sin internet, ideal para hogares y zonas con conectividad limitada.',
    result: '1er Lugar Innovatec Local 2026 — Área de Salud. Prototipo funcional reconocido por jurado médico y técnico como solución diferenciada frente a wearables convencionales.',
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
    description: 'App móvil que transcribe la consulta médica por voz y genera la nota clínica estructurada conforme a NOM-004 y NOM-024, sin escritura manual.',
    problem: 'El médico pasa gran parte de la consulta escribiendo en lugar de mirar al paciente. La documentación clínica es obligatoria por normativa, pero le roba al médico lo más valioso: la atención.',
    solution: 'Klino escucha la consulta y genera automáticamente la nota clínica completa — antecedentes personales, familiares patológicos y no patológicos, exploración física — en formato estructurado conforme a NOM-004 y NOM-024. El médico habla con su paciente; Klino documenta.',
    result: '2do Lugar Innovatec Local 2026 — Área de Salud. Piloto en curso con médicos, con análisis de impacto en tiempo de documentación y calidad de la nota clínica.',
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
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
          margin-top: 120px;
          justify-items: center;
          padding-bottom: 80px;
        }

        @media (max-width: 1024px) {
          .proyectos-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 120px 40px;
          }
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
