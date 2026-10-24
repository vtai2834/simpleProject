import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import AdminPanel from './AdminPanel.jsx'
import PlayersTab from './PlayersTab.jsx'
import { resetGame, initGame } from '../../lib/game.js'
import { useGameState } from '../../hooks/useGameState.js'

vi.mock('../../lib/game.js', () => ({ resetGame: vi.fn(), initGame: vi.fn() }))
vi.mock('../../hooks/useGameState.js', () => ({ useGameState: vi.fn() }))
vi.mock('../../hooks/usePrizes.js', () => ({
  usePrizes: () => ({
    data: [{ id: 'p1', name: 'Lọ hồng' }, { id: 'p2', name: 'Lọ xanh' }],
    loading: false,
  }),
}))

const prizes = [{ id: 'p1', name: 'Lọ hồng' }, { id: 'p2', name: 'Lọ xanh' }]
const twoPlayers = {
  remaining: ['p3', 'p4', 'p5'],
  assignments: {
    lan: { name: 'Lan', prizeId: 'p1', wish: 'Chúc Lan', drawnAt: 1700000000000 },
    mai: { name: 'Mai', prizeId: 'p9', wish: 'Chúc Mai', drawnAt: 1700000100000 },
  },
  devices: {},
}

beforeEach(() => {
  vi.clearAllMocks()
  useGameState.mockReturnValue({ data: twoPlayers, loading: false })
})

test('PlayersTab hiện 2 người với đúng tên quà và "Còn 3 quà"', () => {
  render(<PlayersTab game={twoPlayers} prizes={prizes} />)
  const lan = screen.getByText('Lan').closest('tr')
  expect(within(lan).getByText('Lọ hồng')).toBeInTheDocument()
  expect(within(lan).getByText('Chúc Lan')).toBeInTheDocument()
  expect(screen.getByText(/Còn 3 quà/)).toBeInTheDocument()
})

test('PlayersTab prizeId không còn trong prizes hiện "(đã xóa)"', () => {
  render(<PlayersTab game={twoPlayers} prizes={prizes} />)
  const mai = screen.getByText('Mai').closest('tr')
  expect(within(mai).getByText('(đã xóa)')).toBeInTheDocument()
})

test('PlayersTab rỗng hiện "Chưa ai chơi"', () => {
  render(<PlayersTab game={{ remaining: [], assignments: {}, devices: {} }} prizes={prizes} />)
  expect(screen.getByText('Chưa ai chơi')).toBeInTheDocument()
})

test('Reset chỉ gọi resetGame sau khi bấm Xác nhận', async () => {
  render(<AdminPanel onClose={() => {}} onLogout={() => {}} />)
  fireEvent.click(screen.getByRole('button', { name: /reset trò chơi/i }))
  expect(resetGame).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('button', { name: /xác nhận/i }))
  await waitFor(() => expect(resetGame).toHaveBeenCalledTimes(1))
})

test('trò chơi chưa khởi tạo thì nút là Khởi tạo và gọi initGame sau xác nhận', async () => {
  useGameState.mockReturnValue({ data: null, loading: false })
  render(<AdminPanel onClose={() => {}} onLogout={() => {}} />)
  fireEvent.click(screen.getByRole('button', { name: /khởi tạo/i }))
  fireEvent.click(screen.getByRole('button', { name: /xác nhận/i }))
  await waitFor(() => expect(initGame).toHaveBeenCalledTimes(1))
  expect(resetGame).not.toHaveBeenCalled()
})

test('bấm Hủy trong hộp xác nhận không reset', () => {
  render(<AdminPanel onClose={() => {}} onLogout={() => {}} />)
  fireEvent.click(screen.getByRole('button', { name: /reset trò chơi/i }))
  fireEvent.click(screen.getByRole('button', { name: /hủy/i }))
  expect(resetGame).not.toHaveBeenCalled()
})
