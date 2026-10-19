import { NextRequest, NextResponse } from 'next/server';
import { practiceRequestSchema } from '@/lib/schemas';
import { callAI, parseAIJSON } from '@/lib/ai';
import { demoStore } from '@/lib/supabase';
import { PracticeProblem } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = practiceRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const { topicId, chapter, difficulty, count } = parsed.data;
    const topic = demoStore.getTopic(topicId);

    const prompt = `Nhiệm vụ TN4: Sinh ngẫu nhiên đúng ${count} BÀI TOÁN TỰ LUẬN TƯƠNG TỰ CÙNG DẠNG cho môn Xác suất & Thống kê.
Chủ đề gốc: ${topic?.title || 'Chương ' + chapter}
Độ khó: ${difficulty}

YÊU CẦU:
- Bối cảnh thực tế đa dạng (Y tế, Kinh tế, Sản xuất, Ngân hàng, Kỹ thuật).
- Chỉ cung cấp CHIẾN LƯỢC GIẢI (strategy), TUYỆT ĐỐI KHÔNG CUNG CẤP LỜI GIẢI HOÀN CHỈNH HAY ĐÁP SỐ.
- Sử dụng công thức toán LaTeX $...$.

Trả về DUY NHẤT định dạng JSON:
{
  "questions": [
    {
      "id": "p_1",
      "title": "Tiêu đề ngắn",
      "question": "Đề bài chi tiết...",
      "context": "Ngữ cảnh thực tế",
      "strategy": [
        "Bước 1: Gọi biến cố...",
        "Bước 2: Dùng công thức...",
        "Bước 3: Thay số..."
      ]
    }
  ]
}`;

    const rawResponse = await callAI(prompt, 'Bạn là Chuyên gia tạo đề bài tập Xác suất Thống kê Socratic.');
    const result = parseAIJSON<{ questions: PracticeProblem[] }>(rawResponse, {
      questions: [
        {
          id: 'p_def_1',
          title: 'Bài toán Dây chuyền sản xuất chip',
          question: 'Nhà máy có 2 máy A và B sản xuất lần lượt 60% và 40% linh kiện. Tỷ lệ lỗi của máy A là 1%, máy B là 3%. Lấy ngẫu nhiên 1 linh kiện thấy lỗi. Tính xác suất linh kiện do máy B sản xuất.',
          context: 'Sản xuất công nghiệp',
          strategy: ['Xác định không gian mẫu', 'Tính P(Lỗi) toàn phần', 'Áp dụng công thức Bayes']
        }
      ]
    });

    return NextResponse.json({
      success: true,
      chapter,
      difficulty,
      questions: result.questions
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Lỗi sinh bài tập tự luyện' }, { status: 500 });
  }
}
