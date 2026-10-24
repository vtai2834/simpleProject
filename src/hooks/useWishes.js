import { doc } from 'firebase/firestore'
import { db } from '../lib/firebase.js'
import { useSnapshot } from './useDoc.js'

const ref = doc(db, 'config', 'wishes')

// data = mảng mẫu lời chúc (rỗng nếu chưa có)
export function useWishes() {
  const r = useSnapshot(ref, (snap) => (snap.exists() ? snap.data().templates ?? [] : []))
  return { ...r, data: r.data ?? [] }
}
