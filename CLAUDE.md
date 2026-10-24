# CLAUDE.md

Hướng dẫn cho Claude khi làm việc trong repo này.

## Dự án là gì
Web mini-game 20/10 cho nhóm bạn gồm 5 người phụ nữ. Chủ repo đã chuẩn bị 5 lọ hoa (màu sắc, kiểu dáng khác nhau). Để công bằng, mỗi người vào link, gõ tên, chơi **gacha capsule** và nhận ngẫu nhiên 1 lọ hoa. Kết quả hiện kèm hiệu ứng pháo giấy / cánh hoa rơi và một lời chúc riêng.

## Yêu cầu đã chốt
- Mỗi người mở link trên điện thoại của mình (**mỗi người 1 link, chơi từ xa**), nên cần **DB online** dùng chung.
- Cơ chế chơi: **gacha / máy gắp capsule**. Gõ tên → bấm nút → capsule rơi ra → mở ra lọ hoa → pháo giấy + cánh hoa rơi + lời chúc riêng.
- Nhiều animation, đẹp, theo chủ đề 20/10.
- Stack: **Vite + React**. Chọn cách setup đơn giản nhất.
- Mobile-first.
- Ngôn ngữ giao diện: tiếng Việt.

## Quy tắc nghiệp vụ (quan trọng)
- Đây là bài toán **hoán vị 5 phần tử**: mỗi lọ hoa chỉ thuộc đúng 1 người, **không được trùng**.
- Việc bốc thăm phải **atomic** (dùng transaction), vì 2 người có thể bấm cùng lúc.
- **Idempotent**: một người đã bốc rồi thì mở lại / F5 / bấm lại chỉ hiện lại kết quả cũ, không bốc lại.
- Chuẩn hóa tên khi so khớp (trim, bỏ dấu, lowercase) để "Lan" và "lan " là cùng một người.
- Lời chúc là template chèn tên người chơi (xem `src/data/wishes.js`).

## Quyết định kỹ thuật (đề xuất, chờ chủ repo xác nhận)
- **Backend: Firebase Firestore** (không cần server, gói Spark miễn phí, SDK có transaction).
- Do transaction phía client không query được, dùng **1 document duy nhất** `game/state`:
  - `remaining: string[]` — id các lọ hoa chưa ai bốc
  - `assignments: { [normalizedName]: { name, prizeId, drawnAt } }`
- Hàm bốc: `runTransaction` → nếu tên đã có trong `assignments` thì trả về kết quả cũ; ngược lại chọn ngẫu nhiên 1 id trong `remaining`, xóa nó khỏi `remaining`, ghi vào `assignments`.
- Animation: CSS/SVG + `framer-motion` cho capsule; `canvas-confetti` cho pháo giấy (dùng `shapeFromText` với emoji 🌸, bật `disableForReducedMotion`).
- Cấu hình Firebase đọc từ biến môi trường `VITE_FIREBASE_*` trong `.env.local` (không commit).
- Deploy: Vercel hoặc Firebase Hosting (chọn khi tới bước đó).

## Cấu trúc dự kiến
```
src/
  components/   # GachaMachine, Capsule, PrizeReveal, NameForm, PetalRain...
  data/         # prizes.js (5 lọ hoa), wishes.js (lời chúc theo tên)
  lib/          # firebase.js, draw.js (transaction), normalizeName.js
  App.jsx
public/prizes/  # ảnh 5 lọ hoa
```

## Giao diện
Hồng pastel + kem, đỏ đô làm màu nhấn. Font viết tay cho tiêu đề. Nền có cánh hoa rơi chậm. Bo góc lớn, nhiều khoảng trắng.

## Quy ước làm việc
- Trả lời và comment bằng tiếng Việt, tên biến / hàm bằng tiếng Anh.
- Quy trình: brainstorming → spec → plan → code. **Chưa scaffold code** cho tới khi chủ repo duyệt thiết kế.
- Giữ đơn giản (YAGNI): không thêm đăng nhập, admin panel, bảng xếp hạng.
- Không commit `.env.local` hay khóa Firebase.

## Quyết định đã chốt với chủ repo
- **Không có danh sách tên cố định**: người chơi tự gõ tên lúc vào web. Ai gõ tên nào cũng được.
- Lời chúc là **template có chỗ chèn tên** (ví dụ `"{name} ơi, chúc bạn ..."`), chọn ngẫu nhiên / theo lọ hoa và thay `{name}` bằng tên người chơi đã nhập.
- 5 lọ hoa (tên + link ảnh) là **hằng số gán cứng** trong `src/data/prizes.js`, chủ repo sẽ tự sửa tên / link ảnh sau.
- Backend: **Firebase Firestore** (đã xác nhận).

## Rủi ro đã biết khi cho nhập tên tự do
- Người thứ 6 trở đi sẽ thấy "đã hết quà".
- Gõ sai / khác tên có thể bốc lại: giảm bằng cách lưu kết quả theo cả `deviceId` (localStorage), một thiết bị chỉ bốc một lần.
- Reset trò chơi: sửa `game/state` trong Firebase console (không làm admin UI).
