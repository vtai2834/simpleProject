import { doc } from 'firebase/firestore'
import { db } from '../lib/firebase.js'
import { useSnapshot } from './useDoc.js'

const ref = doc(db, 'game', 'state')

// data = null nếu trò chơi chưa khởi tạo
export function useGameState() {
  return useSnapshot(ref, (snap) => {
    if (!snap.exists()) return null
    const s = snap.data()
    return { remaining: s.remaining ?? [], assignments: s.assignments ?? {}, devices: s.devices ?? {} }
  })
}
