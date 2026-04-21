import { motion } from 'motion/react'
import SplitText from '../animations/SplitText'
import Magnet from '../animations/Magnet'

const ease = [0.16, 1, 0.3, 1] as const

export default function Contacto() {
  return (
    <section id="contacto" className="section">
      <div className="container">
        <SplitText
          text="Contacto"
          className="section-label"
          delay={50}
          duration={0.8}
          tag="p"
        />
        <div className="contacto-layout">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease }}
          >
            <SplitText
              text="¿Tienes un proyecto?"
              className="contacto-heading mb-6"
              delay={40}
              duration={0.6}
              tag="h2"
              textAlign="left"
            />
            <p className="contacto-sub">
              Cuéntanos qué quieres construir o lo que necesitas resolver. Respondemos en menos de 24 horas.
            </p>
          </motion.div>

          <motion.div
            className="contacto-options"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease, delay: 0.1 }}
          >
            <Magnet distance={0.15} stiffness={160} damping={15}>
              <a className="contact-option" href="https://wa.me/528361168007" target="_blank" rel="noopener noreferrer">
                <div className="contact-option-body">
                  <p className="contact-option-label">WhatsApp</p>
                  <p className="contact-option-value">+52 836 116 8007</p>
                </div>
                <span className="contact-option-arrow">→</span>
              </a>
            </Magnet>
            
            <Magnet distance={0.15} stiffness={160} damping={15}>
              <a className="contact-option" href="mailto:contacto@ravynstudio.mx">
                <div className="contact-option-body">
                  <p className="contact-option-label">Email</p>
                  <p className="contact-option-value">contacto@ravynstudio.mx</p>
                </div>
                <span className="contact-option-arrow">→</span>
              </a>
            </Magnet>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
