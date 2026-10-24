import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import WishesTab from './WishesTab.jsx'
import { saveWishes } from '../../lib/game.js'

vi.mock('../../lib/game.js', () => ({ saveWishes: vi.fn() }))
vi.mock('../../hooks/useWishes.js', () => ({
  useWishes: () => ({ data: ['A {name}'], loading: false }),
}))

beforeEach(() => vi.clearAllMocks())

test('thêm mẫu rồi Lưu gọi saveWishes với mảng mới', async () => {
  render(<WishesTab />)
  fireEvent.click(screen.getByRole('button', { name: /thêm lời chúc/i }))
  const boxes = screen.getAllByRole('textbox')
  fireEvent.change(boxes[1], { target: { value: 'B {name}' } })
  fireEvent.click(screen.getByRole('button', { name: /lưu tất cả/i }))
  await waitFor(() => expect(saveWishes).toHaveBeenCalledWith(['A {name}', 'B {name}']))
})

test('mẫu chỉ khoảng trắng bị loại khi lưu', async () => {
  render(<WishesTab />)
  fireEvent.click(screen.getByRole('button', { name: /thêm lời chúc/i }))
  fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: '   ' } })
  fireEvent.click(screen.getByRole('button', { name: /lưu tất cả/i }))
  await waitFor(() => expect(saveWishes).toHaveBeenCalledWith(['A {name}']))
})

test('xóa một mẫu rồi lưu', async () => {
  render(<WishesTab />)
  fireEvent.click(screen.getByRole('button', { name: /xóa/i }))
  fireEvent.click(screen.getByRole('button', { name: /lưu tất cả/i }))
  await waitFor(() => expect(saveWishes).toHaveBeenCalledWith([]))
})

test('có nhắc dùng {name} để chèn tên', () => {
  render(<WishesTab />)
  expect(screen.getByText(/\{name\}/, { selector: 'p' })).toBeInTheDocument()
})
