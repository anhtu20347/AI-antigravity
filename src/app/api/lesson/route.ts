import { NextRequest, NextResponse } from 'next/server';
import { lessonRequestSchema } from '@/lib/schemas';
import { callAI, parseAIJSON } from '@/lib/ai';
import { demoStore } from '@/lib/supabase';
import { FourStep } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = lessonRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const { topicId, customText, type } = parsed.data;
    const existing = demoStore.getTopic(topicId);

    // Nếu không có customText, trả về bài học có sẵn
    if (!customText && existing) {
      return NextResponse.json({
        topic: existing,
        four_steps: existing.content_json.four_steps
      });
    }

    // Nếu có customText, AI sẽ phân rã thành bài học 4 bước mới (TN11: Sao chép/Nhân bản quy trình)
    const prompt = `Bạn là Chuyên gia Thiết kế Sư phạm Toán học Xác suất & Thống kê.
Nhiệm vụ: Phân rã nội dung sau thành tiến trình học tập chuẩn 4 bước (${type === 'concept' ? 'Khái niệm: Trải nghiệm -> Định nghĩa -> Củng cố -> Vận dụng' : type === 'theorem' ? 'Định lí: Trải nghiệm -> Định lí/Chứng minh -> Củng cố -> Vận dụng' : 'Giải toán Pólya: Tìm hiểu -> Kế hoạch -> Trình bày -> Nhìn lại'}):

Nội dung: ${customText || (existing ? existing.title : 'Bài toán Xác suất')}

Hãy trả về duy nhất định dạng JSON theo schema:
{
  "four_steps": [
    {
      "step": 1,
      "title": "Bước 1: ...",
      "objective": "Mục tiêu bước...",
      "content": "Nội dung phân tích chi tiết (có công thức LaTeX $...$)...",
      "interactive_prompt": "Câu hỏi gợi mở tương tác cho người học...",
      "tips": "Lưu ý hoặc bẫy hay gặp..."
    },
    ... (đủ 4 bước)
  ]
}`;

    const rawResponse = await callAI(prompt);
    const parsedResponse = parseAIJSON<{ four_steps: FourStep[] }>(rawResponse, {
      four_steps: existing ? existing.content_json.four_steps : []
    });

    return NextResponse.json({
      topicId,
      four_steps: parsedResponse.four_steps
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Lỗi xử lý bài học' }, { status: 500 });
  }
}
