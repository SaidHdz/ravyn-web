import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

const springConfig = { damping: 30, stiffness: 100, mass: 2 }

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  amplitude?: number
  scaleOnHover?: number
}

export default function TiltCard({
  children,
  className,
  style,
  amplitude = 14,
  scaleOnHover = 1.05,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const rotateX = useSpring(useMotionValue(0), springConfig)
  const rotateY = useSpring(useMotionValue(0), springConfig)
  const scale = useSpring(1, springConfig)

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left - rect.width / 2
    const offsetY = e.clientY - rect.top - rect.height / 2
    rotateX.set((offsetY / (rect.height / 2)) * -amplitude)
    rotateY.set((offsetX / (rect.width / 2)) * amplitude)
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover)
  }

  function handleMouseLeave() {
    scale.set(1)
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <div
      style={{ perspective: '800px', ...style }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        ref={ref}
        className={className}
        style={{ rotateX, rotateY, scale, transformStyle: 'preserve-3d', height: '100%' }}
      >
        {children}
      </motion.div>
    </div>
  )
}
