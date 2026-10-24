import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { celebrate } from '../lib/celebrate.js'

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

  useEffect(() => {
    celebrate()
  }, [])

  const showImage = prize?.imageUrl && !imgFailed

  return (
    <motion.div
      className="card reveal"
      initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 110, damping: 12 }}
    >
      <p className="subtitle">Chúc mừng {assignment.name}! Bạn nhận được</p>
      <motion.div
        className="prize-frame"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
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
      <h2 className="title title--name">{prize ? prize.name : 'Một lọ hoa bí mật 🌸'}</h2>
      <p className="wish">{assignment.wish}</p>
    </motion.div>
  )
}
