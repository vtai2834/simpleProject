// Âm thanh tổng hợp bằng WebAudio (không cần file âm thanh). Mặc định TẮT, bật bằng nút 🔊.
const KEY = 'gacha2010.sound'
let enabled = null
let ctx = null

export function resetSfxForTest() {
  enabled = null
  ctx = null
}

export function getSoundEnabled() {
  if (enabled === null) {
    try {
      enabled = localStorage.getItem(KEY) === '1'
    } catch {
      enabled = false
    }
  }
  return enabled
}

export function setSoundEnabled(value) {
  enabled = Boolean(value)
  try {
    localStorage.setItem(KEY, enabled ? '1' : '0')
  } catch {
    // bỏ qua: vẫn giữ trong bộ nhớ
  }
  if (enabled) getContext() // tạo AudioContext ngay trong lúc người dùng bấm nút
}

function getContext() {
  if (typeof window === 'undefined') return null
  const Ctor = window.AudioContext || window.webkitAudioContext
  if (!Ctor) return null
  if (!ctx) {
    try {
      ctx = new Ctor()
    } catch {
      return null
    }
  }
  if (ctx.state === 'suspended') ctx.resume?.()
  return ctx
}

// Một nốt: tần số lướt từ f0 sang f1 trong `dur` giây, bắt đầu sau `at` giây
function tone(c, { at = 0, dur = 0.3, f0 = 440, f1 = f0, type = 'sine', vol = 0.2 }) {
  const t0 = c.currentTime + at
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(f0, t0)
  if (f1 !== f0) osc.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), t0 + dur)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.linearRampToValueAtTime(vol, t0 + Math.min(0.02, dur / 4))
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g)
  g.connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

// Nhiễu qua bộ lọc: dùng cho tiếng lạch cạch, vỡ, xì
function noise(c, { at = 0, dur = 0.3, from = 2000, to = from, vol = 0.2 }) {
  const t0 = c.currentTime + at
  const len = Math.max(1, Math.floor(c.sampleRate * dur))
  const buffer = c.createBuffer(1, len, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  const src = c.createBufferSource()
  src.buffer = buffer
  const filter = c.createBiquadFilter()
  filter.type = 'bandpass'
  filter.Q.value = 1.2
  filter.frequency.setValueAtTime(from, t0)
  if (to !== from) filter.frequency.exponentialRampToValueAtTime(Math.max(to, 1), t0 + dur)
  const g = c.createGain()
  g.gain.setValueAtTime(vol, t0)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  src.connect(filter)
  filter.connect(g)
  g.connect(c.destination)
  src.start(t0)
  src.stop(t0 + dur + 0.05)
}

const NOTES = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1568]

const SOUNDS = {
  tap: (c) => tone(c, { dur: 0.12, f0: 700, f1: 520, type: 'triangle', vol: 0.12 }),

  // Máy rung, capsule lạch cạch
  spin: (c) => {
    tone(c, { dur: 1.8, f0: 70, f1: 110, type: 'sawtooth', vol: 0.07 })
    for (let i = 0; i < 14; i++) {
      noise(c, { at: i * 0.12, dur: 0.07, from: 1500 + (i % 4) * 700, vol: 0.12 })
    }
  },

  // Capsule rơi và nảy
  drop: (c) => {
    tone(c, { dur: 0.25, f0: 220, f1: 60, type: 'sine', vol: 0.35 })
    tone(c, { at: 0.32, dur: 0.14, f0: 160, f1: 70, type: 'sine', vol: 0.18 })
    noise(c, { dur: 0.1, from: 900, vol: 0.12 })
  },

  // Năng lượng dồn lại trước khi vỡ
  charge: (c) => {
    tone(c, { dur: 1.6, f0: 200, f1: 1400, type: 'sawtooth', vol: 0.08 })
    tone(c, { dur: 1.6, f0: 300, f1: 2100, type: 'triangle', vol: 0.06 })
  },

  // Vỡ và tỏa sáng
  crack: (c) => {
    noise(c, { dur: 0.5, from: 6000, to: 800, vol: 0.35 })
    tone(c, { dur: 0.6, f0: 880, f1: 880, type: 'triangle', vol: 0.15 })
    tone(c, { at: 0.05, dur: 0.9, f0: 1318.5, type: 'sine', vol: 0.12 })
  },

  // Chuông lấp lánh khi hiện quà
  reveal: (c) => {
    NOTES.forEach((f, i) => tone(c, { at: i * 0.09, dur: 0.7, f0: f, type: 'sine', vol: 0.14 }))
    tone(c, { at: 0.55, dur: 1.2, f0: 261.63, type: 'triangle', vol: 0.1 })
  },
}

export function play(name) {
  if (!getSoundEnabled()) return
  const sound = SOUNDS[name]
  if (!sound) return
  const c = getContext()
  if (!c) return
  try {
    sound(c)
  } catch {
    // âm thanh lỗi không được làm hỏng trò chơi
  }
}
