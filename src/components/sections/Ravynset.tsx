import { motion } from 'motion/react'
import MagicBento from '../animations/MagicBento'
import RotatingText from '@/components/RotatingText/RotatingText'
import { Globe, Bot, Shield, TrendingUp } from 'lucide-react'


const ease = [0.16, 1, 0.3, 1] as const

const pilares = [
  {
    icon: <Globe className="w-5 h-5 text-blue-400" />,
    title: "Web de Autoridad",
    description: "Construimos confianza instantánea mediante interfaces de alto nivel que posicionan tu marca.",
    label: "Confianza"
  },
  {
    icon: <Bot className="w-5 h-5 text-green-400" />,
    title: "Asistente Digital n8n",
    description: "Eficacia 24/7 automatizando tareas repetitivas y atención al cliente sin errores.",
    label: "Eficacia"
  },
  {
    icon: <TrendingUp className="w-5 h-5 text-amber-400" />,
    title: "MedicalSheet",
    description: "Sistemas diseñados específicamente para potenciar tus ventas y optimizar la gestión médica.",
    label: "Ventas"
  },
  {
    icon: <Shield className="w-5 h-5 text-purple-400" />,
    title: "Sistema de Reputación",
    description: "Domina tu mercado local asegurando una imagen impecable y feedback constante de pacientes.",
    label: "Dominio Local"
  }
]

export default function Ravynset() {
  return (
    <section className="section bg-black pb-24 overflow-hidden">
      <div className="container">
        <div className="max-w-4xl mb-16">
          <motion.p
            className="text-blue-400 font-mono text-lg md:text-xl uppercase tracking-[0.2em] mb-8"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Nuestra Metodología — Ravynset
          </motion.p>
          <motion.h2 
            className="text-5xl md:text-7xl font-bold text-white leading-tight mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            Reducimos el ausentismo en tu clínica <span className="text-green-400">hasta un 68%</span> mediante automatización industrial.
          </motion.h2>
        </div>

        <div className="mb-16">
          <MagicBento 
            items={pilares}
            textAutoHide={false}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={false}
            enableMagnetism={false}
            clickEffect={true}
            spotlightRadius={500}
            particleCount={15}
            glowColor="96, 165, 250"
          />
        </div>

        <p className="servicios-rotating-text !mt-0 text-center">
          Deja en nuestras manos tu{' '}
          <RotatingText
            texts={['web', 'app', 'sistema', 'automatización']}
            mainClassName="servicios-rotating-pill"
            splitLevelClassName="servicios-rotating-split"
            staggerFrom="last"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-120%' }}
            staggerDuration={0.025}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            rotationInterval={2000}
          />
        </p>
      </div>
    </section>
  )
}
