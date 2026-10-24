import { getDeviceId, resetDeviceIdCache } from './deviceId.js'

beforeEach(() => {
  localStorage.clear()
  resetDeviceIdCache()
  vi.restoreAllMocks()
})

test('getDeviceId gọi hai lần ra cùng giá trị', () => {
  expect(getDeviceId()).toBe(getDeviceId())
})

test('getDeviceId lưu vào localStorage khóa gacha2010.deviceId', () => {
  const id = getDeviceId()
  expect(localStorage.getItem('gacha2010.deviceId')).toBe(id)
})

test('getDeviceId vẫn trả chuỗi không rỗng khi localStorage ném lỗi', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
  const id = getDeviceId()
  expect(id.length).toBeGreaterThan(0)
  expect(getDeviceId()).toBe(id)
})
