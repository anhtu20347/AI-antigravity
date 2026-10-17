# 🦉 CÚ ĐÊM · NỀN TẢNG TRỢ LÝ AI HỌC XÁC SUẤT & THỐNG KÊ
### Socratic AI Math Pedagogy Platform — Kiến Trúc Phân Rã Module (Clean Architecture)

> 🌐 **Trang web chạy trực tiếp:** [https://anhtu20347.github.io/AI-antigravity/](https://anhtu20347.github.io/AI-antigravity/)  
> 📑 **Tài liệu Kiến trúc Chuẩn hóa v2.2:** Xem chi tiết tại [docs/Product_Tech_Architecture_Blueprint_v2.2.md](docs/Product_Tech_Architecture_Blueprint_v2.2.md) hoặc tải file Word [docs/Product_Tech_Architecture_Blueprint_v2.2.docx](docs/Product_Tech_Architecture_Blueprint_v2.2.docx).

---

## 🏗️ CẤU TRÚC PHÂN CHIA QUẢN TRỊ DỰ ÁN (PROJECT DIRECTORY)

Khắc phục hoàn toàn tình trạng "dồn tất cả vào 1 file nguyên khối không phân chia", mã nguồn đã được tái cấu trúc thành các module độc lập giúp việc quản lý, mở rộng và bảo trì tính năng/giao diện trở nên cực kỳ dễ dàng:

```text
AI-antigravity/
├── docs/                                    # TÀI LIỆU THIẾT KẾ & KIẾN TRÚC HỆ THỐNG
│   ├── Product_Tech_Architecture_Blueprint_v2.2.docx  # Bản Word 23 chương chuẩn nộp bài
│   ├── Product_Tech_Architecture_Blueprint_v2.2.md    # Bản Markdown đọc trực tiếp trên GitHub
│   └── ARCHITECTURE.md                                # Hướng dẫn chi tiết quản trị mã nguồn
│
├── src/                                     # MÃ NGUỒN PHÂN TÁCH THEO PHÂN HỆ
│   ├── styles/
│   │   └── app.css                          # Toàn bộ CSS, giao diện pastel, animation
│   ├── data/
│   │   ├── constants.js                     # 7 chương XSTK, Barem điểm, menu, state management
│   │   └── bank.js                          # Ngân hàng câu hỏi mẫu 7 chương & sinh bài tập thực tế
│   ├── services/
│   │   ├── canvas3d.js                      # Linh vật Cú Đêm SVG & Động cơ mô phỏng 3D isometric
│   │   ├── gemini.js                        # Tầng kết nối Google Gemini API (Multimodal Flash)
│   │   ├── speech.js                        # Tầng Voice AI (Web Speech Recognition & Synthesis)
│   │   └── firebase.js                      # Xác thực tài khoản, đồng bộ RTDB, bạn bè & chat 1-1
│   └── components/
│       ├── pad.js                           # Bảng viết iPad cảm ứng, bút/tẩy, nhận diện ảnh/PDF
│       ├── pedagogy.js                      # Quy trình sư phạm 4 bước & Meta-Engine nhân bản (TN1, TN11)
│       ├── practice.js                      # Màn hình luyện tập 7 chương & Bản đồ tư duy (TN5, TN8)
│       ├── exam.js                          # Đấu trường thi thử bấm giờ, tự chấm điểm & chữa bài
│       ├── tutor.js                         # AI Tutor chấm điểm theo Barem & Sinh 5 bài tự luận (TN2, TN4)
│       ├── oral_exam.js                     # Phòng khảo hạch vấn đáp lý thuyết tiếng Việt (TN6)
│       ├── stats.js                         # Hồ sơ năng lực cá nhân & Thống kê lỗi sai 3 nguồn (TN7, TN10)
│       ├── forum.js                         # Diễn đàn học tập 100% người thật, kết bạn & DM 1-1 (TN9)
│       └── home.js                          # Màn hình Trang chủ & Bộ điều hướng tổng quan (Router)
│
├── index.html                               # Trang ứng dụng tinh gọn, nạp các module, chạy trên GitHub Pages
├── README.md                                # Trang giới thiệu tổng quan dự án
├── PJ.docx                                  # Tài liệu dự án gốc
└── .gitignore                               # Cấu hình bỏ qua tệp rác
```

---

## 🎯 MA TRẬN 11 TÍNH NĂNG CHUẨN HÓA THEO ĐỀ BÀI

| STT | Tính năng theo đề bài | Phân hệ phụ trách | Trạng thái |
|:---:|:---|:---|:---:|
| **TN 1** | **Quy trình sư phạm 4 bước:** Giải toán Pólya, Khái niệm, Định lí | `src/components/pedagogy.js` | ✅ Hoàn thành |
| **TN 2** | **AI Tutor chấm điểm:** Bảng viết iPad, ảnh, PDF theo Barem 4 tiêu chí | `src/components/pad.js` & `tutor.js` | ✅ Hoàn thành |
| **TN 3** | **Tương tác giọng nói (Voice AI):** Vấn đáp 2 chiều, đồng bộ bảng iPad | `src/services/speech.js` | ✅ Hoàn thành |
| **TN 4** | **Tạo 5 bài toán tự luận tương tự:** Sinh ngẫu nhiên kèm Chiến lược giải | `src/components/tutor.js` | ✅ Hoàn thành |
| **TN 5** | **Tạo bài tập trắc nghiệm tương tự:** Chấm tức thì, giải đáp lý do vì sao | `src/components/practice.js` | ✅ Hoàn thành |
| **TN 6** | **Phòng khảo hạch vấn đáp lý thuyết:** Chấm điểm, chỉ ra lỗ hổng kiến thức | `src/components/oral_exam.js` | ✅ Hoàn thành |
| **TN 7** | **Thống kê lỗi sai 3 nguồn:** Vấn đáp, Trắc nghiệm, Tự luận $\to$ Đề xuất khắc phục | `src/components/stats.js` | ✅ Hoàn thành |
| **TN 8** | **Bản đồ tư duy (Mindmap) XSTK:** Trực quan hóa 4 nhánh tại mỗi câu | `src/components/practice.js` | ✅ Hoàn thành |
| **TN 9** | **Diễn đàn điện tử 100% người thật:** Đăng bài kèm LaTeX, vẽ iPad, kết bạn, DM 1-1 | `src/components/forum.js` | ✅ Hoàn thành |
| **TN 10** | **Hồ sơ AI học XSTK:** Bản đồ năng lực 7 chương, lộ trình bổ trợ cá nhân | `src/components/stats.js` | ✅ Hoàn thành |
| **TN 11** | **Meta Pedagogy Engine:** Nhận bài toán/định lí bất kỳ $\to$ Nhân bản tiến trình 4 bước | `src/components/pedagogy.js` | ✅ Hoàn thành |

---

## 🚀 HƯỚNG DẪN SỬ DỤNG & QUẢN TRỊ

1. **Chạy trực tiếp trên Web:** Truy cập [https://anhtu20347.github.io/AI-antigravity/](https://anhtu20347.github.io/AI-antigravity/) trên bất kỳ trình duyệt nào (Chrome, Edge, Safari, iPad).
2. **Kích hoạt tính năng AI:** Nhập **Gemini API Key** tại ô mật khẩu trên thanh Menu để kích hoạt AI chấm bài, Voice AI và vẽ bản đồ tư duy. (Hệ thống có sẵn ngân hàng đề Offline chạy được ngay không cần Key).
3. **Quản trị mã nguồn:** Khi cần sửa giao diện, sửa câu hỏi hay bổ sung tính năng, tham khảo bảng hướng dẫn chi tiết tại [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).