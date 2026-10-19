import { NextRequest, NextResponse } from 'next/server';
import { tutorRequestSchema } from '@/lib/schemas';
import { callAI, parseAIJSON } from '@/lib/ai';
import { demoStore } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = tutorRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const { topicId, prompt: userPrompt, inputText, imageBase64 } = parsed.data;
    const topic = demoStore.getTopic(topicId);

    const systemPrompt = `Bạn là Giáo sư Cú Đêm - AI Tutor Sư phạm Xác suất Thống kê.
NGUYÊN TẮC CỐT LÕI (BẢN MVP):
1. Chấm điểm bài làm học sinh (thang điểm 10) dựa trên Barem 4 mục:
   - Nhận diện đúng biến cố / dạng toán (2.0đ)
   - Thiết lập đúng công thức (3.0đ)
   - Tính toán và thay số (3.5đ)
   - Kết luận và ý nghĩa thực tế (1.5đ)
2. CHỈ CUNG CẤP CHIẾN LƯỢC GIẢI VÀ ĐẶT CÂU HỎI GỢI MỞ BƯỚC TIẾP THEO. TUYỆT ĐỐI KHÔNG ĐƯA SẴN BÀI GIẢI HOÀN CHỈNH HAY ĐÁP SỐ.
3. Chỉ rõ các lỗi sai / nhầm lẫn kiến thức (nếu có) dưới dạng các thẻ lỗi ngắn gọn (error_tags).

Trả về DUY NHẤT định dạng JSON:
{
  "score": 7.5,
  "feedback": "Nhận xét sư phạm thân thiện, chỉ ra điểm làm được và chỗ thiếu sót...",
  "error_tags": ["Tên lỗi 1", "Tên lỗi 2"],
  "next_step": "Gợi ý hành động tiếp theo người học nên làm..."
}`;

    const textToAnalyze = `Chủ đề: ${topic?.title || topicId}
Bài làm của sinh viên:
${inputText || userPrompt || '(Người học nộp bài bằng hình ảnh/bảng vẽ iPad)'}`;

    const rawResponse = await callAI(textToAnalyze, systemPrompt, imageBase64);
    const result = parseAIJSON(rawResponse, {
      score: 7.0,
      feedback: 'Bài làm bước đầu nắm được dạng toán. Cần lưu ý kiểm tra điều kiện của không gian mẫu và viết lại công thức xác suất đầy đủ.',
      error_tags: ['Thiếu điều kiện mẫu', 'Cần rà soát công thức'],
      next_step: 'Hãy thử lại với bài tập tương tự hoặc kiểm tra lại bước 2 của quy trình.'
    });

    // Lưu vào learning_history (Table 10)
    const historyRecord = demoStore.addHistory({
      user_id: demoStore.getProfile().id,
      topic_id: topicId,
      mode: 'tutor',
      input_text: inputText || (imageBase64 ? '[Ảnh/Canvas bài làm]' : ''),
      result_json: result,
      score: result.score,
      error_tags: result.error_tags || []
    });

    return NextResponse.json({
      success: true,
      historyId: historyRecord.id,
      score: result.score,
      feedback: result.feedback,
      error_tags: result.error_tags,
      next_step: result.next_step
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Lỗi xử lý AI Tutor' }, { status: 500 });
  }
}
