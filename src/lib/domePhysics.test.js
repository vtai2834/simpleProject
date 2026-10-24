import { buildWalls, clampGravity, tornadoForce } from './domePhysics.js'

test('buildWalls tạo đủ số đoạn tường, mỗi đoạn nằm trên vòng ngoài bán kính', () => {
  const walls = buildWalls(100, 100, 90, 24, 60)
  expect(walls).toHaveLength(24)
  for (const w of walls) {
    const dist = Math.hypot(w.x - 100, w.y - 100)
    expect(dist).toBeCloseTo(90 + 30, 5)
  }
})

test('buildWalls xoay mỗi đoạn vuông góc với bán kính', () => {
  const [w] = buildWalls(0, 0, 50, 8, 20)
  // đoạn đầu tiên ở góc 0 (bên phải tâm) nên phải dựng đứng: góc xoay 90 độ
  expect(w.angle).toBeCloseTo(Math.PI / 2, 5)
})

test('clampGravity giới hạn trong [-1, 1] và xử lý giá trị rỗng', () => {
  expect(clampGravity(100)).toBe(1)
  expect(clampGravity(-100)).toBe(-1)
  expect(clampGravity(20)).toBeCloseTo(0.5, 5)
  expect(clampGravity(null)).toBe(0)
  expect(clampGravity(undefined)).toBe(0)
  expect(clampGravity(Number.NaN)).toBe(0)
})

test('tornadoForce vuông góc với bán kính và có độ lớn đúng', () => {
  const f = tornadoForce({ x: 130, y: 100 }, { x: 100, y: 100 }, 0.02)
  expect(f.x * 30 + f.y * 0).toBeCloseTo(0, 8)
  expect(Math.hypot(f.x, f.y)).toBeCloseTo(0.02, 8)
})

test('tornadoForce ở đúng tâm trả về lực 0 thay vì NaN', () => {
  expect(tornadoForce({ x: 5, y: 5 }, { x: 5, y: 5 }, 0.02)).toEqual({ x: 0, y: 0 })
})
