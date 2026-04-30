import { useRef, useCallback, useEffect } from 'react'
import './BorderGlow.css'

function parseHSL(hslStr: string) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/)
  if (!match) return { h: 40, s: 80, l: 80 }
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) }
}

function buildGlowVars(glowColor: string, intensity: number): Record<string, string> {
  const { h, s, l } = parseHSL(glowColor)
  const base = `${h}deg ${s}% ${l}%`
  const opacities = [100, 60, 50, 40, 30, 20, 10]
  const keys = ['', '-60', '-50', '-40', '-30', '-20', '-10']
  const vars: Record<string, string> = {}
  for (let i = 0; i < opacities.length; i++) {
    vars[`--glow-color${keys[i]}`] = `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`
  }
  return vars
}

const GRADIENT_POSITIONS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%']
const GRADIENT_KEYS = ['--gradient-one', '--gradient-two', '--gradient-three', '--gradient-four', '--gradient-five', '--gradient-six', '--gradient-seven']
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1]

function buildGradientVars(colors: string[]): Record<string, string> {
  const vars: Record<string, string> = {}
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)]
    vars[GRADIENT_KEYS[i]] = `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`
  }
  vars['--gradient-base'] = `linear-gradient(${colors[0]} 0 100%)`
  return vars
}

function easeOutCubic(x: number) { return 1 - Math.pow(1 - x, 3) }
function easeInCubic(x: number) { return x * x * x }

function animateValue({ start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, isCancelled, onUpdate, onEnd }: {
  start?: number; end?: number; duration?: number; delay?: number
  ease?: (x: number) => number; isCancelled?: () => boolean; onUpdate: (v: number) => void; onEnd?: () => void
}) {
  const t0 = performance.now() + delay
  function tick() {
    if (isCancelled?.()) return
    const elapsed = performance.now() - t0
    const t = Math.min(elapsed / duration, 1)
    onUpdate(start + (end - start) * ease(t))
    if (t < 1) requestAnimationFrame(tick)
    else if (onEnd) onEnd()
  }
  setTimeout(() => requestAnimationFrame(tick), delay)
}

interface BorderGlowProps {
  children: React.ReactNode
  className?: string
  edgeSensitivity?: number
  glowColor?: string
  backgroundColor?: string
  borderRadius?: number
  glowRadius?: number
  glowIntensity?: number
  coneSpread?: number
  animated?: boolean
  colors?: string[]
  fillOpacity?: number
  autoLoop?: boolean
  loopDelay?: number
  initialDelay?: number
  startAngle?: number
  sweepDirection?: 1 | -1
}

export default function BorderGlow({
  children,
  className = '',
  edgeSensitivity = 8,
  glowColor = '40 80 80',
  backgroundColor = 'var(--bg-surface)',
  borderRadius = 12,
  glowRadius = 40,
  glowIntensity = 1.0,
  coneSpread = 25,
  animated = false,
  colors = ['#60a5fa', '#3b82f6', '#93c5fd'],
  fillOpacity = 0.5,
  autoLoop = false,
  loopDelay = 2000,
  initialDelay = 0,
  startAngle = 110,
  sweepDirection = 1,
}: BorderGlowProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isHoveringRef = useRef(false)
  const loopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeSweepIdRef = useRef(0)
  const runSweepRef = useRef<() => void>(() => {})

  const getCenterOfElement = useCallback((el: HTMLDivElement) => {
    const { width, height } = el.getBoundingClientRect()
    return [width / 2, height / 2]
  }, [])

  const getEdgeProximity = useCallback((el: HTMLDivElement, x: number, y: number) => {
    const [cx, cy] = getCenterOfElement(el)
    const dx = x - cx
    const dy = y - cy
    let kx = Infinity
    let ky = Infinity
    if (dx !== 0) kx = cx / Math.abs(dx)
    if (dy !== 0) ky = cy / Math.abs(dy)
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1)
  }, [getCenterOfElement])

  const getCursorAngle = useCallback((el: HTMLDivElement, x: number, y: number) => {
    const [cx, cy] = getCenterOfElement(el)
    const dx = x - cx
    const dy = y - cy
    if (dx === 0 && dy === 0) return 0
    let degrees = Math.atan2(dy, dx) * (180 / Math.PI) + 90
    if (degrees < 0) degrees += 360
    return degrees
  }, [getCenterOfElement])

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const edge = getEdgeProximity(card, x, y)
    const angle = getCursorAngle(card, x, y)
    card.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(3)}`)
    card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`)
  }, [getEdgeProximity, getCursorAngle])

  // One-shot animated prop (original behavior)
  useEffect(() => {
    if (!animated || !cardRef.current) return
    const card = cardRef.current
    card.classList.add('sweep-active')
    card.style.setProperty('--cursor-angle', '110deg')
    animateValue({ duration: 500, onUpdate: v => card.style.setProperty('--edge-proximity', String(v)) })
    animateValue({ ease: easeInCubic, duration: 1500, end: 50, onUpdate: v => {
      card.style.setProperty('--cursor-angle', `${(355 * (v / 100) + 110)}deg`)
    }})
    animateValue({ ease: easeOutCubic, delay: 1500, duration: 2250, start: 50, end: 100, onUpdate: v => {
      card.style.setProperty('--cursor-angle', `${(355 * (v / 100) + 110)}deg`)
    }})
    animateValue({ ease: easeInCubic, delay: 2500, duration: 1500, start: 100, end: 0,
      onUpdate: v => card.style.setProperty('--edge-proximity', String(v)),
      onEnd: () => card.classList.remove('sweep-active'),
    })
  }, [animated])

  // Auto-loop sweep
  useEffect(() => {
    if (!autoLoop || !cardRef.current) return
    const card = cardRef.current

    const runSweep = (fadeIn = true) => {
      if (isHoveringRef.current) return
      const sweepId = ++activeSweepIdRef.current
      const isCancelled = () => activeSweepIdRef.current !== sweepId

      card.classList.add('sweep-active')
      card.style.setProperty('--cursor-angle', `${startAngle}deg`)

      if (fadeIn) {
        animateValue({ duration: 1000, isCancelled, onUpdate: v => card.style.setProperty('--edge-proximity', String(v)) })
      } else {
        card.style.setProperty('--edge-proximity', '100')
      }

      animateValue({ ease: easeInCubic, duration: 3000, end: 50, isCancelled, onUpdate: v => {
        card.style.setProperty('--cursor-angle', `${(360 * sweepDirection * (v / 100) + startAngle)}deg`)
      }})
      animateValue({ ease: easeOutCubic, delay: 3000, duration: 4500, start: 50, end: 100, isCancelled, onUpdate: v => {
        card.style.setProperty('--cursor-angle', `${(360 * sweepDirection * (v / 100) + startAngle)}deg`)
      }, onEnd: () => {
        if (isCancelled()) return
        if (!isHoveringRef.current) {
          loopTimerRef.current = setTimeout(() => runSweep(false), loopDelay)
        }
      }})
    }

    runSweepRef.current = () => runSweep(true)
    loopTimerRef.current = setTimeout(() => runSweep(true), initialDelay)

    return () => {
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current)
      activeSweepIdRef.current++
    }
  }, [autoLoop, loopDelay, initialDelay])

  const handlePointerEnter = useCallback(() => {
    if (!autoLoop) return
    isHoveringRef.current = true
    activeSweepIdRef.current++
    if (loopTimerRef.current) {
      clearTimeout(loopTimerRef.current)
      loopTimerRef.current = null
    }
    const card = cardRef.current
    if (!card) return
    card.classList.remove('sweep-active')
    card.style.setProperty('--edge-proximity', '0')
  }, [autoLoop])

  const handlePointerLeave = useCallback(() => {
    if (!autoLoop) return
    isHoveringRef.current = false
    activeSweepIdRef.current++
    if (loopTimerRef.current) {
      clearTimeout(loopTimerRef.current)
      loopTimerRef.current = null
    }
    const card = cardRef.current
    if (!card) return
    card.classList.remove('sweep-active')
    card.style.setProperty('--edge-proximity', '0')
    loopTimerRef.current = setTimeout(() => runSweepRef.current(), loopDelay)
  }, [autoLoop, loopDelay])

  const glowVars = buildGlowVars(glowColor, glowIntensity)

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`border-glow-card ${className}`}
      style={{
        '--card-bg': backgroundColor,
        '--edge-sensitivity': edgeSensitivity,
        '--border-radius': `${borderRadius}px`,
        '--glow-padding': `${glowRadius}px`,
        '--cone-spread': coneSpread,
        '--fill-opacity': fillOpacity,
        ...glowVars,
        ...buildGradientVars(colors),
      } as React.CSSProperties}
    >
      <span className="edge-light" />
      <div className="border-glow-inner">
        {children}
      </div>
    </div>
  )
}
