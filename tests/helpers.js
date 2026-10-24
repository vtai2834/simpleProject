import { readFileSync } from 'node:fs'
import { initializeTestEnvironment } from '@firebase/rules-unit-testing'

export const ADMIN_UID = 'REPLACE_WITH_ADMIN_UID' // phải trùng UID trong firestore.rules
export const PROJECT_ID = 'demo-gacha-2010'

export async function makeEnv() {
  return initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules: readFileSync('firestore.rules', 'utf8'), host: '127.0.0.1', port: 8080 },
  })
}

export const PRIZE_IDS = ['p1', 'p2', 'p3', 'p4', 'p5']

export function openState(overrides = {}) {
  return { remaining: [...PRIZE_IDS], assignments: {}, devices: {}, ...overrides }
}

// Ghi dữ liệu nền bỏ qua rules
export async function seed(env, { state = openState(), wishes = ['Chúc {name}'] } = {}) {
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore()
    await db.doc('game/state').set(state)
    await db.doc('config/wishes').set({ templates: wishes })
    for (const [i, id] of PRIZE_IDS.entries()) {
      await db.doc(`prizes/${id}`).set({ name: `Lọ ${i + 1}`, imageUrl: '', order: i })
    }
  })
}
