import { doc, getDoc } from 'firebase/firestore'
import { makeEnv, openState, seed } from './helpers.js'
import { draw } from '../src/lib/draw.js'
import { db } from '../src/lib/firebase.js'

let env
beforeAll(async () => { env = await makeEnv() })
afterAll(async () => { await env.cleanup() })
beforeEach(async () => {
  await env.clearFirestore()
  await seed(env)
})

const names = ['An', 'Bình', 'Chi', 'Dung', 'Em']

test('5 người khác nhau bốc ra 5 quà đôi một khác nhau, người thứ 6 hết quà', async () => {
  const ids = []
  for (const [i, name] of names.entries()) {
    const r = await draw(name, `dev${i}`)
    expect(r.status).toBe('new')
    ids.push(r.assignment.prizeId)
  }
  expect(new Set(ids).size).toBe(5)
  expect((await draw('Fi', 'dev9')).status).toBe('soldout')
})

test('cùng người bốc lại nhận kết quả cũ', async () => {
  const first = await draw('Lan', 'devA')
  const again = await draw('Lan', 'devA')
  expect(again.status).toBe('existing')
  expect(again.assignment.prizeId).toBe(first.assignment.prizeId)
})

test('5 lần draw đồng thời vẫn ra 5 quà khác nhau', async () => {
  const results = await Promise.all(names.map((n, i) => draw(n, `devC${i}`)))
  expect(results.every((r) => r.status === 'new')).toBe(true)
  expect(new Set(results.map((r) => r.assignment.prizeId)).size).toBe(5)
  const state = (await getDoc(doc(db, 'game', 'state'))).data()
  expect(state.remaining).toHaveLength(0)
})

test('game/state chưa tồn tại thì ném GAME_NOT_OPEN', async () => {
  await env.withSecurityRulesDisabled((ctx) => ctx.firestore().doc('game/state').delete())
  await expect(draw('Lan', 'devX')).rejects.toThrow('GAME_NOT_OPEN')
})

test('state không đủ quà (remaining rỗng) trả soldout', async () => {
  await seed(env, { state: openState({ remaining: [] }) })
  expect((await draw('Lan', 'devY')).status).toBe('soldout')
})
