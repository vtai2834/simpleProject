import confetti from 'canvas-confetti'

const PALETTES = [
  ['#ffd27a', '#fff1c1', '#f5b942'],
  ['#ff4d8d', '#ff8fbe', '#ffe3ef'],
  ['#c026d3', '#e879f9', '#fdf2f8'],
  ['#ffffff', '#ffd27a', '#ff8fbe'],
]

const rand = (min, max) => min + Math.random() * (max - min)

// Pháo hoa + cánh hoa 🌸 nhiều đợt. Trả về hàm dọn dẹp để dừng khi rời màn hình.
export function celebrate() {
  const petal = confetti.shapeFromText({ text: '🌸', scalar: 2 })
  const base = { disableForReducedMotion: true, zIndex: 50 }
  const timers = []
  let rafId = 0
  let stopped = false

  // 1. Nổ lớn giữa màn hình
  confetti({ ...base, particleCount: 160, spread: 110, startVelocity: 52, origin: { x: 0.5, y: 0.55 }, shapes: [petal, 'star', 'circle'], scalar: 2, colors: PALETTES[0].concat(PALETTES[1]) })

  // 2. Pháo hoa nổ ngẫu nhiên trên cao
  const fireworks = setInterval(() => {
    const colors = PALETTES[Math.floor(Math.random() * PALETTES.length)]
    confetti({
      ...base,
      particleCount: 55,
      spread: 360,
      startVelocity: rand(22, 36),
      gravity: 0.9,
      ticks: 80,
      decay: 0.92,
      shapes: ['star', 'circle'],
      scalar: rand(0.9, 1.4),
      colors,
      origin: { x: rand(0.12, 0.88), y: rand(0.12, 0.45) },
    })
  }, 420)
  timers.push(fireworks)
  timers.push(setTimeout(() => clearInterval(fireworks), 4600))

  // 3. Hai khẩu pháo hai bên
  const end = Date.now() + 2600
  const cannons = () => {
    if (stopped) return
    confetti({ ...base, particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.75 }, gravity: 0.7, shapes: [petal, 'circle'], scalar: 2, colors: PALETTES[1] })
    confetti({ ...base, particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.75 }, gravity: 0.7, shapes: [petal, 'circle'], scalar: 2, colors: PALETTES[0] })
    if (Date.now() < end) rafId = requestAnimationFrame(cannons)
  }
  cannons()

  // 4. Mưa cánh hoa nhẹ từ trên xuống
  const rain = setInterval(() => {
    confetti({ ...base, particleCount: 2, angle: 90, spread: 170, origin: { x: Math.random(), y: -0.1 }, gravity: 0.32, drift: rand(-1, 1), ticks: 420, shapes: [petal], scalar: rand(1.8, 2.8) })
  }, 130)
  timers.push(rain)
  timers.push(setTimeout(() => clearInterval(rain), 8000))

  return () => {
    stopped = true
    cancelAnimationFrame(rafId)
    timers.forEach((id) => { clearInterval(id); clearTimeout(id) })
    confetti.reset()
  }
}
