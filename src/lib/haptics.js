// Rung điện thoại nhẹ (nếu thiết bị hỗ trợ); không làm gì ở nơi không có
export function vibrate(pattern) {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(pattern)
    }
  } catch {
    // bỏ qua
  }
}
