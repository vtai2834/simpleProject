# CLAUDE.md

Hướng dẫn cho Claude khi làm việc trong repo này.

## Dự án là gì
Web mini-game 20/10 cho nhóm 5 người phụ nữ. Chủ repo đã chuẩn bị 5 lọ hoa. Mỗi người mở link trên điện thoại, gõ tên, chơi **gacha capsule** và nhận ngẫu nhiên 1 lọ hoa kèm pháo giấy, cánh hoa rơi và lời chúc có chèn tên. Admin đăng nhập (nút 🔒 góc trên phải) để xem ai nhận gì, sửa quà, sửa lời chúc, reset.

Spec: `docs/superpowers/specs/2026-10-24-gacha-20-10-design.md`. Plan: `docs/superpowers/plans/2026-10-24-gacha-20-10.md`. Checklist kiểm tay: `docs/CHECKLIST.md`.

## Stack và lệnh
Vite + React (JS), framer-motion, canvas-confetti, Firebase (Firestore + Auth email/password), Vitest.
- `npm run dev` · `npm test` (unit, jsdom) · `npm run build`
- `npm run test:emu`: test Firestore Rules và bốc đồng thời với Emulator, **cần Java**.
- Cấu hình Firebase trong `.env.local` (`VITE_FIREBASE_*`, `VITE_ADMIN_EMAIL`), không commit.

## Quy tắc nghiệp vụ (quan trọng)
- Mỗi lọ hoa chỉ thuộc đúng 1 người; bốc thăm **atomic** bằng `runTransaction` trên `game/state`.
- **Idempotent**: cùng `deviceId` (localStorage `gacha2010.deviceId`) hoặc cùng tên chuẩn hóa thì trả lại kết quả cũ.
- Tên chuẩn hóa (`normalizeName`): trim, bỏ dấu, lowercase, gộp khoảng trắng. Tên hiển thị tối đa 30 ký tự.
- Lời chúc là template có `{name}`, được **chốt tại lúc bốc** (lưu trong assignment).
- Người chơi tự gõ tên, không có danh sách cố định. Người thứ 6 trở đi thấy "hết quà".

## Dữ liệu Firestore
```
prizes/{id}      { name, imageUrl, order }
config/wishes    { templates: string[] }
game/state       { remaining: string[], assignments: {[normName]: {name, prizeId, wish, drawnAt}},
                   devices: {[deviceId]: normName}, lastDraw?: {key, deviceId, prizeId} }
```
- `lastDraw` do người chơi ghi kèm mỗi lần bốc để Firestore Rules đối chiếu (Rules không lấy được phần tử của Set). `resetGame` xóa nó.
- Rules (`firestore.rules`): `prizes`, `config` chỉ admin ghi; người chơi chỉ được `update` `game/state` khi đúng 1 quà bị bỏ khỏi `remaining` và thêm đúng 1 assignment + 1 device. Email admin hard-code trong rules, nhớ đổi.

## Cấu trúc
```
src/
  components/   NameForm, ConfirmName, GachaMachine, Capsule, PrizeReveal, StatusScreens, PetalRain
    admin/      AdminButton, LoginModal, AdminPanel, PlayersTab, PrizesTab, WishesTab
  data/         defaultPrizes.js, defaultWishes.js (chỉ để seed lần đầu)
  lib/          computeDraw (thuần), draw (transaction), game (init/reset/CRUD quà), gameState,
                normalizeName, wish, deviceId, celebrate, firebase
  hooks/        useGameState, usePrizes, useWishes, useAuth, useDoc
  App.jsx       điều phối màn hình: name → confirm → gacha → result (+ soldout/notOpen/error)
tests/          test cần Emulator (rules, draw đồng thời)
```

## Giao diện
Hồng pastel + kem, đỏ đô làm màu nhấn, font Pacifico cho tiêu đề, mobile-first, tôn trọng `prefers-reduced-motion`.

## Quy ước làm việc
- Trả lời và comment bằng tiếng Việt, tên biến / hàm bằng tiếng Anh.
- TDD: viết test trước, thấy fail rồi mới code.
- YAGNI: không âm thanh, bảng xếp hạng, upload ảnh, đa admin.
- Không commit `.env.local` hay khóa Firebase.

## Trạng thái
Code xong theo plan. **Chưa được kiểm chứng:** `npm run test:emu` (máy dev chưa có Java) và giao diện/animation trên trình duyệt và điện thoại thật.
