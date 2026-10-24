const KEY = 'gacha2010.deviceId'
let cached = null

export function resetDeviceIdCache() {
  cached = null
}

function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `d-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

// UUID theo thiết bị; localStorage bị chặn thì giữ tạm trong bộ nhớ
export function getDeviceId() {
  if (cached) return cached
  try {
    const saved = localStorage.getItem(KEY)
    if (saved) return (cached = saved)
  } catch {
    // bỏ qua
  }
  cached = newId()
  try {
    localStorage.setItem(KEY, cached)
  } catch {
    // bỏ qua
  }
  return cached
}
