import { useMemo } from 'react'

const EMOJIS = ['🌸', '🌷', '💮', '🌺']

// Cánh hoa rơi chậm làm nền; CSS tự tắt khi người dùng bật prefers-reduced-motion
export default function PetalRain({ count = 16 }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 14 + Math.random() * 18,
        duration: 9 + Math.random() * 9,
        delay: -Math.random() * 14,
        sway: 20 + Math.random() * 40,
        emoji: EMOJIS[i % EMOJIS.length],
      })),
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
