import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth.js'
import LoginModal from './LoginModal.jsx'
import AdminPanel from './AdminPanel.jsx'

// Nút nhỏ cố định góc trên phải
export default function AdminButton() {
  const { isAdmin, login, logout } = useAuth()
  const [open, setOpen] = useState(false)

  const handleLogin = async (email, password) => {
    await login(email, password)
  }

  return (
    <>
      <button className="admin-fab" type="button" onClick={() => setOpen(true)} aria-label="Admin">
        {isAdmin ? '⚙️' : '🔒'}
      </button>
      {open && !isAdmin && <LoginModal onLogin={handleLogin} onClose={() => setOpen(false)} />}
      {open && isAdmin && (
        <AdminPanel
          onClose={() => setOpen(false)}
          onLogout={async () => { await logout(); setOpen(false) }}
        />
      )}
    </>
  )
}
