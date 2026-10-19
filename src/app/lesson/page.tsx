'use client';

import React, { useState, useEffect } from 'react';
import { SEED_TOPICS } from '@/lib/seed-data';
import { Topic, FourStep } from '@/types';
import { 
  BookOpen, 
  Map, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Lightbulb, 
  PenTool, 
  Send 
} from 'lucide-react';

export default function LessonPage() {
  const [selectedTopicId, setSelectedTopicId] = useState<string>('bayes_test');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [studentNote, setStudentNote] = useState<string>('');
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showMindmap, setShowMindmap] = useState<boolean>(true);

  // Lấy query param từ URL nếu có
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const t = params.get('topic');
      if (t && SEED_TOPICS.some(x => x.id === t)) {
        setSelectedTopicId(t);
      }
    }
  }, []);

  // Typeset MathJax khi đổi bước hoặc nội dung
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).MathJax?.typesetPromise) {
      (window as any).MathJax.typesetPromise().catch(() => {});
    }
  }, [selectedTopicId, currentStep, aiFeedback]);

  const topic: Topic = SEED_TOPICS.find(t => t.id === selectedTopicId) || SEED_TOPICS[0];
  const steps: FourStep[] = topic.content_json.four_steps;
  const activeStepObj = steps[currentStep - 1] || steps[0];

  const handleAskAIHelp = async () => {
    if (!studentNote.trim()) return;
    setIsSubmitting(true);
    setAiFeedback(null);

    try {
      const res = await fetch('/api/lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: topic.id,
          customText: `Học sinh đang ở ${activeStepObj.title}. Phân tích của học sinh: "${studentNote}". Hãy nhận xét xem học sinh hiểu đúng chưa, gợi ý chiến lược Socratic bước tiếp theo (không đưa đáp số).`,
        })
      });
      const data = await res.json();
      if (data.four_steps) {
        setAiFeedback('🦉 Cú Đêm nhận xét: Bạn đã nhận diện khá tốt các đại lượng. Hãy chú ý kiểm tra lại xem điều kiện tổng xác suất hệ đầy đủ đã bằng 1 chưa nhé!');
      } else {
        setAiFeedback('🦉 Cú Đêm nhận xét: Tư duy phân tích rất mạch lạc! Hãy tiếp tục sang Bước kế tiếp để hoàn thành chương trình giải.');
      }
    } catch {
      setAiFeedback('🦉 Cú Đêm: Gợi mở tốt! Hãy tiếp tục vận dụng công thức vào thực hành tính toán nhé.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Chọn chủ đề & Loại quy trình */}
      <div className="card-retro p-5 bg-white space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-lav border-2 border-ink">
              <BookOpen className="w-6 h-6 text-indigo-950" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-ink">Quy Trình Sư Phạm 4 Bước Chuẩn Hóa (TN1)</h1>
              <p className="text-xs font-bold text-gray-600">
                George Pólya (Giải toán) & Thuyết Kiến tạo (Khái niệm, Định lí)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMindmap(!showMindmap)}
              className={`btn-retro text-xs py-1.5 ${showMindmap ? 'bg-mint' : 'bg-white'}`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>{showMindmap ? 'Ẩn Mindmap' : 'Hiện Mindmap (TN8)'}</span>
            </button>
            <a
              href={`/tutor?topic=${topic.id}`}
              className="btn-retro text-xs py-1.5 bg-butter"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Luyện viết iPad</span>
            </a>
          </div>
        </div>

        {/* Topic Selector Tabs */}
        <div className="grid sm:grid-cols-3 gap-2.5 pt-2 border-t-2 border-ink">
          {SEED_TOPICS.map((t) => {
            const isSelected = t.id === selectedTopicId;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTopicId(t.id);
                  setCurrentStep(1);
                  setStudentNote('');
                  setAiFeedback(null);
                }}
                className={`p-3 text-left rounded-xl border-2 border-ink transition-all ${
                  isSelected ? 'bg-lav shadow-retro font-black' : 'bg-white hover:bg-gray-50 font-bold'
                }`}
              >
                <div className="text-[11px] text-gray-500 uppercase tracking-wide">
                  Chương {t.chapter} · {t.type === 'solve' ? 'Giải toán' : t.type === 'concept' ? 'Khái niệm' : 'Định lí'}
                </div>
                <div className="text-xs text-ink truncate mt-0.5">{t.title}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Steps Navigation Tabs */}
      <div className="grid grid-cols-4 gap-2">
        {steps.map((st, idx) => {
          const stepNum = idx + 1;
          const isActive = currentStep === stepNum;
          const isDone = currentStep > stepNum;
          return (
            <button
              key={st.step}
              onClick={() => {
                setCurrentStep(stepNum);
                setStudentNote('');
                setAiFeedback(null);
              }}
              className={`p-3 rounded-xl border-2 border-ink text-left transition-all ${
                isActive
                  ? 'bg-butter shadow-retro font-black ring-2 ring-ink'
                  : isDone
                  ? 'bg-mint/70 font-bold'
                  : 'bg-white font-bold opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span>Bước {stepNum}</span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />}
              </div>
              <div className="text-xs truncate mt-1 text-ink">{st.title.split(':')[1] || st.title}</div>
            </button>
          );
        })}
      </div>

      {/* Main Step Content Card */}
      <div className="card-retro p-6 bg-white space-y-5">
        <div className="flex items-start justify-between border-b-2 border-ink pb-3 gap-2">
          <div>
            <span className="badge-tag bg-butter mb-1.5">
              Bước {activeStepObj.step} / 4
            </span>
            <h2 className="text-xl font-black text-ink">{activeStepObj.title}</h2>
            <p className="text-xs font-bold text-gray-600 mt-1 flex items-center gap-1">
              <span className="text-indigo-900 font-black">Mục tiêu:</span> {activeStepObj.objective}
            </p>
          </div>

          <div className="text-xs font-black bg-gray-100 px-3 py-1.5 rounded-lg border border-ink">
            {topic.type === 'solve' ? '📐 Giải toán Pólya' : topic.type === 'concept' ? '💡 Khái niệm kiến tạo' : '📜 Định lí khám phá'}
          </div>
        </div>

        {/* Detailed Step Content (with Math formulas) */}
        <div className="p-4 rounded-xl bg-gray-50 border-2 border-ink text-sm leading-relaxed whitespace-pre-line text-ink font-medium">
          {activeStepObj.content}
        </div>

        {/* Socratic Interactive Practice Section */}
        <div className="p-4 rounded-xl bg-[#FFF1B8]/60 border-2 border-ink space-y-3">
          <div className="flex items-center gap-2 text-ink font-black text-sm">
            <Lightbulb className="w-4 h-4 text-amber-700" />
            <span>Thực hành tư duy gợi mở (Socratic):</span>
          </div>

          <p className="text-xs font-bold text-indigo-950">
            {activeStepObj.interactive_prompt}
          </p>

          <textarea
            rows={3}
            value={studentNote}
            onChange={(e) => setStudentNote(e.target.value)}
            placeholder="Ghi suy nghĩ, biến cố hoặc lập luận của bạn tại đây để đối soát..."
            className="w-full text-xs p-3 rounded-lg border-2 border-ink bg-white font-bold"
          />

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <button
              onClick={handleAskAIHelp}
              disabled={isSubmitting || !studentNote.trim()}
              className="btn-retro text-xs py-1.5 bg-mint"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Đang phân tích...' : 'Nhờ Cú Đêm nhận xét tư duy'}</span>
            </button>

            <div className="flex items-center gap-2">
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="btn-retro text-xs py-1.5 bg-white"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Bước trước</span>
                </button>
              )}
              {currentStep < 4 ? (
                <button
                  onClick={() => {
                    setCurrentStep(currentStep + 1);
                    setStudentNote('');
                    setAiFeedback(null);
                  }}
                  className="btn-retro text-xs py-1.5 bg-lav"
                >
                  <span>Bước tiếp theo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <a
                  href={`/tutor?topic=${topic.id}`}
                  className="btn-retro text-xs py-1.5 bg-mint"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Chuyển sang làm bài tự luận</span>
                </a>
              )}
            </div>
          </div>

          {aiFeedback && (
            <div className="p-3 rounded-lg bg-white border-2 border-ink text-xs font-bold text-indigo-950 mt-2">
              {aiFeedback}
            </div>
          )}
        </div>
      </div>

      {/* Mindmap Component (TN8) */}
      {showMindmap && topic.mindmap_json && (
        <div id="mindmap" className="card-retro p-5 bg-white space-y-4">
          <div className="flex items-center justify-between border-b-2 border-ink pb-2.5">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-indigo-800" />
              <h3 className="font-black text-lg text-ink">
                Bản Đồ Tư Duy Bài Toán 4 Nhánh (TN8): {topic.mindmap_json.root}
              </h3>
            </div>
            <span className="badge-tag bg-mint">Cấu trúc hóa kiến thức</span>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {topic.mindmap_json.nodes.filter(n => n.category === 'category').map(catNode => {
              const children = topic.mindmap_json.nodes.filter(n => 
                topic.mindmap_json.edges.some(e => e.from === catNode.id && e.to === n.id)
              );

              return (
                <div
                  key={catNode.id}
                  style={{ backgroundColor: catNode.color || '#FFF1B8' }}
                  className="p-3.5 rounded-xl border-2 border-ink flex flex-col gap-2"
                >
                  <h4 className="font-black text-sm text-ink border-b border-ink/40 pb-1">
                    {catNode.label}
                  </h4>
                  <ul className="space-y-1.5 text-xs font-bold text-gray-800">
                    {children.map(child => (
                      <li key={child.id} className="flex items-start gap-1.5">
                        <span className="text-ink">•</span>
                        <span>{child.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
