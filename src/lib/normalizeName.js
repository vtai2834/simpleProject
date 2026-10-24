const MAX_NAME_LENGTH = 30

// Gộp khoảng trắng và bỏ khoảng trắng đầu/cuối
function collapse(name) {
  return String(name ?? '').trim().replace(/\s+/g, ' ')
}

// Khóa so khớp tên: bỏ dấu, lowercase, gộp khoảng trắng
export function normalizeName(name) {
  return collapse(name)
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

// Tên hiển thị: giữ dấu, cắt tối đa 30 ký tự
export function sanitizeDisplayName(name) {
  return Array.from(collapse(name)).slice(0, MAX_NAME_LENGTH).join('')
}
