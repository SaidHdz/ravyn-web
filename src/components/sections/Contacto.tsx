import { motion } from 'motion/react'

const ease = [0.16, 1, 0.3, 1] as const

export default function Contacto() {
  return (
    <section id="contacto" className="section">
      <div className="container">
        <motion.p
          className="section-label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4 }}
        >
          Contacto
        </motion.p>
        <div className="contacto-layout">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease }}
          >
            <h2 className="contacto-heading">
              ¿Tienes un<br />proyecto?
            </h2>
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
            <a className="contact-option" href="https://wa.me/528361168007" target="_blank" rel="noopener noreferrer">
              <div className="contact-option-body">
                <p className="contact-option-label">WhatsApp</p>
                <p className="contact-option-value">+52 836 116 8007</p>
              </div>
              <span className="contact-option-arrow">→</span>
            </a>
            <a className="contact-option" href="mailto:contacto@ravynstudio.mx">
              <div className="contact-option-body">
                <p className="contact-option-label">Email</p>
                <p className="contact-option-value">contacto@ravynstudio.mx</p>
              </div>
              <span className="contact-option-arrow">→</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
