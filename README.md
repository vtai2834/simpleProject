# 🌸 Gacha Hoa 20/10

Mini-game tặng quà 20/10: mỗi bạn gõ tên, quay gacha capsule và nhận ngẫu nhiên một lọ hoa, kèm lời chúc riêng.

> Trạng thái: **đang lên kế hoạch** (chưa có code).

## Cách chơi
1. Mở link trên điện thoại.
2. Gõ tên của bạn.
3. Bấm nút để máy gacha nhả capsule.
4. Capsule mở ra lọ hoa của bạn, kèm pháo giấy, cánh hoa rơi và lời chúc.

Mỗi lọ hoa chỉ thuộc về một người. Mở lại link sẽ thấy lại kết quả cũ.

## Công nghệ
- Vite + React
- Firebase Firestore (lưu kết quả dùng chung)
- framer-motion, canvas-confetti

## Chạy thử (sẽ có sau khi code xong)
```bash
npm install
cp .env.example .env.local   # điền VITE_FIREBASE_*
npm run dev
```

## Setup Firebase (dự kiến, ~5 phút)
1. Vào https://console.firebase.google.com → tạo project.
2. Add app Web → copy config vào `.env.local`.
3. Build → Firestore Database → Create (test mode là đủ cho nhóm nhỏ).
4. Tạo document `game/state` bằng script khởi tạo của repo (sẽ bổ sung).

## Roadmap
- [x] Chốt ý tưởng và `CLAUDE.md`
- [ ] Chốt thiết kế (spec)
- [ ] Scaffold Vite + React
- [ ] Giao diện + animation gacha
- [ ] Nối Firestore, bốc thăm atomic
- [ ] Lời chúc riêng + ảnh 5 lọ hoa
- [ ] Deploy và gửi link
