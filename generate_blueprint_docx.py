import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

doc = Document()

# Page setup
for s in doc.sections:
    s.top_margin = Inches(0.8)
    s.bottom_margin = Inches(0.8)
    s.left_margin = Inches(0.8)
    s.right_margin = Inches(0.8)

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), fill_hex)
    tcPr.append(shd)

# Title
title_p = doc.add_paragraph()
title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = title_p.add_run("TÀI LIỆU THIẾT KẾ KIẾN TRÚC SẢN PHẨM & KỸ THUẬT\nPRODUCT & TECHNICAL ARCHITECTURE BLUEPRINT v2.1\n")
run.font.size = Pt(16)
run.font.bold = True
run.font.color.rgb = RGBColor(45, 42, 74)

sub_p = doc.add_paragraph()
sub_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run_sub = sub_p.add_run("DỰ ÁN: HỆ THỐNG TRỢ LÝ AI HỌC XÁC SUẤT & THỐNG KÊ (CÚ ĐÊM - XSTK AI)\n")
run_sub.font.size = Pt(13)
run_sub.font.bold = True
run_sub.font.color.rgb = RGBColor(90, 70, 160)

doc.add_paragraph("Ngày lập: 17/10/2026 | Phiên bản: 2.1 | Trạng thái: Sẵn sàng triển khai\n")

# 01
doc.add_heading("01. Tóm tắt dự án (Executive Summary)", level=1)
doc.add_paragraph("• Tên hệ thống: Nền tảng Trợ lý AI Sư phạm Học Xác suất & Thống kê ('Cú Đêm' / Owl Probability AI Tutor).")
doc.add_paragraph("• Mục đích: Xây dựng hệ sinh thái học tập ứng dụng Trí tuệ Nhân tạo thế hệ mới (Generative AI) chuyên sâu cho môn học Xác suất & Thống kê bậc Đại học và Cao đẳng, tích hợp trọn vẹn 11 tính năng cốt lõi theo chuẩn sư phạm toán học hiện đại.")
doc.add_paragraph("• Nguyên lý sư phạm hạt nhân: Dạy học giải quyết vấn đề theo tiến trình 4 bước của George Pólya và thuyết kiến tạo (Constructivism) trong dạy học Khái niệm & Định lý. AI đóng vai trò người cố vấn (Socratic Tutor) — chỉ cung cấp chiến lược giải và gợi mở tư duy, kiên quyết không giải hộ hoặc đưa sẵn đáp số.")
doc.add_paragraph("• Trạng thái kỹ thuật hiện tại: Đã xây dựng phiên bản Web SPA tương tác cao với Canvas 3D, Web Speech API (Voice), Bảng viết iPad cảm ứng, Firebase Realtime Sync, và Gemini 3.8 Flash. Hiện đã có 8/11 tính năng (đạt 70%); cần hoàn thiện 3 tính năng sư phạm chuyên sâu và gia cố bảo mật chuẩn Production.")

# 02
doc.add_heading("02. Bối cảnh & Thách thức đặc thù môn Xác suất Thống kê", level=1)
doc.add_paragraph("Môn Xác suất & Thống kê (XSTK) là nỗi ám ảnh của đại đa số sinh viên bởi 4 rào cản nhận thức đặc thù:")
doc.add_paragraph("1. Nghịch lý nhận diện mô hình: Sinh viên thuộc công thức (Bayes, Nhị thức, Chuẩn) nhưng không thể trích xuất biến cố từ ngữ cảnh thực tế dài dòng.")
doc.add_paragraph("2. Khó khăn biểu đạt toán học: Các công thức tích phân, tổng, độ lệch chuẩn khó gõ phím; cần công cụ viết vẽ tự nhiên như bảng iPad.")
doc.add_paragraph("3. Thói quen ỷ lại: Các AI thông thường đưa ngay bài giải đầy đủ, triệt tiêu tư duy độc lập của người học.")
doc.add_paragraph("4. Thiếu môi trường học tập toán học: Mạng xã hội thông thường không hỗ trợ công thức toán LaTeX và thiếu công cụ chữa bài viết tay.")

# 03
doc.add_heading("03. Người dùng mục tiêu & Bảng Job-to-be-done (JTBD)", level=1)
table_jtbd = doc.add_table(rows=1, cols=3)
table_jtbd.style = 'Table Grid'
hdr_cells = table_jtbd.rows[0].cells
hdr_cells[0].text = "Công việc cần làm (JTBD)"
hdr_cells[1].text = "Nỗi đau hiện tại"
hdr_cells[2].text = "Giải pháp của Cú Đêm AI"
for c in hdr_cells:
    set_cell_background(c, 'E0D7FF')
    for p in c.paragraphs:
        for r in p.runs:
            r.font.bold = True

jtbd_data = [
    ("Hiểu bản chất khái niệm/định lí", "Học vẹt công thức, không hiểu ý nghĩa alpha, p-value, sigma.", "Tiến trình 4 bước kiến tạo: Trải nghiệm -> Định nghĩa -> Củng cố -> Vận dụng."),
    ("Chữa bài tập tự luận viết tay", "Giảng viên không thể chữa chi tiết từng người; sinh viên không biết sai ở đâu.", "Vẽ bảng iPad / Chụp ảnh -> AI Tutor đối soát Barem 4 mục -> Chỉ rõ bước sai."),
    ("Vấn đáp & phản xạ lý thuyết", "Ấp úng khi bảo vệ hoặc thi vấn đáp; hiểu sai lệch bản chất toán học.", "Trạm Voice AI tương tác giọng nói 2 chiều, hỏi đáp sâu và chẩn đoán lỗ hổng."),
    ("Khắc phục lỗi sai có hệ thống", "Làm sai xong quên ngay, lặp lại lỗi cũ trong kỳ thi chính.", "Tự động gom câu sai -> Biểu đồ năng lực 7 chương -> Sinh đề bổ trợ điểm yếu.")
]
for row in jtbd_data:
    r_cells = table_jtbd.add_row().cells
    r_cells[0].text = row[0]
    r_cells[1].text = row[1]
    r_cells[2].text = row[2]

# 04
doc.add_heading("04. Định vị sản phẩm & Hiện trạng 11 tính năng theo đề bài", level=1)
table_11 = doc.add_table(rows=1, cols=4)
table_11.style = 'Table Grid'
hdr11 = table_11.rows[0].cells
hdr11[0].text = "STT"
hdr11[1].text = "Tính năng theo đề bài"
hdr11[2].text = "Tiến độ"
hdr11[3].text = "Hiện trạng trên Web & Điểm cần bổ sung"
for c in hdr11:
    set_cell_background(c, 'BFF1DC')
    for p in c.paragraphs:
        for r in p.runs:
            r.font.bold = True

features_data = [
    ("TN 1", "Quy trình 4 bước: Giải toán Polya, Khái niệm, Định lí", "35%", "Đã có mindmap 4 nhánh. Cần bổ sung 3 module chuyên biệt chuẩn 4 bước sư phạm."),
    ("TN 2", "AI Tutor chấm ảnh, PDF, bảng iPad, Barem, chỉ cấp Chiến lược", "85%", "Đã có bảng vẽ iPad mượt mà, upload ảnh/PDF, Barem điểm. Cần ép AI chỉ gợi mở chiến lược."),
    ("TN 3", "Tương tác giọng nói Voice AI 2 chiều + Bảng iPad", "85%", "Đã có Speech Recognition & Synthesis tiếng Việt, hỏi đáp micro và vẽ bảng iPad."),
    ("TN 4", "Tạo ngẫu nhiên 5 bài tự luận tương tự kèm Chiến lược", "60%", "Đã có sinh đề tự luận. Cần đóng gói nút tạo trọn bộ đúng 5 bài kèm khung chiến lược."),
    ("TN 5", "Tạo bài tập trắc nghiệm tức thì có giải đáp tại sao", "95%", "Hoàn thiện. Ngân hàng 7 chương, sinh đề AI/Local, chấm tức thì, giải đáp vì sao."),
    ("TN 6", "Vấn đáp lý thuyết, chấm điểm và chỉ ra lỗ hổng kiến thức", "65%", "Đã có engine vấn đáp. Cần tách riêng phòng Khảo hạch Vấn đáp Lý thuyết độc lập."),
    ("TN 7", "Thống kê lỗi sai 3 nguồn -> Nhận định -> Đề xuất khắc phục", "80%", "Đã có lưu câu sai, biểu đồ cột 7 chương, AI chẩn đoán và sinh đề bù đắp."),
    ("TN 8", "Bản đồ tư duy (Mindmap) phục vụ học XSTK", "90%", "Hoàn thiện. Tích hợp trực quan tại mỗi câu hỏi với 4 nhánh kiến thức chuẩn."),
    ("TN 9", "Diễn đàn điện tử học XSTK 100% người thật, kết bạn, DM 1-1", "95%", "Đầy đủ đăng bài kèm LaTeX, vẽ iPad, kết bạn 2 chiều, DM 1-1 (Cần gia cố bảo mật)."),
    ("TN 10", "Hồ sơ AI học XSTK, ma trận điểm yếu, lộ trình bổ trợ", "85%", "Đã có hồ sơ cá nhân, Level, XP, streak, tỉ lệ đúng 7 chương, lịch sử sửa sai."),
    ("TN 11", "Nhân bản quy trình sư phạm 4 bước cho bài/khái niệm/định lí bất kỳ", "0%", "Chưa có. Cần xây dựng màn hình nhập bài bất kỳ để AI tự động phân rã 4 bước.")
]
for f in features_data:
    r_cells = table_11.add_row().cells
    r_cells[0].text = f[0]
    r_cells[1].text = f[1]
    r_cells[2].text = f[2]
    r_cells[3].text = f[3]

# 05
doc.add_heading("05. Khung lý thuyết sư phạm hạt nhân (Pedagogical Framework)", level=1)
doc.add_paragraph("Hệ thống được thiết kế dựa trên 3 tiến trình sư phạm toán học kinh điển:")
doc.add_paragraph("1. Quy trình Giải toán 4 bước của George Pólya:")
doc.add_paragraph("   • Bước 1: Tìm hiểu nội dung bài toán (Phân biệt cái đã cho, cái phải tìm, ký hiệu hóa, điều kiện ràng buộc).")
doc.add_paragraph("   • Bước 2: Xây dựng chương trình giải (Chia nhỏ bài toán, chọn kiến thức gần gũi, dự đoán kết quả).")
doc.add_paragraph("   • Bước 3: Trình bày lời giải (Thực hiện phép tính logic, kiểm soát từng bước).")
doc.add_paragraph("   • Bước 4: Kiểm tra và nghiên cứu sâu (Thử lại kết quả, tìm cách giải khác, đề xuất bài toán tổng quát).")
doc.add_paragraph("2. Quy trình Học Khái niệm XSTK theo thuyết kiến tạo:")
doc.add_paragraph("   • Trải nghiệm trực quan -> Hình thành định nghĩa -> Củng cố -> Vận dụng thực tiễn.")
doc.add_paragraph("3. Quy trình Học Định lí XSTK:")
doc.add_paragraph("   • Trải nghiệm phát hiện -> Hình thành định lí & chứng minh -> Củng cố -> Vận dụng.")

# 06
doc.add_heading("06. Kiến trúc hệ thống & Ranh giới tin cậy (Architecture & Trust Boundaries)", level=1)
doc.add_paragraph("Hệ thống áp dụng kiến trúc Clean Architecture phân tầng rõ ràng:")
doc.add_paragraph("• Client Presentation Layer: Web Responsive SPA, HTML5 Canvas 2D mô phỏng 3D isometric, Web Speech API, MathJax LaTeX rendering.")
doc.add_paragraph("• Authentication & Identity: Chuyển dịch toàn bộ sang Firebase Authentication (Argon2/Scrypt hash mật khẩu, Google OAuth 2.0). Xóa bỏ triệt để lưu pass Base64.")
doc.add_paragraph("• Realtime Database with Security Rules: Phân quyền cấp độ bản ghi (Row-Level Security), chỉ cho phép người trong cuộc đọc tin nhắn riêng tư.")
doc.add_paragraph("• Serverless AI Proxy: Gọi Google Gemini 3.8 Flash qua backend proxy để che giấu khóa API, ngăn ngừa rò rỉ và kiểm soát chi phí.")

# 07
doc.add_heading("07. Thiết kế Prompting Sư phạm & Barem chấm điểm", level=1)
doc.add_paragraph("Barem chấm điểm 4 tiêu chí cho AI Tutor (Thang điểm 10):")
doc.add_paragraph("• Tiêu chí 1: Nhận diện dạng toán & gọi tên biến cố (Tối đa 2.0 điểm)")
doc.add_paragraph("• Tiêu chí 2: Thiết lập đúng công thức cốt lõi (Tối đa 3.0 điểm)")
doc.add_paragraph("• Tiêu chí 3: Thay số và quá trình tính toán chuẩn xác (Tối đa 3.5 điểm)")
doc.add_paragraph("• Tiêu chí 4: Kết luận ngữ cảnh thực tế & điều kiện ràng buộc (Tối đa 1.5 điểm)")
doc.add_paragraph("Nguyên tắc vàng của Prompt: AI tuyệt đối không giải hộ; chỉ đưa ra câu hỏi gợi mở Socratic và chiến lược tư duy từng bước.")

# 08
doc.add_heading("08. Lộ trình triển khai 4 giai đoạn", level=1)
doc.add_paragraph("• Giai đoạn 1 (1-2 ngày): Gia cố bảo mật (Firebase Auth chuẩn, Security Rules, ẩn API Key).")
doc.add_paragraph("• Giai đoạn 2 (3-4 ngày): Bổ sung 3 Module Sư phạm 4 bước (Giải toán, Khái niệm, Định lí) và Module TN11 nhân bản quy trình.")
doc.add_paragraph("• Giai đoạn 3 (2-3 ngày): Tối ưu AI Tutor (chỉ cấp Chiến lược) + Phòng thi Vấn đáp Lý thuyết độc lập.")
doc.add_paragraph("• Giai đoạn 4 (2 ngày): Tối ưu vòng lặp Canvas 3D, chuyển Polling sang Realtime WebSocket Push.")

# Save
output_path = r"c:\Dự án web - antigravity\Product_Tech_Architecture_Blueprint.docx"
doc.save(output_path)
print("SUCCESS_SAVED:", output_path)
