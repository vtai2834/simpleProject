import { render, screen, fireEvent } from '@testing-library/react'
import { MotionGlobalConfig } from 'framer-motion'
import GachaMachine from './GachaMachine.jsx'

beforeAll(() => {
  MotionGlobalConfig.skipAnimations = true
})

test('ở idle có nút Quay và bấm gọi onSpinStart', () => {
  const onSpinStart = vi.fn()
  render(<GachaMachine phase="idle" onSpinStart={onSpinStart} onPhaseDone={() => {}} />)
  fireEvent.click(screen.getByRole('button', { name: /quay/i }))
  expect(onSpinStart).toHaveBeenCalledTimes(1)
})

test('ở shaking nút Quay bị vô hiệu', () => {
  render(<GachaMachine phase="shaking" onSpinStart={() => {}} onPhaseDone={() => {}} />)
  expect(screen.getByRole('button', { name: /quay/i })).toBeDisabled()
})

test('mỗi phase hoạt ảnh kết thúc sẽ gọi onPhaseDone với đúng tên phase', async () => {
  const onPhaseDone = vi.fn()
  render(<GachaMachine phase="dropping" onSpinStart={() => {}} onPhaseDone={onPhaseDone} />)
  await vi.waitFor(() => expect(onPhaseDone).toHaveBeenCalledWith('dropping'))
})

test('phase done gọi onPhaseDone("done")', async () => {
  const onPhaseDone = vi.fn()
  render(<GachaMachine phase="done" onSpinStart={() => {}} onPhaseDone={onPhaseDone} />)
  await vi.waitFor(() => expect(onPhaseDone).toHaveBeenCalledWith('done'))
})
