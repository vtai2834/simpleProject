import { renderWish, pickWish, DEFAULT_WISH } from './wish.js'

test('renderWish thay mọi {name}', () => {
  expect(renderWish('{name} ơi, vui nhé {name}', 'Lan')).toBe('Lan ơi, vui nhé Lan')
})
test('pickWish với danh sách rỗng dùng mẫu mặc định có tên', () => {
  expect(pickWish([], 'Lan', () => 0)).toContain('Lan')
  expect(DEFAULT_WISH).toContain('{name}')
})
test('pickWish thêm tiền tố khi mẫu không có {name}', () => {
  expect(pickWish(['Chúc vui'], 'Lan', () => 0).startsWith('Lan ơi, ')).toBe(true)
})
test('pickWish chọn mẫu theo rand', () => {
  expect(pickWish(['A {name}', 'B {name}'], 'Lan', () => 0.99)).toBe('B Lan')
})
