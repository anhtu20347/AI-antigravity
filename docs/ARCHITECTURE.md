# HƯỚNG DẪN QUẢN TRỊ KIẾN TRÚC MÃ NGUỒN (ARCHITECTURE & MODULE GUIDE)
## HỆ THỐNG TRỢ LÝ AI HỌC XÁC SUẤT & THỐNG KÊ (CÚ ĐÊM)

---

## 1. TỔNG QUAN CẤU TRÚC PHÂN CHIA (MODULAR ARCHITECTURE)

Dự án đã được phân rã hoàn toàn từ file nguyên khối 1700 dòng thành cấu trúc module hóa chuẩn công nghiệp:

```text
AI-antigravity/
├── docs/                                    # TÀI LIỆU THIẾT KẾ & KIẾN TRÚC HỆ THỐNG
│   ├── Product_Tech_Architecture_Blueprint_v2.2.docx  # Bản Word 23 chương chuẩn nộp bài
│   ├── Product_Tech_Architecture_Blueprint_v2.2.md    # Bản Markdown đọc trực tiếp trên GitHub
│   └── ARCHITECTURE.md                                # Tài liệu hướng dẫn phân chia & quản trị mã nguồn
│
├── src/                                     # MÃ NGUỒN PHÂN CHIA CHỨC NĂNG
│   ├── styles/
│   │   └── app.css                          # Định kiểu, biến màu Pastel, CSS animations
│   ├── data/
│   │   ├── constants.js                     # 7 chương XSTK, Barem điểm, Menu điều hướng, State
│   │   └── bank.js                          # Ngân hàng bài tập 7 chương & thuật toán sinh đề thực tế
│   ├── services/
│   │   ├── canvas3d.js                      # Linh vật Cú Đêm SVG & Động cơ mô phỏng 3D isometric
│   │   ├── gemini.js                        # Tầng kết nối Google Gemini API (Multimodal Flash)
│   │   ├── speech.js                        # Tầng Voice AI (Web Speech Recognition & Synthesis)
│   │   └── firebase.js                      # Xác thực danh tính, đồng bộ RTDB, bạn bè & chat 1-1
│   └── components/
│       ├── pad.js                           # Bảng viết iPad cảm ứng, công cụ bút/tẩy, nhận diện ảnh/PDF
│       ├── pedagogy.js                      # Quy trình sư phạm 4 bước & Meta-Engine nhân bản (TN1, TN11)
│       ├── practice.js                      # Màn hình luyện tập 7 chương & Bản đồ tư duy 4 nhánh (TN5, TN8)
│       ├── exam.js                          # Đấu trường thi thử bấm giờ, tự chấm điểm & chữa bài
│       ├── tutor.js                         # AI Tutor chấm điểm theo Barem & Sinh 5 bài tự luận (TN2, TN4)
│       ├── oral_exam.js                     # Phòng khảo hạch vấn đáp lý thuyết tiếng Việt (TN6)
│       ├── stats.js                         # Hồ sơ năng lực cá nhân & Thống kê lỗi sai 3 nguồn (TN7, TN10)
│       ├── forum.js                         # Diễn đàn học tập 100% người thật, kết bạn & DM 1-1 (TN9)
│       └── home.js                          # Màn hình Trang chủ & Bộ điều hướng tổng quan (Router)
│
├── index.html                               # Trang ứng dụng tinh gọn (gọi các module, chạy trên GitHub Pages)
├── README.md                                # Trang giới thiệu chính của repository
├── PJ.docx                                  # Tài liệu dự án gốc
└── .gitignore                               # Cấu hình bỏ tệp rác
```

---

## 2. HƯỚNG DẪN QUẢN TRỊ TỪNG PHÂN HỆ

| Khi bạn muốn thực hiện | Mở file tương ứng | Nội dung cần chỉnh |
|:---|:---|:---|
| **Thay đổi giao diện, màu sắc, nút bấm** | `src/styles/app.css` | Tùy chỉnh các biến màu `--lav`, `--mint`, `--peach`, `.pc`, `.bt` |
| **Thêm/bớt chương hoặc sửa tiêu chí Barem** | `src/data/constants.js` | Chỉnh sửa mảng `CH` (7 chương) hoặc mảng `RUBRIC` (barem 4 tiêu chí) |
| **Bổ sung câu hỏi mới vào ngân hàng đề** | `src/data/bank.js` | Thêm phần tử `M(...)` vào mảng `BANK` theo chương tương ứng |
| **Chỉnh sửa Bảng vẽ iPad hoặc nét bút** | `src/components/pad.js` | Chỉnh kích thước canvas, màu bút, độ dày tẩy trong hàm `initPad()` |
| **Cập nhật bài học Quy trình 4 bước** | `src/components/pedagogy.js` | Chỉnh sửa dữ liệu `PEDAGOGY_DATA` (Giải toán, Khái niệm, Định lí) |
| **Thay đổi câu hỏi khảo hạch Vấn đáp** | `src/components/oral_exam.js` | Thêm các câu hỏi lý thuyết vào mảng `ORAL_TOPICS` |
| **Tùy chỉnh Prompt hướng dẫn AI Tutor** | `src/components/tutor.js` | Thay đổi nội dung `prompt` trong hàm `gradeTutor()` hoặc `generate5SimilarEssayProblems()` |
| **Quản trị Diễn đàn và khung chat bạn bè** | `src/components/forum.js` | Tùy chỉnh hiển thị bài viết, bình luận và cấu trúc tin nhắn DM |
| **Cấu hình API Key hoặc đổi mô hình Gemini** | `src/services/gemini.js` | Thay đổi model mặc định trong biến `MODEL` |
