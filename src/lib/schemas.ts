import { z } from 'zod';

export const lessonRequestSchema = z.object({
  topicId: z.string().min(1, 'Chưa chọn chủ đề'),
  customText: z.string().optional(),
  type: z.enum(['solve', 'concept', 'theorem']).optional(),
});

export const tutorRequestSchema = z.object({
  topicId: z.string().default('bayes_test'),
  prompt: z.string().optional(),
  inputText: z.string().optional(),
  imageBase64: z.string().optional(), // Image or Canvas exported PNG/JPEG
  canvasData: z.string().optional(),
});

export const practiceRequestSchema = z.object({
  topicId: z.string().default('bayes_test'),
  chapter: z.number().int().min(1).max(7).default(1),
  difficulty: z.enum(['Cơ bản', 'Vận dụng', 'Vận dụng cao']).default('Vận dụng'),
  count: z.number().int().min(1).max(10).default(5),
});

export const oralRequestSchema = z.object({
  topicId: z.string().default('clt_theorem'),
  history: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      text: z.string(),
    })
  ).default([]),
  userSpeech: z.string().min(1, 'Câu trả lời không được rỗng'),
});

export const explainRequestSchema = z.object({
  question: z.string().min(1),
  selectedOption: z.string().min(1),
  correctOption: z.string().min(1),
});

export const forumPostSchema = z.object({
  title: z.string().min(3, 'Tiêu đề tối thiểu 3 ký tự'),
  body: z.string().min(5, 'Nội dung tối thiểu 5 ký tự'),
  topicId: z.string().optional(),
});

export const commentSchema = z.object({
  postId: z.string().min(1),
  body: z.string().min(1, 'Nội dung bình luận không được rỗng'),
});
