import { render, screen, fireEvent } from '@testing-library/react'
import SoundToggle from './SoundToggle.jsx'
import { getSoundEnabled, resetSfxForTest } from '../lib/sfx.js'

beforeEach(() => {
  localStorage.clear()
  resetSfxForTest()
})

test('mặc định âm thanh đang bật nên nút ghi "Tắt âm thanh"', () => {
  render(<SoundToggle />)
  expect(screen.getByRole('button', { name: /tắt âm thanh/i })).toBeInTheDocument()
})

test('bấm nút thì tắt âm thanh và đổi nhãn thành bật', () => {
  render(<SoundToggle />)
  fireEvent.click(screen.getByRole('button', { name: /tắt âm thanh/i }))
  expect(getSoundEnabled()).toBe(false)
  expect(screen.getByRole('button', { name: /bật âm thanh/i })).toBeInTheDocument()
})

test('bấm lần nữa thì bật lại', () => {
  render(<SoundToggle />)
  fireEvent.click(screen.getByRole('button', { name: /tắt âm thanh/i }))
  fireEvent.click(screen.getByRole('button', { name: /bật âm thanh/i }))
  expect(getSoundEnabled()).toBe(true)
})

test('lần trước đã tắt thì mở lại vẫn thấy đang tắt', () => {
  localStorage.setItem('gacha2010.sound', '0')
  render(<SoundToggle />)
  expect(screen.getByRole('button', { name: /bật âm thanh/i })).toBeInTheDocument()
})
