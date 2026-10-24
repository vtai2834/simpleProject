import { useEffect, useRef, useState } from 'react'
import { saveWishes } from '../../lib/game.js'
import { useWishes } from '../../hooks/useWishes.js'

export default function WishesTab() {
  const { data } = useWishes()
  const [list, setList] = useState(data)
  const [message, setMessage] = useState('')
  const dirty = useRef(false)

  // Đồng bộ từ Firestore khi chưa có chỉnh sửa dở
  const serialized = JSON.stringify(data)
  useEffect(() => {
    if (!dirty.current) setList(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialized])

  const change = (next) => {
    dirty.current = true
    setList(next)
  }

  const save = async () => {
    const cleaned = list.map((w) => w.trim()).filter(Boolean)
    setMessage('')
    try {
      await saveWishes(cleaned)
      dirty.current = false
      setList(cleaned)
      setMessage('Đã lưu ✔')
    } catch {
      setMessage('Lưu không được, thử lại nhé')
    }
  }

  return (
    <div className="admin-section">
      <p className="admin-hint">Dùng {'{name}'} để chèn tên người chơi vào lời chúc.</p>
      {list.map((w, i) => (
        <div className="admin-card" key={i}>
          <textarea
            className="input"
            rows={2}
            aria-label={`Lời chúc ${i + 1}`}
            value={w}
            onChange={(e) => change(list.map((x, j) => (j === i ? e.target.value : x)))}
          />
          <div className="row">
            <button
              className="btn btn--small btn--danger"
              type="button"
              onClick={() => change(list.filter((_, j) => j !== i))}
            >
              Xóa
            </button>
          </div>
        </div>
      ))}
      <div className="row">
        <button className="btn btn--small btn--ghost" type="button" onClick={() => change([...list, ''])}>
          Thêm lời chúc
        </button>
        <button className="btn btn--small" type="button" onClick={save}>Lưu tất cả</button>
      </div>
      {message && <p className="admin-note">{message}</p>}
    </div>
  )
}
