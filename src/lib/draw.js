import { doc, runTransaction } from 'firebase/firestore'
import { db } from './firebase.js'
import { computeDraw } from './computeDraw.js'
import { getDeviceId } from './deviceId.js'

// Bốc thăm atomic trên game/state. Trả về { status, assignment? }.
export async function draw(name) {
  const stateRef = doc(db, 'game', 'state')
  const wishesRef = doc(db, 'config', 'wishes')
  const deviceId = getDeviceId()

  return runTransaction(db, async (tx) => {
    const stateSnap = await tx.get(stateRef)
    if (!stateSnap.exists()) throw new Error('GAME_NOT_OPEN')
    const wishesSnap = await tx.get(wishesRef)
    const templates = wishesSnap.exists() ? wishesSnap.data().templates ?? [] : []
    const s = stateSnap.data()
    const state = {
      remaining: s.remaining ?? [],
      assignments: s.assignments ?? {},
      devices: s.devices ?? {},
    }

    const result = computeDraw(state, { name, deviceId, templates, now: Date.now(), rand: Math.random })
    if (result.kind === 'new') {
      tx.update(stateRef, result.nextState)
      return { status: 'new', assignment: result.assignment }
    }
    if (result.kind === 'existing') return { status: 'existing', assignment: result.assignment }
    return { status: result.kind }
  })
}
