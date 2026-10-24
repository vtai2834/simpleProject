import { motion } from 'framer-motion'

// Capsule hai nửa; open=true thì hai nửa tách ra
export default function Capsule({ color = '#ff8fb3', size = 56, open = false }) {
  const half = {
    width: size,
    height: size / 2,
    background: color,
    boxShadow: 'inset 0 -6px 0 rgba(0,0,0,0.08)',
  }
  return (
    <div className="capsule" style={{ width: size, height: size }} aria-hidden="true">
      <motion.div
        className="capsule-half capsule-top"
        style={{ ...half, borderRadius: `${size}px ${size}px 0 0` }}
        animate={open ? { y: -size * 0.7, rotate: -28, x: -size * 0.2 } : { y: 0, rotate: 0, x: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 10 }}
      />
      <motion.div
        className="capsule-half capsule-bottom"
        style={{ ...half, background: '#fff', borderRadius: `0 0 ${size}px ${size}px` }}
        animate={open ? { y: size * 0.5, rotate: 22, x: size * 0.2 } : { y: 0, rotate: 0, x: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 10 }}
      />
    </div>
  )
}
