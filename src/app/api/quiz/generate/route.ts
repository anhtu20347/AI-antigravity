import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { callGeminiJSON, isAIConfigured } from '@/lib/ai';
import { SEED_TOPICS } from '@/lib/seed-data';
import { QuizQuestion } from '@/types';

export const maxDuration = 60;

const requestSchema = z.object({
  chapter: z.number().int().min(1).max(7),
  difficulty: z.enum(['Cơ bản', 'Vận dụng', 'Vận dụng cao']).default('Vận dụng'),
});

const draftSchema = z.object({
  questions: z.array(z.object({
    question: z.string().trim().min(1).max(2000),
    options: z.array(z.string().trim().min(1).max(500)).length(4),
    correct_index: z.number().int().min(0).max(3),
    explanation: z.string().trim().min(1).max(2000),
    difficulty: z.enum(['Cơ bản', 'Vận dụng', 'Vận dụng cao']),
  })).length(5),
});

const reviewSchema = z.object({
  valid: z.boolean(),
  issues: z.array(z.string().trim().min(1).max(300)).max(20),
});

function parseJSON<T>(raw: string, schema: z.ZodType<T>): T {
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  return schema.parse(JSON.parse(cleaned));
}

export async function POST(request: NextRequest) {
  if (!isAIConfigured) {
    return NextResponse.json({ error: 'Gemini chưa được cấu hình trên máy chủ.' }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Chọn chương và độ khó hợp lệ.' }, { status: 400 });
  }

  const { chapter, difficulty } = parsed.data;
  const chapterTopics = SEED_TOPICS.filter((topic) => topic.chapter === chapter);
  if (!chapterTopics.length) {
    return NextResponse.json({ error: 'Chưa có nội dung học tập cho chương này.' }, { status: 404 });
  }
  const topic = chapterTopics[0];
  const sourceContext = topic.content_json.four_steps
    .map((step) => `${step.title}: ${step.content}`)
    .join('\n')
    .slice(0, 9000);

  try {
    const draftRaw = await callGeminiJSON(
      `Tạo đúng 5 câu trắc nghiệm mới bằng tiếng Việt về chủ đề "${topic.title}" (Chương ${chapter}). Độ khó: ${difficulty}.
Chỉ dùng kiến thức trong nội dung sau:
${sourceContext}
Mỗi câu phải có đúng 4 phương án khác nhau, duy nhất một đáp án đúng, phương án nhiễu hợp lý và lời giải có thể kiểm tra được. Không tự thêm giả thiết.
Trả JSON theo dạng {"questions":[{"question":"...","options":["...","...","...","..."],"correct_index":0,"explanation":"...","difficulty":"${difficulty}"}]}.
`,
      'Bạn là giảng viên Xác suất Thống kê. Tạo câu hỏi chính xác, chỉ dựa trên nội dung được cung cấp. Trả về JSON hợp lệ.',
    );
    const draft = parseJSON(draftRaw, draftSchema);
    if (new Set(draft.questions.map((question) => question.question.toLocaleLowerCase('vi').trim())).size !== 5) {
      return NextResponse.json({ error: 'Gemini tạo câu hỏi bị trùng; hãy thử lại.' }, { status: 422 });
    }
    const duplicateOptions = draft.questions.some((question) =>
      new Set(question.options.map((option) => option.toLocaleLowerCase('vi').trim())).size !== 4,
    );
    if (duplicateOptions) {
      return NextResponse.json({ error: 'Gemini tạo phương án trùng nhau; hãy thử lại.' }, { status: 422 });
    }

    const reviewRaw = await callGeminiJSON(
      `Kiểm tra độc lập 5 câu trắc nghiệm sau. Tự giải từng câu. Chỉ trả valid=true nếu mỗi câu có đúng một đáp án đúng, lời giải chính xác và không thiếu giả thiết; nếu chưa chắc, valid=false.
${JSON.stringify(draft.questions)}
Trả JSON {"valid":true,"issues":[]} hoặc {"valid":false,"issues":["..."]}.`,
      'Bạn là người phản biện toán học độc lập. Không mặc định câu trả lời của người soạn là đúng. Trả về JSON hợp lệ.',
    );
    const review = parseJSON(reviewRaw, reviewSchema);
    if (!review.valid) {
      return NextResponse.json({ error: 'Chưa xác nhận được độ chính xác của bộ câu hỏi. Hãy thử lại.', issues: review.issues }, { status: 422 });
    }

    const questions: QuizQuestion[] = draft.questions.map((question, index) => ({
      ...question,
      id: `ai_${Date.now()}_${index + 1}`,
      chapter,
      topic_id: topic.id,
    }));
    return NextResponse.json({ success: true, source: 'gemini', chapter, topic: topic.title, questions });
  } catch (error) {
    const unavailable = error instanceof Error && error.message === 'AI_NOT_CONFIGURED';
    console.error('Gemini quiz generation failed:', error instanceof Error ? error.message : 'unknown error');
    return NextResponse.json(
      { error: unavailable ? 'Gemini chưa được cấu hình trên máy chủ.' : 'Gemini chưa thể tạo và kiểm tra câu hỏi lúc này. Hãy thử lại sau.' },
      { status: unavailable ? 503 : 502 },
    );
  }
}
