import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing'
import { ADMIN_UID, makeEnv, openState, seed } from './helpers.js'

let env
beforeAll(async () => { env = await makeEnv() })
afterAll(async () => { await env.cleanup() })
beforeEach(async () => {
  await env.clearFirestore()
  await seed(env)
})

const guest = () => env.unauthenticatedContext().firestore()
const admin = () => env.authenticatedContext(ADMIN_UID).firestore()

// Trạng thái hợp lệ sau khi bốc 1 quà
const afterDraw = (over = {}) => ({
  remaining: ['p2', 'p3', 'p4', 'p5'],
  assignments: { lan: { name: 'Lan', prizeId: 'p1', wish: 'Chúc Lan', drawnAt: 1 } },
  devices: { dev1: 'lan' },
  lastDraw: { key: 'lan', deviceId: 'dev1', prizeId: 'p1' },
  ...over,
})

test('khách đọc prizes được', async () => {
  await assertSucceeds(guest().doc('prizes/p1').get())
})

test('khách ghi prizes bị chặn', async () => {
  await assertFails(guest().doc('prizes/p1').update({ name: 'hack' }))
})

test('khách ghi config/wishes bị chặn', async () => {
  await assertFails(guest().doc('config/wishes').set({ templates: ['x'] }))
})

test('khách bốc hợp lệ 1 quà thì được', async () => {
  await assertSucceeds(guest().doc('game/state').update(afterDraw()))
})

test('khách lấy 2 quà một lần bị chặn', async () => {
  const twoPrizes = afterDraw({ remaining: ['p3', 'p4', 'p5'] })
  await assertFails(guest().doc('game/state').update(twoPrizes))
})

test('khách ghi assignment trỏ tới quà khác với remaining bị bỏ bị chặn', async () => {
  const mismatch = afterDraw({
    assignments: { lan: { name: 'Lan', prizeId: 'p2', wish: 'x', drawnAt: 1 } },
  })
  await assertFails(guest().doc('game/state').update(mismatch))
})

test('khách thêm khóa lạ vào state bị chặn', async () => {
  await assertFails(guest().doc('game/state').update(afterDraw({ hack: true })))
})

test('khách sửa assignment của người khác bị chặn', async () => {
  const taken = openState({
    remaining: ['p2', 'p3', 'p4', 'p5'],
    assignments: { mai: { name: 'Mai', prizeId: 'p1', wish: 'x', drawnAt: 1 } },
    devices: { devM: 'mai' },
  })
  await seed(env, { state: taken })
  const steal = {
    remaining: ['p3', 'p4', 'p5'],
    assignments: { mai: { name: 'Lan', prizeId: 'p2', wish: 'x', drawnAt: 2 } },
    devices: { devM: 'mai', dev1: 'lan' },
    lastDraw: { key: 'lan', deviceId: 'dev1', prizeId: 'p2' },
  }
  await assertFails(guest().doc('game/state').update(steal))
})

test('khách xóa game/state bị chặn', async () => {
  await assertFails(guest().doc('game/state').delete())
})

test('khách tạo mới game/state bị chặn', async () => {
  await env.withSecurityRulesDisabled((ctx) => ctx.firestore().doc('game/state').delete())
  await assertFails(guest().doc('game/state').set(openState()))
})

test('admin ghi mọi thứ được', async () => {
  await assertSucceeds(admin().doc('prizes/p1').update({ name: 'Mới' }))
  await assertSucceeds(admin().doc('config/wishes').set({ templates: ['x'] }))
  await assertSucceeds(admin().doc('game/state').set(openState()))
})

test('tài khoản đăng nhập nhưng không phải admin bị chặn, kể cả mang email admin', async () => {
  const other = env.authenticatedContext('u2', { email: 'admin@example.com' }).firestore()
  await assertFails(other.doc('prizes/p1').update({ name: 'hack' }))
})

test('khách ghi lời chúc quá 500 ký tự bị chặn', async () => {
  const big = afterDraw({
    assignments: { lan: { name: 'Lan', prizeId: 'p1', wish: 'x'.repeat(501), drawnAt: 1 } },
  })
  await assertFails(guest().doc('game/state').update(big))
})

test('khách ghi tên quá 30 ký tự bị chặn', async () => {
  const long = afterDraw({
    assignments: { lan: { name: 'a'.repeat(31), prizeId: 'p1', wish: 'x', drawnAt: 1 } },
  })
  await assertFails(guest().doc('game/state').update(long))
})

test('khách ghi drawnAt không phải số bị chặn', async () => {
  const bad = afterDraw({
    assignments: { lan: { name: 'Lan', prizeId: 'p1', wish: 'x', drawnAt: 'now' } },
  })
  await assertFails(guest().doc('game/state').update(bad))
})
