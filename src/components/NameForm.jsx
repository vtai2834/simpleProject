import { useState } from 'react'
import { motion } from 'framer-motion'
import { sanitizeDisplayName } from '../lib/normalizeName.js'

export default function NameForm({ onSubmit }) {
  const [value, setValue] = useState('')
  const clean = sanitizeDisplayName(value)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (clean) onSubmit(clean)
  }

  return (
    <motion.form
      className="card name-form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 14 }}
    >
      <motion.div
        className="hero-flower"
        animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        🌸
      </motion.div>
      <h1 className="title">Chúc mừng 20/10</h1>
      <p className="subtitle">Gõ tên của bạn để nhận một lọ hoa bất ngờ nhé!</p>
      <input
        className="input"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tên của bạn"
        autoComplete="off"
        maxLength={60}
      />
      <motion.button
        className="btn"
        type="submit"
        disabled={!clean}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
      >
        Vào quay quà
      </motion.button>
    </motion.form>
  )
}
