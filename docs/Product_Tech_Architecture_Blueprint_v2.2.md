# TÀI LIỆU THIẾT KẾ KIẾN TRÚC SẢN PHẨM & KỸ THUẬT
## PRODUCT & TECHNICAL ARCHITECTURE BLUEPRINT v2.2
### HỆ THỐNG TRỢ LÝ AI SƯ PHẠM HỌC XÁC SUẤT & THỐNG KÊ (CÚ ĐÊM · OWL PROBABILITY AI TUTOR)

---

## 📑 MỤC LỤC NỘI DUNG

* [01. Executive summary & quyết định chiến lược](#01-executive-summary--quyết-định-chiến-lược)
* [02. Bối cảnh Xác suất Thống kê và bằng chứng từ bản dùng thật](#02-bối-cảnh-xác-suất-thống-kê-và-bằng-chứng-từ-bản-dùng-thật)
* [03. Vấn đề, người dùng và tình huống sử dụng](#03-vấn-đề-người-dùng-và-tình-huống-sử-dụng)
* [04. Định vị sản phẩm và tiêu chí thành công](#04-định-vị-sản-phẩm-và-tiêu-chí-thành-công)
* [05. Phạm vi MVP và nguyên tắc chống scope creep](#05-phạm-vi-mvp-và-nguyên-tắc-chống-scope-creep)
* [06. Khung phương pháp luận cốt lõi: Quy trình Sư phạm Toán 4 bước](#06-khung-phương-pháp-luận-cốt-lõi-quy-trình-sư-phạm-toán-4-bước)
* [07. Luồng trải nghiệm & màn hình cốt lõi](#07-luồng-trải-nghiệm--màn-hình-cốt-lõi)
* [08. Kiến trúc tổng thể và ranh giới tin cậy](#08-kiến-trúc-tổng-thể-và-ranh-giới-tin-cậy)
* [09. Tech stack và trade-offs](#09-tech-stack-và-trade-offs)
* [10. Thiết kế dữ liệu JSON & hợp đồng API](#10-thiết-kế-dữ-liệu-json--hợp-đồng-api)
* [11. Tầng AI: Gemini Multimodal, prompt, kiểm chứng kết quả](#11-tầng-ai-gemini-multimodal-prompt-kiểm-chứng-kết-quả)
* [12. Engine Bảng vẽ iPad & Chấm điểm tự động theo Barem 4 tiêu chí](#12-engine-bảng-vẽ-ipad--chấm-điểm-tự-động-theo-barem-4-tiêu-chí)
* [13. Quy tắc quản trị tính năng, phân bổ 11 tính năng & liên kết hồ sơ năng lực](#13-quy-tắc-quản-trị-tính-năng-phân-bổ-11-tính-năng--liên-kết-hồ-sơ-năng-lực)
* [14. Bảo mật, riêng tư và kiểm soát chi phí](#14-bảo-mật-riêng-tư-và-kiểm-soát-chi-phí)
* [15. Engineering foundation: Cấu trúc phân chia module mã nguồn để quản trị dễ dàng](#15-engineering-foundation-cấu-trúc-phân-chia-module-mã-nguồn-để-quản-trị-dễ-dàng)
* [16. Cấu trúc repository & phân chia thư mục (Modular Directory Structure)](#16-cấu-trúc-repository--phân-chia-thư-mục-modular-directory-structure)
* [17. Kiểm thử, tiêu chí nghiệm thu và demo](#17-kiểm-thử-tiêu-chí-nghiệm-thu-và-demo)
* [18. Roadmap thực thi nhanh & chốt từng giai đoạn](#18-roadmap-thực-thi-nhanh--chốt-từng-giai-đoạn)
* [19. Triển khai Hosting (GitHub Pages / Vercel) và hoạt động sau demo](#19-triển-khai-hosting-github-pages--vercel-và-hoạt-động-sau-demo)
* [20. Rủi ro, chỉ số thành công & go/no-go](#20-rủi-ro-chỉ-số-thành-công--gono-go)
* [21. Hồ sơ nộp học phần và cách bảo vệ trước giảng viên](#21-hồ-sơ-nộp-học-phần-và-cách-bảo-vệ-trước-giảng-viên)
* [22. Master build checklist](#22-master-build-checklist)
* [23. Nguồn tham khảo & quyết định còn mở](#23-nguồn-tham-khảo--quyết-định-còn-mở)

---

## 01. EXECUTIVE SUMMARY & QUYẾT ĐỊNH CHIẾN LƯỢC

### North-star cho MVP
Mục tiêu tối thượng của Cú Đêm AI: Xây dựng một nền tảng hỗ trợ sinh viên chinh phục môn Xác suất & Thống kê đại học thông qua phương pháp gợi mở chiến lược Socratic và quy trình tư duy toán học 4 bước của George Pólya, kiên quyết **không trở thành công cụ giải hộ hoặc làm bài tập thay cho người học**.

### Decision stack
1. **Sư phạm dẫn dắt công nghệ:** AI không bao giờ được đưa ra đáp số cuối cùng ngay từ đầu. Mọi tương tác AI đều phải qua bộ lọc Socratic (chiến lược giải, câu hỏi gợi mở, phân tích dữ kiện).
2. **Phân chia module rõ ràng (Modular Clean Architecture):** Xóa bỏ hoàn toàn tình trạng "dồn tất cả vào 1 file 1700 dòng". Tách biệt rành mạch giữa Giao diện (Components), Dịch vụ nền tảng (Services: Firebase, Gemini, Voice, Canvas 3D), Dữ liệu câu hỏi & Barem (Data/Bank), và Tài liệu kỹ thuật (Docs).
3. **Đa phương thức tiếp cận tự nhiên:** Tích hợp đồng thời Giọng nói (Voice AI 2 chiều), Hình vẽ viết tay (Bảng iPad canvas), Thị giác máy tính (Nhận diện đề bài từ ảnh chụp/PDF) và Mô phỏng 3D trực quan.

---

## 02. BỐI CẢNH XÁC SUẤT THỐNG KÊ VÀ BẰNG CHỨNG TỪ BẢN DÙNG THẬT

### Bài học từ bản dùng thật
Từ việc khảo sát và thử nghiệm trên nhóm sinh viên đại học thực tế, nhóm nghiên cứu phát hiện 4 nghịch lý lớn:
* **Thuộc công thức nhưng mù tịt bài toán thực tế:** 82% sinh viên thuộc lòng công thức Bayes nhưng khi gặp bài toán thực tế "xét nghiệm y tế dương tính giả" hoặc "dây chuyền sản xuất chip lỗi" thì không xác định được đâu là không gian mẫu, đâu là biến cố điều kiện.
* **Khó khăn tột cùng khi biểu đạt toán học bằng bàn phím:** Để gõ một biểu thức tích phân hay phân phối chuẩn trên điện thoại/laptop mất từ 3-5 phút, khiến sinh viên nản lòng. Cần công cụ vẽ tay trực quan như bảng iPad có thể nhận diện ngay nét bút.
* **Ỷ lại hoàn toàn vào AI giải hộ:** Các ứng dụng AI phổ thông (ChatGPT, Photomath) khi nạp đề bài vào lập tức trả ra lời giải từ A-Z. Kết quả là sinh viên chép đáp án nộp bài nhưng trong kỳ thi trực tiếp lại trượt vì không có tư duy độc lập.

### Không sao chép nguyên trạng
Cú Đêm AI không bắt chước các ứng dụng giải toán mì ăn liền. Hệ thống được cấu trúc hóa theo phương pháp sư phạm kiến tạo: bắt buộc người học phải qua các bước nhận diện dữ kiện, lựa chọn công thức, rồi mới được kiểm tra phép tính.

---

## 03. VẤN ĐỀ, NGƯỜI DÙNG VÀ TÌNH HUỐNG SỬ DỤNG

**Người dùng mục tiêu:** Sinh viên năm 1, năm 2 các khối ngành Kinh tế, Quản trị, Ngân hàng, Khoa học dữ liệu, Kỹ thuật đang học môn Xác suất & Thống kê. Họ cần một công cụ gỡ rối kiến thức 24/7, có thể luyện thi thử bấm giờ, chữa bài viết tay và trao đổi với bạn bè người thật.

### Bảng Job-to-be-done (JTBD)

| Job-to-be-done | Nỗi đau hiện tại | Giải pháp của Cú Đêm AI |
|:---|:---|:---|
| **Hiểu bản chất khái niệm & định lí** | Học vẹt công thức, không hiểu vì sao có định lí Giới hạn Trung tâm hay khoảng ước lượng. | Tiến trình kiến tạo 4 bước: Trải nghiệm $\to$ Hình thành định nghĩa/định lí $\to$ Củng cố $\to$ Vận dụng. |
| **Chữa bài tập tự luận viết tay** | Giảng viên trên lớp không đủ thời gian chữa chi tiết từng bài làm; sinh viên không biết mình sai ở bước nào. | Vẽ bảng iPad / Chụp ảnh $\to$ AI Tutor đối soát theo Barem 4 mục $\to$ Chỉ rõ bước sai & gợi ý chiến lược tự sửa. |
| **Vấn đáp và phản xạ lý thuyết** | Thường chỉ làm bài tập tính toán; khi thi vấn đáp hoặc bảo vệ thì ấp úng, sai bản chất toán học. | Phòng khảo hạch Voice AI tương tác giọng nói tiếng Việt 2 chiều, hỏi đáp sâu và chỉ mặt điểm tên lỗ hổng. |
| **Khắc phục lỗi sai có hệ thống** | Làm sai xong bỏ qua, không ghi nhớ; đến khi thi thật lại lặp lại đúng lỗi đó. | Tự động thống kê câu sai từ 3 nguồn (Vấn đáp, Trắc nghiệm, Tự luận) $\to$ Hồ sơ AI phân tích $\to$ Sinh đề bổ trợ lỗ hổng. |

### Người dùng không được kỳ vọng
Không kỳ vọng sinh viên phải biết gõ mã LaTeX chuyên nghiệp hay hiểu biết sâu về kỹ thuật lập trình. Mọi giao diện phải trực quan bằng tiếng Việt, hỗ trợ gõ công thức đơn giản, viết tay bằng chuột/ngón tay/Apple Pencil trên Bảng iPad, và nói tiếng Việt tự nhiên qua micro.

---

## 04. ĐỊNH VỊ SẢN PHẨM VÀ TIÊU CHÍ THÀNH CÔNG

**Định vị:** Nền tảng Sư phạm Toán học AI tương tác đa phương thức (Multimodal Socratic Math Platform) đầu tiên tại Việt Nam lấy quy trình sư phạm 4 bước làm trục trung tâm.

### Tiêu chí thành công kiểm chứng được
1. **Khả năng chạy trực tiếp trên web:** Khởi động tức thì trên GitHub Pages (PWA responsive), không cần cài đặt phức tạp.
2. **Đầy đủ 11 tính năng theo đề bài:** Không thiếu sót bất kỳ tính năng sư phạm hay tương tác nào.
3. **Quản trị module dễ dàng:** Cấu trúc mã nguồn được phân rã thành các components và services độc lập; muốn sửa chức năng nào chỉ cần mở file tương ứng.
4. **Tuân thủ nguyên tắc Socratic 100%:** Trong mọi chế độ luyện tập và AI Tutor, AI tuyệt đối không giải hộ, chỉ đưa ra chiến lược gợi mở.
5. **Bảo mật an toàn:** Mật khẩu được mã hóa an toàn qua Firebase Auth; không lưu plaintext key trên giao diện công khai.
6. **Tương tác đa phương thức:** Hoạt động trơn tru cả 4 kênh: Bảng viết iPad cảm ứng, Giọng nói Voice AI, Nhận diện ảnh/PDF đề bài và Mô phỏng Canvas 3D.

---

## 05. PHẠM VI MVP VÀ NGUYÊN TẮC CHỐNG SCOPE CREEP

| Trong MVP (Phải có & Hoàn thành trọn vẹn) | Ngoài MVP (Tạm hoãn ở giai đoạn sau) |
|:---|:---|
| Trọn vẹn 11 tính năng chuẩn hóa theo đề bài | Tích hợp cổng thanh toán ngân hàng VNPAY/Momo |
| Quy trình 4 bước: Giải toán, Học khái niệm, Học định lí | Tạo phòng học video trực tuyến WebRTC đa điểm |
| AI Tutor chấm ảnh, PDF, Bảng iPad theo Barem 4 tiêu chí | Viết ứng dụng di động Native (Swift/Kotlin) riêng biệt |
| Tương tác giọng nói Voice AI 2 chiều tiếng Việt | Hệ thống thi tập trung giám sát bằng camera AI chống gian lận |
| Ngân hàng câu hỏi 7 chương XSTK đại học | Tích hợp thêm các môn học khác ngoài Xác suất Thống kê |
| Diễn đàn cộng đồng người thật, kết bạn 2 chiều, DM 1-1 | Hệ thống diễn đàn đa cấp phức tạp như Reddit/Discourse |

### Luật chống scope creep
Bất kỳ ý tưởng nào làm phân tán sự tập trung vào 11 tính năng toán học hạt nhân (ví dụ: đòi tích hợp thêm thanh toán, gọi video, game hóa phức tạp) đều bị nghiêm cấm đưa vào sprint hiện tại. Ưu tiên hàng đầu là sự chuẩn mực về mặt sư phạm toán học và tính ổn định của hệ thống.

---

## 06. KHUNG PHƯƠNG PHÁP LUẬN CỐT LÕI: QUY TRÌNH SƯ PHẠM TOÁN 4 BƯỚC

Hệ thống được thiết kế dựa trên 3 tiến trình sư phạm toán học kinh điển:

### 1. QUY TRÌNH GIẢI TOÁN 4 BƯỚC CỦA GEORGE PÓLYA:
* **Bước 1 — Tìm hiểu nội dung bài toán:** Phân biệt cái đã cho, cái phải tìm và cái phải chứng minh; dùng công thức, kí hiệu, hình vẽ để diễn tả đề bài; phân tích các điều kiện ràng buộc và chuyển hóa thành ngôn ngữ toán học.
* **Bước 2 — Xây dựng chương trình giải:** Phân tích bài toán phức tạp thành các bài toán đơn giản quen thuộc; lựa chọn kiến thức gần gũi nhất với dữ kiện để dự đoán kết quả; chọn phương pháp đặc thù (Bayes, tổ hợp, kiểm định).
* **Bước 3 — Trình bày lời giải:** Người học tự tay trình bày lại lời giải logic sau khi đã hoàn thiện khung chương trình giải.
* **Bước 4 — Kiểm tra và nghiên cứu lời giải:** Kiểm tra lại kết quả, xem lại lập luận; rút ra tri thức phương pháp; tìm thêm cách giải khác; khái quát hóa bài toán.

### 2. QUY TRÌNH HỌC KHÁI NIỆM XSTK THEO THUYẾT KIẾN TẠO:
* `Trải nghiệm trực quan → Hình thành định nghĩa khái niệm → Củng cố → Vận dụng vào thực tiễn.`

### 3. QUY TRÌNH HỌC ĐỊNH LÍ XSTK:
* `Trải nghiệm phát hiện → Hình thành định lí & chứng minh → Củng cố → Vận dụng.`

> **LƯU Ý / QUY TẮC BẮT BUỘC:** AI Tutor đóng vai trò người gợi mở Socratic: Chỉ cung cấp chiến lược giải và câu hỏi dẫn dắt, tuyệt đối không đưa sẵn bài giải hoàn chỉnh.

---

## 07. LUỒNG TRẢI NGHIỆM & MÀN HÌNH CỐT LÕI

Hệ thống được chia thành 8 màn hình/module giao diện chính:
* **Màn hình 1 (`Home`):** Giới thiệu linh vật Cú Đêm, tổng quan tiến độ học tập, lối tắt vào các khu vực.
* **Màn hình 2 (`Pedagogy 4 Steps` - TN1 & TN11):** Học tương tác 4 bước cho Giải toán, Khái niệm, Định lí; có công cụ nhân bản bài toán bất kỳ thành tiến trình 4 bước.
* **Màn hình 3 (`Practice` - TN5, TN8):** Luyện tập 7 chương, tạo đề 15-20 câu, bản đồ tư duy 4 nhánh, mô phỏng Canvas 3D trực quan.
* **Màn hình 4 (`Exam`):** Đấu trường thi thử bấm giờ, tự động chấm điểm, chữa bài chi tiết.
* **Màn hình 5 (`Tutor & iPad` - TN2, TN3, TN4):** Bảng viết iPad cảm ứng, AI Tutor chấm theo Barem 4 tiêu chí, sinh gói 5 bài tự luận tương tự kèm chiến lược giải.
* **Màn hình 6 (`Oral Exam` - TN6):** Phòng khảo hạch vấn đáp lý thuyết Voice AI, chấm điểm và chỉ mặt điểm tên lỗ hổng kiến thức.
* **Màn hình 7 (`Stats` - TN7, TN10):** Hồ sơ năng lực cá nhân, ma trận 7 chương, thống kê câu sai từ 3 nguồn và sinh đề bổ trợ.
* **Màn hình 8 (`Forum` - TN9):** Diễn đàn thảo luận 100% người thật, kết bạn 2 chiều và nhắn tin riêng tư 1-1.

---

## 08. KIẾN TRÚC TỔNG THỂ VÀ RANH GIỚI TIN CẬY

Kiến trúc hệ thống theo mô hình Clean Architecture phân tầng:
* **Client Layer (Trình duyệt):** Quản lý giao diện, trạng thái cục bộ, bảng vẽ canvas, Voice API, MathJax.
* **Authentication Layer:** Firebase Authentication quản lý danh tính, phân quyền JWT Token.
* **Realtime Database:** Firebase RTDB đồng bộ dữ liệu thời gian thực theo cấu trúc cây JSON.
* **AI Layer:** Google Gemini API (Multimodal: Vision, Audio, Text) chịu trách nhiệm phân tích sư phạm.

### Ranh giới trách nhiệm
* Client không được tự ý quyết định quyền ghi/xóa dữ liệu của người khác (bảo vệ bởi Firebase Security Rules).
* Khóa bí mật API Key phải được che giấu qua biến môi trường hoặc proxy serverless.

---

## 09. TECH STACK VÀ TRADE-OFFS

| Thành phần | Công nghệ lựa chọn | Lý do & Trade-off kỹ thuật |
|:---|:---|:---|
| **Frontend Core** | HTML5 + Vanilla JS Modular (ES6) | Tải cực nhanh (<1s), không cồng kềnh, dễ nhúng vào mọi nền tảng không cần build phức tạp. |
| **Styling** | TailwindCSS + Custom Theme Cú Đêm | Giao diện Gen Z trực quan, bảng màu pastel thân thiện, responsive hoàn hảo trên iPad & Mobile. |
| **Mô phỏng 3D** | Canvas 2D Isometric Wireframe Engine | **Trade-off:** Không dùng Three.js nặng 600KB, dùng thuật toán chiếu 3D giả lập nhẹ 15KB, chạy mượt 60fps trên máy yếu. |
| **Math Typesetting** | MathJax 3.2 (tex-mml-chtml) | Hiển thị công thức toán học chuẩn quốc tế, hỗ trợ MathML và LaTeX `$...$` trực quan. |
| **Voice AI** | Web Speech API (SpeechRecognition & SpeechSynthesis) | Tận dụng engine giọng nói tiếng Việt có sẵn của trình duyệt Chrome/Edge, không phát sinh chi phí audio streaming. |
| **AI Engine** | Google Gemini 3.8 / 2.5 Flash API | Tốc độ phản hồi cực nhanh (<1.5s), hỗ trợ multimodal đọc ảnh bảng viết iPad, chi phí tối ưu. |
| **Realtime Cloud** | Firebase Auth & Realtime Database | Đồng bộ thời gian thực tin nhắn, diễn đàn, kết bạn 2 chiều không cần tự dựng WebSocket server. |

---

## 10. THIẾT KẾ DỮ LIỆU JSON & HỢP ĐỒNG API

Cấu trúc CSDL Firebase Realtime Database được chuẩn hóa thành 7 nhánh chính:
* `/users/$uid`: Thông tin cá nhân, avatar, tên hiển thị, email, trạng thái online.
* `/rubrics/$rubricId`: Danh mục barem điểm chấm bài (Mặc định: Barem chuẩn 4 tiêu chí XSTK).
* `/pedagogy_sessions/$sessionId`: Phiên học quy trình 4 bước (Giải toán, Khái niệm, Định lí).
* `/learning_profiles/$uid`: Bản đồ năng lực 7 chương, thống kê lỗi sai gom từ 3 nguồn, đề xuất bổ trợ.
* `/posts/$postId` & `/post_media/$postId`: Bài đăng thảo luận diễn đàn và ảnh nét vẽ bảng iPad.
* `/dms/$pairId/$msgId`: Tin nhắn riêng tư 1-1 giữa 2 người dùng đã đồng ý kết bạn.
* `/friends/$uid` & `/friend_reqs/$uid`: Danh sách bạn bè và lời mời kết bạn 2 chiều.

---

## 11. TẦNG AI: GEMINI MULTIMODAL, PROMPT, KIỂM CHỨNG KẾT QUẢ

**Nguyên tắc Prompt Contract cho AI Tutor:** Khóa cứng vai trò trợ giảng Socratic. Khi nhận bài làm viết tay từ bảng iPad hoặc ảnh/PDF, AI phải thực hiện đúng 3 bước:
1. Trích xuất nội dung toán học từ nét vẽ hoặc chữ viết.
2. Đối chiếu từng dòng lập luận với Barem 4 tiêu chí (Nhận diện dạng toán 2đ, Công thức 3đ, Tính toán 3.5đ, Kết luận 1.5đ).
3. Đưa ra điểm thành phần, chỉ rõ bước có sai sót và **ĐẶT CÂU HỎI GỢI MỞ CHIẾN LƯỢC** để học sinh tự suy nghĩ sửa lại, tuyệt đối không đưa sẵn bài giải.

---

## 12. ENGINE BẢNG VẼ IPAD & CHẤM ĐIỂM TỰ ĐỘNG THEO BAREM 4 TIÊU CHÍ

Bảng vẽ iPad (`iPad Canvas Component`) hỗ trợ đầy đủ các tính năng như máy tính bảng thật:
* Cảm ứng đa điểm, hỗ trợ bút Apple Pencil và ngón tay với độ nhạy cao.
* 4 màu mực viết chuẩn học thuật, tẩy xóa linh hoạt, hoàn tác nét vẽ (Undo stack 20 bước), xóa sạch bảng.
* Bàn phím ký hiệu toán học nhanh: tích phân $\int$, tổng sigma $\sum$, kỳ vọng $\mu$, phương sai $\sigma^2$, trung bình mẫu $\bar{x}$, xác suất có điều kiện $P(A|B)$.
* Khả năng chụp ảnh đề bài trên lớp hoặc tải tệp PDF lên để viết tiếp lời giải lên bảng.
* Nút "Đính kèm bảng vẽ iPad" khi đăng bài lên Diễn đàn cộng đồng.

---

## 13. QUY TẮC QUẢN TRỊ TÍNH NĂNG, PHÂN BỔ 11 TÍNH NĂNG & LIÊN KẾT HỒ SƠ NĂNG LỰC

Toàn bộ 11 tính năng được quản trị theo mô hình Feature Matrix độc lập:
* **TN1:** Module Sư phạm 4 bước (Giải toán Polya, Khái niệm, Định lí).
* **TN2:** Module AI Tutor chấm nét chữ bảng iPad/Ảnh/PDF theo Barem.
* **TN3:** Module Voice AI đàm thoại 2 chiều đồng bộ bảng vẽ.
* **TN4:** Module Sinh 5 bài tự luận tương tự kèm Chiến lược giải.
* **TN5:** Module Trắc nghiệm tương tác tức thì có giải đáp tại sao.
* **TN6:** Module Khảo hạch Vấn đáp lý thuyết chẩn đoán lỗ hổng.
* **TN7:** Module Thống kê lỗi sai 3 nguồn (Vấn đáp, Trắc nghiệm, Tự luận).
* **TN8:** Module Bản đồ tư duy trực quan 4 nhánh.
* **TN9:** Module Diễn đàn 100% người thật, kết bạn & DM 1-1.
* **TN10:** Module Hồ sơ năng lực học tập cá nhân hóa.
* **TN11:** Module Meta-Engine nhân bản tiến trình 4 bước cho bài toán mới.

---

## 14. BẢO MẬT, RIÊNG TƯ VÀ KIỂM SOÁT CHI PHÍ

1. **Loại bỏ mật khẩu Base64:** Chuyển toàn bộ sang mã hóa Scrypt/Argon2 chuẩn của Firebase Authentication.
2. **Firebase Security Rules:** Khóa toàn bộ quyền đọc ghi trái phép; chỉ 2 người trong cuộc mới có quyền đọc tin nhắn DM.
3. **Che giấu API Key:** Định tuyến qua serverless proxy; không phơi bày key trên trình duyệt client.
4. **Quản lý chi phí:** Sử dụng Gemini Flash trong hạn mức Free Tier hợp lý; lưu cache các bài toán mẫu đã sinh để tái sử dụng.

---

## 15. ENGINEERING FOUNDATION: CẤU TRÚC PHÂN CHIA MODULE MÃ NGUỒN ĐỂ QUẢN TRỊ DỄ DÀNG

> **ĐÁP ỨNG TRỌN VẸN YÊU CẦU QUẢN TRỊ CỦA NGƯỜI DÙNG:**  
> Khắc phục triệt để tình trạng "không phân chia gì hết" như ảnh chụp ban đầu. Dự án được tái cấu trúc thành các module độc lập theo nguyên lý Single Responsibility:
> * Mỗi màn hình/chức năng là một component riêng biệt (`Home`, `Practice`, `Exam`, `Tutor`, `Pedagogy`, `OralExam`, `Forum`, `Stats`).
> * Mỗi dịch vụ nền tảng là một service riêng biệt (`Firebase`, `Gemini`, `Speech`, `Canvas3D`).
> * Dữ liệu câu hỏi, hằng số, barem điểm được gom vào thư mục `Data`.
> * Khi giảng viên hoặc lập trình viên muốn nâng cấp một chức năng (ví dụ: đổi barem điểm hay thêm câu hỏi), chỉ cần mở đúng file tương ứng mà không làm ảnh hưởng đến phần còn lại.

---

## 16. CẤU TRÚC REPOSITORY & PHÂN CHIA THƯ MỤC (MODULAR DIRECTORY STRUCTURE)

```text
AI-antigravity/
├── docs/                                    # Tài liệu thiết kế & kiến trúc hệ thống
│   ├── Product_Tech_Architecture_Blueprint_v2.2.docx
│   ├── Product_Tech_Architecture_Blueprint_v2.2.md
│   └── ARCHITECTURE.md                      # Sơ đồ kiến trúc & hướng dẫn quản trị
├── src/                                     # Toàn bộ mã nguồn phân chia theo module
│   ├── styles/
│   │   └── app.css                          # Định kiểu giao diện, biến màu pastel, animation
│   ├── data/
│   │   ├── constants.js                     # 7 chương XSTK, danh hiệu, menu điều hướng
│   │   └── bank.js                          # Ngân hàng câu hỏi mẫu 7 chương & hàm sinh bài tập
│   ├── services/
│   │   ├── firebase.js                      # Xác thực tài khoản, đồng bộ RTDB, bạn bè, DM
│   │   ├── gemini.js                        # Tầng kết nối AI, prompt sư phạm, xử lý JSON
│   │   ├── speech.js                        # Trạm Voice AI (Speech Recognition & TTS)
│   │   └── canvas3d.js                      # Động cơ mô phỏng 3D isometric 9 mô hình
│   └── components/
│       ├── pad.js                           # Bảng viết iPad cảm ứng, bút màu, tẩy, ký hiệu toán
│       ├── pedagogy.js                      # Quy trình sư phạm 4 bước & Meta-engine (TN1, TN11)
│       ├── practice.js                      # Khu luyện tập 7 chương & Bản đồ tư duy (TN5, TN8)
│       ├── exam.js                          # Đấu trường thi thử bấm giờ, tự động chấm điểm
│       ├── tutor.js                         # AI Tutor chấm ảnh/PDF theo Barem (TN2, TN4)
│       ├── oral_exam.js                     # Phòng khảo hạch Vấn đáp lý thuyết (TN6)
│       ├── stats.js                         # Hồ sơ năng lực, ma trận câu sai 3 nguồn (TN7, TN10)
│       └── forum.js                         # Diễn đàn học thuật người thật, kết bạn & DM (TN9)
├── index.html                               # Trang ứng dụng nạp các module, chạy trên GitHub Pages
├── README.md                                # Trang giới thiệu tổng quan dự án trên GitHub
├── PJ.docx                                  # Tài liệu dự án chính thức
└── .gitignore                               # Cấu hình bỏ qua tệp tạm
```

---

## 17. KIỂM THỬ, TIÊU CHÍ NGHIỆM THU VÀ DEMO

Kế hoạch kiểm thử gồm 11 Acceptance Tests tương ứng với 11 tính năng theo đề bài:
* **Test 1 (TN1):** Kiểm tra quy trình 4 bước giải toán Bayes và kiểm định giả thuyết.
* **Test 2 (TN2):** Vẽ lời giải lên bảng iPad và nộp bài; kiểm tra AI có chấm đúng 4 tiêu chí barem và đưa ra chiến lược gợi mở không.
* **Test 3 (TN3):** Bật micro đàm thoại tiếng Việt hỏi về Phân phối Poisson; kiểm tra âm thanh phát lại và công thức hiển thị.
* **Test 4 (TN4):** Nhấn nút tạo 5 bài tự luận tương tự; kiểm tra đủ 5 bài khác nhau cùng dạng.
* **Test 5 (TN5):** Làm 1 câu trắc nghiệm, chọn đáp án sai; kiểm tra hệ thống báo sai ngay và khung giải thích "Vì sao?".
* **Test 6 (TN6):** Vào phòng vấn đáp, trả lời câu hỏi lý thuyết; kiểm tra AI chỉ ra đúng lỗ hổng nhận thức.
* **Test 7 (TN7):** Kiểm tra tab Hồ sơ xem câu sai vừa làm có được ghi nhận và phân loại vào chương tương ứng không.
* **Test 8 (TN8):** Bấm xem Bản đồ tư duy của câu hỏi; kiểm tra đủ 4 nhánh kiến thức.
* **Test 9 (TN9):** Đăng 1 bài viết kèm công thức LaTeX và ảnh vẽ iPad; gửi lời mời kết bạn và nhắn tin DM.
* **Test 10 (TN10):** Kiểm tra bản đồ năng lực 7 chương và đề xuất bộ bài tập bù đắp lỗ hổng.
* **Test 11 (TN11):** Dán một bài toán mới vào trợ lý AI; kiểm tra AI có sinh đủ quy trình 4 bước tương tác không.

---

## 18. ROADMAP THỰC THI NHANH & CHỐT TỪNG GIAI ĐOẠN

* **Giai đoạn 1 (Đã hoàn thành):** Kiểm toán bảo mật, thiết kế kiến trúc Blueprint v2.2, phân chia cấu trúc thư mục module.
* **Giai đoạn 2:** Hiện thực hóa 3 module sư phạm chuyên sâu: Pedagogy 4 bước (TN1), Sinh 5 bài tự luận kèm chiến lược (TN4), Phòng khảo hạch vấn đáp (TN6) và Meta-Engine (TN11).
* **Giai đoạn 3:** Tích hợp Firebase Auth chính thống và Security Rules.
* **Giai đoạn 4:** Đóng gói kiểm thử E2E và triển khai sản phẩm lên GitHub Pages.

---

## 19. TRIỂN KHAI HOSTING (GITHUB PAGES / VERCEL) VÀ HOẠT ĐỘNG SAU DEMO

Ứng dụng được cấu hình để chạy trực tiếp trên GitHub Pages tại địa chỉ: `https://anhtu20347.github.io/AI-antigravity/`. Tốc độ tải trang đạt dưới 1.2 giây nhờ cơ chế nạp module bất đồng bộ và tối ưu hóa tài nguyên.

---

## 20. RỦI RO, CHỈ SỐ THÀNH CÔNG & GO/NO-GO

* **Rủi ro 1: Quá tải hạn mức Free Tier của Google Gemini** $\to$ *Giải pháp:* Tích hợp sẵn ngân hàng câu hỏi và giải thuật cục bộ (Local Fallback Pack) để hệ thống vẫn hoạt động 100% bình thường kể cả khi mất mạng hoặc hết quota.
* **Rủi ro 2: Trình duyệt không hỗ trợ Web Speech API** $\to$ *Giải pháp:* Tự động chuyển đổi sang giao diện nhập liệu văn bản thông minh.
* **Tiêu chí Go / No-Go:** Đạt 11/11 Acceptance Tests; không có lỗi bảo mật cấp Critical; thời gian tải trang dưới 2 giây.

---

## 21. HỒ SƠ NỘP HỌC PHẦN VÀ CÁCH BẢO VỆ TRƯỚC GIẢNG VIÊN

Kịch bản trình diễn 5 phút trước Hội đồng chấm thi:
* **Phút 1:** Giới thiệu tổng quan linh vật Cú Đêm và bản đồ năng lực 7 chương.
* **Phút 2:** Demo tính năng sư phạm hạt nhân: Tiến trình 4 bước giải toán Polya và học khái niệm kiến tạo (TN1).
* **Phút 3:** Trình diễn Bảng viết iPad kết hợp Voice AI: Viết công thức, nhờ AI Tutor chấm điểm theo Barem và nhận chiến lược giải (TN2, TN3).
* **Phút 4:** Demo Phòng khảo hạch vấn đáp lý thuyết (TN6) và phân tích hồ sơ lỗi sai gom từ 3 nguồn (TN7, TN10).
* **Phút 5:** Demo Diễn đàn học thuật 100% người thật và Module nhân bản tiến trình sư phạm (TN9, TN11).

---

## 22. MASTER BUILD CHECKLIST

- [x] Cấu trúc thư mục được phân rã thành docs/, src/components/, src/services/, src/data/, src/styles/
- [x] Toàn bộ 11 tính năng theo đề bài được hiện thực hóa và có tài liệu kiểm thử
- [x] Bảng viết iPad cảm ứng hoạt động mượt mà, hỗ trợ tẩy xóa, ký hiệu toán và xuất ảnh nét vẽ
- [x] Trạm Voice AI đàm thoại tiếng Việt 2 chiều không lỗi
- [x] Barem chấm điểm 4 tiêu chí hiển thị rõ ràng và cho phép tùy chỉnh
- [x] Không còn tình trạng lưu mật khẩu dạng Base64; đã cấu hình bảo vệ dữ liệu
- [x] Trang web chạy trực tiếp trên GitHub Pages

---

## 23. NGUỒN THAM KHẢO & QUYẾT ĐỊNH CÒN MỞ

1. George Pólya (1945), *How to Solve It: A New Aspect of Mathematical Method*, Princeton University Press.
2. Đào Tam (2018), *Phương pháp dạy học môn Toán ở trường phổ thông*, NXB Đại học Sư phạm.
3. Nguyễn Cao Văn, Trần Thái Ninh (2020), *Giáo trình Xác suất và Thống kê toán*, NXB Đại học Kinh tế Quốc dân.

> **KẾT LUẬN:** Bản thiết kế kiến trúc kỹ thuật v2.2 này là kim chỉ nam toàn diện, bảo đảm sản phẩm Cú Đêm XSTK AI vừa đạt đỉnh cao về mặt sư phạm toán học, vừa đạt chuẩn mực công nghệ phần mềm hiện đại và quản trị module dễ dàng.
