import { useEffect, useRef } from 'react'

const GOLD = '255, 210, 122'
const ROSE = '255, 143, 190'

// Bụi sao lấp lánh nền bằng canvas. Tự giảm số hạt trên màn hình nhỏ và dừng khi bật giảm chuyển động.
export default function Sparkles({ density = 1 }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext?.('2d')
    if (!ctx) return undefined

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    let stars = []
    let raf = 0

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(90, (w * h) / 14000) * density)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.8,
        speed: 0.4 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2,
        vy: -0.05 - Math.random() * 0.18,
        color: Math.random() < 0.65 ? GOLD : ROSE,
      }))
    }

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h)
      for (const s of stars) {
        const a = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * 0.001 * s.speed + s.phase))
        s.y += s.vy
        if (s.y < -4) s.y = h + 4
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 5)
        g.addColorStop(0, `rgba(${s.color}, ${a})`)
        g.addColorStop(1, `rgba(${s.color}, 0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * 5, 0, Math.PI * 2)
        ctx.fill()
        // tia chữ thập cho các ngôi sao lớn
        if (s.r > 1.7) {
          ctx.strokeStyle = `rgba(${s.color}, ${a * 0.8})`
          ctx.lineWidth = 0.7
          ctx.beginPath()
          ctx.moveTo(s.x - s.r * 4, s.y)
          ctx.lineTo(s.x + s.r * 4, s.y)
          ctx.moveTo(s.x, s.y - s.r * 4)
          ctx.lineTo(s.x, s.y + s.r * 4)
          ctx.stroke()
        }
      }
      if (!reduce) raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [density])

  return <canvas ref={ref} className="sparkles" aria-hidden="true" />
}
