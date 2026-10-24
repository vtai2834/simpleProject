import { getSoundEnabled, setSoundEnabled, play, unlockAudio, resetSfxForTest } from './sfx.js'

beforeEach(() => {
  localStorage.clear()
  resetSfxForTest()
})

function installFakeAudioContext() {
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
  return Ctx
}

afterEach(() => {
  delete window.AudioContext
})

test('mặc định âm thanh bật', () => {
  expect(getSoundEnabled()).toBe(true)
})

test('tắt rồi đọc lại được và lưu vào localStorage', () => {
  setSoundEnabled(false)
  expect(getSoundEnabled()).toBe(false)
  expect(localStorage.getItem('gacha2010.sound')).toBe('0')
})

test('người dùng đã tắt thì lần sau vào vẫn tắt', () => {
  localStorage.setItem('gacha2010.sound', '0')
  resetSfxForTest()
  expect(getSoundEnabled()).toBe(false)
})

test('localStorage ném lỗi vẫn không crash, mặc định bật và vẫn tắt được trong bộ nhớ', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
  expect(getSoundEnabled()).toBe(true)
  setSoundEnabled(false)
  expect(getSoundEnabled()).toBe(false)
  vi.restoreAllMocks()
})

test('play không crash khi môi trường không có AudioContext hoặc tên không tồn tại', () => {
  expect(() => play('spin')).not.toThrow()
  expect(() => play('khong-co-ten-nay')).not.toThrow()
})

test('khi tắt tiếng thì play không tạo AudioContext', () => {
  const Ctx = installFakeAudioContext()
  setSoundEnabled(false)
  play('spin')
  expect(Ctx).not.toHaveBeenCalled()
})

test('khi bật tiếng play tạo AudioContext đúng một lần và dùng lại', () => {
  const Ctx = installFakeAudioContext()
  play('spin')
  play('drop')
  expect(Ctx).toHaveBeenCalledTimes(1)
})

test('unlockAudio tạo AudioContext ngay khi đang bật tiếng', () => {
  const Ctx = installFakeAudioContext()
  unlockAudio()
  expect(Ctx).toHaveBeenCalledTimes(1)
})

test('unlockAudio không làm gì khi đã tắt tiếng', () => {
  const Ctx = installFakeAudioContext()
  setSoundEnabled(false)
  unlockAudio()
  expect(Ctx).not.toHaveBeenCalled()
})
