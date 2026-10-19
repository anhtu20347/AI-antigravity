import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const isAIConfigured = Boolean(apiKey && apiKey.length > 10);

/**
 * Gọi AI tạo nội dung text hoặc JSON
 */
export async function callAI(
  prompt: string,
  systemInstruction: string = 'Bạn là Giáo sư Cú Đêm - Trợ lý sư phạm Xác suất Thống kê Socratic. Luôn ưu tiên chiến lược giải và câu hỏi gợi mở, tuyệt đối không đưa sẵn đáp số.',
  imageBase64?: string
): Promise<string> {
  if (!genAI || !apiKey) {
    // Trả fallback thông minh khi chưa có API Key
    return generateFallbackResponse(prompt, imageBase64);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemInstruction,
    });

    if (imageBase64) {
      // Vision request
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const imagePart = {
        inlineData: {
          data: cleanBase64,
          mimeType: 'image/png'
        }
      };
      const result = await model.generateContent([prompt, imagePart]);
      return result.response.text();
    } else {
      const result = await model.generateContent(prompt);
      return result.response.text();
    }
  } catch (err: any) {
    console.warn('Gemini API call failed, falling back to simulated teacher response:', err?.message);
    return generateFallbackResponse(prompt, imageBase64);
  }
}

/**
 * Parse an toàn JSON từ câu trả lời của AI
 */
export function parseAIJSON<T>(rawText: string, fallback: T): T {
  try {
    let clean = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const firstBrace = clean.indexOf('{');
    const firstBracket = clean.indexOf('[');

    if (firstBracket >= 0 && (firstBrace < 0 || firstBracket < firstBrace)) {
      const lastBracket = clean.lastIndexOf(']');
      if (lastBracket > firstBracket) {
        clean = clean.substring(firstBracket, lastBracket + 1);
      }
    } else if (firstBrace >= 0) {
      const lastBrace = clean.lastIndexOf('}');
      if (lastBrace > firstBrace) {
        clean = clean.substring(firstBrace, lastBrace + 1);
      }
    }

    return JSON.parse(clean);
  } catch (e) {
    return fallback;
  }
}

/**
 * Trình sinh phản hồi sư phạm mô phỏng (dành cho demo offline khi chưa có API key)
 */
function generateFallbackResponse(prompt: string, imageBase64?: string | boolean): string {
  const p = prompt.toLowerCase();
  const hasImage = Boolean(imageBase64);

  if (p.includes('tutor') || hasImage || p.includes('chấm điểm')) {
    return JSON.stringify({
      score: 7.5,
      feedback: 'Bài làm thể hiện tư duy tốt trong việc nhận diện không gian mẫu và đặt các biến cố tương ứng. Tuy nhiên, ở bước chuyển đổi điều kiện, bạn cần chú ý kiểm tra tính độc lập hoặc dùng công thức nhân tổng quát thay vì giả định độc lập.',
      error_tags: ['Nhầm lẫn điều kiện độc lập', 'Thiếu bước kiểm tra mẫu số P(L)'],
      next_step: 'Hãy viết lại công thức xác suất đầy đủ cho mẫu số và tính lại thương số theo Bayes.',
      detailed_strategy: [
        'Bước 1: Liệt kê hệ đầy đủ các biến cố {A1, A2}.',
        'Bước 2: Xác định xác suất tiên nghiệm P(A1), P(A2).',
        'Bước 3: Tính xác suất có điều kiện P(B|A1), P(B|A2).',
        'Bước 4: Thay số vào công thức Bayes để suy ra xác suất hậu nghiệm.'
      ]
    });
  }

  if (p.includes('sinh') || p.includes('tương tự') || p.includes('5 bài')) {
    return JSON.stringify({
      questions: [
        {
          id: 'gen_1',
          title: 'Bài toán Xét nghiệm Virus biến thể',
          question: 'Một phòng thí nghiệm phát triển que test nhanh có độ nhạy 95% và độ đặc hiệu 96%. Tỷ lệ người nhiễm bệnh trong vùng dịch là 2%. Tính xác suất một người dương tính thực sự mắc bệnh.',
          context: 'Y tế dự phòng',
          strategy: ['Dùng hệ đầy đủ người nhiễm và không nhiễm', 'Tính P(+) toàn phần', 'Áp dụng công thức Bayes để tính P(B|+)']
        },
        {
          id: 'gen_2',
          title: 'Bài toán Kiểm tra Thẻ tín dụng gian lận',
          question: 'Hệ thống AI ngân hàng phát hiện 99% các giao dịch gian lận, nhưng có 1% giao dịch hợp lệ bị gắn cờ nhầm. Biết chỉ 0,1% giao dịch là gian lận. Tính xác suất giao dịch bị gắn cờ thực sự là lừa đảo.',
          context: 'Fintech & Ngân hàng',
          strategy: ['Xác định tỷ lệ nền gian lận P(G) = 0,001', 'Tính mẫu số P(Cờ)', 'Chia tỷ lệ gian lận thực tế']
        },
        {
          id: 'gen_3',
          title: 'Bài toán Dây chuyền sản xuất linh kiện',
          question: 'Máy 1 làm 70% sản lượng với tỷ lệ lỗi 1%. Máy 2 làm 30% sản lượng với tỷ lệ lỗi 4%. Chọn ngẫu nhiên một sản phẩm bị lỗi, xác suất nó do máy 2 làm ra là bao nhiêu?',
          context: 'Quản trị chuỗi cung ứng',
          strategy: ['Tính P(Lỗi) = 0,7*0,01 + 0,3*0,04 = 0,019', 'Áp dụng Bayes chia cho nhánh máy 2']
        },
        {
          id: 'gen_4',
          title: 'Bài toán Cảnh báo cháy trong tòa nhà',
          question: 'Cảm biến khói có xác suất báo động khi có cháy là 97%, xác suất báo động giả khi không có cháy là 2%. Tỷ lệ cháy trong mùa khô là 0,5%. Khi có chuông báo, xác suất thực sự có cháy là bao nhiêu?',
          context: 'An toàn công trình',
          strategy: ['Xác định không gian mẫu P(Cháy) = 0,005', 'Tính P(Báo động)', 'Rút ra kết luận']
        },
        {
          id: 'gen_5',
          title: 'Bài toán Lọc tin tuyển dụng giả mạo',
          question: 'Nền tảng việc làm phát hiện 90% tin giả mạo. Tuy nhiên 3% tin thật cũng bị gắn cờ nhầm. Biết tin giả chiếm 5% trên sàn. Tính xác suất một tin bị gắn cờ là tin giả thực sự.',
          context: 'Thương mại điện tử',
          strategy: ['Lập bảng xác suất 2 chiều', 'Tính xác suất điều kiện ngược theo Bayes']
        }
      ]
    });
  }

  if (p.includes('vấn đáp') || p.includes('oral')) {
    return JSON.stringify({
      response: 'Bạn đã trả lời đúng trọng tâm về mặt trực giác! Bản chất của định lí Giới hạn Trung tâm chính là hiệu ứng triệt tiêu sai số khi tổng hợp nhiều yếu tố độc lập.',
      next_question: 'Bạn có thể giải thích thêm: vì sao trong công thức chuẩn hóa Z, chúng ta lại chia cho độ lệch chuẩn là σ/√n chứ không phải là σ không?',
      score: 8.0,
      error_tags: []
    });
  }

  return JSON.stringify({
    explanation: 'Đáp án này chính xác vì dựa trên định lí và tính chất cơ bản của môn Xác suất Thống kê. Các phương án khác vi phạm giả thiết hoặc sai lệch công thức cơ sở.'
  });
}
