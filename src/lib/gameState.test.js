import { buildInitialState } from './gameState.js'
import { defaultPrizes } from '../data/defaultPrizes.js'
import { defaultWishes } from '../data/defaultWishes.js'

test('buildInitialState chứa đủ id quà, assignments và devices rỗng', () => {
  expect(buildInitialState(['p1', 'p2'])).toEqual({ remaining: ['p1', 'p2'], assignments: {}, devices: {} })
})

test('defaultPrizes có 5 quà p1..p5 và defaultWishes có >= 6 mẫu đều có {name}', () => {
  expect(defaultPrizes.map((p) => p.id)).toEqual(['p1', 'p2', 'p3', 'p4', 'p5'])
  expect(defaultWishes.length).toBeGreaterThanOrEqual(6)
  expect(defaultWishes.every((w) => w.includes('{name}'))).toBe(true)
})
