// Bông hoa SVG nhiều lớp cánh, gradient hồng → vàng, xoay chậm và phát sáng
export default function BloomIcon() {
  const petals = Array.from({ length: 10 }, (_, i) => i * 36)
  return (
    <svg className="bloom" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <radialGradient id="petalGrad" cx="50%" cy="20%" r="80%">
          <stop offset="0%" stopColor="#fff1f7" />
          <stop offset="45%" stopColor="#ff7fae" />
          <stop offset="100%" stopColor="#c026d3" />
        </radialGradient>
        <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff7d6" />
          <stop offset="60%" stopColor="#ffd27a" />
          <stop offset="100%" stopColor="#f5b942" />
        </radialGradient>
      </defs>
      <g className="bloom-petals">
        {petals.map((deg) => (
          <ellipse
            key={deg}
            cx="50"
            cy="28"
            rx="9"
            ry="22"
            fill="url(#petalGrad)"
            opacity="0.82"
            transform={`rotate(${deg} 50 50)`}
          />
        ))}
      </g>
      <circle cx="50" cy="50" r="11" fill="url(#coreGrad)" />
      <circle cx="46" cy="46" r="3.5" fill="#fff" opacity="0.8" />
    </svg>
  )
}
