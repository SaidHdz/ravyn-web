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
    problem?: string
    solution?: string
    result?: string
  } | null
}

const ease = [0.16, 1, 0.3, 1] as const

export default function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
    return () => { 
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
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
            {/* Botón de cierre - Fuera del área de scroll para que siempre esté visible */}
            <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar modal">
              <X size={20} />
            </button>

            {/* Área con scroll */}
            <div className="modal-scroll-area">
              <div className="modal-inner">
                <div className="modal-main-grid">
                  <div className="modal-content-col">
                    <div className="modal-header">
                      <div className="modal-tag" style={{ color: project.color }}>CASO DE ÉXITO</div>
                      <h2 className="modal-title">{project.title}</h2>
                    </div>

                    <div className="modal-info">
                      {project.problem ? (
                        <div className="success-case-grid">
                          <div className="success-item">
                            <span className="success-label">Problema</span>
                            <p className="success-text">{project.problem}</p>
                          </div>
                          <div className="success-item">
                            <span className="success-label">Solución</span>
                            <p className="success-text">{project.solution}</p>
                          </div>
                          <div className="success-item highlight">
                            <span className="success-label" style={{ color: project.color }}>Resultado</span>
                            <p className="success-result" style={{ color: project.color }}>{project.result}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="modal-description">{project.description}</p>
                      )}
                      
                      <div className="modal-tech-section">
                        <h4 className="tech-heading">Stack Tecnológico</h4>
                        <div className="tech-stack">
                          {project.tech.map(t => (
                            <span key={t} className="tech-pill">{t}</span>
                          ))}
                        </div>
                      </div>

                      <button className="visit-btn" style={{ '--btn-color': project.color } as any}>
                        <span>Ver Demo en Vivo</span>
                        <div className="visit-btn-bg" />
                      </button>
                    </div>
                  </div>

                  <div className="modal-visual-col">
                    <div className="mockup-placeholder" style={{ borderColor: `${project.color}40` }}>
                      <div className="mockup-content">
                         <span style={{ opacity: 0.3 }}>Visualización del Sistema</span>
                      </div>
                      <div className="mockup-glow" style={{ background: `radial-gradient(circle at 50% 50%, ${project.color}20 0%, transparent 70%)` }} />
                    </div>
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
              padding: 40px 20px; /* Más padding para que no toque los bordes */
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
              max-width: 1000px;
              max-height: 85vh; /* Altura máxima controlada */
              background: #141414;
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 32px; /* Bordes más redondeados */
              overflow: hidden; /* Importante para que el scroll area no rompa los bordes */
              box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6);
              display: flex;
              flex-direction: column;
            }

            .modal-scroll-area {
              width: 100%;
              height: 100%;
              overflow-x: hidden;
              overflow-y: auto;
            }

            /* Scrollbar personalizada para el área de scroll */
            .modal-scroll-area::-webkit-scrollbar {
              width: 6px;
            }
            .modal-scroll-area::-webkit-scrollbar-track {
              background: transparent;
            }
            .modal-scroll-area::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 10px;
            }

            .modal-close-btn {
              position: absolute;
              top: 24px;
              right: 24px;
              width: 44px;
              height: 44px;
              border-radius: 50%;
              background: #141414; /* Mismo que el fondo para que no se vea el contenido debajo */
              border: 1px solid rgba(255, 255, 255, 0.15);
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              z-index: 100; /* Siempre por encima */
              transition: all 0.2s;
              box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            }
            .modal-close-btn:hover {
              background: rgba(255, 255, 255, 0.08);
              transform: rotate(90deg) scale(1.1);
              border-color: rgba(255, 255, 255, 0.3);
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
              font-size: clamp(2.2rem, 5vw, 3.8rem);
              font-weight: 700;
              margin-bottom: 50px;
              letter-spacing: -0.03em;
            }

            .modal-main-grid {
              display: grid;
              grid-template-columns: 1.1fr 0.9fr; /* Ligera ventaja a la info para legibilidad */
              gap: 80px;
              align-items: start;
            }

            .modal-content-col {
              display: flex;
              flex-direction: column;
            }

            .modal-visual-col {
              position: sticky;
              top: 0;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .success-case-grid {
              display: flex;
              flex-direction: column;
              gap: 32px;
              margin-bottom: 48px;
            }

            .success-item {
              display: flex;
              flex-direction: column;
              gap: 8px;
            }

            .success-label {
              font-family: var(--font-mono);
              font-size: 0.65rem;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: #58585e;
            }

            .success-text {
              font-size: 1.1rem;
              color: #f0f0f0;
              line-height: 1.5;
            }

            .success-result {
              font-size: 1.8rem;
              font-weight: 700;
              letter-spacing: -0.02em;
            }

            .modal-tech-section {
              margin-top: 20px;
            }

            .tech-heading {
              font-size: 0.75rem;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: #58585e;
              margin-bottom: 16px;
            }

            .tech-stack {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              margin-bottom: 48px;
            }

            .tech-pill {
              padding: 5px 12px;
              background: rgba(255, 255, 255, 0.03);
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 100px;
              font-size: 0.7rem;
              color: #9a9a9f;
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

            .mockup-placeholder {
              width: 100%;
              aspect-ratio: 9/16;
              background: #0d0d0d;
              border: 1px solid;
              border-radius: 24px;
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
            }
            
            @media (max-width: 900px) {
              .mockup-placeholder {
                aspect-ratio: 16/9;
              }
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
              .modal-main-grid { 
                grid-template-columns: 1fr; 
                gap: 40px; 
              }
              .modal-visual-col {
                position: static;
                order: 2; /* Asegura que la imagen vaya debajo */
              }
              .modal-content-col {
                order: 1;
              }
              .modal-title { margin-bottom: 30px; font-size: 2.2rem; }
              .project-modal-content { max-height: 85vh; border-radius: 24px; }
              .success-result { font-size: 1.5rem; }
              .modal-close-btn { top: 16px; right: 16px; width: 38px; height: 38px; }
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  )
}
