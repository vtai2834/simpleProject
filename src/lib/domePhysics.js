// Phần toán thuần cho bóng thủy tinh vật lý (matter-js), tách riêng để test được.

// Xấp xỉ một vòng tròn rỗng bằng các đoạn tường hình chữ nhật xếp quanh tâm.
// Trả về mô tả từng đoạn: tâm (x, y), kích thước và góc xoay (radian).
export function buildWalls(cx, cy, radius, segments = 28, thickness = 60) {
  const dist = radius + thickness / 2
  const segLen = ((2 * Math.PI * dist) / segments) * 1.15 // dài hơn chút để các đoạn chồng nhau, không hở
  const walls = []
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2
    walls.push({
      x: cx + Math.cos(a) * dist,
      y: cy + Math.sin(a) * dist,
      width: segLen,
      height: thickness,
      angle: a + Math.PI / 2, // trục dài của đoạn tường nằm theo tiếp tuyến
    })
  }
  return walls
}

// Góc nghiêng điện thoại (gamma, độ) -> trọng lực ngang trong [-1, 1]
export function clampGravity(gamma) {
  if (typeof gamma !== 'number' || Number.isNaN(gamma)) return 0
  return Math.max(-1, Math.min(1, gamma / 40))
}

// Lực xoáy quanh tâm: vuông góc với bán kính, độ lớn = strength
export function tornadoForce(pos, center, strength) {
  const dx = pos.x - center.x
  const dy = pos.y - center.y
  const d = Math.hypot(dx, dy)
  if (d < 1e-6) return { x: 0, y: 0 }
  return { x: (-dy / d) * strength, y: (dx / d) * strength }
}
