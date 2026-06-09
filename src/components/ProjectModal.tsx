import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link } from 'react-router-dom'
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
    pageHref?: string | null
  } | null
}

const ease = [0.22, 1, 0.36, 1] as const

// Marco de iPhone para las capturas — el frame negro lee como producto real sobre cream
function IPhoneMockup({ children, color }: { children: React.ReactNode, color: string }) {
  return (
    <div className="iphone-frame">
      <div className="iphone-inner">
        <div className="iphone-notch" />
        <div className="iphone-screen-content">
          {children}
        </div>
      </div>
      <div className="iphone-glow" style={{ background: `radial-gradient(circle at center, ${color}22 0%, transparent 70%)` }} />

      <style>{`
        .iphone-frame {
          position: relative;
          width: 280px;
          height: 580px;
          background: var(--color-pine);
          border-radius: 44px;
          padding: 8px;
          box-shadow:
            0 0 0 3px rgba(16,52,42,0.9),
            0 30px 60px -12px rgba(16,52,42,0.4);
          margin: 0 auto;
        }
        .iphone-inner {
          position: relative;
          width: 100%;
          height: 100%;
          background: #000;
          border-radius: 36px;
          overflow: hidden;
        }
        .iphone-notch {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 25px;
          background: var(--color-pine);
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
          .iphone-frame { width: 240px; height: 500px; }
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

  // Cerrar con ESC
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!project) return null

  const accent = project.color
  const hasImages = project.images && project.images.length > 0

  const nextImage = () => {
    if (project.images) setActiveImageIdx((p) => (p + 1) % project.images!.length)
  }
  const prevImage = () => {
    if (project.images) setActiveImageIdx((p) => (p - 1 + project.images!.length) % project.images!.length)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="pm-overlay">
          <motion.div
            className="pm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="pm-content"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.45, ease }}
          >
            <button className="pm-close" onClick={onClose} aria-label="Cerrar">
              <X size={18} strokeWidth={2.25} />
            </button>

            <div className="pm-scroll">
              <div className="pm-inner">
                <div className="pm-grid">

                  {/* Columna de contenido */}
                  <div className="pm-col-content">
                    <div className="pm-tag" style={{ color: accent }}>
                      Ravyn Labs · Caso de estudio
                    </div>
                    <h2 className="pm-title">{project.title}</h2>

                    {project.problem ? (
                      <div className="pm-case">
                        <div className="pm-case-item">
                          <span className="pm-case-label">Problema</span>
                          <p className="pm-case-text">{project.problem}</p>
                        </div>
                        <div className="pm-case-item">
                          <span className="pm-case-label">Solución</span>
                          <p className="pm-case-text">{project.solution}</p>
                        </div>
                        <div className="pm-case-item">
                          <span className="pm-case-label" style={{ color: accent }}>Resultado</span>
                          <p className="pm-case-result" style={{ color: accent }}>{project.result}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="pm-description">{project.description}</p>
                    )}

                    <div className="pm-tech">
                      <h4 className="pm-tech-heading">Stack</h4>
                      <div className="pm-tech-stack">
                        {project.tech.map(t => (
                          <span key={t} className="pm-tech-pill">{t}</span>
                        ))}
                      </div>
                    </div>

                    {project.pageHref && (
                      <Link to={project.pageHref} className="pm-cta" onClick={onClose}>
                        Ver sitio completo <span aria-hidden="true">→</span>
                      </Link>
                    )}
                  </div>

                  {/* Columna visual */}
                  <div className="pm-col-visual">
                    {hasImages ? (
                      <div className="pm-mockup-wrap">
                        <div className="pm-tabs">
                          {project.images!.map((img, idx) => {
                            const name = img.split('/').pop()?.split('.')[0] || `Vista ${idx + 1}`
                            return (
                              <button
                                key={idx}
                                className={`pm-tab ${activeImageIdx === idx ? 'is-active' : ''}`}
                                onClick={() => setActiveImageIdx(idx)}
                                style={{ '--accent': accent } as React.CSSProperties}
                              >
                                {name}
                              </button>
                            )
                          })}
                        </div>

                        <div className="pm-mockup-display">
                          <IPhoneMockup color={accent}>
                            <AnimatePresence mode="wait">
                              <motion.img
                                key={activeImageIdx}
                                src={project.images![activeImageIdx]}
                                alt={`${project.title} vista ${activeImageIdx + 1}`}
                                className="pm-mockup-img"
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -16 }}
                                transition={{ duration: 0.35, ease }}
                              />
                            </AnimatePresence>
                          </IPhoneMockup>

                          <div className="pm-nav">
                            <button className="pm-nav-arrow" onClick={prevImage} aria-label="Anterior"><ChevronLeft size={22} /></button>
                            <button className="pm-nav-arrow" onClick={nextImage} aria-label="Siguiente"><ChevronRight size={22} /></button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="pm-placeholder" style={{ borderColor: `${accent}40` }}>
                        <span className="pm-placeholder-text">Vista previa pronto</span>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </motion.div>

          <style>{`
            .pm-overlay {
              position: fixed;
              inset: 0;
              z-index: 1000;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }
            .pm-backdrop {
              position: absolute;
              inset: 0;
              background: rgba(16, 52, 42, 0.55);
              backdrop-filter: blur(10px);
              -webkit-backdrop-filter: blur(10px);
            }
            .pm-content {
              position: relative;
              width: 100%;
              max-width: 1080px;
              max-height: 90vh;
              background: var(--color-cream);
              border: 1px solid rgba(16, 52, 42, 0.10);
              border-radius: var(--radius-lg);
              overflow: hidden;
              box-shadow: 0 40px 90px rgba(16, 52, 42, 0.30);
              display: flex;
              flex-direction: column;
            }
            .pm-scroll {
              width: 100%;
              height: 100%;
              overflow-y: auto;
              overflow-x: hidden;
            }
            .pm-inner { padding: clamp(32px, 5vw, 72px) clamp(24px, 5vw, 60px); }

            .pm-close {
              position: absolute;
              top: 24px;
              right: 24px;
              width: 44px;
              height: 44px;
              border-radius: 50%;
              background: var(--color-cream);
              border: 1px solid rgba(16, 52, 42, 0.15);
              color: var(--color-pine);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              z-index: 100;
              transition: background 0.25s, transform 0.25s, border-color 0.25s;
            }
            .pm-close:hover {
              background: var(--color-cream-2);
              border-color: var(--color-pine);
              transform: rotate(90deg);
            }

            .pm-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: clamp(40px, 5vw, 72px);
              align-items: start;
            }
            .pm-col-content { position: sticky; top: 0; }

            .pm-tag {
              font-family: var(--font-mono);
              font-size: 0.7rem;
              font-weight: 500;
              letter-spacing: 0.16em;
              text-transform: uppercase;
              margin-bottom: 14px;
            }
            .pm-title {
              font-family: var(--font-display);
              font-weight: 600;
              font-size: clamp(2.4rem, 5vw, 3.6rem);
              color: var(--color-pine);
              letter-spacing: -0.03em;
              line-height: 1;
              margin-bottom: 40px;
            }

            .pm-case {
              display: flex;
              flex-direction: column;
              gap: 32px;
              margin-bottom: 44px;
            }
            .pm-case-label {
              display: block;
              font-family: var(--font-mono);
              font-size: 0.66rem;
              text-transform: uppercase;
              letter-spacing: 0.15em;
              color: var(--text-muted);
              margin-bottom: 8px;
            }
            .pm-case-text {
              font-family: var(--font-sans);
              font-size: 1rem;
              color: var(--text-secondary);
              line-height: 1.6;
            }
            .pm-case-result {
              font-family: var(--font-display);
              font-weight: 600;
              font-size: 1.5rem;
              letter-spacing: -0.02em;
              line-height: 1.2;
            }
            .pm-description {
              font-family: var(--font-sans);
              font-size: 1.05rem;
              color: var(--text-secondary);
              line-height: 1.65;
              margin-bottom: 44px;
            }

            .pm-tech-heading {
              font-family: var(--font-mono);
              font-size: 0.66rem;
              text-transform: uppercase;
              letter-spacing: 0.12em;
              color: var(--text-muted);
              margin-bottom: 16px;
            }
            .pm-tech-stack {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
            }
            .pm-tech-pill {
              font-family: var(--font-mono);
              padding: 6px 14px;
              background: var(--color-cream-2);
              border: 1px solid rgba(16, 52, 42, 0.12);
              border-radius: var(--radius-pill);
              font-size: 0.75rem;
              color: var(--color-pine);
            }

            .pm-cta {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              margin-top: 40px;
              font-family: var(--font-sans);
              font-size: 0.88rem;
              font-weight: 600;
              color: var(--color-cream);
              background: var(--color-radish);
              padding: 12px 24px;
              border-radius: var(--radius-pill);
              text-decoration: none;
              transition: opacity 0.2s, transform 0.2s;
            }
            .pm-cta span { transition: transform 0.22s ease; }
            .pm-cta:hover { opacity: 0.9; transform: translateY(-1px); }
            .pm-cta:hover span { transform: translateX(4px); }

            .pm-col-visual {
              display: flex;
              justify-content: center;
            }
            .pm-mockup-wrap {
              width: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 32px;
            }
            .pm-tabs {
              display: flex;
              gap: 8px;
              flex-wrap: wrap;
              justify-content: center;
            }
            .pm-tab {
              font-family: var(--font-mono);
              padding: 7px 14px;
              background: transparent;
              border: 1px solid rgba(16, 52, 42, 0.15);
              border-radius: var(--radius-pill);
              font-size: 0.72rem;
              color: var(--text-secondary);
              cursor: pointer;
              transition: all 0.25s;
              text-transform: capitalize;
            }
            .pm-tab.is-active {
              background: var(--accent);
              border-color: var(--accent);
              color: var(--color-cream);
            }

            .pm-mockup-display {
              position: relative;
              display: flex;
              align-items: center;
            }
            .pm-mockup-img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
            }
            .pm-nav {
              position: absolute;
              top: 50%;
              left: -68px;
              right: -68px;
              display: flex;
              justify-content: space-between;
              pointer-events: none;
              transform: translateY(-50%);
            }
            .pm-nav-arrow {
              width: 44px;
              height: 44px;
              border-radius: 50%;
              background: var(--color-cream);
              border: 1px solid rgba(16, 52, 42, 0.15);
              color: var(--color-pine);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              pointer-events: auto;
              transition: background 0.25s, transform 0.25s;
            }
            .pm-nav-arrow:hover { background: var(--color-cream-2); transform: scale(1.08); }

            .pm-placeholder {
              width: 100%;
              min-height: 420px;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 1px dashed;
              border-radius: var(--radius-lg);
            }
            .pm-placeholder-text {
              font-family: var(--font-mono);
              font-size: 0.8rem;
              color: var(--text-muted);
              letter-spacing: 0.08em;
            }

            @media (max-width: 1180px) {
              .pm-nav { left: -16px; right: -16px; }
              .pm-nav-arrow { background: rgba(250, 246, 238, 0.85); backdrop-filter: blur(6px); }
            }
            @media (max-width: 900px) {
              .pm-grid { grid-template-columns: 1fr; gap: 48px; }
              .pm-col-content { position: static; }
              .pm-col-visual { order: -1; }
              .pm-nav { display: none; }
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  )
}
