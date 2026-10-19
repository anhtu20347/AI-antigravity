import { NextRequest, NextResponse } from 'next/server';
import { demoStore } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const profile = demoStore.getProfile();
    const history = demoStore.getHistory(profile.id);

    // 1. Tổng hợp đếm lỗi sai theo error_tags (TN7)
    const errorCountMap: Record<string, number> = {};
    const modeCountMap: Record<string, number> = {
      tutor: 0,
      practice: 0,
      quiz: 0,
      oral: 0,
      lesson: 0,
    };

    let totalScore = 0;
    let scoreCount = 0;

    history.forEach(h => {
      if (modeCountMap[h.mode] !== undefined) {
        modeCountMap[h.mode]++;
      }
      if (h.score != null) {
        totalScore += Number(h.score);
        scoreCount++;
      }
      if (Array.isArray(h.error_tags)) {
        h.error_tags.forEach(tag => {
          if (tag) {
            errorCountMap[tag] = (errorCountMap[tag] || 0) + 1;
          }
        });
      }
    });

    const averageScore = scoreCount > 0 ? (totalScore / scoreCount).toFixed(1) : 'Chưa có';

    // Sắp xếp các lỗi lặp nhiều nhất
    const topErrors = Object.entries(errorCountMap)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 2. Rule gợi ý chủ đề tiếp theo (TN10)
    let recommendedTopicId = 'bayes_test';
    let recommendationReason = 'Khởi đầu với Quy trình 4 bước giải toán Bayes nền tảng';

    if (errorCountMap['Nhầm lẫn điều kiện độc lập'] || errorCountMap['Cần rà soát công thức']) {
      recommendedTopicId = 'bayes_test';
      recommendationReason = 'Hệ thống phát hiện bạn cần củng cố lại Hệ đầy đủ & Điều kiện độc lập';
    } else if (modeCountMap.quiz > 0 && modeCountMap.tutor === 0) {
      recommendedTopicId = 'bayes_test';
      recommendationReason = 'Bạn đã làm trắc nghiệm tốt! Hãy thử sức viết lời giải trên Bảng iPad để AI Tutor chấm điểm';
    } else if (modeCountMap.tutor > 0 && modeCountMap.oral === 0) {
      recommendedTopicId = 'clt_theorem';
      recommendationReason = 'Thử thách phản xạ lý thuyết tại Phòng Khảo Hạch Vấn Đáp cùng Cú Đêm';
    } else {
      recommendedTopicId = 'expectation_concept';
      recommendationReason = 'Tiếp tục lộ trình với Khái niệm Kỳ vọng toán học E(X)';
    }

    const recommendedTopic = demoStore.getTopic(recommendedTopicId);

    return NextResponse.json({
      success: true,
      profile,
      summary: {
        totalActivities: history.length,
        averageScore,
        modeCounts: modeCountMap,
        topErrors,
      },
      recommendation: {
        topicId: recommendedTopicId,
        topicTitle: recommendedTopic?.title || 'Công thức Bayes',
        reason: recommendationReason,
      },
      recentHistory: history.slice(0, 10),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Lỗi tải thống kê' }, { status: 500 });
  }
}
