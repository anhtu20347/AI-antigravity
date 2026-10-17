# TÀI LIỆU THIẾT KẾ KIẾN TRÚC SẢN PHẨM & KỸ THUẬT
## PRODUCT & TECHNICAL ARCHITECTURE BLUEPRINT v2.1
### DỰ ÁN: HỆ THỐNG TRỢ LÝ AI HỌC XÁC SUẤT & THỐNG KÊ (CÚ ĐÊM - XSTK AI)

---

## 01. TÓM TẮT DỰ ÁN (EXECUTIVE SUMMARY)

* **Tên hệ thống:** Nền tảng Trợ lý AI Sư phạm Học Xác suất & Thống kê ("Cú Đêm" / Owl Probability AI Tutor).
* **Mục đích:** Xây dựng một hệ sinh thái học tập ứng dụng Trí tuệ Nhân tạo thế hệ mới (Generative AI) chuyên sâu cho môn học Xác suất & Thống kê bậc Đại học và Cao đẳng, tích hợp trọn vẹn 11 tính năng cốt lõi theo chuẩn sư phạm toán học hiện đại.
* **Nguyên lý sư phạm hạt nhân:** Dạy học giải quyết vấn đề theo tiến trình 4 bước của George Pólya và thuyết kiến tạo (Constructivism) trong dạy học Khái niệm & Định lý. AI đóng vai trò người cố vấn (Socratic Tutor) — **chỉ cung cấp chiến lược giải và gợi mở tư duy, kiên quyết không giải hộ hoặc đưa sẵn đáp số**.
* **Trạng thái kỹ thuật hiện tại:** Phiên bản Web SPA tương tác cao với Canvas 3D, Web Speech API (Voice), Bảng viết iPad cảm ứng, Firebase Realtime Sync, và Gemini 3.8 Flash. Đã hiện thực hóa 8/11 tính năng; cần hoàn thiện 3 tính năng sư phạm chuyên sâu và tái cấu trúc bảo mật theo chuẩn Production.

---

## 02. BỐI CẢNH & THÁCH THỨC ĐẶC THÙ MÔN XÁC SUẤT THỐNG KÊ

Môn Xác suất & Thống kê (XSTK) là "nỗi ám ảnh" của đại đa số sinh viên khối ngành Kinh tế, Kỹ thuật và Khoa học Xã hội bởi các rào cản nhận thức đặc thù:
1. **Nghịch lý nhận diện mô hình:** Sinh viên thuộc công thức (như Bayes, Phân phối Nhị thức, Phân phối Chuẩn) nhưng không thể trích xuất các biến cố từ đề bài ngữ cảnh thực tế dài dòng.
2. **Khó khăn khi biểu đạt toán học bằng lời nói/văn bản thông thường:** Các công thức phức tạp ($\int, \sum, \sigma, \mu, P(A|B)$) không thể gõ phím nhanh; sinh viên cần công cụ viết vẽ tự nhiên như bảng giấy/iPad.
3. **Thói quen ỷ lại lời giải có sẵn:** Các công cụ AI thông thường (ChatGPT, Photomath) lập tức đưa ra bài giải hoàn chỉnh, triệt tiêu phản xạ tư duy và năng lực tự học của sinh viên.
4. **Thiếu môi trường thảo luận có tính toán học:** Các mạng xã hội thông thường không hỗ trợ gõ công thức LaTeX trực quan và không có cơ chế kiểm duyệt/đồng hành chuyên môn.

---

## 03. NGƯỜI DÙNG MỤC TIÊU & TÌNH HUỐNG SỬ DỤNG (USER & JTBD)

### 3.1. Chân dung người dùng mục tiêu
* **Sinh viên đại học (Năm 1 & 2):** Đang học học phần XSTK, cần công cụ luyện thi, gỡ rối bài tập và thi thử có bấm giờ.
* **Giảng viên / Trợ giảng môn Toán:** Cần công cụ tạo ngân hàng đề tự luận/trắc nghiệm tương tự nhanh chóng kèm barem chấm điểm khách quan.

### 3.2. Bảng Job-to-be-done (JTBD)

| Công việc cần hoàn thành (JTBD) | Nỗi đau hiện tại | Giải pháp của Cú Đêm AI |
|:---|:---|:---|
| **Hiểu bản chất khái niệm/định lí** | Học vẹt công thức, không hiểu ý nghĩa thực tế của $\alpha, p\text{-value}, \sigma$. | Tiến trình 4 bước kiến tạo: Trải nghiệm thực tế $\to$ Định nghĩa $\to$ Củng cố $\to$ Vận dụng. |
| **Chữa bài tập tự luận viết tay** | Giảng viên không thể sửa chi tiết cho từng sinh viên; sinh viên không biết mình sai ở bước nào. | Chụp ảnh/vẽ bảng iPad $\to$ AI Tutor đối soát theo Barem 4 tiêu chí $\to$ Chỉ ra lỗi sai cụ thể. |
| **Vấn đáp và phản xạ lý thuyết** | Chỉ làm bài tập tính toán, khi thi vấn đáp hoặc bảo vệ đồ án thì ấp úng, sai bản chất. | Trạm Voice AI tương tác giọng nói tiếng Việt, hỏi xoáy đáp xoay, chẩn đoán trực tiếp lỗ hổng. |
| **Khắc phục lỗi sai có hệ thống** | Làm sai xong bỏ qua, lặp lại cùng một lỗi trong bài thi chính thức. | Tự động ghi vết các câu sai $\to$ Biểu đồ năng lực 7 chương $\to$ Sinh gói bài tập bù đắp lỗ hổng. |

---

## 04. ĐỊNH VỊ SẢN PHẨM & MA TRẬN 11 TÍNH NĂNG THEO ĐỀ BÀI

### 4.1. Định vị sản phẩm
**Cú Đêm AI** là **Socratic AI Math Pedagogy Platform** — Hệ thống sư phạm toán học tương tác đa phương thức (Multimodal Math Platform) đầu tiên tại Việt Nam lấy tiến trình 4 bước và phương pháp gợi mở làm trục trung tâm.

### 4.2. Ma trận chi tiết 11 tính năng

* **TN1 — Quy trình sư phạm 4 bước chuẩn hóa:**
  1. *Quy trình giải toán:* (1) Tìm hiểu nội dung (cho gì, tìm gì, ký hiệu hóa, điều kiện) $\to$ (2) Xây dựng chương trình giải (chia nhỏ, chọn kiến thức gần gũi, dự đoán kết quả) $\to$ (3) Trình bày lời giải $\to$ (4) Kiểm tra và nghiên cứu sâu (thử lại, cách giải khác, tổng quát hóa).
  2. *Quy trình học khái niệm:* Trải nghiệm trực quan $\to$ Hình thành định nghĩa $\to$ Củng cố $\to$ Vận dụng thực tiễn.
  3. *Quy trình học định lí:* Trải nghiệm phát hiện $\to$ Hình thành định lí & chứng minh $\to$ Củng cố $\to$ Vận dụng.
* **TN2 — AI Tutor đa phương thức:** Nhận diện chữ viết tay qua Bảng vẽ Canvas iPad, ảnh chụp đề bài, tệp PDF; chấm điểm tự động theo Barem 4 mục (Nhận diện dạng toán, Viết công thức, Thay số tính toán, Kết luận thực tế); **chỉ gợi mở chiến lược giải quyết, không giải hộ**.
* **TN3 — Đàm thoại Voice AI 2 chiều:** Sử dụng Web Speech API / Gemini Multimodal Live, hỏi đáp kiến thức XSTK bằng giọng nói tự nhiên, tự động chuyển tải công thức lên bảng vẽ nếu nội dung phức tạp.
* **TN4 — Sinh 5 bài tập tự luận tương tự:** Đưa 1 bài toán gốc $\to$ AI phân tích cấu trúc toán học $\to$ Sinh ngẫu nhiên đúng 5 biến thể cùng dạng kèm khung gợi ý chiến lược giải.
* **TN5 — Trắc nghiệm tương tác tức thì:** Hệ thống sinh đề trắc nghiệm 4 lựa chọn, chấm điểm Realtime, cung cấp phản hồi tại sao phương án đó đúng/sai khi học sinh truy vấn.
* **TN6 — Phòng khảo hạch vấn đáp lý thuyết:** AI đóng vai trò giảng viên hỏi thi vấn đáp, đánh giá câu trả lời của người học, chấm điểm và chỉ mặt điểm tên các nhận thức sai lệch (misconceptions).
* **TN7 — Hệ thống phân tích lỗi sai thông minh:** Gom vết sai từ 3 nguồn: Trắc nghiệm, Tự luận, Vấn đáp $\to$ Phân loại theo chương $\to$ Tổng kết nguyên nhân cốt lõi $\to$ Đề xuất hành động khắc phục.
* **TN8 — Bản đồ tư duy (Mindmap) XSTK:** Trực quan hóa cấu trúc bài toán và chương học thành 4 khối chuẩn: Dạng toán, Dữ kiện đề bài, Công thức cốt lõi, Các bước thực hiện & Bẫy thường gặp.
* **TN9 — Diễn đàn học thuật 100% người thật:** Đăng bài kèm công thức LaTeX và nét vẽ iPad, bình luận đa cấp, thả cảm xúc, cơ chế kết bạn 2 chiều xác thực và khung chat riêng tư 1-1 Realtime.
* **TN10 — Hồ sơ năng lực cá nhân (AI Learning Profile):** Lưu trữ lịch sử học tập, ma trận điểm mạnh/yếu trên 7 chương học, danh hiệu, cấp độ XP, chuỗi ngày chăm học (streak) và tự động tạo đề bổ trợ cá nhân hóa.
* **TN11 — Module nhân bản tiến trình sư phạm (Meta Pedagogy Engine):** Tiếp nhận bất kỳ bài toán/khái niệm/định lí nào do người dùng đưa vào $\to$ AI tự động đóng gói đối tượng đó thành một bài học tương tác 4 bước hoàn chỉnh có ví dụ và bài tập củng cố.

---

## 05. NGUYÊN TẮC THIẾT KẾ VÀ CHỐNG PHÌNH PHẠM VI (ANTI-SCOPE-CREEP)

1. **Nguyên tắc Socratic First:** Mọi prompt gửi tới AI Tutor đều phải có tiền điều kiện bảo vệ: *"Tuyệt đối không đưa ra đáp số cuối cùng hoặc bài giải chi tiết hoàn chỉnh khi người học đang trong tiến trình giải quyết vấn đề. Chỉ cung cấp câu hỏi gợi mở, phân tích dữ kiện hoặc nhắc nhở công thức liên quan."*
2. **Nguyên tắc Tối ưu tài nguyên:** Sử dụng Canvas 2D mô phỏng 3D giả lập (Isometric Wireframe Engine) thay vì nhúng Three.js nặng nề, giúp trang tải tức thì trong 1 giây trên mọi máy tính và điện thoại phổ thông.
3. **Phân định rõ ranh giới MVP:**
   * *Trong phạm vi:* 11 tính năng chuẩn, hỗ trợ 7 chương XSTK đại học, xác thực Firebase Auth chính thống, cơ chế lưu trữ an toàn.
   * *Ngoài phạm vi:* Không tích hợp thanh toán ngân hàng, không xây dựng hệ thống họp video trực tuyến (dùng Voice AI thay thế), không phát triển ứng dụng di động native riêng (chạy nền Web Responsive PWA).

---

## 06. KIẾN TRÚC HỆ THỐNG VÀ BẢO MẬT (TRUST BOUNDARIES)

### 6.1. Thiết lập Rào chắn Bảo mật (Khắc phục triệt để kết quả Audit)
1. **Loại bỏ hoàn toàn lưu mật khẩu dạng Base64:** Chuyển dịch toàn bộ sang `firebase.auth().createUserWithEmailAndPassword` và `signInWithEmailAndPassword`. Mật khẩu được bảo vệ bởi thuật toán Scrypt/Argon2 chuẩn quân sự của Google.
2. **Thiết lập Firebase Security Rules nghiêm ngặt:** Đảm bảo chỉ người trong cuộc mới đọc được tin nhắn riêng; chỉ chủ bài viết mới có quyền sửa/xóa bài.
3. **Che giấu API Key qua Serverless Function:** Không lưu `GEMINI_API_KEY` ở LocalStorage của trình duyệt; chuyển thành biến môi trường Server (`process.env.GEMINI_API_KEY`) trên Cloud Function / Node Proxy.

---

## 07. THIẾT KẾ DỮ LIỆU & JSON SCHEMAS (DATA CONTRACTS)

### 7.1. Cấu trúc CSDL Firebase Realtime Database
```json
{
  "users": {
    "$uid": {
      "displayName": "Nguyễn Văn A",
      "email": "a@univ.edu.vn",
      "avatar": "🦊",
      "sid": "2024001",
      "level": 3,
      "xp": 350,
      "lastSeen": 1713337200000
    }
  },
  "pedagogy_sessions": {
    "$sessionId": {
      "uid": "$uid",
      "type": "problem_solving | concept | theorem",
      "currentStep": 2,
      "contentId": "ch1_bayes",
      "history": []
    }
  },
  "learning_profiles": {
    "$uid": {
      "chapterMastery": { "ch1": 85, "ch2": 60, "ch3": 40, "ch4": 75, "ch5": 90, "ch6": 55, "ch7": 70 },
      "misconceptions": [
        { "id": "misc_01", "chapter": 1, "type": "Bayes vs Conditional", "count": 3, "status": "remedied" }
      ],
      "missedQuestions": {
        "$qid": { "chapter": 3, "mode": "mcq", "errorDesc": "Nhầm sigma với sigma^2", "timestamp": 1713337200000 }
      }
    }
  },
  "posts": {
    "$postId": {
      "authorUid": "$uid",
      "title": "Thắc mắc về công thức Bayes",
      "body": "Tại sao bài này mẫu số lại chia làm 3 trường hợp?",
      "canvasImg": "data:image/png;base64,...",
      "timestamp": 1713337200000,
      "likes": { "$uid": true },
      "comments": {
        "$commentId": { "authorUid": "$uid", "text": "...", "timestamp": 1713337300000 }
      }
    }
  },
  "dms": {
    "$pairId": {
      "$msgId": { "senderUid": "$uid", "text": "Chào bạn, cùng giải bài này nhé", "timestamp": 1713337200000 }
    }
  }
}
```

### 7.2. JSON Schema cho Tính năng 4: Tạo 5 bài toán tự luận tương tự
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "array",
  "minItems": 5,
  "maxItems": 5,
  "items": {
    "type": "object",
    "required": ["id", "chapter", "context", "problemStatement", "variables", "solutionStrategy"],
    "properties": {
      "id": { "type": "string" },
      "chapter": { "type": "integer", "minimum": 1, "maximum": 7 },
      "context": { "type": "string", "description": "Bối cảnh thực tế: y tế, kinh doanh, sản xuất..." },
      "problemStatement": { "type": "string", "description": "Đề bài chi tiết chứa công thức dạng LaTeX $...$" },
      "variables": { "type": "string", "description": "Hướng dẫn nhận diện các đại lượng đã cho và cần tìm" },
      "solutionStrategy": {
        "type": "array",
        "items": { "type": "string" },
        "description": "Các bước chiến lược tư duy gợi mở, TUYỆT ĐỐI KHÔNG CUNG CẤP ĐÁP SỐ"
      }
    }
  }
}
```

---

## 08. THIẾT KẾ PROMPT KỸ THUẬT (PEDAGOGICAL PROMPTING PIPELINE)

### 8.1. System Prompt cho AI Tutor chấm điểm (Tính năng 2)
```text
BẠN LÀ: Giáo sư Cú Đêm - Chuyên gia Sư phạm Toán học Xác suất & Thống kê.
NGUYÊN TẮC BẤT DI BẤT DỊCH:
1. KHÔNG BAO GIỜ giải hộ hoặc cho ngay đáp số cuối cùng của bài toán.
2. Bạn phải chấm bài theo BAREM 4 TIÊU CHÍ sau (Thang điểm 10):
   - Tiêu chí 1: Nhận diện đúng dạng toán và gọi tên biến cố/biến ngẫu nhiên (Tối đa 2.0 điểm).
   - Tiêu chí 2: Thiết lập đúng công thức toán học phù hợp (Tối đa 3.0 điểm).
   - Tiêu chí 3: Quá trình thay số và tính toán logic (Tối đa 3.5 điểm).
   - Tiêu chí 4: Kết luận ngữ cảnh thực tế và điều kiện ràng buộc (Tối đa 1.5 điểm).
3. Đọc dữ liệu đầu vào từ ảnh viết tay trên Bảng iPad hoặc văn bản của sinh viên.
4. ĐẦU RA PHẢI CÓ:
   - Điểm số từng phần theo Barem và Tổng điểm X/10.
   - Nhận định điểm làm tốt.
   - Chỉ rõ bước có sai lầm tư duy (nếu có) và đưa ra CÂU HỎI GỢI MỞ CHIẾN LƯỢC để học sinh tự sửa.
   - Định dạng toán học bắt buộc nằm trong cặp dấu $...$ hoặc $$...$$.
```

### 8.2. System Prompt cho Trạm Vấn đáp Lý thuyết (Tính năng 6)
```text
BẠN LÀ: Trưởng bộ môn Xác suất Thống kê đang phỏng vấn vấn đáp sinh viên.
MỤC TIÊU: Khảo hạch xem sinh viên có thực sự hiểu bản chất hay chỉ học vẹt.
CƠ CHẾ:
- Đặt 1 câu hỏi trọng tâm về ý nghĩa thực tế của một khái niệm (VD: Tại sao kích thước mẫu lớn thì phân phối mẫu xấp xỉ chuẩn theo CLT?).
- Tiếp nhận câu trả lời (bằng lời nói hoặc chữ viết).
- Đánh giá câu trả lời: Phân loại thành (Chính xác / Hiểu mơ hồ / Sai bản chất).
- Đưa ra phản hồi ngay: Chỉ ra lỗ hổng tư duy và giải thích bằng ví dụ trực quan.
```

---

## 09. KẾ HOẠCH NÂNG CẤP TRIỂN KHAI THEO 4 GIAI ĐOẠN

* **Giai đoạn 1: Gia cố Bảo mật (1-2 ngày):**
  - Chuyển sang Firebase Auth chính thống (Xóa bỏ lưu pass Base64).
  - Cập nhật Firebase Security Rules chặn truy cập trái phép.
  - Chuyển API Key về server-side proxy.
* **Giai đoạn 2: Bổ sung 3 Module Sư phạm 4 bước (3-4 ngày):**
  - Xây dựng màn hình Quy trình giải toán 4 bước Polya.
  - Xây dựng màn hình Học Khái niệm và Định lí theo tiến trình kiến tạo.
  - Đóng gói Tính năng 11: Meta-engine cho phép paste bài bất kỳ và phân rã thành bài học 4 bước.
* **Giai đoạn 3: Tối ưu AI Tutor & Phòng Vấn đáp (2-3 ngày):**
  - Khóa chế độ AI chỉ đưa *Chiến lược giải*, không đưa lời giải.
  - Thêm nút tạo bộ đúng 5 bài tự luận tương tự.
  - Xây dựng phòng thi Vấn đáp Lý thuyết độc lập có ghi nhận lỗi sai.
* **Giai đoạn 4: Tối ưu Hiệu năng & Vận hành:**
  - Thay cơ chế Polling 4s bằng Realtime WebSocket Listener của Firebase.
  - Tắt vòng lặp vẽ Canvas khi người dùng rời màn hình để giảm tải CPU/pin.

---

## 10. KẾT LUẬN & CAM KẾT SẢN PHẨM

Bản thiết kế kiến trúc này khẳng định dự án **Cú Đêm - XSTK AI** sở hữu đầy đủ luận cứ khoa học giáo dục và công nghệ hiện đại. Việc hoàn thiện từ 8/11 tính năng hiện có lên trọn vẹn 11/11 tính năng cùng hệ thống bảo mật cấp Enterprise sẽ biến sản phẩm trở thành một giải pháp giáo dục AI kiểu mẫu, sẵn sàng triển khai thực nghiệm diện rộng cho các trường Đại học và Cao đẳng.
