# Checklist kiểm tra tay trước khi gửi link

Làm trên điện thoại thật (iOS Safari + Android Chrome), khung hẹp ~375px.

## Chuẩn bị
- [ ] `.env.local` đã điền đủ, `firestore.rules` đã đổi email admin và đã deploy
- [ ] Đăng nhập admin, bấm **Khởi tạo trò chơi**
- [ ] Tab Quà: đã sửa tên và dán link ảnh cho cả 5 lọ hoa, xem trước ảnh hiện đúng
- [ ] Tab Lời chúc: đã sửa lời chúc, có `{name}`

## Người chơi
- [ ] Màn nhập tên: cánh hoa rơi, ô nhập không bị iOS zoom
- [ ] Tên rỗng hoặc toàn khoảng trắng: nút "Vào quay quà" bị vô hiệu
- [ ] Hộp xác nhận hiện đúng tên, "Sửa lại" quay về được
- [ ] Gacha: máy rung, capsule nhảy, capsule rơi, nứt và sáng, không giật
- [ ] Kết quả: ảnh lọ hoa, tên quà, lời chúc có tên, pháo giấy 🌸
- [ ] F5 ở màn kết quả: vẫn thấy kết quả cũ, không bốc lại
- [ ] Đóng tab, mở lại link: vẫn thấy kết quả cũ
- [ ] Gõ tên khác trên cùng thiết bị: vẫn ra kết quả cũ
- [ ] Hai điện thoại cùng bấm Quay một lúc: hai quà khác nhau
- [ ] Người thứ 6: thấy "Đã hết quà"
- [ ] Tắt mạng rồi bấm Quay: báo lỗi có nút "Thử lại", bật mạng thử lại được
- [ ] Bật "Giảm chuyển động" trong cài đặt máy: animation nhẹ hơn, không lỗi

## Admin
- [ ] Nút 🔒 đăng nhập đúng email admin vào được; email khác báo "Không có quyền"
- [ ] Tab Người chơi: hiện tên, quà, giờ, lời chúc theo thời gian thực
- [ ] Sửa tên/ảnh quà: máy khác thấy ngay
- [ ] Xóa quà đã có người nhận: bị chặn
- [ ] Sửa lời chúc: người chơi mới thấy lời chúc mới, người cũ giữ nguyên
- [ ] Reset: có hộp xác nhận, sau reset mọi người chơi lại được

## Trước khi gửi
- [ ] Đã **Reset** để xóa kết quả chơi thử
- [ ] Đã gửi thử link cho 1 người ngoài kiểm tra
