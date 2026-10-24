import { normalizeName, sanitizeDisplayName } from './normalizeName.js'

test('normalizeName bỏ khoảng trắng thừa và lowercase', () => {
  expect(normalizeName('  Lan  Anh ')).toBe('lan anh')
})
test('normalizeName bỏ dấu tiếng Việt', () => {
  expect(normalizeName('Hương')).toBe('huong')
})
test('normalizeName xử lý chữ đ', () => {
  expect(normalizeName('Đào')).toBe('dao')
})
test('normalizeName chuỗi toàn khoảng trắng trả về rỗng', () => {
  expect(normalizeName('   ')).toBe('')
})
test('sanitizeDisplayName cắt tối đa 30 ký tự', () => {
  expect(sanitizeDisplayName('a'.repeat(50)).length).toBe(30)
})
test('sanitizeDisplayName trim và gộp khoảng trắng', () => {
  expect(sanitizeDisplayName('  Lan   Anh ')).toBe('Lan Anh')
})
