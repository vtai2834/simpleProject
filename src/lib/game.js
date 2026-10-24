import {
  collection, doc, getDoc, getDocs, runTransaction, setDoc, updateDoc, writeBatch,
} from 'firebase/firestore'
import { db } from './firebase.js'
import { buildInitialState } from './gameState.js'
import { defaultPrizes } from '../data/defaultPrizes.js'
import { defaultWishes } from '../data/defaultWishes.js'

export { buildInitialState }

const stateRef = () => doc(db, 'game', 'state')
const prizesCol = () => collection(db, 'prizes')

// Seed quà và lời chúc mẫu nếu chưa có, rồi tạo game/state
export async function initGame() {
  const existing = await getDocs(prizesCol())
  if (existing.empty) {
    const batch = writeBatch(db)
    defaultPrizes.forEach((p, i) => {
      batch.set(doc(db, 'prizes', p.id), { name: p.name, imageUrl: p.imageUrl, order: i })
    })
    await batch.commit()
  }
  const wishes = await getDoc(doc(db, 'config', 'wishes'))
  if (!wishes.exists()) await setDoc(doc(db, 'config', 'wishes'), { templates: defaultWishes })
  await resetGame()
}

// Đặt lại: mọi quà hiện có quay về remaining, xóa người chơi và thiết bị
export async function resetGame() {
  const prizes = await getDocs(prizesCol())
  await setDoc(stateRef(), buildInitialState(prizes.docs.map((d) => d.id)))
}

export async function addPrize({ name, imageUrl }) {
  const ref = doc(prizesCol())
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(stateRef())
    tx.set(ref, { name, imageUrl: imageUrl ?? '', order: Date.now() })
    if (snap.exists()) tx.update(stateRef(), { remaining: [...snap.data().remaining, ref.id] })
  })
}

export async function updatePrize(id, patch) {
  await updateDoc(doc(db, 'prizes', id), patch)
}

// Quà đã có người nhận thì không được xóa
export async function deletePrize(id) {
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(stateRef())
    if (snap.exists()) {
      const s = snap.data()
      if (Object.values(s.assignments ?? {}).some((a) => a.prizeId === id)) {
        throw new Error('PRIZE_ASSIGNED')
      }
      tx.update(stateRef(), { remaining: (s.remaining ?? []).filter((x) => x !== id) })
    }
    tx.delete(doc(db, 'prizes', id))
  })
}

export async function saveWishes(templates) {
  await setDoc(doc(db, 'config', 'wishes'), { templates })
}
