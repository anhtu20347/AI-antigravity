'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, isDemoMode } from '@/lib/supabase';
import { Topic, TopicType, FourStep, MindmapData } from '@/types';
import {
  Wand2,
  Sparkles,
  Layers,
  Save,
  CheckCircle,
  Eye,
  BookOpen,
  Settings,
  ArrowRight,
  Database,
  Cpu,
  RefreshCw,
  FolderPlus
} from 'lucide-react';

export default function AdminPedagogyPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [promptText, setPromptText] = useState(
    'Bài toán kiểm định giả thuyết so sánh hai tỷ lệ độc lập (Two-proportion Z-test). Ví dụ so sánh tỷ lệ khỏi bệnh giữa nhóm dùng thuốc mới (100 người khỏi 85) và nhóm giả dược (100 người khỏi 70) với mức ý nghĩa 5%.'
  );
  const [type, setType] = useState<TopicType>('solve');
  const [chapter, setChapter] = useState(6);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Preview generated result
  const [generatedResult, setGeneratedResult] = useState<{
    topic_id?: string;
    title: string;
    type: TopicType;
    chapter: number;
    four_steps: FourStep[];
    mindmap: MindmapData;
  } | null>(null);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load existing topics
  const loadTopics = async () => {
    try {
      const { data } = await supabase.from('topics').select('*');
      if (data) {
        setTopics(data as Topic[]);
      }
    } catch (e) {
      console.warn('Could not load topics:', e);
    }
  };

  useEffect(() => {
    loadTopics();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    setIsGenerating(true);
    setSavedSuccess(false);
    setGeneratedResult(null);

    try {
      const res = await fetch('/api/lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          type,
          chapter
        })
      });

      const data = await res.json();
      setGeneratedResult(data);
    } catch (err) {
      console.error(err);
      alert('Không thể tạo bài học lúc này. Vui lòng thử lại!');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToDatabase = async () => {
    if (!generatedResult) return;
    setIsSaving(true);
    try {
      const newTopicId = `topic_${Date.now()}`;
      const payload: Partial<Topic> = {
        id: newTopicId,
        title: generatedResult.title,
        type: generatedResult.type,
        chapter: generatedResult.chapter,
        content_json: { four_steps: generatedResult.four_steps },
        mindmap_json: generatedResult.mindmap,
        is_published: true
      };

      await supabase.from('topics').insert(payload);
      setSavedSuccess(true);
      await loadTopics();
    } catch (err) {
      console.error('Error saving topic:', err);
      alert('Đã xảy ra lỗi khi lưu vào cơ sở dữ liệu!');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="retro-card bg-butter/40 p-6 md:p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge bg-ink text-white font-mono text-xs">TN11</span>
            <span className="badge bg-white">Meta Pedagogy Engine</span>
            {isDemoMode() && <span className="badge bg-peach text-ink">Demo In-Memory</span>}
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-ink">
            Động Cơ Sư Phạm AI & Quản Trị Tri Thức
          </h1>
          <p className="text-sm text-gray-700 mt-1">
            Nhập bất kỳ bài toán hay định lý XSTK thô nào — AI sẽ tự động cấu trúc hóa thành quy trình 4 bước chuẩn
            sư phạm và vẽ bản đồ tư duy Mindmap tức thì.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/lesson"
            className="retro-btn bg-white text-ink text-xs font-bold py-2 px-3 flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            <span>Xem trang bài học</span>
          </Link>
        </div>
      </div>

      {/* Generator Form */}
      <form
        onSubmit={handleGenerate}
        className="retro-card bg-white p-6 md:p-8 mb-8 border-2 border-ink space-y-4"
      >
        <div className="flex items-center gap-2 pb-3 border-b-2 border-ink/20">
          <Cpu className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-black text-ink">1. Thiết Kế Bài Học Tự Động (AI Curriculum Generator)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Khung Sư Phạm Áp Dụng (Pedagogy Framework):
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TopicType)}
              className="w-full p-2.5 rounded-lg border-2 border-ink text-xs md:text-sm font-semibold bg-gray-50 focus:outline-none"
            >
              <option value="solve">Giải bài toán (Khung 4 Bước George Pólya)</option>
              <option value="concept">Hình thành khái niệm (Khung Kiến Tạo Thực Tiễn)</option>
              <option value="theorem">Dạy học định lý (Khung Suy Diễn & Trực Quan Hóa)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Chương trong giáo trình:</label>
            <select
              value={chapter}
              onChange={(e) => setChapter(Number(e.target.value))}
              className="w-full p-2.5 rounded-lg border-2 border-ink text-xs md:text-sm font-semibold bg-gray-50 focus:outline-none"
            >
              <option value={1}>Chương 1: Biến cố ngẫu nhiên & Xác suất</option>
              <option value={2}>Chương 2: Biến ngẫu nhiên & Phân phối</option>
              <option value={3}>Chương 3: Định lí giới hạn</option>
              <option value={4}>Chương 4: Cơ sở lý thuyết mẫu</option>
              <option value={5}>Chương 5: Ước lượng tham số</option>
              <option value={6}>Chương 6: Kiểm định giả thuyết thống kê</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">
            Nội dung đề bài / ý niệm toán học cần biên soạn:
          </label>
          <textarea
            rows={4}
            required
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-ink text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-butter"
            placeholder="Dán đề bài thi, khái niệm hoặc định lý cần sư phạm hóa..."
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isGenerating || !promptText.trim()}
            className="retro-btn bg-ink text-white font-bold text-xs md:text-sm py-2.5 px-6 flex items-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang phân tích sư phạm & vẽ Mindmap...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-butter" />
                <span>Sinh Bài Học 4 Bước & Mindmap</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Generated Result Preview */}
      {generatedResult && (
        <div className="retro-card bg-mint/20 p-6 md:p-8 mb-8 border-2 border-ink space-y-6 animate-scale-up">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b-2 border-ink gap-4">
            <div>
              <span className="badge bg-ink text-white font-mono text-xs mb-1">KẾT QUẢ TẠO BỞI AI</span>
              <h3 className="text-xl font-black text-ink">{generatedResult.title}</h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Chương {generatedResult.chapter} • Khung: {generatedResult.type.toUpperCase()}
              </p>
            </div>

            <button
              onClick={handleSaveToDatabase}
              disabled={isSaving || savedSuccess}
              className={`retro-btn font-bold text-xs md:text-sm py-2 px-5 flex items-center gap-2 ${
                savedSuccess ? 'bg-emerald-600 text-white' : 'bg-ink text-white'
              }`}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Đã lưu vào hệ thống!</span>
                </>
              ) : isSaving ? (
                <span>Đang lưu...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Lưu bài học vào CSDL</span>
                </>
              )}
            </button>
          </div>

          {/* 4 Steps Preview */}
          <div className="space-y-3">
            <h4 className="font-black text-ink text-sm uppercase tracking-wide">
              Quy trình 4 Bước Sư Phạm:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {generatedResult.four_steps.map((st) => (
                <div key={st.step} className="p-4 bg-white rounded-xl border-2 border-ink space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-ink text-white font-mono font-bold text-xs flex items-center justify-center">
                      {st.step}
                    </span>
                    <span className="font-black text-xs md:text-sm text-ink">{st.title}</span>
                  </div>
                  <div className="text-xs text-gray-600 font-medium">🎯 {st.objective}</div>
                  <p className="text-xs text-gray-800 line-clamp-3 bg-gray-50 p-2 rounded border border-gray-100">
                    {st.content}
                  </p>
                  <div className="text-[11px] text-emerald-800 bg-mint/40 p-1.5 rounded font-mono">
                    💬 Câu hỏi tương tác: {st.interactive_prompt}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mindmap Nodes Preview */}
          <div>
            <h4 className="font-black text-ink text-sm uppercase tracking-wide mb-2">
              Cấu trúc Mindmap ({generatedResult.mindmap.nodes.length} nút):
            </h4>
            <div className="p-4 bg-white rounded-xl border-2 border-ink flex flex-wrap gap-2">
              <span className="badge bg-ink text-white font-bold">{generatedResult.mindmap.root}</span>
              {generatedResult.mindmap.nodes.map((n) => (
                <span
                  key={n.id}
                  className={`badge text-xs border ${
                    n.category === 'category'
                      ? 'bg-lav text-ink font-bold'
                      : n.category === 'formula'
                      ? 'bg-peach text-ink font-mono'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {n.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Topics Database Directory */}
      <div className="retro-card bg-white p-6 md:p-8 border-2 border-ink">
        <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-ink/20">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-ink" />
            <h3 className="text-lg font-black text-ink">Kho Bài Học Hệ Thống ({topics.length})</h3>
          </div>
          <button
            onClick={loadTopics}
            className="text-xs font-bold text-gray-500 hover:text-ink flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Làm mới</span>
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {topics.map((tp) => (
            <div key={tp.id} className="py-3 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge bg-gray-100 text-gray-700 text-[10px]">Chương {tp.chapter}</span>
                  <span className="badge bg-mint text-ink text-[10px]">{tp.type}</span>
                  <span className="badge bg-emerald-100 text-emerald-800 text-[10px]">Đã xuất bản</span>
                </div>
                <h4 className="font-bold text-sm text-ink">{tp.title}</h4>
              </div>

              <Link
                href={`/lesson?topic=${tp.id}`}
                className="retro-btn bg-gray-100 hover:bg-gray-200 text-ink text-xs font-bold py-1.5 px-3 flex items-center gap-1 shrink-0"
              >
                <span>Học thử</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
