# Prompt trình bày quá trình hình thành sản phẩm AI Tutor Xác suất & Thống kê

> **Mục đích:** dùng prompt dưới đây để tạo bài thuyết trình hoặc lời trình bày trước giảng viên, có thể truy ngược từng nhận định về sản phẩm về mã nguồn và tài liệu trong repository.
>
> **Lưu ý về tính xác thực:** đây là prompt tổng hợp được viết từ sản phẩm và hồ sơ hiện có; không phải bản ghi nguyên văn các prompt đã dùng trong những buổi phát triển trước. Vì vậy, hãy trình bày nó như một bản tái dựng quy trình dựa trên bằng chứng, không khẳng định đây là nhật ký prompt lịch sử.

## Prompt có thể dùng

```text
Bạn là người hướng dẫn trình bày một dự án phần mềm học tập trước giảng viên. Hãy xây dựng bài trình bày bằng tiếng Việt về quá trình biến nhu cầu học Xác suất và Thống kê thành sản phẩm AI Tutor đang có trong repository.

MỤC TIÊU
- Cho thấy quá trình phát triển đi từ nhu cầu người học → yêu cầu → thiết kế luồng học → triển khai giao diện/API/dữ liệu → kiểm tra → sản phẩm và giới hạn còn lại.
- Dùng bằng chứng thật có trong mã nguồn và tài liệu dự án. Không sáng tác yêu cầu, số liệu kiểm thử, prompt lịch sử, kết quả AI, quyết định của nhóm hay mức độ hoàn thành.
- Phân biệt rõ: (1) triển khai nhìn thấy trong code, (2) đã được kiểm tra và có ghi nhận, (3) còn thiếu/chưa xác minh.

BỐI CẢNH SẢN PHẨM
Đây là ứng dụng web Next.js 14/React 18 bằng tiếng Việt, hỗ trợ học Xác suất và Thống kê. Sản phẩm có các luồng bài học bốn bước, gia sư nhận bài làm, trắc nghiệm, luyện vấn đáp, bài luyện tập, sơ đồ tư duy, diễn đàn, hồ sơ/lịch sử học tập và khu vực quản trị. Hãy đối chiếu mô tả này với PRODUCT.md, README.md và các route thực tế trước khi dùng.

HÃY TRÌNH BÀY THEO CÁC CHẶNG
1. Vấn đề và người dùng: sinh viên cần học khái niệm, định lí và cách giải; cần được gợi mở, luyện tập và nhìn thấy lỗi của mình. Nêu đây là cách diễn giải nhu cầu từ PRODUCT.md, trừ khi có tài liệu người dùng/nghiên cứu riêng làm bằng chứng trực tiếp.
2. Chuyển nhu cầu thành yêu cầu sản phẩm: chỉ ra các luồng người học và mục tiêu sư phạm; giải thích vì sao ba dạng bài học có tiến trình riêng, vì sao gia sư chỉ gợi chiến lược, và vì sao cần lịch sử cá nhân. Dẫn sang PRODUCT.md và docs/CURRICULUM_COVERAGE.md.
3. Thiết kế giải pháp: mô tả kiến trúc UI → API → AI/schema → Supabase/lịch sử bằng đúng những gì code thể hiện. Lấy ví dụ từ src/app/lesson/page.tsx, src/app/tutor/page.tsx, src/app/quiz/page.tsx, src/app/oral/page.tsx; các API tương ứng trong src/app/api/; hợp đồng trong src/lib/schemas.ts; gọi mô hình trong src/lib/ai.ts.
4. Hiện thực hóa thành sản phẩm: trình bày một hành trình cụ thể, chẳng hạn chọn chủ đề → học theo bốn bước → ghi chú nhận phản hồi → làm quiz/tutor → xem lịch sử. Chỉ mô tả hành vi có route/UI/API/data tương ứng. Nêu danh mục môn học theo số liệu hiện hành trong docs/CURRICULUM_COVERAGE.md nếu cần, và trích nguồn của con số.
5. Kiểm tra và cải tiến: nêu các kiểm tra đã được ghi trong AUDIT_REPORT.md, FIX_PLAN.md và docs/CURRICULUM_COVERAGE.md; giải thích các lỗi/điểm thiếu đã được phát hiện và cách sửa chỉ khi tài liệu hoặc diff chứng minh. Tách unit test, typecheck/build, browser smoke, và kiểm tra end-to-end với dịch vụ/tài khoản thật thành các mức bằng chứng khác nhau.
6. Đánh giá sản phẩm hiện tại: nêu điều sản phẩm đã làm được, sau đó ghi đúng các mục còn BLOCKED/chưa nghiệm thu. Không gọi build thành công là sản phẩm đã hoàn tất; không gọi mock là kết quả AI thật; không coi kiểm tra UI là bằng chứng đúng nghiệp vụ.
7. Kết luận và bước tiếp theo: đề xuất các bước tiếp theo xuất phát trực tiếp từ các giới hạn đã ghi trong báo cáo. Không tuyên bố đã hoàn thành những kiểm tra chưa chạy.

QUY TẮC BẰNG CHỨNG
- Mỗi nhận định cụ thể về tính năng hoặc kiểm tra phải kèm đường dẫn tương đối trong repository; khi có thể, thêm tên route, schema, mục/tiêu đề tài liệu hoặc dòng đã xác minh.
- Với mỗi tính năng, dùng nhãn [CODE] nếu chỉ thấy triển khai, [VERIFIED] nếu tài liệu có kết quả kiểm tra rõ ràng, [PARTIAL] nếu chỉ một phần luồng đã kiểm tra, hoặc [BLOCKED] nếu báo cáo ghi còn vướng/chưa thử.
- Khi nguồn có ngày, nêu ngày để người nghe hiểu trạng thái có thể thay đổi.
- Đối chiếu các tài liệu nếu README và audit khác nhau; ưu tiên báo cáo có phạm vi và ngày cập nhật rõ hơn, nhưng ghi nhận mâu thuẫn thay vì âm thầm chọn kết luận thuận lợi.
- Không đưa secrets, email, dữ liệu định danh người học, dữ liệu thử nghiệm riêng tư hoặc nội dung .env vào bài trình bày.
- Không bịa sơ đồ quy trình nhóm, sprint, phân công, phỏng vấn người dùng, prompt gốc, số người dùng, tỷ lệ chính xác, thời gian tiết kiệm, tác động học tập hay đánh giá của giảng viên. Nếu repo không chứng minh thì ghi “chưa có bằng chứng trong repository”.
- Không nói mọi tính năng đều hoàn thiện. AUDIT_REPORT.md ghi rõ một số luồng AI/provider, microphone/thiết bị và thao tác admin còn chưa được nghiệm thu; dùng đúng trạng thái mới nhất trong tài liệu.

ĐẦU RA
1. Một bài nói 4–6 phút, tiếng Việt tự nhiên, có mở đầu, các chặng phát triển và kết luận.
2. Một bảng “Chặng | Quyết định/việc làm | Bằng chứng trong repo | Trạng thái”.
3. Một danh sách 5–8 đường dẫn tài liệu/code quan trọng để giảng viên tự kiểm tra.
4. Một mục “Giới hạn và việc cần làm tiếp”, không che các mục chưa xác minh.
5. Cuối cùng, thêm ghi chú: “Bài trình bày này tái dựng quá trình từ artifact hiện có; không thay thế nhật ký commit, lịch sử prompt hoặc biên bản làm việc nếu các tài liệu đó không được cung cấp.”

Trước khi viết, hãy đọc các file được dẫn, kiểm tra chúng còn tồn tại, và trích xuất bằng chứng cụ thể. Nếu không truy cập được repository, hãy yêu cầu nội dung cần thiết thay vì tự điền.
```

## Bằng chứng trong repository để đối chiếu

| Chặng | Bằng chứng hiện có | Nó chứng minh điều gì | Không tự nó chứng minh |
|---|---|---|---|
| Định nghĩa sản phẩm | `PRODUCT.md`; `README.md` | Mục tiêu, người dùng dự kiến, routes, tính năng và hợp đồng cần giữ | Nghiên cứu người dùng, phỏng vấn, hay thứ tự lịch sử nhóm đã quyết định |
| Chương trình học | `docs/CURRICULUM_COVERAGE.md`; `src/lib/curriculum/`; `src/lib/seed-data.ts` | Phạm vi nội dung và cấu trúc lesson/quiz/mindmap được đưa vào ứng dụng | Độ chính xác của toàn bộ nội dung chỉ từ việc có dữ liệu trong code |
| Luồng học tương tác | `src/app/lesson/page.tsx`; `src/app/api/lesson/route.ts`; `src/lib/schemas.ts` | UI bốn bước, gửi feedback, schema phản hồi và quy trình theo loại bài | Mọi phản hồi AI đều đúng hoặc mọi chủ đề đã E2E |
| Gia sư và bài làm | `src/app/tutor/page.tsx`; `src/app/api/tutor/route.ts`; `src/lib/file-validation.ts` | Đầu vào bài làm/tệp, kiểm tra dữ liệu và luồng chấm theo schema | Chấm đúng với mọi ảnh/PDF hoặc mọi thiết bị |
| Luyện tập sinh đề | `src/app/api/practice/route.ts`; `src/lib/schemas.ts` | Yêu cầu đúng 5 câu, bước rà soát schema và loại đáp án khỏi output người học | Bộ kiểm tra toán độc lập; audit ghi provider từng trả lỗi |
| Quiz và vấn đáp | `src/app/quiz/page.tsx`; `src/app/oral/page.tsx`; `src/app/api/explain/route.ts`; `src/app/api/oral/route.ts` | Các giao diện và route cho quiz/giải thích/vấn đáp | Microphone thật hoạt động trên mọi trình duyệt hoặc mọi luồng AI được chấp nhận |
| Tài khoản và lưu trữ | `src/lib/supabase/server.ts`; `src/app/api/history/route.ts`; `supabase/migrations/` | Vị trí kiểm tra phiên đăng nhập, lịch sử theo user và cấu hình schema/policy trong repo | Toàn bộ quyền production đúng chỉ từ việc migration tồn tại |
| Kiểm thử và giới hạn | `AUDIT_REPORT.md`; `FIX_PLAN.md`; `docs/CURRICULUM_COVERAGE.md` | Kết quả theo phạm vi/ngày ghi trong báo cáo, cổng đã qua/chưa qua | Trạng thái hiện tại của dịch vụ ngoài repo nếu chưa kiểm tra lại |

## Cách dùng khi nộp cho giảng viên

1. Đặt file này cạnh source code trong hồ sơ dự án.
2. Chạy prompt trong công cụ AI có quyền đọc repository để tạo bài trình bày và bảng dẫn chứng.
3. Mở ngẫu nhiên các đường dẫn được trích trong bài để chắc chắn nội dung khớp với code/tài liệu hiện hành.
4. Nếu giảng viên yêu cầu **nhật ký quá trình thật**, bổ sung commit history, issue/biên bản hoặc prompt gốc nếu có. File prompt này là bằng chứng về cách tái dựng trình bày từ sản phẩm, không phải bằng chứng độc lập rằng prompt này đã được dùng xuyên suốt quá trình phát triển.
