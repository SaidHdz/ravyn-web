import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  project: {
    title: string
    color: string
    description: string
    tech: string[]
    images?: string[]
    problem?: string
    solution?: string
    result?: string
  } | null
}

const ease = [0.16, 1, 0.3, 1] as const

// Componente para enmarcar las capturas en un iPhone
function IPhoneMockup({ children, color }: { children: React.ReactNode, color: string }) {
  return (
    <div className="iphone-frame">
      <div className="iphone-inner">
        <div className="iphone-notch" />
        <div className="iphone-screen-content">
          {children}
        </div>
      </div>
      <div className="iphone-glow" style={{ background: `radial-gradient(circle at center, ${color}20 0%, transparent 70%)` }} />
      
      <style>{`
        .iphone-frame {
          position: relative;
          width: 280px;
          height: 580px;
          background: #000;
          border-radius: 44px;
          padding: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 
            0 0 0 4px #1a1a1a,
            0 30px 60px -10px rgba(0,0,0,0.8);
          margin: 0 auto;
        }

        .iphone-inner {
          position: relative;
          width: 100%;
          height: 100%;
          background: #000;
          border-radius: 36px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .iphone-notch {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 25px;
          background: #000;
          border-bottom-left-radius: 15px;
          border-bottom-right-radius: 15px;
          z-index: 20;
        }

        .iphone-screen-content {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .iphone-glow {
          position: absolute;
          inset: -40px;
          pointer-events: none;
          z-index: -1;
        }

        @media (max-width: 768px) {
          .iphone-frame {
            width: 240px;
            height: 500px;
          }
        }
      `}</style>
    </div>
  )
}

export default function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      setActiveImageIdx(0)
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

  // Mejorar contraste de colores si es necesario (especialmente el morado de Klino)
  const displayColor = project.color === '#8b5cf6' ? '#a78bfa' : project.color

  const nextImage = () => {
    if (project.images) {
      setActiveImageIdx((prev) => (prev + 1) % project.images!.length)
    }
  }

  const prevImage = () => {
    if (project.images) {
      setActiveImageIdx((prev) => (prev - 1 + project.images!.length) % project.images!.length)
    }
  }

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
            <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar modal">
              <X size={20} />
            </button>

            <div className="modal-scroll-area">
              <div className="modal-inner">
                <div className="modal-main-grid">
                  <div className="modal-content-col">
                    <div className="modal-header">
                      <div className="modal-tag" style={{ color: displayColor }}>CASO DE ÉXITO</div>
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
                            <span className="success-label" style={{ color: displayColor }}>Resultado</span>
                            <p className="success-result" style={{ color: displayColor }}>{project.result}</p>
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
                    </div>
                  </div>

                  <div className="modal-visual-col">
                    <div className="visual-container">
                      {project.images && project.images.length > 0 ? (
                        <div className="mockup-navigation-wrapper">
                          <div className="mockup-tabs">
                            {project.images.map((img, idx) => {
                              // Obtener nombre del archivo para la pestaña
                              const name = img.split('/').pop()?.split('.')[0] || `Captura ${idx + 1}`
                              return (
                                <button 
                                  key={idx}
                                  className={`tab-btn ${activeImageIdx === idx ? 'active' : ''}`}
                                  onClick={() => setActiveImageIdx(idx)}
                                  style={{ 
                                    '--active-color': displayColor 
                                  } as any}
                                >
                                  {name}
                                </button>
                              )
                            })}
                          </div>

                          <div className="mockup-display">
                            <IPhoneMockup color={displayColor}>
                              <AnimatePresence mode="wait">
                                <motion.img 
                                  key={activeImageIdx}
                                  src={project.images[activeImageIdx]} 
                                  alt={`${project.title} view ${activeImageIdx + 1}`}
                                  className="mockup-img"
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -20 }}
                                  transition={{ duration: 0.4, ease }}
                                />
                              </AnimatePresence>
                            </IPhoneMockup>

                            <div className="nav-controls">
                              <button className="nav-arrow" onClick={prevImage}><ChevronLeft size={24} /></button>
                              <button className="nav-arrow" onClick={nextImage}><ChevronRight size={24} /></button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mockup-placeholder" style={{ borderColor: `${displayColor}30` }}>
                          <div className="mockup-content">Preview soon</div>
                          <div className="mockup-glow" style={{ background: `radial-gradient(circle at center, ${displayColor}20 0%, transparent 70%)` }} />
                        </div>
                      )}
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
              padding: 20px;
            }

            .project-modal-backdrop {
              position: absolute;
              inset: 0;
              background: rgba(8, 8, 8, 0.9);
              backdrop-filter: blur(16px);
              -webkit-backdrop-filter: blur(16px);
            }

            .project-modal-content {
              position: relative;
              width: 100%;
              max-width: 1100px;
              max-height: 90vh;
              background: #0f0f0f;
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 36px;
              overflow: hidden;
              box-shadow: 0 50px 100px rgba(0, 0, 0, 0.8);
              display: flex;
              flex-direction: column;
            }

            .modal-scroll-area {
              width: 100%;
              height: 100%;
              overflow-x: hidden;
              overflow-y: auto;
            }

            .modal-inner {
              padding: 80px 60px;
            }

            .modal-close-btn {
              position: absolute;
              top: 32px; /* Más margen solicitado */
              right: 32px;
              width: 48px;
              height: 48px;
              border-radius: 50%;
              background: rgba(255,255,255,0.03);
              border: 1px solid rgba(255, 255, 255, 0.1);
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              z-index: 100;
              transition: all 0.3s var(--ease-out);
            }
            .modal-close-btn:hover {
              background: rgba(255, 255, 255, 0.08);
              transform: rotate(90deg) scale(1.05);
              border-color: rgba(255, 255, 255, 0.2);
            }

            .modal-main-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 80px;
              align-items: start;
            }

            .modal-content-col {
              position: sticky; /* Columna fija solicitada */
              top: 0;
            }

            .modal-tag {
              font-family: var(--font-mono);
              font-size: 0.75rem;
              font-weight: 500;
              letter-spacing: 0.2em;
              margin-bottom: 16px;
            }

            .modal-title {
              font-size: clamp(2.5rem, 5vw, 4rem);
              font-weight: 700;
              margin-bottom: 48px;
              letter-spacing: -0.04em;
              line-height: 1;
            }

            .visual-container {
              width: 100%;
              display: flex;
              justify-content: center;
            }

            .mockup-navigation-wrapper {
              width: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 40px;
            }

            .mockup-tabs {
              display: flex;
              gap: 12px;
              flex-wrap: wrap;
              justify-content: center;
            }

            .tab-btn {
              padding: 8px 16px;
              background: rgba(255,255,255,0.02);
              border: 1px solid rgba(255,255,255,0.06);
              border-radius: 100px;
              font-size: 0.8rem;
              font-weight: 600;
              color: #7a7a7a;
              cursor: pointer;
              transition: all 0.3s;
              text-transform: capitalize;
            }
            .tab-btn.active {
              background: var(--active-color);
              border-color: var(--active-color);
              color: #000;
            }

            .mockup-display {
              position: relative;
              display: flex;
              align-items: center;
              gap: 20px;
            }

            .mockup-img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
            }

            .nav-controls {
              position: absolute;
              top: 50%;
              left: -80px;
              right: -80px;
              display: flex;
              justify-content: space-between;
              pointer-events: none;
              transform: translateY(-50%);
            }

            .nav-arrow {
              width: 50px;
              height: 50px;
              border-radius: 50%;
              background: rgba(255,255,255,0.03);
              border: 1px solid rgba(255,255,255,0.08);
              color: #fff;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              pointer-events: auto;
              transition: all 0.3s;
            }
            .nav-arrow:hover {
              background: rgba(255,255,255,0.08);
              transform: scale(1.1);
            }

            .success-case-grid {
              display: flex;
              flex-direction: column;
              gap: 40px;
              margin-bottom: 60px;
            }

            .success-label {
              font-family: var(--font-mono);
              font-size: 0.7rem;
              text-transform: uppercase;
              letter-spacing: 0.15em;
              color: #555;
              margin-bottom: 8px;
              display: block;
            }

            .success-text {
              font-size: 1.15rem;
              color: #ccc;
              line-height: 1.6;
            }

            .success-result {
              font-size: 1.8rem;
              font-weight: 700;
              letter-spacing: -0.02em;
              line-height: 1.2;
            }

            .tech-heading {
              font-size: 0.75rem;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: #555;
              margin-bottom: 20px;
            }

            .tech-stack {
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
            }

            .tech-pill {
              padding: 6px 16px;
              background: rgba(255, 255, 255, 0.03);
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 100px;
              font-size: 0.8rem;
              color: #888;
            }

            @media (max-width: 1200px) {
              .nav-controls {
                left: -20px;
                right: -20px;
              }
              .nav-arrow {
                background: rgba(0,0,0,0.5);
                backdrop-filter: blur(10px);
              }
            }

            @media (max-width: 900px) {
              .modal-main-grid {
                grid-template-columns: 1fr;
                gap: 60px;
              }
              .modal-content-col {
                position: static;
              }
              .modal-inner {
                padding: 60px 30px;
              }
              .nav-controls {
                display: none;
              }
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  )
}

