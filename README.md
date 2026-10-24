# 🌸 Gacha Hoa 20/10

Mini-game tặng quà 20/10: mỗi bạn mở link, gõ tên, quay gacha capsule và nhận ngẫu nhiên một lọ hoa, kèm pháo giấy, cánh hoa rơi và lời chúc có tên mình.

## Cách chơi
1. Mở link trên điện thoại.
2. Gõ tên, xác nhận.
3. Bấm **Quay** để máy gacha nhả capsule.
4. Capsule mở ra lọ hoa của bạn kèm lời chúc.

Mỗi lọ hoa chỉ thuộc về một người. Mở lại link trên cùng thiết bị sẽ thấy kết quả cũ.

## Công nghệ
Vite + React, framer-motion, canvas-confetti, Firebase (Firestore + Auth).

## Chạy trên máy
```bash
npm install
cp .env.example .env.local   # rồi điền giá trị Firebase (xem bên dưới)
npm run dev
```
Lệnh khác: `npm test` (unit test), `npm run build`, `npm run test:emu` (cần Java, xem bên dưới).

## Setup Firebase (~5 phút)
1. https://console.firebase.google.com → tạo project.
2. Add app **Web** (`</>`) → copy 4 giá trị config vào `.env.local`:
   `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`.
3. **Build → Firestore Database → Create database** (chế độ production).
4. **Build → Authentication → Get started** → bật **Email/Password**.
5. Authentication → Users → **Add user** (email + mật khẩu admin). Email này điền vào `VITE_ADMIN_EMAIL` trong `.env.local`.
6. Mở `firestore.rules`, đổi `'admin@example.com'` thành email admin của bạn.
7. Deploy rules:
   ```bash
   npx firebase login
   npx firebase use --add        # chọn project của bạn
   npx firebase deploy --only firestore:rules
   ```
8. Chạy `npm run dev`, bấm nút 🔒 góc trên phải, đăng nhập admin, bấm **Khởi tạo trò chơi**. Sau đó vào tab **Quà** sửa tên và dán link ảnh từng lọ hoa, tab **Lời chúc** sửa lời chúc (dùng `{name}` để chèn tên).

## Admin
- Nút 🔒 nhỏ ở góc trên phải. Tab **Người chơi**: ai đã nhận quà gì. Tab **Quà**: sửa tên và link ảnh. Tab **Lời chúc**: sửa các mẫu lời chúc.
- **Reset trò chơi** xóa toàn bộ kết quả, mọi người chơi lại từ đầu.
- Quà đã có người nhận thì không xóa được.

## Deploy
Build rồi đưa thư mục `dist/` lên Vercel hoặc Firebase Hosting:
```bash
npm run build
npx firebase init hosting     # public directory: dist, single-page app: Yes
npx firebase deploy --only hosting
```
Nhớ khai báo các biến `VITE_*` trong cài đặt của nơi host (Vercel: Project Settings → Environment Variables).

## Test với Firestore Emulator
`npm run test:emu` kiểm tra Firestore Rules và việc bốc đồng thời. Cần cài **Java (JDK 11+)** để chạy emulator.

## Lưu ý
- Ai đọc được `game/state` đều thấy ai nhận quà gì. Rules chặn gian lận thô nhưng không chặn người cố tình dùng nhiều thiết bị với nhiều tên.
- Người chơi thứ 6 trở đi sẽ thấy "Đã hết quà".
- Chơi trên thiết bị khác hoặc xóa dữ liệu trình duyệt thì bốc lại cùng tên sẽ nhận kết quả cũ, nhưng khác tên thì bốc được quà mới.
