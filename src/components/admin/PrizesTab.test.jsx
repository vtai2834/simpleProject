import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PrizesTab from './PrizesTab.jsx'
import { addPrize, updatePrize, deletePrize } from '../../lib/game.js'

vi.mock('../../lib/game.js', () => ({
  addPrize: vi.fn(),
  updatePrize: vi.fn(),
  deletePrize: vi.fn(),
}))
vi.mock('../../hooks/usePrizes.js', () => ({
  usePrizes: () => ({
    data: [{ id: 'p1', name: 'Lọ hồng', imageUrl: 'http://x/a.png' }],
    loading: false,
  }),
}))

beforeEach(() => vi.clearAllMocks())

test('sửa tên rồi Lưu gọi updatePrize(id, {name})', async () => {
  render(<PrizesTab />)
  fireEvent.change(screen.getByLabelText('Tên quà'), { target: { value: 'Lọ tím' } })
  fireEvent.click(screen.getByRole('button', { name: /^lưu$/i }))
  await waitFor(() => expect(updatePrize).toHaveBeenCalledWith('p1', { name: 'Lọ tím' }))
})

test('chưa sửa gì thì nút Lưu bị vô hiệu', () => {
  render(<PrizesTab />)
  expect(screen.getByRole('button', { name: /^lưu$/i })).toBeDisabled()
})

test('xóa quà đã có người nhận hiện cảnh báo', async () => {
  deletePrize.mockRejectedValue(new Error('PRIZE_ASSIGNED'))
  render(<PrizesTab />)
  fireEvent.click(screen.getByRole('button', { name: /xóa/i }))
  expect(await screen.findByText(/đã có người nhận, không xóa được/i)).toBeInTheDocument()
})

test('URL ảnh lỗi thì xem trước hiện placeholder', () => {
  render(<PrizesTab />)
  fireEvent.error(screen.getByRole('img', { name: /xem trước/i }))
  expect(screen.getByTestId('thumb-placeholder')).toBeInTheDocument()
})

test('Thêm quà gọi addPrize', async () => {
  render(<PrizesTab />)
  fireEvent.click(screen.getByRole('button', { name: /thêm quà/i }))
  await waitFor(() => expect(addPrize).toHaveBeenCalledTimes(1))
})
