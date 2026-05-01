import { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  project: {
    title: string
    color: string
    description: string
    tech: string[]
    image?: string
  } | null
}

const ease = [0.16, 1, 0.3, 1] as const

export default function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!project) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="project-modal-overlay">
          <motion.div 
            className="project-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div 
            className="project-modal-content"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.5, ease }}
          >
            <button className="modal-close-btn" onClick={onClose}>
              <X size={20} />
            </button>

            <div className="modal-inner">
              <div className="modal-header">
                <div className="modal-tag" style={{ color: project.color }}>PROYECTO SELECCIONADO</div>
                <h2 className="modal-title">{project.title}</h2>
              </div>

              <div className="modal-body">
                <div className="modal-info">
                  <p className="modal-description">{project.description}</p>
                  
                  <div className="modal-tech-section">
                    <h4 className="tech-heading">Tecnologías</h4>
                    <div className="tech-stack">
                      {project.tech.map(t => (
                        <span key={t} className="tech-pill">{t}</span>
                      ))}
                    </div>
                  </div>

                  <button className="visit-btn" style={{ '--btn-color': project.color } as any}>
                    <span>Ver caso de estudio</span>
                    <div className="visit-btn-bg" />
                  </button>
                </div>

                <div className="modal-visual">
                  <div className="mockup-placeholder" style={{ borderColor: `${project.color}40` }}>
                    <div className="mockup-content">
                       <span style={{ opacity: 0.3 }}>Visualización del Proyecto</span>
                    </div>
                    <div className="mockup-glow" style={{ background: `radial-gradient(circle at 50% 50%, ${project.color}20 0%, transparent 70%)` }} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <style>{`
            .project-modal-overlay {
              position: fixed;
              inset: 0;
              z-index: 1000;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }

            .project-modal-backdrop {
              position: absolute;
              inset: 0;
              background: rgba(10, 10, 10, 0.85);
              backdrop-filter: blur(12px);
              -webkit-backdrop-filter: blur(12px);
            }

            .project-modal-content {
              position: relative;
              width: 100%;
              max-width: 900px;
              background: #141414;
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 24px;
              overflow: hidden;
              box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6);
            }

            .modal-close-btn {
              position: absolute;
              top: 24px;
              right: 24px;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background: rgba(255, 255, 255, 0.03);
              border: 1px solid rgba(255, 255, 255, 0.1);
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              z-index: 10;
              transition: all 0.2s;
            }
            .modal-close-btn:hover {
              background: rgba(255, 255, 255, 0.08);
              transform: rotate(90deg);
            }

            .modal-inner {
              padding: 60px;
            }

            .modal-tag {
              font-family: var(--font-mono);
              font-size: 0.7rem;
              letter-spacing: 0.15em;
              margin-bottom: 12px;
            }

            .modal-title {
              font-size: clamp(2rem, 4vw, 3.5rem);
              font-weight: 700;
              margin-bottom: 40px;
              letter-spacing: -0.02em;
            }

            .modal-body {
              display: grid;
              grid-template-columns: 1fr 1.2fr;
              gap: 60px;
            }

            .modal-description {
              font-size: 1.05rem;
              color: #9a9a9f;
              line-height: 1.7;
              margin-bottom: 40px;
            }

            .tech-heading {
              font-size: 0.8rem;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: white;
              margin-bottom: 16px;
            }

            .tech-stack {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              margin-bottom: 48px;
            }

            .tech-pill {
              padding: 6px 14px;
              background: rgba(255, 255, 255, 0.03);
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 100px;
              font-size: 0.75rem;
              color: #f0f0f0;
            }

            .visit-btn {
              position: relative;
              padding: 16px 32px;
              background: transparent;
              border: 1px solid var(--btn-color);
              color: white;
              font-weight: 600;
              border-radius: 12px;
              overflow: hidden;
              cursor: pointer;
            }

            .visit-btn span { position: relative; z-index: 1; }
            .visit-btn-bg {
              position: absolute;
              inset: 0;
              background: var(--btn-color);
              opacity: 0.1;
              transition: opacity 0.3s;
            }
            .visit-btn:hover .visit-btn-bg { opacity: 0.25; }

            .modal-visual {
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .mockup-placeholder {
              width: 100%;
              aspect-ratio: 4/3;
              background: #0d0d0d;
              border: 1px solid;
              border-radius: 16px;
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
            }

            .mockup-content {
              font-family: var(--font-mono);
              font-size: 0.8rem;
            }

            .mockup-glow {
              position: absolute;
              inset: 0;
              pointer-events: none;
            }

            @media (max-width: 768px) {
              .modal-inner { padding: 40px 24px; }
              .modal-body { grid-template-columns: 1fr; gap: 40px; }
              .modal-title { margin-bottom: 20px; }
              .project-modal-content { max-height: 90vh; overflow-y: auto; }
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  )
}
