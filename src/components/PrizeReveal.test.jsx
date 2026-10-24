import { render, screen, fireEvent } from '@testing-library/react'
import PrizeReveal from './PrizeReveal.jsx'

vi.mock('../lib/celebrate.js', () => ({ celebrate: vi.fn() }))

const assignment = { name: 'Lan', prizeId: 'p1', wish: 'Chúc Lan thật vui', drawnAt: 1 }

test('có prize thì hiện tên quà và lời chúc', () => {
  render(<PrizeReveal prize={{ name: 'Lọ hồng', imageUrl: 'http://x/a.png' }} assignment={assignment} />)
  expect(screen.getByText('Lọ hồng')).toBeInTheDocument()
  expect(screen.getByText('Chúc Lan thật vui')).toBeInTheDocument()
})

test('prize null vẫn hiện "Một lọ hoa bí mật" và lời chúc', () => {
  render(<PrizeReveal prize={null} assignment={assignment} />)
  expect(screen.getByText(/Một lọ hoa bí mật/)).toBeInTheDocument()
  expect(screen.getByText('Chúc Lan thật vui')).toBeInTheDocument()
})

test('ảnh lỗi chuyển sang placeholder', () => {
  render(<PrizeReveal prize={{ name: 'Lọ hồng', imageUrl: 'http://x/broken.png' }} assignment={assignment} />)
  fireEvent.error(screen.getByRole('img', { name: 'Lọ hồng' }))
  expect(screen.getByTestId('prize-placeholder')).toBeInTheDocument()
})

test('imageUrl rỗng hiện placeholder', () => {
  render(<PrizeReveal prize={{ name: 'Lọ hồng', imageUrl: '' }} assignment={assignment} />)
  expect(screen.getByTestId('prize-placeholder')).toBeInTheDocument()
})
