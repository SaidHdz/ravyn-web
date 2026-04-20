import { motion } from 'motion/react'

const ease = [0.16, 1, 0.3, 1] as const

const proyectos = [
  {
    category: 'Experiencia Web',
    title: 'Aniversario Interactivo',
    desc: 'Mini-sitio personalizado con contador en vivo, galería de recuerdos, trivia de pareja y cartas animadas.',
    footer: '2024 · React + Vite',
  },
  {
    category: 'IoT',
    title: 'Monitor de Temperatura',
    desc: 'Sistema de sensores industriales con dashboard en tiempo real y alertas automáticas por WhatsApp.',
    footer: '2024 · ESP32 + Node.js',
  },
  {
    category: 'Desarrollo Web',
    title: 'Sistema de Pedidos',
    desc: 'App interna para gestión de pedidos y empleados de un restaurante local en Reynosa.',
    footer: '2025 · React + Supabase',
  },
]

export default function Portafolio() {
  return (
    <section id="trabajo" className="section">
      <div className="container">
        <motion.p
          className="section-label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4 }}
        >
          Trabajo
        </motion.p>
        <motion.div
          className="portafolio-grid"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease }}
        >
          {proyectos.map((p) => (
            <div key={p.title} className="portafolio-card">
              <div className="portafolio-card-header">
                <span className="portafolio-category">{p.category}</span>
                <span className="portafolio-status" />
              </div>
              <h3 className="portafolio-title">{p.title}</h3>
              <p className="portafolio-desc">{p.desc}</p>
              <p className="portafolio-footer">{p.footer}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
