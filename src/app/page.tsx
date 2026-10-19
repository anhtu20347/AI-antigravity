'use client';

import React, { useEffect, useState } from 'react';
import { SEED_TOPICS } from '@/lib/seed-data';
import { 
  BookOpen, 
  PenTool, 
  HelpCircle, 
  Mic, 
  Sparkles, 
  ArrowRight, 
  Flame, 
  Target, 
  AlertTriangle 
} from 'lucide-react';

export default function HomePage() {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/insights')
      .then(res => res.json())
      .then(data => {
        if (data.success) setInsights(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <section className="card-retro p-6 bg-white relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="badge-tag bg-mint">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-800" />
              Socratic AI Pedagogy MVP · 11 Tính Năng Khả Thi
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-ink leading-tight">
              Học Xác Suất & Thống Kê Theo Tiến Trình 4 Bước Sư Phạm 🦉
            </h1>
            <p className="text-sm font-bold text-gray-700 leading-relaxed">
              Trợ lý AI đồng hành định hướng chiến lược giải toán (George Pólya), học bản chất khái niệm và chứng minh định lí. Chấm bài viết tay trên Bảng iPad, khảo hạch vấn đáp và khắc phục lỗ hổng kiến thức.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">
            <a href="/lesson" className="btn-retro bg-lav justify-between text-sm py-2.5 px-4">
              <span>Bắt đầu Học 4 Bước</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
            <a href="/tutor" className="btn-retro bg-mint justify-between text-sm py-2.5 px-4">
              <span>Mở Bảng iPad & AI Tutor</span>
              <PenTool className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </section>

      {/* Core Loop Guide: Chọn Topic -> Học 4 bước -> Làm bài -> Nhận điểm -> Thấy nên học gì tiếp */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-ink flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-700" />
            Vòng lặp cốt lõi (Core Loop): Chọn chủ đề để học theo 4 bước
          </h2>
          <span className="text-xs font-bold text-gray-600">3 Chủ đề mẫu chuẩn hóa</span>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {SEED_TOPICS.map((topic) => {
            const typeBadge = topic.type === 'solve'
              ? { text: 'Quy trình Giải toán Pólya', color: 'bg-lav' }
              : topic.type === 'concept'
              ? { text: 'Học Khái niệm Kiến tạo', color: 'bg-butter' }
              : { text: 'Học Định lí Khám phá', color: 'bg-mint' };

            return (
              <div key={topic.id} className="card-retro p-5 flex flex-col justify-between hover:translate-y-[-2px]">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`badge-tag ${typeBadge.color}`}>
                      {typeBadge.text}
                    </span>
                    <span className="text-xs font-black text-gray-500">Chương {topic.chapter}</span>
                  </div>
                  <h3 className="font-black text-lg text-ink line-clamp-2">
                    {topic.title}
                  </h3>
                  <p className="text-xs font-bold text-gray-600">
                    Bao gồm 4 bước tương tác, câu hỏi gợi mở Socratic và bản đồ tư duy mindmap.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t-2 border-ink flex items-center justify-between gap-2">
                  <a
                    href={`/lesson?topic=${topic.id}`}
                    className="btn-retro text-xs py-1.5 px-3 bg-white hover:bg-lav flex-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Học 4 bước</span>
                  </a>
                  <a
                    href={`/tutor?topic=${topic.id}`}
                    className="btn-retro text-xs py-1.5 px-3 bg-mint"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>Nộp bài</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI Insights & Recommendation Widget (Table 4: "Hồ sơ: Đếm câu đúng/sai & Gợi ý topic tiếp theo") */}
      <section className="card-retro p-5 bg-[#F3EEFF] space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧭</span>
            <div>
              <h3 className="font-black text-lg text-ink">Định hướng cá nhân hóa từ AI Insights</h3>
              <p className="text-xs font-bold text-gray-600">Phân tích dựa trên lịch sử làm bài và các lỗi sai đã lưu</p>
            </div>
          </div>
          <a href="/profile" className="btn-retro text-xs bg-white py-1.5">
            Xem hồ sơ năng lực đầy đủ 📊
          </a>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-white border-2 border-ink">
            <div className="text-xs font-bold text-gray-600">Tổng hoạt động đã làm</div>
            <div className="text-2xl font-black text-indigo-950 mt-1">
              {loading ? '...' : insights?.summary?.totalActivities || 0} lượt
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border-2 border-ink">
            <div className="text-xs font-bold text-gray-600">Điểm trung bình gợi ý</div>
            <div className="text-2xl font-black text-emerald-800 mt-1">
              {loading ? '...' : (insights?.summary?.averageScore !== 'Chưa có' ? `${insights?.summary?.averageScore} / 10` : 'Chưa có')}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border-2 border-ink sm:col-span-2 md:col-span-1">
            <div className="text-xs font-bold text-gray-600">Chủ đề nên học tiếp</div>
            <div className="text-sm font-black text-purple-900 mt-1 truncate">
              {loading ? '...' : insights?.recommendation?.topicTitle || 'Công thức Bayes'}
            </div>
          </div>
        </div>

        {insights?.summary?.topErrors && insights.summary.topErrors.length > 0 && (
          <div className="p-3 rounded-xl bg-peach/40 border-2 border-ink">
            <div className="text-xs font-black text-red-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Lỗ hổng kiến thức cần chú ý:
            </div>
            <div className="flex gap-1.5 flex-wrap mt-2">
              {insights.summary.topErrors.map((err: any, idx: number) => (
                <span key={idx} className="badge-tag bg-white text-xs text-red-950">
                  ⚠️ {err.tag} ({err.count} lần)
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 11 Tính Năng MVP Quick Access */}
      <section className="space-y-3">
        <h2 className="text-xl font-black text-ink">Bản đồ 11 Tính năng theo yêu cầu Đề bài</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-bold">
          <a href="/lesson" className="p-3 card-retro hover:bg-lav/30 flex items-center gap-2">
            <span>📘</span> <span>TN1: Quy trình 4 bước</span>
          </a>
          <a href="/tutor" className="p-3 card-retro hover:bg-mint/30 flex items-center gap-2">
            <span>✍️</span> <span>TN2: AI Tutor & iPad Canvas</span>
          </a>
          <a href="/oral" className="p-3 card-retro hover:bg-butter/30 flex items-center gap-2">
            <span>🎙️</span> <span>TN3: Tương tác giọng nói</span>
          </a>
          <a href="/tutor#practice" className="p-3 card-retro hover:bg-peach/30 flex items-center gap-2">
            <span>📝</span> <span>TN4: 5 bài tự luận tương tự</span>
          </a>
          <a href="/quiz" className="p-3 card-retro hover:bg-lav/30 flex items-center gap-2">
            <span>🎯</span> <span>TN5: Trắc nghiệm giải đáp</span>
          </a>
          <a href="/oral" className="p-3 card-retro hover:bg-mint/30 flex items-center gap-2">
            <span>🧠</span> <span>TN6: Khảo hạch vấn đáp</span>
          </a>
          <a href="/profile" className="p-3 card-retro hover:bg-butter/30 flex items-center gap-2">
            <span>📊</span> <span>TN7: Thống kê lỗi 3 nguồn</span>
          </a>
          <a href="/lesson#mindmap" className="p-3 card-retro hover:bg-peach/30 flex items-center gap-2">
            <span>🗺️</span> <span>TN8: Bản đồ tư duy Mindmap</span>
          </a>
          <a href="/forum" className="p-3 card-retro hover:bg-lav/30 flex items-center gap-2">
            <span>🌐</span> <span>TN9: Diễn đàn người thật</span>
          </a>
          <a href="/profile" className="p-3 card-retro hover:bg-mint/30 flex items-center gap-2">
            <span>🪪</span> <span>TN10: Hồ sơ năng lực AI</span>
          </a>
          <a href="/admin" className="p-3 card-retro hover:bg-butter/30 flex items-center gap-2 col-span-full sm:col-span-2">
            <span>✨</span> <span>TN11: Sao chép & Nhân bản quy trình 4 bước</span>
          </a>
        </div>
      </section>
    </div>
  );
}
