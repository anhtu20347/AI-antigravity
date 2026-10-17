# 🦉 CÚ ĐÊM · NỀN TẢNG TRỢ LÝ AI HỌC XÁC SUẤT & THỐNG KÊ

> Hệ thống trợ lý AI sư phạm tương tác đa phương thức (Multimodal AI Tutor) hỗ trợ học tập, luyện tập thực tế và thi thử môn **Xác suất & Thống kê** bậc Đại học / Cao đẳng.

---

## 🌟 TÍNH NĂNG NỔI BẬT

1. **Quy trình Sư phạm 4 bước (George Pólya & Kiến tạo):** Hỗ trợ giải toán, tiếp cận khái niệm và chứng minh định lý theo phương pháp tư duy gợi mở (Socratic).
2. **AI Tutor Đa phương thức:** Chấm điểm tự động qua hình ảnh, file PDF và **Bảng vẽ iPad cảm ứng** theo Barem 4 tiêu chí chuẩn; chỉ cung cấp chiến lược giải, không giải hộ.
3. **Voice AI (Tương tác giọng nói):** Đàm thoại 2 chiều hỏi đáp lý thuyết và bài tập XSTK bằng tiếng Việt.
4. **Sinh bài tập tự luận & trắc nghiệm tự động:** Tạo ngẫu nhiên các bộ bài toán thực tế cho 7 chương học kèm giải đáp chi tiết.
5. **Mô phỏng trực quan 3D (Isometric Canvas):** 9 mô hình 3D thực tế (xúc xắc, chuông chuẩn Gauss, dây chuyền chip Bayes, A/B Testing, xếp hàng Poisson...).
6. **Bản đồ tư duy (Mindmap) XSTK:** Trực quan hóa cấu trúc bài toán: Dạng toán, Dữ kiện, Công thức, Bước giải & Bẫy hay sai.
7. **Diễn đàn học tập 100% người thật:** Đăng bài kèm công thức toán LaTeX & nét vẽ iPad, bình luận, kết bạn 2 chiều và nhắn tin riêng tư 1-1.
8. **Hồ sơ năng lực cá nhân (AI Learning Profile):** Theo dõi chuỗi ngày chăm học (streak), ma trận tỷ lệ làm đúng 7 chương, chẩn đoán lỗ hổng kiến thức và đề xuất bài tập bổ trợ.

---

## 📁 CẤU TRÚC THƯ MỤC DỰ ÁN

* `index.html` — Mã nguồn ứng dụng Web SPA (Single Page Application).
* `PJ.docx` — Tài liệu Dự án chi tiết (Project Document).
* `Product_Tech_Architecture_Blueprint.docx` — Tài liệu Thiết kế Kiến trúc Sản phẩm & Kỹ thuật (bản Word chuẩn nộp bài).
* `Product_Tech_Architecture_Blueprint.md` — Bản thiết kế kiến trúc kỹ thuật chi tiết (Markdown).
* `AI_Scrum_MBO_Product_Tech_Architecture_Blueprint_v2.1.docx` — Tài liệu mẫu kiến trúc v2.1 tham chiếu.
* `New Microsoft Word Document.docx` — Đề bài 11 tính năng dự án AI XSTK.

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT & CHẠY

1. **Chạy trực tiếp trên trình duyệt:**
   * Mở trực tiếp file `index.html` bằng trình duyệt web bất kỳ (Chrome, Edge, Firefox, Cốc Cốc).
   * Không cần cài đặt server hay môi trường phức tạp.

2. **Cấu hình Gemini API (để bật tính năng AI):**
   * Nhập **Gemini API Key** tại ô mật khẩu trên thanh Menu để kích hoạt AI chấm bài, Voice AI và vẽ bản đồ tư duy.
   * Nếu chưa có Key, hệ thống tự động sử dụng ngân hàng đề mẫu offline có sẵn.

---

## 🛡️ CÔNG NGHỆ SỬ DỤNG

* **Frontend:** HTML5, TailwindCSS (CDN), Vanilla JavaScript, Canvas 2D/3D Engine.
* **Math Rendering:** MathJax 3.2 (LaTeX typesetting).
* **Audio / Voice:** Web Speech API (SpeechRecognition & SpeechSynthesis).
* **Cloud & Realtime:** Firebase Authentication, Firebase Realtime Database.
* **AI Model:** Google Gemini 3.8 Flash API.
