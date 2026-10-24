import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { celebrate } from '../lib/celebrate.js'
import { play } from '../lib/sfx.js'
import { vibrate } from '../lib/haptics.js'

const clamp = (v, lim) => Math.max(-lim, Math.min(lim, v))

function Placeholder() {
  return (
    <div className="prize-placeholder" data-testid="prize-placeholder" aria-hidden="true">
      💐
    </div>
  )
}

// prize có thể null (quà đã bị xóa khỏi danh sách) — vẫn hiện lời chúc
export default function PrizeReveal({ prize, assignment }) {
  const [imgFailed, setImgFailed] = useState(false)

  // Nghiêng 3D theo ngón tay hoặc con quay của điện thoại
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const tiltX = useSpring(rx, { stiffness: 110, damping: 14 })
  const tiltY = useSpring(ry, { stiffness: 110, damping: 14 })

  useEffect(() => {
    const stop = celebrate()
    play('reveal')
    vibrate([30, 40, 30, 40, 90])
    return typeof stop === 'function' ? stop : undefined
  }, [])

  // Admin sửa lại URL ảnh thì thử tải lại
  useEffect(() => { setImgFailed(false) }, [prize?.imageUrl])

  useEffect(() => {
    const onTilt = (e) => {
      if (typeof e.gamma !== 'number' || typeof e.beta !== 'number') return
      ry.set(clamp(e.gamma / 3, 14))
      rx.set(clamp(-(e.beta - 45) / 3, 14))
    }
    window.addEventListener('deviceorientation', onTilt)
    return () => window.removeEventListener('deviceorientation', onTilt)
  }, [rx, ry])

  const onPointerMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    ry.set((((e.clientX - r.left) / r.width) - 0.5) * 22)
    rx.set(-(((e.clientY - r.top) / r.height) - 0.5) * 22)
  }
  const resetTilt = () => { rx.set(0); ry.set(0) }

  const showImage = prize?.imageUrl && !imgFailed
  const words = assignment.wish.split(/\s+/).filter(Boolean)

  return (
    <>
      <motion.div
        className="flash-in"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        aria-hidden="true"
      />
      <div className="sunburst" aria-hidden="true" />

      <motion.div
        className="reveal-wrap"
        initial={{ opacity: 0, scale: 0.4, y: 80, rotateX: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
        transition={{ type: 'spring', stiffness: 90, damping: 13, delay: 0.25 }}
      >
        <motion.div
          className="card reveal"
          style={{ rotateX: tiltX, rotateY: tiltY }}
          onPointerMove={onPointerMove}
          onPointerLeave={resetTilt}
        >
          <p className="script">Chúc mừng {assignment.name}!</p>
          <p className="subtitle">Bạn nhận được</p>
          <motion.div
            className="prize-frame"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {showImage ? (
              <img
                className="prize-img"
                src={prize.imageUrl}
                alt={prize.name}
                onError={() => setImgFailed(true)}
              />
            ) : (
              <Placeholder />
            )}
          </motion.div>
          <motion.h2
            className="title title--name"
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.9, duration: 0.7 }}
          >
            {prize ? prize.name : 'Một lọ hoa bí mật 🌸'}
          </motion.h2>
          {/* Bản đầy đủ cho trình đọc màn hình; bản hiện từng từ chỉ để làm đẹp */}
          <p className="sr-only">{assignment.wish}</p>
          <p className="wish" aria-hidden="true">
            {words.map((w, i) => (
              <motion.span
                key={i}
                className="w"
                initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 1.4 + i * 0.07, duration: 0.45 }}
              >
                {w}
              </motion.span>
            ))}
          </p>
        </motion.div>
      </motion.div>
    </>
  )
}
