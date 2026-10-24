import { useCallback, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../lib/firebase.js'

const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || '').trim().toLowerCase()

export function isAdminEmail(email) {
  return Boolean(ADMIN_EMAIL) && (email || '').trim().toLowerCase() === ADMIN_EMAIL
}

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(
    () => onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false) }),
    [],
  )

  // Đăng nhập; tài khoản không phải admin thì đăng xuất ngay và báo lỗi
  const login = useCallback(async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    if (!isAdminEmail(cred.user.email)) {
      await signOut(auth)
      throw new Error('NOT_ADMIN')
    }
  }, [])

  const logout = useCallback(() => signOut(auth), [])

  return { user, loading, isAdmin: isAdminEmail(user?.email), login, logout }
}
