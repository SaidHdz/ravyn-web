import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link } from 'react-router-dom'
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  project: {
    id?: string
    title: string
    color: string
    description: string
    tech: readonly string[] | string[]
    images?: readonly string[] | string[]
    problem?: string
    solution?: string
    result?: string
    pageHref?: string | null
    liveUrl?: string | null
  } | null
}

const ease = [0.22, 1, 0.36, 1] as const

// Marco de iPhone para móvil
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
          width: 90px;
          height: 20px;
          background: var(--color-pine);
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          z-index: 10;
        }
        .iphone-screen-content {
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: relative;
        }
        .iphone-glow {
          position: absolute;
          inset: -40px;
          pointer-events: none;
          z-index: -1;
          filter: blur(30px);
        }
        @media (max-width: 600px) {
          .iphone-frame {
            width: 240px;
            height: 490px;
            border-radius: 38px;
            padding: 7px;
          }
          .iphone-inner { border-radius: 30px; }
          .iphone-notch { width: 75px; height: 16px; }
        }
      `}</style>
    </div>
  )
}

// Marco de Laptop / PC para escritorio (sin emojis)
function DesktopMockup({ children, color, url }: { children: React.ReactNode, color: string, url?: string }) {
  return (
    <div className="desktop-frame">
      <div className="desktop-header">
        <div className="desktop-dots">
          <span className="desktop-dot desktop-dot--red" />
          <span className="desktop-dot desktop-dot--yellow" />
          <span className="desktop-dot desktop-dot--green" />
        </div>
        <div className="desktop-url-bar">
          <span className="desktop-url-text">{url || 'http://localhost:4321'}</span>
        </div>
      </div>
      <div className="desktop-screen-content">
        {children}
      </div>
      <div className="desktop-glow" style={{ background: `radial-gradient(circle at center, ${color}22 0%, transparent 70%)` }} />

      <style>{`
        .desktop-frame {
          position: relative;
          width: 100%;
          max-width: 540px;
          height: 380px;
          background: var(--color-pine);
          border-radius: 18px;
          padding: 8px;
          box-shadow:
            0 0 0 3px rgba(16,52,42,0.9),
            0 30px 60px -12px rgba(16,52,42,0.4);
          margin: 0 auto;
          display: flex;
          flex-direction: column;
        }
        .desktop-header {
          height: 28px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 10px;
        }
        .desktop-dots {
          display: flex;
          gap: 6px;
        }
        .desktop-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
        }
        .desktop-dot--red { background: #ff5f56; }
        .desktop-dot--yellow { background: #ffbd2e; }
        .desktop-dot--green { background: #27c93f; }
        .desktop-url-bar {
          flex: 1;
          background: rgba(250, 246, 238, 0.12);
          border-radius: 6px;
          height: 20px;
          display: flex;
          align-items: center;
          padding: 0 10px;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--color-cream);
          gap: 6px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .desktop-screen-content {
          flex: 1;
          background: #000;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
        }
        .desktop-glow {
          position: absolute;
          inset: -40px;
          pointer-events: none;
          z-index: -1;
          filter: blur(30px);
        }
        @media (max-width: 600px) {
          .desktop-frame {
            height: 280px;
            border-radius: 14px;
            padding: 6px;
          }
        }
      `}</style>
    </div>
  )
}

type SlimergyScreen = 'home' | 'cuartos' | 'ajustes'
type SlimergyMode = 'despues' | 'antes'

const slimergyImageMap: Record<SlimergyScreen, Record<SlimergyMode, number>> = {
  home: { despues: 0, antes: 1 },
  cuartos: { despues: 2, antes: 3 },
  ajustes: { despues: 4, antes: 5 },
}

export default function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  const { t, language } = useLanguage()
  const [activeImageIdx, setActiveImageIdx] = useState(0)

  // Slimergy App (Mobile)
  const isSlimergyApp = project?.id === 'slimergy'
  const [slimergyMode, setSlimergyMode] = useState<SlimergyMode>('despues')
  const [slimergyScreen, setSlimergyScreen] = useState<SlimergyScreen>('home')

  // Slimergy Landing (Web PC vs Móvil)
  const isSlimergyLanding = project?.id === 'slimergy-landing'
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop')

  // Reset al abrir proyecto nuevo
  useEffect(() => {
    if (isOpen) {
      setActiveImageIdx(0)
      setSlimergyMode('despues')
      setSlimergyScreen('home')
      setDeviceMode('desktop')
    }
  }, [isOpen, project])

  // Sync Slimergy App switch when activeImageIdx changes
  useEffect(() => {
    if (isSlimergyApp && project?.images && project.images[activeImageIdx]) {
      const raw = project.images[activeImageIdx].toLowerCase()
      if (raw.includes('antes')) {
        setSlimergyMode('antes')
      } else if (raw.includes('despues')) {
        setSlimergyMode('despues')
      }

      if (raw.includes('cuarto')) {
        setSlimergyScreen('cuartos')
      } else if (raw.includes('confi')) {
        setSlimergyScreen('ajustes')
      } else if (raw.includes('home')) {
        setSlimergyScreen('home')
      }
    }
  }, [activeImageIdx, isSlimergyApp, project])

  // Lock de scroll al abrir
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

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!project) return null

  const hasImages = project.images && project.images.length > 0
  const accent = project.color || 'var(--color-radish)'

  const nextImage = () => {
    if (!project.images || project.images.length === 0) return
    setActiveImageIdx((prev) => (prev + 1) % project.images!.length)
  }

  const prevImage = () => {
    if (!project.images || project.images.length === 0) return
    setActiveImageIdx((prev) => (prev - 1 + project.images!.length) % project.images!.length)
  }

  const getScreenTabLabel = (imgPath: string, idx: number) => {
    const raw = imgPath.split('/').pop()?.toLowerCase() || ''
    const isEn = language === 'en'

    if (raw.includes('home') || raw.includes('inicio')) {
      return t.projectModal.screens?.home || 'Home'
    }
    if (raw.includes('login')) {
      return t.projectModal.screens?.login || 'Login'
    }
    if (raw.includes('expediente')) {
      return t.projectModal.screens?.expedientes || (isEn ? 'Records' : 'Expedientes')
    }
    if (raw.includes('calendar') || raw.includes('calendario') || raw.includes('agenda')) {
      return t.projectModal.screens?.calendario || (isEn ? 'Schedule' : 'Agenda')
    }
    if (raw.includes('ajuste') || raw.includes('confi') || raw.includes('config') || raw.includes('setting')) {
      return t.projectModal.screens?.ajustes || (isEn ? 'Settings' : 'Ajustes')
    }
    if (raw.includes('hardware')) {
      return t.projectModal.screens?.hardware || 'Hardware'
    }
    if (raw.includes('alerta')) {
      return t.projectModal.screens?.alertas || (isEn ? 'Alerts' : 'Alertas')
    }
    if (raw.includes('cuarto') || raw.includes('room')) {
      return t.projectModal.screens?.cuartos || (isEn ? 'Rooms' : 'Cuartos')
    }

    const clean = raw.replace(/[_-]+/g, ' ').replace(/\.(jpg|jpeg|png|webp)$/i, '').trim()
    return clean.charAt(0).toUpperCase() + clean.slice(1) || `${t.projectModal.screenNum} ${idx + 1}`
  }

  const getScreenTag = (imgPath: string) => {
    const raw = imgPath.split('/').pop()?.toLowerCase() || ''
    if (raw.includes('despues')) return t.projectModal.tagAfter || (language === 'es' ? 'REDISEÑO EN EXPO' : 'EXPO REDESIGN')
    if (raw.includes('antes')) return t.projectModal.tagBefore || (language === 'es' ? 'PROTOTIPO PREVIO' : 'PREVIOUS PROTOTYPE')
    return null
  }

  const liveUrl = project.liveUrl || (isSlimergyLanding ? 'http://localhost:4321' : null)

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
            <button className="pm-close" onClick={onClose} aria-label={t.projectModal.close}>
              <X size={18} strokeWidth={2.25} />
            </button>

            <div className="pm-scroll">
              <div className="pm-inner">
                <div className="pm-grid">

                  {/* Columna de contenido */}
                  <div className="pm-col-content">
                    <h2 className="pm-title">{project.title}</h2>

                    {project.problem ? (
                      <div className="pm-case">
                        <div className="pm-case-item">
                          <span className="pm-case-label">{t.projectModal.problem}</span>
                          <p className="pm-case-text">{project.problem}</p>
                        </div>
                        <div className="pm-case-item">
                          <span className="pm-case-label">{t.projectModal.solution}</span>
                          <p className="pm-case-text">{project.solution}</p>
                        </div>
                        <div className="pm-case-item">
                          <span className="pm-case-label" style={{ color: accent }}>{t.projectModal.result}</span>
                          <p className="pm-case-result" style={{ color: accent }}>{project.result}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="pm-description">{project.description}</p>
                    )}

                    <div className="pm-tech">
                      <h4 className="pm-tech-heading">{t.projectModal.stack}</h4>
                      <div className="pm-tech-stack">
                        {project.tech.map(techItem => (
                          <span key={techItem} className="pm-tech-pill">{techItem}</span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                      {liveUrl && (
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary inline-flex items-center gap-2 self-start"
                        >
                          {t.projectModal.visitLive} <ExternalLink size={14} />
                        </a>
                      )}

                      {project.pageHref && (
                        <Link to={project.pageHref} className="pm-cta" onClick={onClose}>
                          {t.projectModal.explorePage} <span aria-hidden="true">→</span>
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Columna visual */}
                  <div className="pm-col-visual">
                    {/* CASO 1: Slimergy Landing Page (Switch PC vs Móvil) */}
                    {isSlimergyLanding ? (
                      <div className="pm-mockup-wrap">
                        <div className="slimergy-switch-bar">
                          <div className="slimergy-switch-track">
                            <button
                              type="button"
                              className={`slimergy-switch-btn ${deviceMode === 'desktop' ? 'is-active' : ''}`}
                              onClick={() => setDeviceMode('desktop')}
                            >
                              <span>{t.projectModal.deviceDesktop || 'PC / Desktop'}</span>
                            </button>
                            <button
                              type="button"
                              className={`slimergy-switch-btn ${deviceMode === 'mobile' ? 'is-active' : ''}`}
                              onClick={() => setDeviceMode('mobile')}
                            >
                              <span>{t.projectModal.deviceMobile || 'Móvil'}</span>
                            </button>
                          </div>
                        </div>

                        <a
                          href={liveUrl || 'http://localhost:4321'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[0.74rem] font-mono text-[var(--color-radish)] hover:underline"
                        >
                          {t.projectModal.openLive || 'Abrir sitio en vivo →'} ({liveUrl || 'http://localhost:4321'})
                        </a>

                        <div className="pm-mockup-display w-full flex justify-center">
                          {deviceMode === 'desktop' ? (
                            <DesktopMockup color={accent} url={liveUrl || 'http://localhost:4321'}>
                              <iframe
                                src={liveUrl || 'http://localhost:4321'}
                                title="Slimergy Landing Desktop Preview"
                                className="w-full h-full border-0 bg-white"
                              />
                            </DesktopMockup>
                          ) : (
                            <IPhoneMockup color={accent}>
                              <iframe
                                src={liveUrl || 'http://localhost:4321'}
                                title="Slimergy Landing Mobile Preview"
                                className="pm-mockup-iframe-mobile"
                              />
                            </IPhoneMockup>
                          )}
                        </div>
                      </div>
                    ) : isSlimergyApp ? (
                      /* CASO 2: Slimergy App Móvil (Switch Antes / Después y pantallas) */
                      <div className="pm-mockup-wrap">
                        <div className="slimergy-controls-wrap">
                          <div className="slimergy-switch-bar">
                            <div className="slimergy-switch-track">
                              <button
                                type="button"
                                className={`slimergy-switch-btn ${slimergyMode === 'antes' ? 'is-active' : ''}`}
                                onClick={() => {
                                  setSlimergyMode('antes')
                                  const nextIdx = slimergyImageMap[slimergyScreen]['antes']
                                  setActiveImageIdx(nextIdx)
                                }}
                              >
                                <span>{t.projectModal.before}</span>
                              </button>
                              <button
                                type="button"
                                className={`slimergy-switch-btn ${slimergyMode === 'despues' ? 'is-active' : ''}`}
                                onClick={() => {
                                  setSlimergyMode('despues')
                                  const nextIdx = slimergyImageMap[slimergyScreen]['despues']
                                  setActiveImageIdx(nextIdx)
                                }}
                              >
                                <span>{t.projectModal.after}</span>
                              </button>
                            </div>
                          </div>

                          <div className="pm-tabs slimergy-pills-row">
                            {(['home', 'cuartos', 'ajustes'] as const).map((screenKey) => {
                              const label = t.projectModal.screens[screenKey]
                              const isActive = slimergyScreen === screenKey

                              return (
                                <button
                                  key={screenKey}
                                  type="button"
                                  className={`pm-tab ${isActive ? 'is-active' : ''}`}
                                  onClick={() => {
                                    setSlimergyScreen(screenKey)
                                    const nextIdx = slimergyImageMap[screenKey][slimergyMode]
                                    setActiveImageIdx(nextIdx)
                                  }}
                                  style={{ '--accent': accent } as React.CSSProperties}
                                >
                                  {label}
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        <div className="pm-mockup-display">
                          <IPhoneMockup color={accent}>
                            <div className="relative w-full h-full">
                              <AnimatePresence mode="wait">
                                <motion.img
                                  key={activeImageIdx}
                                  src={project.images![activeImageIdx]}
                                  alt={`${project.title} ${t.projectModal.screenNum} ${activeImageIdx + 1}`}
                                  className="pm-mockup-img"
                                  initial={{ opacity: 0, x: 16 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -16 }}
                                  transition={{ duration: 0.35, ease }}
                                />
                              </AnimatePresence>
                              {getScreenTag(project.images![activeImageIdx]) && (
                                <span className="pm-screen-tag">
                                  {getScreenTag(project.images![activeImageIdx])}
                                </span>
                              )}
                            </div>
                          </IPhoneMockup>

                          <div className="pm-nav">
                            <button className="pm-nav-arrow" onClick={prevImage} aria-label={t.projectModal.prevScreen}><ChevronLeft size={22} /></button>
                            <button className="pm-nav-arrow" onClick={nextImage} aria-label={t.projectModal.nextScreen}><ChevronRight size={22} /></button>
                          </div>
                        </div>
                      </div>
                    ) : hasImages ? (
                      /* CASO 3: Otros proyectos con imágenes (Klino, Shield Sense) */
                      <div className="pm-mockup-wrap">
                        <div className="pm-tabs">
                          {project.images!.map((img, idx) => {
                            const name = getScreenTabLabel(img, idx)
                            return (
                              <button
                                key={idx}
                                type="button"
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
                            <div className="relative w-full h-full">
                              <AnimatePresence mode="wait">
                                <motion.img
                                  key={activeImageIdx}
                                  src={project.images![activeImageIdx]}
                                  alt={`${project.title} ${t.projectModal.screenNum} ${activeImageIdx + 1}`}
                                  className="pm-mockup-img"
                                  initial={{ opacity: 0, x: 16 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -16 }}
                                  transition={{ duration: 0.35, ease }}
                                />
                              </AnimatePresence>
                            </div>
                          </IPhoneMockup>

                          <div className="pm-nav">
                            <button className="pm-nav-arrow" onClick={prevImage} aria-label={t.projectModal.prevScreen}><ChevronLeft size={22} /></button>
                            <button className="pm-nav-arrow" onClick={nextImage} aria-label={t.projectModal.nextScreen}><ChevronRight size={22} /></button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="pm-placeholder" style={{ borderColor: `${accent}40` }}>
                        <span className="pm-placeholder-text">Próximamente capturas</span>
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
            }
            .pm-close {
              position: absolute;
              top: 20px;
              right: 20px;
              width: 38px;
              height: 38px;
              border-radius: 50%;
              background: rgba(16, 52, 42, 0.06);
              border: 1px solid rgba(16, 52, 42, 0.10);
              color: var(--color-pine);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              z-index: 20;
              transition: background 0.2s, transform 0.2s;
            }
            .pm-close:hover {
              background: rgba(224, 67, 107, 0.15);
              color: var(--color-radish);
              transform: scale(1.05);
            }
            .pm-scroll {
              overflow-y: auto;
              max-height: 90vh;
              padding: clamp(32px, 5vw, 64px);
            }
            .pm-inner {
              max-width: 960px;
              margin: 0 auto;
            }
            .pm-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: clamp(36px, 5vw, 72px);
              align-items: start;
            }
            .pm-col-content {
              display: flex;
              flex-direction: column;
              gap: 28px;
              position: sticky;
              top: 0;
            }
            .pm-title {
              font-family: var(--font-display);
              font-weight: 600;
              font-size: clamp(28px, 3.5vw, 42px);
              line-height: 1.08;
              letter-spacing: -0.025em;
              color: var(--color-pine);
            }
            .pm-description {
              font-family: var(--font-sans);
              font-size: 0.96rem;
              color: var(--text-secondary);
              line-height: 1.68;
            }
            .pm-case {
              display: flex;
              flex-direction: column;
              gap: 18px;
            }
            .pm-case-item {
              display: flex;
              flex-direction: column;
              gap: 4px;
            }
            .pm-case-label {
              font-family: var(--font-mono);
              font-size: 0.68rem;
              font-weight: 700;
              letter-spacing: 0.14em;
              text-transform: uppercase;
              color: var(--text-muted);
            }
            .pm-case-text {
              font-family: var(--font-sans);
              font-size: 0.92rem;
              color: var(--text-secondary);
              line-height: 1.6;
            }
            .pm-case-result {
              font-family: var(--font-sans);
              font-size: 0.94rem;
              font-weight: 600;
              line-height: 1.5;
            }
            .pm-tech {
              display: flex;
              flex-direction: column;
              gap: 10px;
              padding-top: 6px;
            }
            .pm-tech-heading {
              font-family: var(--font-mono);
              font-size: 0.68rem;
              font-weight: 700;
              letter-spacing: 0.14em;
              text-transform: uppercase;
              color: var(--text-muted);
            }
            .pm-tech-stack {
              display: flex;
              flex-wrap: wrap;
              gap: 6px;
            }
            .pm-tech-pill {
              font-family: var(--font-mono);
              font-size: 0.72rem;
              padding: 4px 10px;
              border-radius: 6px;
              background: rgba(16, 52, 42, 0.05);
              border: 1px solid rgba(16, 52, 42, 0.10);
              color: var(--color-pine);
            }
            .pm-cta {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              font-family: var(--font-sans);
              font-size: 0.9rem;
              font-weight: 600;
              color: var(--color-radish);
              text-decoration: none;
              transition: gap 0.2s ease;
              align-self: flex-start;
            }
            .pm-cta:hover { gap: 12px; }
            .pm-col-visual {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            .pm-mockup-wrap {
              width: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 20px;
            }

            /* Slimergy Interactive Controls */
            .slimergy-controls-wrap {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 12px;
              width: 100%;
            }
            .slimergy-switch-bar {
              display: flex;
              justify-content: center;
              width: 100%;
            }
            .slimergy-switch-track {
              display: inline-flex;
              align-items: center;
              padding: 4px;
              border-radius: 100vw;
              background: rgba(16, 52, 42, 0.08);
              border: 1px solid rgba(16, 52, 42, 0.14);
              gap: 4px;
              box-shadow: inset 0 2px 4px rgba(16, 52, 42, 0.04);
            }
            .slimergy-switch-btn {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              padding: 7px 20px;
              border-radius: 100vw;
              border: none;
              background: transparent;
              font-family: var(--font-mono);
              font-size: 0.74rem;
              font-weight: 700;
              letter-spacing: 0.06em;
              text-transform: uppercase;
              color: var(--text-muted);
              cursor: pointer;
              transition: all 0.22s cubic-bezier(0.22, 1, 0.36, 1);
            }
            .slimergy-switch-btn:hover:not(.is-active) {
              color: var(--color-pine);
            }
            .slimergy-switch-btn.is-active {
              background: #FFFFFF;
              color: var(--color-pine);
              box-shadow: 0 3px 10px rgba(16, 52, 42, 0.12), 0 1px 2px rgba(0, 0, 0, 0.04);
            }

            .slimergy-pills-row {
              gap: 8px;
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
            .pm-mockup-iframe-mobile {
              width: 375px;
              height: 800px;
              transform: scale(0.704);
              transform-origin: top left;
              border: 0;
              background: #ffffff;
            }
            .pm-mockup-img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
            }
            .pm-screen-tag {
              position: absolute;
              bottom: 16px;
              left: 50%;
              transform: translateX(-50%);
              background: rgba(16, 52, 42, 0.9);
              color: var(--color-cream);
              font-family: var(--font-mono);
              font-size: 0.65rem;
              font-weight: 700;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              padding: 4px 12px;
              border-radius: 100vw;
              backdrop-filter: blur(8px);
              z-index: 10;
              pointer-events: none;
              white-space: nowrap;
              border: 1px solid rgba(250, 246, 238, 0.25);
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
            @media (max-width: 600px) {
              .slimergy-switch-btn {
                padding: 5px 14px;
                font-size: 0.7rem;
              }
              .slimergy-controls-wrap {
                gap: 10px;
              }
              .pm-tab {
                padding: 6px 12px;
                font-size: 0.68rem;
              }
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  )
}
