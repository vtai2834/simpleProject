import { getSoundEnabled, setSoundEnabled, play, resetSfxForTest } from './sfx.js'

beforeEach(() => {
  localStorage.clear()
  resetSfxForTest()
})

test('mặc định âm thanh tắt', () => {
  expect(getSoundEnabled()).toBe(false)
})

test('bật rồi đọc lại được và lưu vào localStorage', () => {
  setSoundEnabled(true)
  expect(getSoundEnabled()).toBe(true)
  expect(localStorage.getItem('gacha2010.sound')).toBe('1')
})

test('đọc lại từ localStorage sau khi reset bộ nhớ tạm', () => {
  localStorage.setItem('gacha2010.sound', '1')
  resetSfxForTest()
  expect(getSoundEnabled()).toBe(true)
})

test('localStorage ném lỗi vẫn không crash và vẫn bật tắt được trong bộ nhớ', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
  expect(getSoundEnabled()).toBe(false)
  setSoundEnabled(true)
  expect(getSoundEnabled()).toBe(true)
  vi.restoreAllMocks()
})

test('play không crash khi tắt tiếng hoặc môi trường không có AudioContext', () => {
  expect(() => play('spin')).not.toThrow()
  setSoundEnabled(true)
  expect(() => play('crack')).not.toThrow()
  expect(() => play('khong-co-ten-nay')).not.toThrow()
})

test('play chỉ tạo AudioContext khi đã bật tiếng', () => {
  const Ctx = vi.fn(function FakeAudioContext() {
    return {
    currentTime: 0,
    destination: {},
    state: 'running',
    resume: vi.fn(),
    createOscillator: () => ({ connect: vi.fn(), start: vi.fn(), stop: vi.fn(), frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() }, type: '' }),
    createGain: () => ({ connect: vi.fn(), gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() } }),
    createBuffer: () => ({ getChannelData: () => new Float32Array(10) }),
    createBufferSource: () => ({ connect: vi.fn(), start: vi.fn(), stop: vi.fn(), buffer: null }),
    createBiquadFilter: () => ({ connect: vi.fn(), frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }, type: '', Q: { value: 0 } }),
    sampleRate: 44100,
    }
  })
  window.AudioContext = Ctx
  play('spin')
  expect(Ctx).not.toHaveBeenCalled()
  setSoundEnabled(true)
  play('spin')
  expect(Ctx).toHaveBeenCalledTimes(1)
  delete window.AudioContext
})
