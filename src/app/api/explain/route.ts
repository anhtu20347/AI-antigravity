import { NextRequest, NextResponse } from 'next/server';
import { explainRequestSchema } from '@/lib/schemas';
import { callAI, parseAIJSON } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = explainRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const { question, selectedOption, correctOption } = parsed.data;

    const prompt = `Nhiệm vụ TN5: Giải đáp thắc mắc "Tại sao đáp án này đúng/sai?".
Câu hỏi: "${question}"
Lựa chọn của người học: "${selectedOption}"
Đáp án đúng chuẩn: "${correctOption}"

YÊU CẦU:
1. Giải thích cặn kẽ bản chất toán học tại sao "${correctOption}" mới là đáp án chính xác.
2. Chỉ ra lỗi sai phổ biến hoặc bẫy tư duy khiến người học chọn "${selectedOption}".
3. Dùng công thức toán LaTeX $...$, văn phong súc tích, dễ hiểu.

Trả về DUY NHẤT định dạng JSON:
{
  "explanation": "Giải thích chi tiết vì sao...",
  "trap_warning": "Bẫy nhận thức thường gặp trong dạng bài này..."
}`;

    const rawResponse = await callAI(prompt, 'Bạn là Trợ giảng Cú Đêm giải thích trắc nghiệm XSTK.');
    const result = parseAIJSON(rawResponse, {
      explanation: `Đáp án "${correctOption}" là chính xác theo đúng định nghĩa và công thức chuẩn của chương. Lựa chọn "${selectedOption}" thường do nhầm lẫn giữa các đại lượng hoặc bỏ quên điều kiện tiên quyết.`,
      trap_warning: 'Hãy luôn đọc kỹ câu hỏi xem đề bài yêu cầu tính xác suất hay phần trăm!'
    });

    return NextResponse.json({
      success: true,
      explanation: result.explanation,
      trap_warning: result.trap_warning
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Lỗi giải thích câu hỏi' }, { status: 500 });
  }
}
