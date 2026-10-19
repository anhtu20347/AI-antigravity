'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, isDemoMode } from '@/lib/supabase';
import { LearningHistory } from '@/types';
import {
  User,
  Award,
  TrendingUp,
  AlertTriangle,
  Brain,
  Sparkles,
  BookOpen,
  ArrowRight,
  Clock,
  CheckCircle2,
  BarChart3,
  Flame,
  Activity,
  Layers
} from 'lucide-react';

interface InsightData {
  total_sessions: number;
  avg_score: number;
  tag_counts: Record<string, number>;
  weakest_tags: string[];
  recommended_next_topic: {
    topic_id: string;
    reason: string;
  };
}

export default function ProfilePage() {
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [historyList, setHistoryList] = useState<LearningHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // Fetch AI Insights from API
        const res = await fetch('/api/insights');
        const data = await res.json();
        setInsights(data);

        // Fetch user history from Supabase/demoStore
        const { data: hist } = await supabase
          .from('learning_history')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (hist) {
          setHistoryList(hist as LearningHistory[]);
        }
      } catch (err) {
        console.warn('Profile fetch fallback:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Profile Header Card */}
      <div className="retro-card bg-lav/30 p-6 md:p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-ink text-white flex items-center justify-center font-black text-2xl border-2 border-ink shadow-md">
            🎓
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge bg-ink text-white font-mono text-xs">TN7 & TN10</span>
              <span className="badge bg-mint text-ink font-bold">Sinh viên XSTK</span>
              {isDemoMode() && <span className="badge bg-peach text-ink">Demo Mode</span>}
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-ink">Hồ Sơ Năng Lực AI & Chẩn Đoán Lỗi</h1>
            <p className="text-xs md:text-sm text-gray-700 mt-1">
              Hệ thống theo dõi tiến độ thời gian thực, tổng hợp sai lầm từ 3 nguồn (Trắc nghiệm, Tự luận, Vấn đáp).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-center px-4 py-2 bg-white rounded-xl border-2 border-ink shadow-sm">
            <div className="text-[10px] text-gray-500 font-bold uppercase">Tổng buổi học</div>
            <div className="text-2xl font-black text-ink">{insights?.total_sessions || 8}</div>
          </div>
          <div className="text-center px-4 py-2 bg-white rounded-xl border-2 border-ink shadow-sm">
            <div className="text-[10px] text-gray-500 font-bold uppercase">Điểm trung bình</div>
            <div className="text-2xl font-black text-emerald-600">
              {Math.round(insights?.avg_score || 78)}%
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation Alert */}
      {insights?.recommended_next_topic && (
        <div className="retro-card bg-peach/30 p-6 mb-8 border-2 border-ink flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-scale-up">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-peach shrink-0 mt-1" />
            <div>
              <span className="badge bg-ink text-white text-xs font-mono mb-1 inline-block">
                CHẨN ĐOÁN & KHUYẾN NGHỊ HỌC TẬP
              </span>
              <h3 className="font-black text-ink text-lg">
                Chủ đề đề xuất tiếp theo:{' '}
                <span className="underline decoration-ink decoration-2">
                  {insights.recommended_next_topic.topic_id === 'bayes_test'
                    ? 'Chương 1: Công thức Bayes & Hệ Đầy Đủ'
                    : 'Chương 2: Khái niệm Kỳ vọng E(X)'}
                </span>
              </h3>
              <p className="text-sm text-gray-700 mt-1">{insights.recommended_next_topic.reason}</p>
            </div>
          </div>

          <Link
            href={`/lesson?topic=${insights.recommended_next_topic.topic_id}`}
            className="retro-btn bg-ink text-white font-bold text-xs md:text-sm py-2.5 px-5 flex items-center gap-2 shrink-0"
          >
            <span>Học ngay bài này</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* 3-Source Error Taxonomy (TN10) */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-ink" />
          <h2 className="text-xl font-black text-ink">Bản Đồ Lỗi Sai Từ 3 Nguồn (Triangulation)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Source 1: Trắc nghiệm */}
          <div className="retro-card bg-white p-5 border-2 border-ink">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <span className="font-black text-ink text-sm">1. Trắc Nghiệm</span>
              <span className="badge bg-peach/40 text-ink text-[10px]">Tốc độ & Nhận diện</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">Các bẫy phương án nhiễu thường mắc phải:</p>
            <div className="space-y-2">
              <div className="p-2.5 bg-gray-50 rounded-lg text-xs border border-gray-200">
                <div className="font-bold text-ink">Nghịch lý tỷ lệ nền</div>
                <div className="text-[11px] text-gray-500">Bị bẫy bởi độ nhạy xét nghiệm cao</div>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-lg text-xs border border-gray-200">
                <div className="font-bold text-ink">Hiệu chỉnh Bessel (n-1)</div>
                <div className="text-[11px] text-gray-500">Quên chia mẫu cho n-1 ở phương sai mẫu</div>
              </div>
            </div>
          </div>

          {/* Source 2: Tự luận / Canvas */}
          <div className="retro-card bg-white p-5 border-2 border-ink">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <span className="font-black text-ink text-sm">2. Tự Luận & Barem</span>
              <span className="badge bg-lav/40 text-ink text-[10px]">4 Bước Pólya</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">Lỗi lập luận & trình bày bước toán học:</p>
            <div className="space-y-2">
              <div className="p-2.5 bg-gray-50 rounded-lg text-xs border border-gray-200">
                <div className="font-bold text-ink">Thiếu kiểm tra hệ đầy đủ</div>
                <div className="text-[11px] text-gray-500">Không chỉ ra P(A) + P(A_) = 1 trước khi tính</div>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-lg text-xs border border-gray-200">
                <div className="font-bold text-ink">Làm tròn số sớm</div>
                <div className="text-[11px] text-gray-500">Làm tròn 2 chữ số thập phân ở bước trung gian</div>
              </div>
            </div>
          </div>

          {/* Source 3: Vấn đáp AI */}
          <div className="retro-card bg-white p-5 border-2 border-ink">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <span className="font-black text-ink text-sm">3. Vấn Đáp AI</span>
              <span className="badge bg-mint/40 text-ink text-[10px]">Bản chất khái niệm</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">Lỗ hổng trong phản xạ và phản ví dụ:</p>
            <div className="space-y-2">
              <div className="p-2.5 bg-gray-50 rounded-lg text-xs border border-gray-200">
                <div className="font-bold text-ink">Đồng nhất E(X) với giá trị thực</div>
                <div className="text-[11px] text-gray-500">Chưa nắm E(X) là trọng tâm xác suất lý thuyết</div>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-lg text-xs border border-gray-200">
                <div className="font-bold text-ink">Điều kiện áp dụng CLT</div>
                <div className="text-[11px] text-gray-500">Quên điều kiện phương sai hữu hạn của mẫu</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Tags Frequency Breakdown */}
      <div className="retro-card bg-white p-6 md:p-8 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="font-black text-ink text-lg">Tần Suất Thẻ Lỗi (Error Tags Cloud)</h3>
          </div>
          <span className="text-xs text-gray-500 font-mono">Tự động phân loại bởi Gemini AI</span>
        </div>

        {insights && Object.keys(insights.tag_counts).length > 0 ? (
          <div className="flex flex-wrap gap-2.5">
            {Object.entries(insights.tag_counts).map(([tag, count]) => (
              <div
                key={tag}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 border-ink bg-butter/30 text-xs font-bold text-ink shadow-sm"
              >
                <span>#{tag}</span>
                <span className="w-5 h-5 rounded-full bg-ink text-white text-[10px] flex items-center justify-center font-mono">
                  {count}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <span className="badge bg-butter text-ink">#nham_lan_he_day_du (4)</span>
            <span className="badge bg-butter text-ink">#nghich_ly_ty_le_nen (3)</span>
            <span className="badge bg-butter text-ink">#dieu_kien_clt (2)</span>
            <span className="badge bg-butter text-ink">#hieu_chinh_bessel (2)</span>
            <span className="badge bg-butter text-ink">#sai_lam_loai_1 (1)</span>
          </div>
        )}
      </div>

      {/* Recent History Table */}
      <div className="retro-card bg-white p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-ink" />
            <h3 className="font-black text-ink text-lg">Nhật Ký Học Tập Gần Đây</h3>
          </div>
          <span className="text-xs font-mono text-gray-500">10 phiên gần nhất</span>
        </div>

        {historyList.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-6">Chưa có phiên học nào được ghi lại.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="border-b-2 border-ink bg-gray-50 text-gray-700 font-mono">
                  <th className="py-2.5 px-3">Thời gian</th>
                  <th className="py-2.5 px-3">Chế độ</th>
                  <th className="py-2.5 px-3">Nội dung / Câu hỏi</th>
                  <th className="py-2.5 px-3 text-center">Điểm số</th>
                  <th className="py-2.5 px-3">Thẻ lỗi phát hiện</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {historyList.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80">
                    <td className="py-3 px-3 font-mono text-gray-500 text-xs">
                      {new Date(item.created_at).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`badge text-[10px] font-bold ${
                          item.mode === 'oral'
                            ? 'bg-lav text-ink'
                            : item.mode === 'quiz'
                            ? 'bg-peach text-ink'
                            : item.mode === 'tutor'
                            ? 'bg-mint text-ink'
                            : 'bg-butter text-ink'
                        }`}
                      >
                        {item.mode.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-ink max-w-xs truncate">
                      {item.input_text || 'Học bài 4 bước'}
                    </td>
                    <td className="py-3 px-3 text-center font-bold">
                      {item.score !== undefined ? `${item.score}` : '-'}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {item.error_tags && item.error_tags.length > 0 ? (
                          item.error_tags.map((t, idx) => (
                            <span key={idx} className="badge bg-gray-100 text-gray-700 text-[10px]">
                              {t}
                            </span>
                          ))
                        ) : (
                          <span className="text-emerald-600 text-xs font-bold">Hoàn hảo</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
