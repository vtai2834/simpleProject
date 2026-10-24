import { useState } from 'react'

export default function LoginModal({ onLogin, onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await onLogin(email.trim(), password)
    } catch (err) {
      setError(err?.message === 'NOT_ADMIN' ? 'Không có quyền' : 'Sai email hoặc mật khẩu')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-overlay" role="dialog" aria-label="Đăng nhập admin">
      <form className="card login-card" onSubmit={submit}>
        <h2 className="title">Admin</h2>
        <input
          className="input"
          type="email"
          placeholder="Email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="Mật khẩu"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="admin-error">{error}</p>}
        <div className="row">
          <button className="btn btn--ghost" type="button" onClick={onClose}>Hủy</button>
          <button className="btn" type="submit" disabled={busy || !email || !password}>Đăng nhập</button>
        </div>
      </form>
    </div>
  )
}
