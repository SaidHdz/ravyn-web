import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useTransform, animate, motion } from 'motion/react'

interface CountUpProps {
  from?: number
  to: number
  separator?: string
  direction?: 'up' | 'down'
  duration?: number
  className?: string
  onStart?: () => void
  onEnd?: () => void
}

export default function CountUp({
  from = 0,
  to,
  separator = '',
  direction = 'up',
  duration = 2,
  className,
  onStart,
  onEnd,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(direction === 'down' ? to : from)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  const formatted = useTransform(motionValue, (latest) => {
    const rounded = Math.round(latest)
    if (!separator) return String(rounded)
    return rounded.toLocaleString()
  })

  useEffect(() => {
    if (!isInView) return
    onStart?.()
    const controls = animate(motionValue, direction === 'down' ? from : to, {
      duration,
      ease: 'easeOut',
      onComplete: onEnd,
    })
    return () => controls.stop()
  }, [isInView])

  return (
    <motion.span ref={ref} className={className}>
      {formatted}
    </motion.span>
  )
}
