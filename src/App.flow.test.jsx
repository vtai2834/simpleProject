import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useEffect } from 'react'
import App from './App.jsx'
import { draw } from './lib/draw.js'
import { useGameState } from './hooks/useGameState.js'

vi.mock('./lib/draw.js', () => ({ draw: vi.fn() }))
vi.mock('./lib/celebrate.js', () => ({ celebrate: vi.fn() }))
vi.mock('./lib/deviceId.js', () => ({ getDeviceId: () => 'dev1' }))
vi.mock('./hooks/useAuth.js', () => ({
  useAuth: () => ({ user: null, isAdmin: false, loading: false, login: vi.fn(), logout: vi.fn() }),
}))
vi.mock('./hooks/useGameState.js', () => ({ useGameState: vi.fn() }))
vi.mock('./hooks/usePrizes.js', () => ({
  usePrizes: () => ({ data: [{ id: 'p1', name: 'Lọ hồng', imageUrl: '' }], loading: false }),
}))
// Máy gacha giả: tự báo hoàn thành mỗi phase để test luồng không phụ thuộc animation
vi.mock('./components/GachaMachine.jsx', () => ({
  default: function FakeMachine({ phase, onSpinStart, onPhaseDone }) {
    useEffect(() => {
      if (phase !== 'idle') onPhaseDone(phase)
    }, [phase])
    return <button onClick={onSpinStart}>Quay</button>
  },
}))

const openState = { data: { remaining: ['p1'], assignments: {}, devices: {} }, loading: false }
const assignment = { name: 'Lan', prizeId: 'p1', wish: 'Chúc Lan thật vui', drawnAt: 1 }

async function playAs(name) {
  fireEvent.change(screen.getByPlaceholderText(/tên của bạn/i), { target: { value: name } })
  fireEvent.click(screen.getByRole('button', { name: /vào quay quà/i }))
  fireEvent.click(screen.getByRole('button', { name: /đúng rồi/i }))
}

beforeEach(() => {
  vi.clearAllMocks()
  useGameState.mockReturnValue(openState)
})

test('màn đầu hiện tiêu đề Chúc mừng 20/10', () => {
  render(<App />)
  expect(screen.getByText(/Chúc mừng 20\/10/)).toBeInTheDocument()
})

test('draw new dẫn tới màn kết quả', async () => {
  draw.mockResolvedValue({ status: 'new', assignment })
  render(<App />)
  await playAs('Lan')
  fireEvent.click(screen.getByRole('button', { name: /quay/i }))
  expect(await screen.findByText('Chúc Lan thật vui')).toBeInTheDocument()
  expect(screen.getByText('Lọ hồng')).toBeInTheDocument()
})

test('soldout dẫn tới màn hết quà', async () => {
  draw.mockResolvedValue({ status: 'soldout' })
  render(<App />)
  await playAs('Lan')
  fireEvent.click(screen.getByRole('button', { name: /quay/i }))
  expect(await screen.findByText(/hết quà/i)).toBeInTheDocument()
})

test('GAME_NOT_OPEN dẫn tới màn Sắp mở', async () => {
  draw.mockRejectedValue(new Error('GAME_NOT_OPEN'))
  render(<App />)
  await playAs('Lan')
  fireEvent.click(screen.getByRole('button', { name: /quay/i }))
  expect(await screen.findByText(/Sắp mở nhé/)).toBeInTheDocument()
})

test('lỗi khác hiện màn lỗi, thử lại gọi draw lần nữa', async () => {
  draw.mockRejectedValueOnce(new Error('network')).mockResolvedValueOnce({ status: 'new', assignment })
  render(<App />)
  await playAs('Lan')
  fireEvent.click(screen.getByRole('button', { name: /quay/i }))
  fireEvent.click(await screen.findByRole('button', { name: /thử lại/i }))
  fireEvent.click(await screen.findByRole('button', { name: /quay/i }))
  expect(await screen.findByText('Chúc Lan thật vui')).toBeInTheDocument()
  expect(draw).toHaveBeenCalledTimes(2)
})

test('bấm Quay hai lần liên tiếp chỉ gọi draw một lần', async () => {
  draw.mockResolvedValue({ status: 'new', assignment })
  render(<App />)
  await playAs('Lan')
  const btn = screen.getByRole('button', { name: /quay/i })
  fireEvent.click(btn)
  fireEvent.click(btn)
  await screen.findByText('Chúc Lan thật vui')
  expect(draw).toHaveBeenCalledTimes(1)
})

test('thiết bị đã chơi vào thẳng màn kết quả', async () => {
  useGameState.mockReturnValue({
    data: { remaining: [], assignments: { lan: assignment }, devices: { dev1: 'lan' } },
    loading: false,
  })
  render(<App />)
  expect(await screen.findByText('Chúc Lan thật vui')).toBeInTheDocument()
  expect(draw).not.toHaveBeenCalled()
})

test('trò chơi chưa khởi tạo hiện Sắp mở nhé', () => {
  useGameState.mockReturnValue({ data: null, loading: false })
  render(<App />)
  expect(screen.getByText(/Sắp mở nhé/)).toBeInTheDocument()
})
