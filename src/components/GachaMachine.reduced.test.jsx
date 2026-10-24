import { render } from '@testing-library/react'
import { MotionGlobalConfig } from 'framer-motion'
import GachaMachine from './GachaMachine.jsx'

// Giả lập người dùng bật "Giảm chuyển động" trước khi framer-motion đọc cài đặt
beforeAll(() => {
  MotionGlobalConfig.skipAnimations = false
  window.matchMedia = (query) => ({
    matches: query.includes('prefers-reduced-motion'),
    media: query,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
  })
})

test('giảm chuyển động: đổi từ idle sang shaking vẫn báo xong để game không bị kẹt', async () => {
  const onPhaseDone = vi.fn()
  const props = { onSpinStart: () => {}, onPhaseDone }
  const { rerender } = render(<GachaMachine phase="idle" {...props} />)
  // đợi animation mount của idle xong rồi mới chuyển phase, giống luồng thật
  await new Promise((r) => setTimeout(r, 300))
  onPhaseDone.mockClear()
  rerender(<GachaMachine phase="shaking" {...props} />)
  await vi.waitFor(() => expect(onPhaseDone).toHaveBeenCalledWith('shaking'), { timeout: 1500 })
})
