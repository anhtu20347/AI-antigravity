# AI Tutor Xác Suất Thống Kê (MVP Fast-Build Architecture)

> Hệ thống Trợ lý Sư phạm Thông minh Hỗ trợ Dạy & Học Môn Xác Suất Thống Kê Đại Học.
> Thiết kế theo kiến trúc Tinh gọn (Fast-Build MVP) dựa trên Khung sư phạm 4 Bước Pólya, Kiến tạo & Suy luận toán học.

---

## 🌟 11 Tính Năng Cốt Lõi (Question 5 Specification)

| Mã | Tính Năng | Mô Tả Kỹ Thuật | Trạng Thái |
| :--- | :--- | :--- | :---: |
| **TN1** | **Học 4 bước có giàn giáo** | Khung giải toán Pólya 4 bước, Kiến tạo khái niệm & Suy luận định lý | ✅ Đã hoàn thành |
| **TN2** | **AI Tutor Socratic & Barem** | Chấm bài tự luận theo 4 tiêu chí chuẩn, đưa câu hỏi gợi mở | ✅ Đã hoàn thành |
| **TN3** | **Phòng thi vấn đáp AI** | Mô phỏng thi miệng bằng Web Speech API (nhận dạng & phát âm tiếng Việt) | ✅ Đã hoàn thành |
| **TN4** | **Bảng vẽ Canvas iPad** | Vẽ trực tiếp bút stylus/touch/chuột, chèn ký hiệu toán, tải lên bài làm | ✅ Đã hoàn thành |
| **TN5** | **Trắc nghiệm tương tác & "Tại sao?"** | 22 câu hỏi trắc nghiệm, chấm điểm tức thì, AI phân tích bẫy nhận thức | ✅ Đã hoàn thành |
| **TN6** | **Khảo sát nhận thức mở** | Đánh giá câu trả lời tự do, phát hiện quan niệm sai lệch (Misconceptions) | ✅ Đã hoàn thành |
| **TN7** | **Hồ sơ năng lực học tập** | Theo dõi điểm số, số phiên học, nhận khuyến nghị bài học cá nhân hóa | ✅ Đã hoàn thành |
| **TN8** | **Bản đồ tư duy Mindmap** | Trực quan hóa cấu trúc bài học, liên kết dạng toán, công thức & bẫy | ✅ Đã hoàn thành |
| **TN9** | **Diễn đàn trao đổi thảo luận** | Đăng câu hỏi, phản hồi cộng đồng và giải đáp tự động từ AI Tutor | ✅ Đã hoàn thành |
| **TN10** | **Bản đồ lỗi 3 nguồn** | Tổng hợp và đối chiếu sai lầm từ Trắc nghiệm, Tự luận và Vấn đáp | ✅ Đã hoàn thành |
| **TN11** | **Meta Pedagogy Engine** | Biên soạn bài học 4 bước & Mindmap tự động từ đề bài bất kỳ bằng AI | ✅ Đã hoàn thành |

---

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

- **Framework**: Next.js 14 (App Router, Server Actions, TypeScript).
- **Styling**: TailwindCSS với bảng màu Retro Pastel mềm mại (`--lav`, `--mint`, `--peach`, `--butter`, `--ink`).
- **Math Rendering**: MathJax 3.2 hỗ trợ hiển thị ký hiệu toán học LaTeX hoàn chỉnh.
- **AI Engine**: Google Gemini (gemini-2.5-flash) multimodal vision & prompt engineering.
- **Database**: Supabase PostgreSQL (6 bảng cốt lõi) kèm cơ chế **Demo Mode / In-Memory Mock Store** tự động chạy mượt mà ngay cả khi không có kết nối cloud.
- **Audio/Speech**: HTML5 Web Speech API (`SpeechRecognition` & `SpeechSynthesis`).

---

## 🛠️ Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Yêu cầu hệ thống
- **Node.js**: v18.0.0 trở lên (khuyên dùng Node.js 20+ hoặc 24 LTS).
- **Trình quản lý gói**: npm hoặc yarn.

### 2. Cài đặt các gói phụ thuộc
```bash
npm install
```

### 3. Cấu hình biến môi trường (Tùy chọn)
Sao chép tệp mẫu cấu hình:
```bash
cp .env.example .env.local
```
Điền các giá trị nếu muốn kết nối với API thực tế:
```env
GEMINI_API_KEY="your-gemini-api-key"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```
*(Lưu ý: Nếu không điền biến môi trường, hệ thống vẫn tự động chuyển sang chế độ **Demo Mock Store & Socratic Fallback** đầy đủ dữ liệu để báo cáo hoặc chấm điểm mà không bị lỗi).*

### 4. Khởi chạy môi trường phát triển (Dev)
```bash
npm run dev
```
Truy cập ứng dụng tại: `http://localhost:3000`

### 5. Đóng gói & Chạy thử nghiệm sản xuất (Build)
```bash
npm run build
npm run start
```

---

## 📂 Cấu Trúc Thư Mục Dự Án

```
├── src/
│   ├── app/                      # Next.js 14 App Router
│   │   ├── page.tsx              # Dashboard chính & điều hướng 11 tính năng
│   │   ├── lesson/page.tsx       # TN1 (Học 4 bước Pólya) & TN8 (Mindmap)
│   │   ├── tutor/page.tsx        # TN2 (AI Tutor & Barem) & TN4 (Canvas iPad)
│   │   ├── quiz/page.tsx         # TN5 (Trắc nghiệm tương tác & Nút Tại sao?)
│   │   ├── oral/page.tsx         # TN3 (Phòng thi vấn đáp AI) & TN6 (Khảo sát nhận thức)
│   │   ├── profile/page.tsx      # TN7 (Hồ sơ học tập) & TN10 (Bản đồ lỗi 3 nguồn)
│   │   ├── forum/page.tsx        # TN9 (Diễn đàn cộng đồng)
│   │   ├── admin/page.tsx        # TN11 (Meta Pedagogy Engine)
│   │   ├── layout.tsx            # Root layout tích hợp MathJax
│   │   ├── globals.css           # Cấu hình phong cách Retro Pastel Card
│   │   └── api/                  # 6 Route API Backend (lesson, tutor, practice, oral, explain, insights)
│   ├── components/               # Navbar & các UI Components
│   ├── lib/                      # AI Client, Supabase Demo Client, Seed Data & Schemas
│   └── types/                    # Định nghĩa kiểu dữ liệu TypeScript
├── supabase/migrations/          # Script khởi tạo 6 bảng CSDL chuẩn Supabase
└── public/                       # Assets & Static Files
```

---

## 📜 Giấy Phép
Dự án được xây dựng phục vụ nghiên cứu ứng dụng Trí tuệ Nhân tạo trong Đổi mới Sư phạm và Giảng dạy Toán học Đại học.
