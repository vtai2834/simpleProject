import { collection, orderBy, query } from 'firebase/firestore'
import { db } from '../lib/firebase.js'
import { useSnapshot } from './useDoc.js'

const q = query(collection(db, 'prizes'), orderBy('order'))

// data = mảng { id, name, imageUrl, order }
export function usePrizes() {
  const r = useSnapshot(q, (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  return { ...r, data: r.data ?? [] }
}
