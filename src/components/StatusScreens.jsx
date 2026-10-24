import { motion } from 'framer-motion'

const COPY = {
  notOpen: { emoji: '🌱', title: 'Sắp mở nhé 🌸', text: 'Trò chơi chưa bắt đầu, bạn quay lại sau một lát nha!' },
  soldout: { emoji: '🎁', title: 'Đã hết quà rồi', text: 'Tất cả lọ hoa đã có chủ. Hẹn bạn dịp sau nhé 💕' },
  error: { emoji: '📡', title: 'Có chút trục trặc', text: 'Mạng hơi chập chờn. Lượt của bạn vẫn còn, thử lại nhé!' },
}

export default function StatusScreens({ kind, onRetry }) {
  const c = COPY[kind]
  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="hero-flower" aria-hidden="true">{c.emoji}</div>
      <h2 className="title">{c.title}</h2>
      <p className="subtitle">{c.text}</p>
      {kind === 'error' && (
        <button className="btn" type="button" onClick={onRetry}>Thử lại</button>
      )}
    </motion.div>
  )
}
