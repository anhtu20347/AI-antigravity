# TÀI LIỆU THIẾT KẾ KIẾN TRÚC SẢN PHẨM & KỸ THUẬT
## PRODUCT & TECHNICAL ARCHITECTURE BLUEPRINT v2.2
### DỰ ÁN: HỆ THỐNG TRỢ LÝ AI HỌC XÁC SUẤT & THỐNG KÊ (CÚ ĐÊM - XSTK AI)

---

## 01. TÓM TẮT DỰ ÁN (EXECUTIVE SUMMARY)

* **Tên hệ thống:** Nền tảng Trợ lý AI Sư phạm Học Xác suất & Thống kê ("Cú Đêm" / Owl Probability AI Tutor).
* **Mục đích:** Xây dựng một hệ sinh thái học tập ứng dụng Trí tuệ Nhân tạo tạo sinh (Generative AI) chuyên sâu cho môn học Xác suất & Thống kê bậc Đại học và Cao đẳng, tích hợp trọn vẹn 11 tính năng cốt lõi theo chuẩn sư phạm toán học hiện đại.
* **Nguyên lý sư phạm hạt nhân:** Dạy học giải quyết vấn đề theo tiến trình 4 bước của George Pólya và thuyết kiến tạo (Constructivism) trong dạy học Khái niệm & Định lí. AI đóng vai trò người cố vấn (Socratic Tutor) — **chỉ cung cấp chiến lược giải và gợi mở tư duy, kiên quyết không giải hộ hoặc đưa sẵn đáp số**.
* **Trạng thái kỹ thuật & Công nghệ:** Phiên bản Web SPA tương tác cao với Canvas 2D Isometric Wireframe, Web Speech API (Voice), Bảng viết iPad cảm ứng đồng bộ màn hình, Firebase Realtime Sync, và mô hình đa phương thức Gemini 2.5 Flash. Tài liệu v2.2 này hoàn thiện thiết kế toàn diện cho 11/11 tính năng cùng kiến trúc bảo mật chuẩn Production.

---

## 02. BỐI CẢNH & THÁCH THỨC ĐẶC THÙ MÔN XÁC SUẤT THỐNG KÊ

Môn Xác suất & Thống kê (XSTK) là thách thức lớn của đại đa số sinh viên khối ngành Kinh tế, Kỹ thuật và Khoa học Xã hội bởi các rào cản nhận thức đặc thù:
1. **Nghịch lý nhận diện mô hình:** Sinh viên thuộc công thức (như Bayes, Phân phối Nhị thức, Phân phối Chuẩn) nhưng không thể trích xuất các biến cố, phân biệt cái đã cho và cái cần tìm từ đề bài ngữ cảnh thực tế dài dòng.
2. **Khó khăn khi biểu đạt toán học bằng lời nói/văn bản thông thường:** Các công thức phức tạp ($\int, \sum, \sigma, \mu, P(A\vert{}B)$) không thể diễn đạt trọn vẹn chỉ qua lời nói hoặc gõ phím nhanh; người học cần công cụ viết vẽ tự nhiên qua bảng iPad hiện trực tiếp lên màn hình.
3. **Thói quen ỷ lại lời giải có sẵn:** Các công cụ AI thông thường (ChatGPT, Photomath) lập tức đưa ra bài giải hoàn chỉnh, triệt tiêu phản xạ tư duy và năng lực tự học của sinh viên.
4. **Thiếu môi trường thảo luận có tính toán học:** Các mạng xã hội thông thường không hỗ trợ gõ công thức LaTeX trực quan và không có cơ chế đồng hành chuyên môn.

---

## 03. NGƯỜI DÙNG MỤC TIÊU & TÌNH HUỐNG SỬ DỤNG (USER & JTBD)

### 3.1. Chân dung người dùng mục tiêu
* **Sinh viên đại học / Học sinh:** Đang học học phần XSTK, cần công cụ học bản chất khái niệm/định lí, luyện giải bài tập theo quy trình 4 bước, ôn tập vấn đáp và khắc phục lỗi sai cá nhân.
* **Giảng viên / Trợ giảng môn Toán:** Cần công cụ cập nhật barem chấm điểm tự động, tạo bài tập tự luận/trắc nghiệm tương tự và nhân bản quy trình sư phạm 4 bước cho các bài học mới.

### 3.2. Bảng Job-to-be-done (JTBD)

| Công việc cần hoàn thành (JTBD) | Nỗi đau hiện tại | Giải pháp của Cú Đêm AI |
|:---|:---|:---|
| **Hiểu bản chất khái niệm/định lí**[cite: 1] | Học vẹt công thức, không hiểu ý nghĩa thực tế của $\alpha, p\text{-value}, \sigma$ hay cấu trúc logic của định lí. | Tiến trình 4 bước chuẩn hóa: Trải nghiệm $\to$ Hình thành định nghĩa/định lí $\to$ Củng cố $\to$ Vận dụng. |
| **Chữa bài tập tự luận viết tay**[cite: 1] | Giảng viên không thể sửa chi tiết cho từng người; người học không biết mình sai ở bước nào[cite: 1]. | Tương tác qua bảng iPad/Ảnh/PDF $\to$ AI Tutor cập nhật Barem chấm tự động $\to$ Chỉ cung cấp chiến lược giải. |
| **Vấn đáp và phản xạ lý thuyết**[cite: 1] | Chỉ làm bài tập tính toán, khi thi vấn đáp hoặc hỏi bản chất thì ấp úng, hiểu sai. | Trạm Vấn đáp & Voice AI kết hợp bảng viết iPad, chấm điểm trực tiếp và chỉ rõ lỗ hổng kiến thức. |
| **Khắc phục lỗi sai có hệ thống**[cite: 1] | Làm sai xong bỏ qua, lặp lại cùng một lỗi trong bài thi chính thức[cite: 1]. | Thống kê lỗi sai từ Vấn đáp, Trắc nghiệm, Tự luận $\to$ Hồ sơ AI nhận định lỗi $\to$ Đề xuất phương án bổ trợ. |

---

## 04. ĐỊNH VỊ SẢN PHẨM & MA TRẬN 11 TÍNH NĂNG CHUẨN HÓA

### 4.1. Định vị sản phẩm
**Cú Đêm AI** là **Socratic AI Math Pedagogy Platform** — Hệ thống sư phạm toán học tương tác đa phương thức (Multimodal Math Platform) lấy quy trình sư phạm 4 bước và phương pháp gợi mở chiến lược làm trục trung tâm.

### 4.2. Ma trận chi tiết 11 tính năng (Khớp 100% yêu cầu đề bài)

#### **TN1 — Quy trình sư phạm 4 bước chuẩn hóa (Giải toán, Khái niệm, Định lí):**
1. **Quy trình giải toán Xác suất Thống kê (4 bước):**
   * *Bước 1 — Tìm hiểu nội dung bài toán:* Hướng dẫn người học phân biệt cái đã cho, cái phải tìm và cái phải chứng minh; dùng công thức, kí hiệu, hình vẽ để diễn tả đề bài; phân biệt các thành phần khác nhau của điều kiện và chuyển hóa các điều kiện đó thành công thức toán học[cite: 2].
   * *Bước 2 — Xây dựng chương trình giải:* Phân tích bài toán đã cho thành nhiều bài toán đơn giản quen thuộc; lựa chọn kiến thức đã học gần gũi nhất với dữ kiện để dự đoán kết quả; sử dụng phương pháp đặc thù với từng dạng toán (như chứng minh, tính xác suất)[cite: 2].
   * *Bước 3 — Trình bày lời giải:* Người học thực hiện trình bày lại lời giải hoàn chỉnh sau khi đã điều chỉnh những chỗ cần thiết từ chương trình giải[cite: 2].
   * *Bước 4 — Kiểm tra và nghiên cứu lời giải:* Kiểm tra lại kết quả và các lập luận trong quá trình giải; nhìn lại toàn bộ các bước giải để rút ra tri thức phương pháp; tìm thêm cách giải khác (nếu có); khai thác kết quả bài toán; đề xuất bài toán tương tự, bài toán đặc biệt hoặc khái quát hóa bài toán[cite: 2].
2. **Quy trình học Khái niệm Xác suất Thống kê (`Trải nghiệm → Hình thành định nghĩa khái niệm → Củng cố → Vận dụng`):**
   * *Bước 1 — Trải nghiệm:* Tiếp cận các dấu hiệu bản chất của khái niệm thông qua biểu tượng trực quan hoặc trải nghiệm thực tiễn; đưa ra các tình huống cụ thể để học sinh cảm nhận sự tồn tại hoặc tác dụng của đối tượng cần định nghĩa[cite: 2].
   * *Bước 2 — Hình thành định nghĩa khái niệm:*
     + Nhận biết dấu hiệu bản chất thông qua phân tích, so sánh, trừu tượng hóa, khái quát hóa để tìm ra dấu hiệu đặc trưng (hoặc đi ngay vào định nghĩa mới như một trường hợp riêng của khái niệm đã biết)[cite: 2].
     + Lĩnh hội các thuật ngữ, kí hiệu then chốt; phát biểu được bằng lời (nêu tên và dấu hiệu đặc trưng) và ghi nhớ định nghĩa khái niệm[cite: 2].
   * *Bước 3 — Củng cố:*
     + Nhận diện khái niệm trong những trường hợp đơn giản có tính chất đặc trưng (vận dụng trực tiếp trong các tình huống quen thuộc)[cite: 2].
     + Thể hiện khái niệm trong các ngữ cảnh khác nhau cũng như trong mối liên hệ logic với các khái niệm khác nhằm tạo tiền đề cho bước vận dụng[cite: 2].
   * *Bước 4 — Vận dụng vào thực tiễn:* Vận dụng khái niệm vừa học trong các tình huống gián tiếp, phức hợp hơn và giải quyết các vấn đề thực tiễn[cite: 2].
3. **Quy trình học Định lí Xác suất Thống kê (`Trải nghiệm → Hình thành định lí → Củng cố → Vận dụng`):**
   * *Bước 1 — Trải nghiệm:* Tiếp cận trực tiếp với các yếu tố giả thiết và kết luận nhằm khơi gợi mong muốn tự chứng minh hoặc bác bỏ vấn đề; sử dụng tình huống thực tiễn hoặc vấn đề nội bộ môn toán để tạo động lực tiếp nhận giả thiết và phát sinh nhu cầu kiểm chứng[cite: 2].
   * *Bước 2 — Hình thành định lí:*
     + Nhận diện và phân biệt chính xác phần giả thiết và phần kết luận hàm chứa bên trong định lí[cite: 2].
     + Dự đoán và phát biểu định lí (nhận biết những yếu tố được phản ánh trong định lí)[cite: 2].
     + Nhận biết các luận cứ làm cơ sở cho chứng minh định lí[cite: 2].
     + Nhận biết cách thức chứng minh và tự chứng minh được định lí[cite: 2].
     + Hiểu rõ cấu trúc logic của định lí[cite: 2].
   * *Bước 3 — Củng cố:* Thực hành vận dụng định lí trong những trường hợp đơn giản có tính chất đặc trưng[cite: 2].
   * *Bước 4 — Vận dụng:* Vận dụng định lí để giải quyết một số vấn đề toán học hoặc giải quyết vấn đề gắn với thực tiễn[cite: 2].

#### **Các tính năng tương tác, khảo hạch và cá nhân hóa (TN2 – TN11):**
* **TN2 — AI Tutor chấm điểm đa phương thức (Hình ảnh, PDF, Bảng iPad):** Cho phép chấm điểm qua ảnh chụp, file PDF hoặc tương tác trực tiếp với bảng viết iPad (nội dung viết trên iPad hiển thị đồng bộ lên màn hình để AI Tutor chấm điểm)[cite: 1, 2]. Hệ thống cho phép **cập nhật Barem điểm linh hoạt** (hoặc dùng Barem chuẩn 4 tiêu chí) để chấm điểm tự động[cite: 1, 2]. **Nguyên tắc cốt lõi:** AI Tutor chỉ cung cấp chiến lược giải chứ không cung cấp lời giải[cite: 1, 2].
* **TN3 — Tương tác giọng nói 2 chiều kết hợp Bảng iPad:** Cho phép người dùng trao đổi, hỏi đáp bằng giọng nói về nội dung XSTK[cite: 1, 2]. Khi hỏi về bài toán cụ thể (vốn khó diễn đạt thuần túy bằng lời nói), người học có thể **vừa nói vừa hỏi và trình bày lời giải qua bảng iPad**, đồng thời AI cũng hiển thị công thức trực quan lên màn hình[cite: 1, 2].
* **TN4 — Tạo 5 bài tập tương tự tự luận:** Người học tương tác với một bài toán gốc, AI phân tích cấu trúc và **tự động sinh ngẫu nhiên đúng 5 bài toán tự luận tương tự** để tự luyện tập[cite: 1, 2]. Tính năng này cũng tuân thủ nghiêm ngặt việc **chỉ cung cấp chiến lược giải**, không đưa đáp án sẵn[cite: 1, 2].
* **TN5 — Tạo bài tập tương tự trắc nghiệm & Truy vấn đáp án:** AI sinh các bài tập trắc nghiệm tương tự theo chủ đề/câu hỏi gốc; người học làm bài và được **chấm điểm ngay tức thì (Realtime)**[cite: 1, 2]. AI cung cấp điểm số và hỗ trợ giải đáp tương tác khi học sinh **truy vấn hỏi "Tại sao đáp án này đúng/sai?"**[cite: 1, 2].
* **TN6 — Phòng khảo hạch vấn đáp lý thuyết:** Học sinh tương tác với các câu hỏi vấn đáp về lý thuyết XSTK[cite: 1, 2]. AI thực hiện **chấm điểm sau các câu hỏi vấn đáp**, đồng thời chỉ rõ các **lỗ hổng kiến thức** và những **sai lầm nhận thức (misconceptions)** khi học XSTK[cite: 1, 2].
* **TN7 — Thống kê câu hỏi sai & Nội dung sai:** AI tự động thu thập và thống kê toàn bộ các câu trả lời sai từ 3 nguồn: **Vấn đáp, Trắc nghiệm, và Tự luận**[cite: 1, 2]. Từ dữ liệu đó, AI đưa ra **nhận định chung về các lỗi sai** của người học và đề xuất **hướng khắc phục cụ thể** cho từng nhóm lỗi[cite: 1, 2].
* **TN8 — Bản đồ tư duy (Mindmap) XSTK:** AI cung cấp bản đồ tư duy trực quan phục vụ việc hệ thống hóa nội dung XSTK theo 4 nhánh chuẩn: Dạng toán, Dữ kiện đề bài, Công thức cốt lõi, Các bước thực hiện & Bẫy thường gặp[cite: 1, 2].
* **TN9 — Diễn đàn điện tử học XSTK:** Không gian trao đổi học thuật cho phép người học đăng bài thảo luận thông tin về XSTK kèm công thức LaTeX và hình vẽ từ bảng iPad, bình luận đa cấp, kết bạn và nhắn tin trao đổi trực tuyến[cite: 1, 2].
* **TN10 — Hồ sơ AI học XSTK (AI Learning Profile):** Mỗi người dùng sở hữu một hồ sơ học tập riêng biệt theo dõi tiến độ trên 7 chương XSTK[cite: 1, 2]. Thông qua hồ sơ này, AI đưa ra **nhận định tổng hợp về các lỗi sai mà người học hay mắc phải** và tự động **đề xuất phương án/bài tập bổ trợ để khắc phục lỗi đó**[cite: 1, 2].
* **TN11 — Nhân bản quy trình 4 bước (Meta Pedagogy Engine):** Khi người dùng đưa bất kỳ một bài toán, một khái niệm, hoặc một định lí mới vào trợ lý AI, hệ thống tự động tạo ra bản sao quy trình 4 bước tương ứng với đối tượng ban đầu (Giải toán / Khái niệm / Định lí), bảo đảm đầy đủ 4 bước có tính năng tương tác, có ví dụ minh họa và bài tập củng cố[cite: 1, 2].

---

## 05. NGUYÊN TẮC THIẾT KẾ VÀ CHỐNG PHÌNH PHẠM VI (ANTI-SCOPE-CREEP)

1. **Nguyên tắc Socratic First & Chống bẻ khóa (Anti-Jailbreak):** Mọi prompt gửi tới AI Tutor (TN1, TN2, TN4, TN11) đều có lớp rào chắn trạng thái: *"Tuyệt đối không đưa ra đáp số cuối cùng hoặc bài giải chi tiết hoàn chỉnh. Kể cả khi người học nài nỉ hoặc đưa ra một con số bất kỳ để dò đáp án, chỉ xác nhận tính hợp lý của phương pháp/công thức và đặt câu hỏi gợi mở bước tiếp theo."*[cite: 1, 2]
2. **Nguyên tắc Tối ưu tài nguyên:** Sử dụng Canvas 2D mô phỏng 3D giả lập (Isometric Wireframe Engine) thay vì nhúng Three.js nặng nề, giúp trang tải tức thì trên cả máy tính và máy tính bảng iPad[cite: 1].
3. **Phân định rõ ranh giới MVP:**
   * *Trong phạm vi:* Trọn vẹn 11 tính năng chuẩn theo đề bài, hỗ trợ 7 chương XSTK đại học, xác thực Firebase Auth chính thống, đồng bộ bảng viết iPad và lưu trữ đám mây an toàn[cite: 1, 2].
   * *Ngoài phạm vi:* Không tích hợp cổng thanh toán ngân hàng, không xây dựng hệ thống gọi video trực tuyến (sử dụng Voice AI + Canvas Sync thay thế), không phát triển ứng dụng di động native riêng (chạy trên nền Web Responsive PWA hỗ trợ Apple Pencil/iPad)[cite: 1, 2].

---

## 06. KIẾN TRÚC HỆ THỐNG VÀ BẢO MẬT (TRUST BOUNDARIES)

1. **Xác thực chuẩn Production:** Loại bỏ hoàn toàn cơ chế lưu mật khẩu dạng Base64; chuyển toàn bộ sang `firebase.auth().createUserWithEmailAndPassword` và `signInWithEmailAndPassword`[cite: 1].
2. **Thiết lập Firebase Security Rules nghiêm ngặt:** Đảm bảo chỉ người trong cuộc mới đọc được tin nhắn riêng (`dms`); chỉ chủ sở hữu mới sửa được hồ sơ năng lực (`learning_profiles`) và bài viết (`posts`)[cite: 1].
3. **Che giấu API Key qua Serverless Proxy:** Tuyệt đối không lưu `GEMINI_API_KEY` ở LocalStorage của trình duyệt; toàn bộ lời gọi tới mô hình `gemini-2.5-flash` được định tuyến qua Cloud Function / Node Proxy sử dụng biến môi trường `process.env.GEMINI_API_KEY`[cite: 1].
4. **Tối ưu truyền tải ảnh Bảng viết iPad:** Nét vẽ trên Canvas iPad được nén sang định dạng `image/webp` (chất lượng 0.65) trước khi gửi lên AI Tutor hoặc lưu tách sang nhánh `post_media` để không làm nghẽn băng thông khi tải danh sách bài viết diễn đàn[cite: 1, 2].

---

## 07. THIẾT KẾ DỮ LIỆU & JSON SCHEMAS (DATA CONTRACTS)

### 7.1. Cấu trúc CSDL Firebase Realtime Database (Đã nâng cấp cho đủ 11 tính năng)
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
      "streak": 5,
      "lastSeen": 1713337200000
    }
  },
  "rubrics": {
    "$rubricId": {
      "title": "Barem chuẩn 4 tiêu chí XSTK",
      "createdBy": "$uid",
      "isDefault": true,
      "criteria": [
        { "id": "c1", "name": "Nhận diện dạng toán & Gọi biến cố/biến ngẫu nhiên", "maxScore": 2.0 },
        { "id": "c2", "name": "Thiết lập công thức toán học phù hợp", "maxScore": 3.0 },
        { "id": "c3", "name": "Quá trình thay số và tính toán logic", "maxScore": 3.5 },
        { "id": "c4", "name": "Kết luận ngữ cảnh thực tế & Điều kiện ràng buộc", "maxScore": 1.5 }
      ]
    }
  },
  "pedagogy_sessions": {
    "$sessionId": {
      "uid": "$uid",
      "sourceType": "built_in | cloned_meta_engine",
      "category": "problem_solving | concept | theorem",
      "title": "Định lí Giới hạn Trung tâm (CLT)",
      "currentStep": 2,
      "stepsData": {
        "step1": { "completed": true, "userResponse": "..." },
        "step2": { "completed": false, "userResponse": "" },
        "step3": { "completed": false, "userResponse": "" },
        "step4": { "completed": false, "userResponse": "" }
      },
      "updatedAt": 1713337200000
    }
  },
  "learning_profiles": {
    "$uid": {
      "chapterMastery": { "ch1": 85, "ch2": 60, "ch3": 40, "ch4": 75, "ch5": 90, "ch6": 55, "ch7": 70 },
      "generalErrorAssessment": "Thường xuyên nhầm lẫn giữa xác suất có điều kiện P(A|B) và xác suất giao P(AB); quên kiểm tra điều kiện độc lập của biến ngẫu nhiên.",
      "remediationPlan": [
        "Ôn lại quy trình 4 bước học khái niệm Xác suất có điều kiện (Chương 1)",
        "Hoàn thành gói 5 bài tập tự luận tương tự về Công thức Bayes"
      ],
      "misconceptions": [
        { "id": "misc_01", "chapter": 1, "type": "Bayes vs Conditional", "source": "oral", "count": 3, "status": "remedied" }
      ],
      "missedQuestions": {
        "$qid": {
          "chapter": 3,
          "mode": "mcq | essay | oral",
          "questionSummary": "Tính phương sai của tổ hợp tuyến tính Y = 2X - 3",
          "errorDesc": "Không bình phương hệ số a khi tính Var(aX + b)",
          "remediationHint": "Áp dụng tính chất Var(aX + b) = a^2 * Var(X)",
          "timestamp": 1713337200000
        }
      }
    }
  },
  "posts": {
    "$postId": {
      "authorUid": "$uid",
      "title": "Thắc mắc về công thức Bayes",
      "body": "Tại sao bài này mẫu số lại chia làm 3 trường hợp?",
      "hasCanvasImg": true,
      "timestamp": 1713337200000,
      "likes": { "$uid": true },
      "comments": {
        "$commentId": { "authorUid": "$uid", "text": "...", "timestamp": 1713337300000 }
      }
    }
  },
  "post_media": {
    "$postId": {
      "canvasImgWebp": "data:image/webp;base64,..."
    }
  },
  "dms": {
    "$pairId": {
      "$msgId": { "senderUid": "$uid", "text": "Chào bạn, cùng giải bài này nhé", "timestamp": 1713337200000 }
    }
  }
}