import { useMemo } from 'react'

const EMOJIS = ['🌸', '🌷', '💮', '🌺']

// Cánh hoa rơi có chiều sâu: hạt xa thì nhỏ, mờ, chậm; hạt gần thì to, rõ, nhanh.
// CSS tự tắt khi người dùng bật prefers-reduced-motion.
export default function PetalRain({ count = 18 }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const depth = Math.random() // 0 = xa, 1 = gần
        return {
          id: i,
          left: Math.random() * 100,
          size: 12 + depth * 26,
          duration: 16 - depth * 8 + Math.random() * 4,
          delay: -Math.random() * 16,
          sway: 20 + Math.random() * 50,
          opacity: 0.3 + depth * 0.55,
          blur: depth < 0.3 ? 2.5 : depth > 0.85 ? 1.5 : 0,
          emoji: EMOJIS[i % EMOJIS.length],
        }
      }),
    [count],
  )

  return (
    <div className="petal-rain" aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.id}
          className="petal"
          style={{
            left: `${p.left}%`,
            fontSize: p.size,
            opacity: p.opacity,
            filter: p.blur ? `blur(${p.blur}px)` : undefined,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            '--sway': `${p.sway}px`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  )
}
