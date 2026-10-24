import { computeDraw } from './computeDraw.js'

const baseState = () => ({
  remaining: ['p1', 'p2', 'p3', 'p4', 'p5'],
  assignments: {},
  devices: {},
})
const input = (over = {}) => ({
  name: 'Lan',
  deviceId: 'd1',
  templates: ['Chúc {name}'],
  now: 1000,
  rand: () => 0,
  ...over,
})

test('bốc mới ghi assignment, device và bỏ quà khỏi remaining', () => {
  const r = computeDraw(baseState(), input())
  expect(r.kind).toBe('new')
  expect(r.nextState.remaining).toHaveLength(4)
  expect(r.nextState.remaining).not.toContain(r.assignment.prizeId)
  expect(r.nextState.assignments.lan).toEqual(r.assignment)
  expect(r.nextState.devices.d1).toBe('lan')
  expect(r.assignment).toMatchObject({ name: 'Lan', drawnAt: 1000, wish: 'Chúc Lan' })
})

test('cùng deviceId nhưng gõ tên khác trả về kết quả cũ', () => {
  const first = computeDraw(baseState(), input())
  const again = computeDraw(first.nextState, input({ name: 'Mai' }))
  expect(again.kind).toBe('existing')
  expect(again.assignment).toEqual(first.assignment)
})

test('cùng normName nhưng khác deviceId trả về kết quả cũ', () => {
  const first = computeDraw(baseState(), input())
  const again = computeDraw(first.nextState, input({ name: ' lan ', deviceId: 'd2' }))
  expect(again.kind).toBe('existing')
  expect(again.assignment).toEqual(first.assignment)
})

test('hết quà với người mới trả về soldout', () => {
  const s = { ...baseState(), remaining: [] }
  expect(computeDraw(s, input()).kind).toBe('soldout')
})

test('tên toàn khoảng trắng trả về invalid', () => {
  expect(computeDraw(baseState(), input({ name: '   ' })).kind).toBe('invalid')
})

test('5 người khác nhau nhận 5 quà đôi một khác nhau', () => {
  let state = baseState()
  const ids = []
  ;['An', 'Bình', 'Chi', 'Dung', 'Em'].forEach((name, i) => {
    const r = computeDraw(state, input({ name, deviceId: `d${i}`, rand: () => 0.5 }))
    expect(r.kind).toBe('new')
    ids.push(r.assignment.prizeId)
    state = r.nextState
  })
  expect(new Set(ids).size).toBe(5)
  expect(state.remaining).toHaveLength(0)
})

test('không mutate state đầu vào', () => {
  const s = baseState()
  const copy = structuredClone(s)
  computeDraw(s, input())
  expect(s).toEqual(copy)
})

test('templates rỗng vẫn có lời chúc chứa tên', () => {
  const r = computeDraw(baseState(), input({ templates: [] }))
  expect(r.assignment.wish).toContain('Lan')
})

test('tên dài hơn 30 ký tự bị cắt trong assignment', () => {
  const r = computeDraw(baseState(), input({ name: 'a'.repeat(50) }))
  expect(r.assignment.name).toHaveLength(30)
})
