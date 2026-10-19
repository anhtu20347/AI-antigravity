'use client';

import React, { useState, useEffect } from 'react';
import { SEED_QUIZZES } from '@/lib/seed-data';
import { QuizQuestion } from '@/types';
import { supabase, isDemoMode } from '@/lib/supabase';
import {
  CheckCircle,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Filter,
  Brain,
  Lightbulb,
  X
} from 'lucide-react';

declare global {
  interface Window {
    MathJax?: {
      typesetPromise?: () => Promise<void>;
    };
  }
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>(SEED_QUIZZES);
  const [filteredQuestions, setFilteredQuestions] = useState<QuizQuestion[]>(SEED_QUIZZES);
  const [selectedChapter, setSelectedChapter] = useState<number | 'all'>('all');
  const [selectedDiff, setSelectedDiff] = useState<string | 'all'>('all');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // Modal State for AI "Tại sao?"
  const [showExplainModal, setShowExplainModal] = useState(false);
  const [explainLoading, setExplainLoading] = useState(false);
  const [explanationData, setExplanationData] = useState<{
    why_wrong?: string;
    underlying_misconception?: string;
    correct_logic?: string;
    memory_rule?: string;
  } | null>(null);

  // Filter effect
  useEffect(() => {
    let list = [...questions];
    if (selectedChapter !== 'all') {
      list = list.filter((q) => q.chapter === selectedChapter);
    }
    if (selectedDiff !== 'all') {
      list = list.filter((q) => q.difficulty === selectedDiff);
    }
    setFilteredQuestions(list);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
  }, [selectedChapter, selectedDiff, questions]);

  // MathJax re-render
  useEffect(() => {
    if (typeof window !== 'undefined' && window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise().catch((err) => console.debug('MathJax error:', err));
    }
  }, [currentIndex, isAnswered, explanationData]);

  const currentQ = filteredQuestions[currentIndex];

  const handleSelect = async (optIdx: number) => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(optIdx);
    setIsAnswered(true);

    const isCorrect = optIdx === currentQ.correct_index;
    if (isCorrect) {
      setScore((prev) => prev + 10);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    // Record history
    try {
      const errorTag = isCorrect ? [] : [`sai_chuong_${currentQ.chapter}`, `trac_nghiem_${currentQ.difficulty}`];
      await supabase.from('learning_history').insert({
        user_id: 'guest_user',
        topic_id: currentQ.topic_id || 'general',
        mode: 'quiz',
        input_text: `Câu hỏi: ${currentQ.question} - Chọn: ${currentQ.options[optIdx]}`,
        score: isCorrect ? 100 : 0,
        error_tags: errorTag,
        result_json: {
          question_id: currentQ.id,
          selected: optIdx,
          correct: currentQ.correct_index,
          isCorrect
        }
      });
    } catch (e) {
      console.warn('History save ignored:', e);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setExplanationData(null);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setExplanationData(null);
  };

  // Trigger AI Socratic Distractor Analysis
  const handleAskWhy = async () => {
    if (!currentQ || selectedOption === null) return;
    setShowExplainModal(true);
    setExplainLoading(true);
    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQ.question,
          selected_option: currentQ.options[selectedOption],
          correct_option: currentQ.options[currentQ.correct_index],
          context: `Độ khó: ${currentQ.difficulty}, Chương: ${currentQ.chapter}. Giải thích sẵn: ${currentQ.explanation}`
        })
      });
      const data = await res.json();
      setExplanationData(data);
    } catch (err) {
      setExplanationData({
        why_wrong: 'Phương án này phản ánh trực giác vội vàng hoặc nhầm lẫn giữa công thức biến rời rạc và liên tục.',
        underlying_misconception: 'Lẫn lộn giữa xác suất điều kiện và xác suất đồng thời.',
        correct_logic: currentQ.explanation,
        memory_rule: 'Nhớ kiểm tra điều kiện hệ đầy đủ trước khi chọn đáp án.'
      });
    } finally {
      setExplainLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="retro-card bg-peach/40 p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge bg-ink text-white font-mono text-xs">TN5</span>
            <span className="badge bg-white">Luyện tập trắc nghiệm XSTK</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-ink">
            Trắc Nghiệm Tương Tác & Phân Tích Bẫy
          </h1>
          <p className="text-sm text-gray-700 mt-1">
            Chấm điểm tức thì, giải thích toán học logic và phân tích bẫy nhận thức với nút{' '}
            <strong>&quot;Tại sao?&quot; AI</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border-2 border-ink shadow-sm">
          <div className="text-center px-3 border-r border-gray-200">
            <div className="text-xs text-gray-500 font-bold uppercase">Điểm số</div>
            <div className="text-2xl font-black text-ink">{score}</div>
          </div>
          <div className="text-center px-3">
            <div className="text-xs text-gray-500 font-bold uppercase">Chuỗi đúng 🔥</div>
            <div className="text-2xl font-black text-peach">{streak}</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-4 bg-white rounded-xl border-2 border-ink shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-ink">
          <Filter className="w-4 h-4 text-lav" />
          <span>Lọc câu hỏi:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border-2 border-ink bg-gray-50 focus:outline-none"
          >
            <option value="all">Tất cả các Chương (1 - 6)</option>
            <option value="1">Chương 1: Biến cố & Xác suất (Bayes)</option>
            <option value="2">Chương 2: Biến ngẫu nhiên & Phân phối</option>
            <option value="3">Chương 3: Định lí giới hạn (CLT, Chuẩn)</option>
            <option value="4">Chương 4: Lý thuyết mẫu</option>
            <option value="5">Chương 5: Ước lượng tham số</option>
            <option value="6">Chương 6: Kiểm định giả thuyết</option>
          </select>

          <select
            value={selectedDiff}
            onChange={(e) => setSelectedDiff(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border-2 border-ink bg-gray-50 focus:outline-none"
          >
            <option value="all">Mọi độ khó</option>
            <option value="Cơ bản">Cơ bản</option>
            <option value="Vận dụng">Vận dụng</option>
            <option value="Vận dụng cao">Vận dụng cao</option>
          </select>
        </div>

        <div className="text-xs font-mono text-gray-500">
          Tổng số: <strong>{filteredQuestions.length} câu</strong>
        </div>
      </div>

      {/* Main Question Card */}
      {filteredQuestions.length === 0 ? (
        <div className="retro-card bg-white p-12 text-center">
          <p className="text-gray-500 font-medium">Không tìm thấy câu hỏi phù hợp bộ lọc.</p>
          <button
            onClick={() => {
              setSelectedChapter('all');
              setSelectedDiff('all');
            }}
            className="retro-btn bg-mint text-ink font-bold text-xs mt-4"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      ) : (
        <div className="retro-card bg-white p-6 md:p-8">
          {/* Question Meta */}
          <div className="flex items-center justify-between text-xs text-gray-500 font-mono pb-4 border-b border-gray-100 mb-6">
            <span className="font-bold text-ink">
              Câu {currentIndex + 1} / {filteredQuestions.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="badge bg-lav/30 text-ink">Chương {currentQ.chapter}</span>
              <span
                className={`badge ${
                  currentQ.difficulty === 'Vận dụng cao'
                    ? 'bg-peach text-ink'
                    : currentQ.difficulty === 'Vận dụng'
                    ? 'bg-butter text-ink'
                    : 'bg-mint text-ink'
                }`}
              >
                {currentQ.difficulty}
              </span>
            </div>
          </div>

          {/* Question Text */}
          <h2 className="text-lg md:text-xl font-bold text-ink leading-relaxed mb-6">
            {currentQ.question}
          </h2>

          {/* Options Grid */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((option, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correct_index;

              let style = 'bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-800';
              if (isAnswered) {
                if (isCorrect) {
                  style = 'bg-mint/40 border-emerald-600 text-emerald-950 font-bold';
                } else if (isSelected && !isCorrect) {
                  style = 'bg-red-50 border-red-500 text-red-950';
                } else {
                  style = 'bg-gray-50 border-gray-200 text-gray-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3.5 ${style}`}
                >
                  <span
                    className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center font-mono font-bold text-xs border ${
                      isAnswered && isCorrect
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : isAnswered && isSelected && !isCorrect
                        ? 'bg-red-500 text-white border-red-600'
                        : 'bg-white text-ink border-gray-300'
                    }`}
                  >
                    {letter}
                  </span>
                  <div className="flex-1 text-sm md:text-base pt-0.5">{option}</div>
                  {isAnswered && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box when Answered */}
          {isAnswered && (
            <div className="p-5 rounded-xl bg-butter/30 border-2 border-ink space-y-3 animate-fade-in mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-ink font-bold text-sm">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>Giải thích toán học chi tiết:</span>
                </div>
                {selectedOption !== currentQ.correct_index && (
                  <button
                    onClick={handleAskWhy}
                    className="retro-btn bg-lav text-ink font-bold text-xs py-1.5 px-3 flex items-center gap-1.5"
                  >
                    <Brain className="w-3.5 h-3.5" />
                    <span>Tại sao đáp án này sai? (Hỏi AI)</span>
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-800 leading-relaxed pl-6">{currentQ.explanation}</p>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              onClick={handleRestart}
              className="text-xs font-bold text-gray-500 hover:text-ink flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Bắt đầu lại</span>
            </button>

            {isAnswered && (
              <button
                onClick={handleNext}
                disabled={currentIndex >= filteredQuestions.length - 1}
                className="retro-btn bg-ink text-white font-bold text-xs md:text-sm py-2 px-5 flex items-center gap-2 disabled:opacity-40"
              >
                <span>{currentIndex < filteredQuestions.length - 1 ? 'Câu tiếp theo' : 'Hoàn thành bài tập'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* AI Deep "Tại sao?" Modal */}
      {showExplainModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="retro-card bg-white max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b-2 border-ink mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-lav" />
                <h3 className="font-black text-ink text-lg">AI Phân Tích Bẫy Nhận Thức</h3>
              </div>
              <button
                onClick={() => setShowExplainModal(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {explainLoading ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-8 h-8 border-4 border-lav border-t-ink rounded-full animate-spin mx-auto" />
                <p className="text-xs font-mono text-gray-600">Đang giải mã bẫy nhận thức và cấu trúc sai lầm...</p>
              </div>
            ) : explanationData ? (
              <div className="space-y-4 text-sm">
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <span className="font-bold text-red-900 block mb-1">❌ Vì sao phương án đã chọn lại sai?</span>
                  <p className="text-red-950 text-xs md:text-sm">{explanationData.why_wrong}</p>
                </div>

                <div className="p-3 bg-lav/20 rounded-lg border border-lav">
                  <span className="font-bold text-ink block mb-1">🧠 Bẫy trực giác / Sai lầm gốc rễ:</span>
                  <p className="text-gray-800 text-xs md:text-sm">{explanationData.underlying_misconception}</p>
                </div>

                <div className="p-3 bg-mint/30 rounded-lg border border-mint">
                  <span className="font-bold text-emerald-900 block mb-1">💡 Hướng tư duy đúng:</span>
                  <p className="text-emerald-950 text-xs md:text-sm">{explanationData.correct_logic}</p>
                </div>

                {explanationData.memory_rule && (
                  <div className="p-3 bg-butter/40 rounded-lg border border-amber-300">
                    <span className="font-bold text-amber-900 block mb-1">📌 Mẹo ghi nhớ / Nguyên tắc vàng:</span>
                    <p className="text-amber-950 text-xs md:text-sm italic">{explanationData.memory_rule}</p>
                  </div>
                )}

                <button
                  onClick={() => setShowExplainModal(false)}
                  className="w-full retro-btn bg-ink text-white font-bold text-xs py-2 mt-2"
                >
                  Đã hiểu bẫy này
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
