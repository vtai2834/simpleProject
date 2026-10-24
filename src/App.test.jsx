import { render, screen } from '@testing-library/react'
import App from './App.jsx'

test('App hiển thị tiêu đề Chúc mừng 20/10', () => {
  render(<App />)
  expect(screen.getByText(/Chúc mừng 20\/10/)).toBeInTheDocument()
})
