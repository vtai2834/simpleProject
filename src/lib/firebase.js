import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const env = import.meta.env

// Thiếu cấu hình thì dùng giá trị tạm để app không crash lúc khởi tạo
export const isFirebaseConfigured = Boolean(env.VITE_FIREBASE_PROJECT_ID && env.VITE_FIREBASE_API_KEY)

const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY || 'missing',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'missing.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'missing',
  appId: env.VITE_FIREBASE_APP_ID || 'missing',
})

export const db = getFirestore(app)
export const auth = getAuth(app)
