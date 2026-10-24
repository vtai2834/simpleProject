import { useState } from 'react'
import { getSoundEnabled, play, setSoundEnabled } from '../lib/sfx.js'

// Nút bật/tắt âm thanh cố định ở góc trên trái
export default function SoundToggle() {
  const [on, setOn] = useState(getSoundEnabled())

  const toggle = () => {
    const next = !on
    setSoundEnabled(next) // bật ngay trong lúc bấm để trình duyệt cho phép phát tiếng
    setOn(next)
    if (next) play('tap')
  }

  return (
    <button
      className="sound-fab"
      type="button"
      onClick={toggle}
      aria-label={on ? 'Tắt âm thanh' : 'Bật âm thanh'}
      title={on ? 'Tắt âm thanh' : 'Bật âm thanh'}
    >
      {on ? '🔊' : '🔇'}
    </button>
  )
}
