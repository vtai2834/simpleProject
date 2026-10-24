import { motion } from 'framer-motion'

export default function ConfirmName({ name, onConfirm, onBack }) {
  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 160, damping: 14 }}
    >
      <p className="subtitle">Bạn là</p>
      <h2 className="title title--name">{name}</h2>
      <p className="subtitle">đúng không? Mỗi người chỉ quay được một lần thôi nha 💕</p>
      <div className="row">
        <button className="btn btn--ghost" type="button" onClick={onBack}>Sửa lại</button>
        <button className="btn" type="button" onClick={onConfirm}>Đúng rồi!</button>
      </div>
    </motion.div>
  )
}
