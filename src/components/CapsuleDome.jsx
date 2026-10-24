import { useEffect, useRef } from 'react'
import Matter from 'matter-js'
import { buildWalls, clampGravity, tornadoForce } from '../lib/domePhysics.js'

const { Engine, Bodies, Body, Composite } = Matter

const SIZE = 280
const CENTER = { x: SIZE / 2, y: SIZE / 2 }
const INNER_RADIUS = 128
const COLORS = ['#ff4d8d', '#c026d3', '#ffd27a', '#8b5cf6', '#ff8fb3', '#38bdf8', '#34d399', '#fb7185', '#f59e0b', '#e879f9']

function drawCapsule(ctx, body, color) {
  const r = body.circleRadius
  ctx.save()
  ctx.translate(body.position.x, body.position.y)
  ctx.rotate(body.angle)
  ctx.shadowColor = color
  ctx.shadowBlur = 14

  // nửa trên: màu đậm
  ctx.beginPath()
  ctx.arc(0, 0, r, Math.PI, 0)
  ctx.closePath()
  const top = ctx.createLinearGradient(0, -r, 0, 0)
  top.addColorStop(0, 'rgba(255,255,255,0.75)')
  top.addColorStop(0.35, color)
  top.addColorStop(1, color)
  ctx.fillStyle = top
  ctx.fill()

  // nửa dưới: ngọc trai
  ctx.shadowBlur = 0
  ctx.beginPath()
  ctx.arc(0, 0, r, 0, Math.PI)
  ctx.closePath()
  const bottom = ctx.createLinearGradient(0, 0, 0, r)
  bottom.addColorStop(0, '#ffffff')
  bottom.addColorStop(1, '#ead7ff')
  ctx.fillStyle = bottom
  ctx.fill()

  // đường nối
  ctx.strokeStyle = 'rgba(0,0,0,0.18)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(-r, 0)
  ctx.lineTo(r, 0)
  ctx.stroke()

  // điểm sáng
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.beginPath()
  ctx.ellipse(-r * 0.38, -r * 0.42, r * 0.22, r * 0.12, -0.6, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

// Các capsule lăn và va chạm thật trong bóng thủy tinh. Nghiêng điện thoại thì capsule trượt theo.
// jsdom không có canvas nên getContext trả null và component tự bỏ qua.
export default function CapsuleDome({ phase }) {
  const canvasRef = useRef(null)
  const phaseRef = useRef(phase)
  phaseRef.current = phase

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext?.('2d')
    if (!ctx) return undefined

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = SIZE * dpr
    canvas.height = SIZE * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const engine = Engine.create({ gravity: { x: 0, y: 1, scale: 0.0012 } })
    const walls = buildWalls(CENTER.x, CENTER.y, INNER_RADIUS, 30, 70).map((w) =>
      Bodies.rectangle(w.x, w.y, w.width, w.height, { isStatic: true, angle: w.angle, restitution: 0.6, friction: 0.02 }),
    )
    const balls = COLORS.map((color, i) => {
      const angle = (i / COLORS.length) * Math.PI * 2
      const dist = 30 + Math.random() * 60
      const body = Bodies.circle(CENTER.x + Math.cos(angle) * dist, CENTER.y + 20 + Math.sin(angle) * dist * 0.6, 20, {
        restitution: 0.55,
        friction: 0.02,
        frictionAir: 0.012,
        density: 0.0012,
      })
      body.colorHex = color
      return body
    })
    Composite.add(engine.world, [...walls, ...balls])

    let tiltX = 0
    const onTilt = (e) => { tiltX = clampGravity(e.gamma) }
    window.addEventListener('deviceorientation', onTilt)

    let raf = 0
    let last = performance.now()
    let nextNudge = last + 1800

    const frame = (now) => {
      const dt = Math.min(now - last, 33)
      last = now
      const p = phaseRef.current

      if (p === 'shaking') {
        // lật trọng lực liên tục + lực xoáy + xung ngẫu nhiên: capsule bay tứ tung
        const amp = reduce ? 0.3 : 1.5
        engine.gravity.y = Math.sin(now * 0.013) * amp
        engine.gravity.x = Math.cos(now * 0.017) * amp * 0.6
        for (const b of balls) {
          const f = tornadoForce(b.position, CENTER, 0.0045 * b.mass)
          Body.applyForce(b, b.position, {
            x: f.x + (Math.random() - 0.5) * 0.004 * b.mass,
            y: f.y + (Math.random() - 0.5) * 0.004 * b.mass,
          })
        }
      } else {
        engine.gravity.y = 1
        engine.gravity.x = tiltX
        if (!reduce && p === 'idle' && now > nextNudge) {
          const b = balls[Math.floor(Math.random() * balls.length)]
          Body.applyForce(b, b.position, { x: (Math.random() - 0.5) * 0.02 * b.mass, y: -0.03 * b.mass })
          nextNudge = now + 1500 + Math.random() * 1500
        }
      }

      Engine.update(engine, dt)
      ctx.clearRect(0, 0, SIZE, SIZE)
      for (const b of balls) drawCapsule(ctx, b, b.colorHex)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('deviceorientation', onTilt)
      Composite.clear(engine.world, false)
      Engine.clear(engine)
    }
  }, [])

  return <canvas ref={canvasRef} className="dome-canvas" style={{ width: SIZE, height: SIZE }} aria-hidden="true" />
}
