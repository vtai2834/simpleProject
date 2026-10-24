import confetti from 'canvas-confetti'

const COLORS = ['#ff8fb3', '#ffc2d6', '#fff0f5', '#ff6f9c', '#ffd6a5']

// Pháo giấy cánh hoa 🌸 bắn nhiều đợt rồi rơi nhẹ
export function celebrate() {
  const petal = confetti.shapeFromText({ text: '🌸', scalar: 2 })
  const base = {
    shapes: [petal, 'circle'],
    scalar: 2,
    colors: COLORS,
    disableForReducedMotion: true,
    zIndex: 50,
  }

  confetti({ ...base, particleCount: 90, spread: 80, origin: { x: 0.5, y: 0.55 }, startVelocity: 45 })

  const end = Date.now() + 2500
  const frame = () => {
    confetti({ ...base, particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, gravity: 0.7 })
    confetti({ ...base, particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, gravity: 0.7 })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()

  setTimeout(() => {
    confetti({ ...base, particleCount: 60, spread: 120, origin: { x: 0.5, y: 0.2 }, gravity: 0.5, ticks: 300 })
  }, 900)
}
