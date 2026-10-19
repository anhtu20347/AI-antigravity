import { NextRequest, NextResponse } from 'next/server';
import { oralRequestSchema } from '@/lib/schemas';
import { callAI, parseAIJSON } from '@/lib/ai';
import { demoStore } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = oralRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const { topicId, history, userSpeech } = parsed.data;
    const topic = demoStore.getTopic(topicId);

    const prompt = `Nhiệm vụ TN6: Bạn là Giảng viên Đại học đang phỏng vấn Vấn đáp lý thuyết môn Xác suất & Thống kê.
Chủ đề vấn đáp: ${topic?.title || topicId}
Lịch sử đàm thoại trước đó:
${history.map(h => `${h.role === 'user' ? 'Sinh viên' : 'Giảng viên'}: ${h.text}`).join('\n')}

Câu trả lời mới nhất của sinh viên (thu từ giọng nói hoặc chữ viết):
"${userSpeech}"

YÊU CẦU ĐÁNH GIÁ VÀ HỎI TIẾP:
1. Đánh giá câu trả lời của sinh viên: đã nắm đúng bản chất chưa? Có sai lầm nhận thức (misconceptions) nào không?
2. Cho điểm lượt trả lời này trên thang 10.
3. Nếu có lỗi sai, chỉ rõ vào mảng error_tags.
4. Đưa ra 1 câu hỏi gợi mở hoặc phản biện tiếp theo (next_question) để kiểm tra sâu hơn.

Trả về DUY NHẤT định dạng JSON:
{
  "response": "Nhận xét của giảng viên về câu trả lời vừa rồi...",
  "next_question": "Câu hỏi vấn đáp tiếp theo...",
  "score": 8.0,
  "error_tags": ["Nhầm lẫn giữa xác suất có điều kiện và giao"]
}`;

    const rawResponse = await callAI(prompt, 'Bạn là Trưởng bộ môn Xác suất Thống kê hỏi thi vấn đáp sắc bén, tận tình.');
    const result = parseAIJSON(rawResponse, {
      response: 'Bạn đã trả lời đúng hướng! Bản chất cốt lõi của khái niệm đã được nhận diện.',
      next_question: 'Bạn có thể nêu một ví dụ thực tế trong kinh doanh mà ở đó việc tính sai kỳ vọng dẫn đến thua lỗ nặng không?',
      score: 8.0,
      error_tags: []
    });

    // Lưu vết vào learning_history (TN7)
    demoStore.addHistory({
      user_id: demoStore.getProfile().id,
      topic_id: topicId,
      mode: 'oral',
      input_text: userSpeech,
      result_json: result,
      score: result.score,
      error_tags: result.error_tags || []
    });

    return NextResponse.json({
      success: true,
      response: result.response,
      next_question: result.next_question,
      score: result.score,
      error_tags: result.error_tags
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Lỗi xử lý vấn đáp' }, { status: 500 });
  }
}
