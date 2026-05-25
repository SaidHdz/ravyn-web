import { motion } from 'motion/react'
import ShinyText from '../animations/ShinyText'
import BlurText from '../animations/BlurText'

const ease = [0.16, 1, 0.3, 1] as const

export default function KlinoHero() {
  return (
    <section className="ravynset-hero">
      <div className="hero-dots" />
      <div className="container">
        <div className="ravynset-hero-content">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-12"
          >
            <ShinyText
              text="Klino · Próximamente"
              disabled={false}
              speed={3}
              className="ravynset-hero-tag"
            />
          </motion.div>

          <BlurText
            text="Klino está en construcción."
            className="ravynset-hero-title"
            delay={50}
            animateBy="words"
            direction="top"
          />

          <BlurText
            text="Estamos preparando algo nuevo. Muy pronto compartiremos los detalles."
            className="ravynset-hero-subtitle"
            delay={30}
            animateBy="words"
            direction="top"
          />
        </div>
      </div>
    </section>
  )
}
