import { render, screen, fireEvent } from '@testing-library/react'
import SoundToggle from './SoundToggle.jsx'
import { getSoundEnabled, resetSfxForTest } from '../lib/sfx.js'

beforeEach(() => {
  localStorage.clear()
  resetSfxForTest()
})

test('mặc định hiện nút bật âm thanh (đang tắt)', () => {
  render(<SoundToggle />)
  expect(screen.getByRole('button', { name: /bật âm thanh/i })).toBeInTheDocument()
})

test('bấm nút thì bật âm thanh và đổi nhãn thành tắt', () => {
  render(<SoundToggle />)
  fireEvent.click(screen.getByRole('button', { name: /bật âm thanh/i }))
  expect(getSoundEnabled()).toBe(true)
  expect(screen.getByRole('button', { name: /tắt âm thanh/i })).toBeInTheDocument()
})

test('bấm lần nữa thì tắt lại', () => {
  render(<SoundToggle />)
  fireEvent.click(screen.getByRole('button', { name: /bật âm thanh/i }))
  fireEvent.click(screen.getByRole('button', { name: /tắt âm thanh/i }))
  expect(getSoundEnabled()).toBe(false)
})
