import { useState } from 'react'
import { addPrize, deletePrize, updatePrize } from '../../lib/game.js'
import { usePrizes } from '../../hooks/usePrizes.js'

function Thumb({ url, name }) {
  const [failed, setFailed] = useState(false)
  if (!url || failed) {
    return <div className="admin-thumb" data-testid="thumb-placeholder">💐</div>
  }
  return (
    <img
      className="admin-thumb"
      src={url}
      alt={`Xem trước ${name}`}
      onError={() => setFailed(true)}
    />
  )
}

function PrizeCard({ prize }) {
  const [name, setName] = useState(prize.name)
  const [imageUrl, setImageUrl] = useState(prize.imageUrl ?? '')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const patch = {}
  if (name !== prize.name) patch.name = name
  if (imageUrl !== (prize.imageUrl ?? '')) patch.imageUrl = imageUrl
  const dirty = Object.keys(patch).length > 0 && name.trim() !== ''

  const run = async (fn, onError) => {
    setBusy(true)
    setMessage('')
    try {
      await fn()
    } catch (e) {
      setMessage(onError(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-card">
      <div className="row">
        <Thumb key={imageUrl} url={imageUrl} name={name} />
        <div style={{ flex: 1, minWidth: 180, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input className="input" aria-label="Tên quà" value={name} onChange={(e) => setName(e.target.value)} />
          <input
            className="input"
            aria-label="URL ảnh"
            placeholder="https://… (link ảnh)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
      </div>
      <div className="row">
        <button
          className="btn btn--small"
          type="button"
          disabled={!dirty || busy}
          onClick={() => run(() => updatePrize(prize.id, patch), () => 'Lưu không được, thử lại nhé')}
        >
          Lưu
        </button>
        <button
          className="btn btn--small btn--danger"
          type="button"
          disabled={busy}
          onClick={() =>
            run(
              () => deletePrize(prize.id),
              (e) => (e?.message === 'PRIZE_ASSIGNED'
                ? 'Quà này đã có người nhận, không xóa được'
                : 'Xóa không được, thử lại nhé'),
            )
          }
        >
          Xóa
        </button>
      </div>
      {message && <p className="admin-error">{message}</p>}
    </div>
  )
}

export default function PrizesTab() {
  const { data: prizes } = usePrizes()
  const [error, setError] = useState('')

  const add = async () => {
    setError('')
    try {
      await addPrize({ name: 'Quà mới', imageUrl: '' })
    } catch {
      setError('Thêm không được, thử lại nhé')
    }
  }

  return (
    <div className="admin-section">
      {prizes.map((p) => (
        <PrizeCard key={p.id} prize={p} />
      ))}
      <button className="btn btn--small" type="button" onClick={add}>Thêm quà</button>
      {error && <p className="admin-error">{error}</p>}
    </div>
  )
}
