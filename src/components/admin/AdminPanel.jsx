import { useState } from 'react'
import { initGame, resetGame } from '../../lib/game.js'
import { useGameState } from '../../hooks/useGameState.js'
import { usePrizes } from '../../hooks/usePrizes.js'
import PlayersTab from './PlayersTab.jsx'

const TABS = [
  { id: 'players', label: 'Người chơi' },
  { id: 'prizes', label: 'Quà' },
  { id: 'wishes', label: 'Lời chúc' },
]

export default function AdminPanel({ onClose, onLogout }) {
  const game = useGameState()
  const prizes = usePrizes()
  const [tab, setTab] = useState('players')
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const notStarted = !game.loading && game.data === null
  const actionLabel = notStarted ? 'Khởi tạo trò chơi' : 'Reset trò chơi'

  const runAction = async () => {
    setBusy(true)
    setError('')
    try {
      await (notStarted ? initGame() : resetGame())
      setConfirming(false)
    } catch {
      setError('Không thực hiện được, kiểm tra mạng hoặc quyền Firestore.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-overlay" role="dialog" aria-label="Bảng điều khiển admin">
      <div className="admin-panel">
        <header className="admin-head">
          <h2>Admin</h2>
          <div className="row">
            <button className="btn btn--small btn--ghost" type="button" onClick={onLogout}>Đăng xuất</button>
            <button className="btn btn--small" type="button" onClick={onClose}>Đóng</button>
          </div>
        </header>

        <nav className="admin-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={tab === t.id ? 'admin-tab is-active' : 'admin-tab'}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="admin-body">
          {tab === 'players' && <PlayersTab game={game.data} prizes={prizes.data} />}
          {tab === 'prizes' && <p className="admin-empty">Đang cập nhật…</p>}
          {tab === 'wishes' && <p className="admin-empty">Đang cập nhật…</p>}
        </div>

        <footer className="admin-foot">
          {!confirming ? (
            <button className="btn btn--small btn--danger" type="button" onClick={() => setConfirming(true)}>
              {actionLabel}
            </button>
          ) : (
            <div className="confirm-box">
              <p>
                {notStarted
                  ? 'Tạo dữ liệu mẫu và mở trò chơi?'
                  : 'Xóa toàn bộ kết quả và cho mọi người chơi lại từ đầu?'}
              </p>
              <div className="row">
                <button className="btn btn--small btn--ghost" type="button" onClick={() => setConfirming(false)}>Hủy</button>
                <button className="btn btn--small btn--danger" type="button" disabled={busy} onClick={runAction}>Xác nhận</button>
              </div>
            </div>
          )}
          {error && <p className="admin-error">{error}</p>}
        </footer>
      </div>
    </div>
  )
}
