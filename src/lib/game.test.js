import { initGame } from './game.js'

const mocks = vi.hoisted(() => ({
  tx: { get: vi.fn(), set: vi.fn(), update: vi.fn(), delete: vi.fn() },
  setDoc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  batchSet: vi.fn(),
}))

vi.mock('./firebase.js', () => ({ db: {} }))
vi.mock('firebase/firestore', () => ({
  collection: (_db, name) => ({ path: name }),
  doc: (_db, ...path) => ({ path: path.join('/') }),
  getDoc: mocks.getDoc,
  getDocs: mocks.getDocs,
  setDoc: mocks.setDoc,
  updateDoc: vi.fn(),
  writeBatch: () => ({ set: mocks.batchSet, commit: vi.fn() }),
  runTransaction: async (_db, fn) => fn(mocks.tx),
}))

beforeEach(() => {
  vi.clearAllMocks()
  mocks.getDocs.mockResolvedValue({ empty: false, docs: [{ id: 'p1' }, { id: 'p2' }] })
  mocks.getDoc.mockResolvedValue({ exists: () => true })
})

test('initGame không ghi đè game/state đang tồn tại', async () => {
  mocks.tx.get.mockResolvedValue({ exists: () => true })
  await initGame()
  expect(mocks.tx.set).not.toHaveBeenCalled()
  expect(mocks.setDoc).not.toHaveBeenCalled()
})

test('initGame tạo game/state với toàn bộ id quà khi chưa tồn tại', async () => {
  mocks.tx.get.mockResolvedValue({ exists: () => false })
  await initGame()
  expect(mocks.tx.set).toHaveBeenCalledWith(
    { path: 'game/state' },
    { remaining: ['p1', 'p2'], assignments: {}, devices: {} },
  )
})
