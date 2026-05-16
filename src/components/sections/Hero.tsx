import { motion, useMotionValue, useSpring } from 'motion/react'
import { useState, useEffect } from 'react'
import TextType from '@/components/TextType/TextType'

const ease = [0.16, 1, 0.3, 1] as const

const springConfig = { damping: 30, stiffness: 100, mass: 2 }

const cards = [
  {
    cls: 'hero-card--green',
    dot: 'green',
    title: 'Desarrollo web a la medida',
    meta: 'Sitios, sistemas y experiencias web construidos desde cero para cada proyecto.',
    x: 38,
    restShadow:  '0 4px 20px rgba(74,222,128,0.10), 0 1px 6px rgba(74,222,128,0.06)',
    hoverShadow: '0 22px 64px rgba(74,222,128,0.22), 0 8px 24px rgba(74,222,128,0.12)',
  },
  {
    cls: 'hero-card--blue',
    dot: 'blue',
    title: 'Sistemas IoT automatizados',
    meta: 'Hardware y software integrados para monitoreo y control en tiempo real.',
    x: -14,
    restShadow:  '0 4px 20px rgba(96,165,250,0.10), 0 1px 6px rgba(96,165,250,0.06)',
    hoverShadow: '0 22px 64px rgba(96,165,250,0.22), 0 8px 24px rgba(96,165,250,0.12)',
  },
  {
    cls: 'hero-card--amber',
    dot: 'amber',
    title: 'Sistemas de gestión para negocios',
    meta: 'Apps internas que reemplazan hojas de cálculo y eliminan procesos manuales.',
    x: 38,
    restShadow:  '0 4px 20px rgba(245,158,11,0.10), 0 1px 6px rgba(245,158,11,0.06)',
    hoverShadow: '0 22px 64px rgba(245,158,11,0.22), 0 8px 24px rgba(245,158,11,0.12)',
  },
]

type Card = typeof cards[0]

function TiltCard({ card, mobile }: { card: Card; mobile: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const rotateX = useSpring(useMotionValue(0), springConfig)
  const rotateY = useSpring(useMotionValue(0), springConfig)
  const scale = useSpring(1, springConfig)

  function handleInteraction(clientX: number, clientY: number) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const offsetX = clientX - rect.left - rect.width / 2
    const offsetY = clientY - rect.top - rect.height / 2
    rotateX.set((offsetY / (rect.height / 2)) * -14)
    rotateY.set((offsetX / (rect.width / 2)) * 14)
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    handleInteraction(e.clientX, e.clientY)
  }

  function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    handleInteraction(e.touches[0].clientX, e.touches[0].clientY)
  }

  function handleStart() { scale.set(1.05) }

  function handleEnd() {
    scale.set(1)
    rotateX.set(0)
    rotateY.set(0)
  }

  const wrapperStyle: React.CSSProperties = {
    perspective: '800px',
    transform: mobile ? 'none' : `translateX(${card.x}px)`
  }

  return (
    <div
      style={wrapperStyle}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseEnter={handleStart}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
    >
      <motion.div
        ref={ref}
        className={`hero-card ${card.cls}`}
        initial={{ boxShadow: card.restShadow }}
        animate={{ boxShadow: card.restShadow }}
        whileHover={{ boxShadow: card.hoverShadow, zIndex: 10 }}
        whileTap={{ scale: 1.05, boxShadow: card.hoverShadow, zIndex: 10 }}
        style={{ rotateX, rotateY, scale, transformStyle: 'preserve-3d' }}
        transition={{ duration: 0.32, ease }}
      >
        <span className={`hero-card-dot ${card.dot}`} />
        <div className="hero-card-body">
          <p className="hero-card-title">{card.title}</p>
          <p className="hero-card-meta">{card.meta}</p>
        </div>
      </motion.div>
    </div>
  )
}

import { useRef } from 'react'

export default function Hero() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 900)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900)
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title" style={{ minHeight: '2.2em' }}>
          <TextType
            as="span"
            text="De la idea al producto."
            typingSpeed={100}
            loop={false}
            showCursor={true}
            cursorCharacter={
              <span style={{
                display: 'inline-block',
                width: '6px',
                height: '0.82em',
                background: 'currentColor',
                verticalAlign: 'middle',
                borderRadius: '1px',
              }} />
            }
            cursorBlinkDuration={0.5}
          />
        </h1>

        <p className="hero-subtitle">
          Construimos experiencias web, soluciones IoT y sistemas digitales
          a la medida — para negocios que saben lo que quieren.
        </p>
      </div>

      <div className="hero-visual">
        <div className="hero-dots" />
        <div className="hero-cards">
          {cards.map((card) => (
            <TiltCard key={card.cls} card={card} mobile={isMobile} />
          ))}
        </div>
      </div>
      
      <style>{`
        @media (max-width: 900px) {
          .hero {
            padding-top: 160px !important; /* Espacio extra arriba para no chocar con header */
          }
        }
      `}</style>
    </section>
  )
}
