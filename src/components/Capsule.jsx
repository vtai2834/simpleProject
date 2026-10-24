import { motion } from 'framer-motion'

// Capsule bóng bẩy hai nửa; open=true thì hai nửa tách ra
export default function Capsule({ color = '#ff4d8d', size = 56, open = false }) {
  const spring = { type: 'spring', stiffness: 130, damping: 9 }
  return (
    <div className="capsule" style={{ width: size, height: size }} aria-hidden="true">
      <motion.div
        className="capsule-half capsule-top"
        style={{
          width: size,
          height: size / 2,
          borderRadius: `${size}px ${size}px 0 0`,
          background: `linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0) 50%), ${color}`,
          boxShadow: `0 0 ${size / 2}px ${color}`,
        }}
        animate={open ? { y: -size * 0.8, rotate: -32, x: -size * 0.28 } : { y: 0, rotate: 0, x: 0 }}
        transition={spring}
      >
        <span className="capsule-gloss" />
      </motion.div>
      <motion.div
        className="capsule-half capsule-bottom"
        style={{
          width: size,
          height: size / 2,
          borderRadius: `0 0 ${size}px ${size}px`,
          background: 'linear-gradient(180deg, #ffffff, #ead7ff)',
        }}
        animate={open ? { y: size * 0.6, rotate: 26, x: size * 0.28 } : { y: 0, rotate: 0, x: 0 }}
        transition={spring}
      />
    </div>
  )
}
