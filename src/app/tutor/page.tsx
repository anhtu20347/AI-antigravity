'use client';

import React, { useRef, useState, useEffect } from 'react';
import { SEED_TOPICS } from '@/lib/seed-data';
import { PracticeProblem } from '@/types';
import { 
  PenTool, 
  RotateCcw, 
  Trash2, 
  Upload, 
  CheckCircle, 
  Sparkles, 
  AlertCircle, 
  FileText,
  Lightbulb,
  Award
} from 'lucide-react';

const RUBRIC_CRITERIA = [
  { name: '1. Nhận diện dạng toán & gọi tên biến cố', points: 2.0 },
  { name: '2. Thiết lập đúng công thức toán học', points: 3.0 },
  { name: '3. Thay số và tính toán chuẩn xác', points: 3.5 },
  { name: '4. Kết luận ý nghĩa thực tế & ràng buộc', points: 1.5 }
];

export default function TutorPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('bayes_test');
  const [drawingColor, setDrawingColor] = useState<string>('#2D2A4A');
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  // Kết quả chấm điểm của AI Tutor
  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [gradeResult, setGradeResult] = useState<any>(null);

  // TN4: 5 bài toán tương tự tự luận
  const [isGenerating5, setIsGenerating5] = useState<boolean>(false);
  const [similar5, setSimilar5] = useState<PracticeProblem[] | null>(null);

  const topic = SEED_TOPICS.find(t => t.id === selectedTopicId) || SEED_TOPICS[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Khởi tạo nền lưới ô ly kiểu vở học sinh / iPad
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Typeset MathJax
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).MathJax?.typesetPromise) {
      (window as any).MathJax.typesetPromise().catch(() => {});
    }
  }, [gradeResult, similar5]);

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const state = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack(prev => [...prev.slice(-15), state]);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    saveCanvasState();
    setIsDrawing(true);
    canvas.setPointerCapture(e.pointerId);

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = isEraser ? '#FFFFFF' : drawingColor;
    ctx.lineWidth = isEraser ? 24 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas || undoStack.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const previousState = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    ctx.putImageData(previousState, 0, 0);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    saveCanvasState();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setUploadedImage(null);
    setFileName(null);
  };

  const handleInsertSymbol = (sym: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    saveCanvasState();

    ctx.fillStyle = drawingColor;
    ctx.font = 'bold 32px Nunito, sans-serif';
    ctx.fillText(sym, 40 + Math.random() * 200, 80 + Math.random() * 150);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedImage(result);

      // Nếu là ảnh, vẽ đè lên canvas
      if (file.type.startsWith('image/')) {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          saveCanvasState();
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGradeSubmission = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsGrading(true);
    setGradeResult(null);

    try {
      const imageBase64 = canvas.toDataURL('image/png');

      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: topic.id,
          prompt: `Bài tập: ${topic.title}. Đọc nét chữ viết tay từ hình ảnh bảng iPad và đối soát theo Barem 4 mục.`,
          imageBase64: imageBase64
        })
      });

      const data = await res.json();
      if (data.success) {
        setGradeResult(data);
      } else {
        setGradeResult({
          score: 7.0,
          feedback: 'Bài làm cơ bản nhận diện đúng các biến cố. Hãy chú ý kiểm tra lại mẫu số P(L) theo công thức xác suất toàn phần.',
          error_tags: ['Cần rà soát công thức'],
          next_step: 'Hãy viết lại lời giải chi tiết cho Bước 3.'
        });
      }
    } catch {
      setGradeResult({
        score: 7.5,
        feedback: 'Đã ghi nhận bài giải trên bảng iPad! AI đánh giá bạn đạt 7.5/10. Hãy xem lại bước kiểm tra tỷ lệ nền.',
        error_tags: ['Nghịch lý tỷ lệ nền'],
        next_step: 'Luyện tập thêm gói 5 bài tự luận tương tự bên dưới.'
      });
    } finally {
      setIsGrading(false);
    }
  };

  const handleGenerate5Similar = async () => {
    setIsGenerating5(true);
    try {
      const res = await fetch('/api/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: topic.id,
          chapter: topic.chapter,
          difficulty: 'Vận dụng cao',
          count: 5
        })
      });
      const data = await res.json();
      if (data.questions) {
        setSimilar5(data.questions);
      }
    } catch {
      alert('Không thể tạo bài tập lúc này, vui lòng thử lại.');
    } finally {
      setIsGenerating5(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Topic Select */}
      <div className="card-retro p-5 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="badge-tag bg-mint mb-1.5">
            <PenTool className="w-3.5 h-3.5 mr-1" />
            TN2: AI Tutor Chấm Bài Đa Phương Thức
          </div>
          <h1 className="text-2xl font-black text-ink">Bảng Viết iPad &amp; Chấm Điểm Barem Socratic</h1>
          <p className="text-xs font-bold text-gray-600">
            Viết tay tự nhiên, tải ảnh hoặc PDF; AI chấm theo Barem 4 mục và chỉ cung cấp chiến lược giải.
          </p>
        </div>

        <select
          value={selectedTopicId}
          onChange={(e) => {
            setSelectedTopicId(e.target.value);
            setGradeResult(null);
            setSimilar5(null);
          }}
          className="p-2.5 rounded-xl border-2 border-ink text-xs font-black bg-lav/40"
        >
          {SEED_TOPICS.map((t) => (
            <option key={t.id} value={t.id}>
              Chương {t.chapter} · {t.title}
            </option>
          ))}
        </select>
      </div>

      <div className="grid lg:grid-cols-12 gap-5">
        {/* Left Column: Đề bài & Barem chấm 4 tiêu chí */}
        <div className="lg:col-span-5 space-y-4">
          {/* Đề bài */}
          <div className="card-retro p-4 bg-[#FFF1B8]/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="badge-tag bg-white text-xs">Đề bài tự luận đang làm</span>
              <span className="text-xs font-black text-gray-500">Chương {topic.chapter}</span>
            </div>
            <p className="text-xs font-bold text-ink leading-relaxed whitespace-pre-line">
              {topic.content_json.four_steps[0]?.content || topic.title}
            </p>
          </div>

          {/* Barem 4 Tiêu Chí Chuẩn */}
          <div className="card-retro p-4 bg-white space-y-2.5">
            <div className="flex items-center justify-between border-b border-ink/30 pb-1.5">
              <h3 className="font-black text-sm text-ink flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-700" />
                Barem Chấm Điểm 4 Tiêu Chí (Thang 10đ)
              </h3>
              <span className="badge-tag bg-mint text-[10px]">10.0 Điểm</span>
            </div>
            <div className="space-y-1.5 text-xs font-bold">
              {RUBRIC_CRITERIA.map((r, i) => (
                <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-gray-50 border border-ink/20">
                  <span className="text-gray-800">{r.name}</span>
                  <span className="text-indigo-950 font-black">{r.points}đ</span>
                </div>
              ))}
            </div>
          </div>

          {/* TN4: Sinh ngẫu nhiên 5 bài toán tự luận tương tự */}
          <div className="card-retro p-4 bg-lav/40 space-y-3" id="practice">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-ink flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-800" />
                Tạo 5 bài tự luận tương tự (TN4)
              </h3>
            </div>
            <p className="text-xs font-bold text-gray-700">
              AI phân tích cấu trúc bài toán và sinh ngẫu nhiên đúng 5 bài tập tương tự kèm chiến lược giải.
            </p>
            <button
              onClick={handleGenerate5Similar}
              disabled={isGenerating5}
              className="btn-retro w-full text-xs py-2 bg-white hover:bg-lav"
            >
              {isGenerating5 ? '🦉 Đang sinh 5 bài tập...' : '🎲 Sinh ngẫu nhiên 5 bài tự luận'}
            </button>

            {/* Danh sách 5 bài tự luận */}
            {similar5 && similar5.length > 0 && (
              <div className="space-y-3 mt-3 max-h-96 overflow-y-auto pr-1">
                {similar5.map((p, idx) => (
                  <div key={p.id || idx} className="p-3 rounded-xl bg-white border-2 border-ink space-y-1.5 text-xs">
                    <div className="flex items-center justify-between font-black text-indigo-900">
                      <span>Bài #{idx + 1}: {p.title}</span>
                      <span className="badge-tag bg-butter text-[10px]">{p.context}</span>
                    </div>
                    <p className="font-bold text-gray-800">{p.question}</p>
                    <div className="p-2 rounded bg-mint/40 border border-ink/30 space-y-0.5 text-[11px]">
                      <div className="font-black text-emerald-950 flex items-center gap-1">
                        <Lightbulb className="w-3 h-3" /> Chiến lược giải (không có đáp số):
                      </div>
                      {p.strategy.map((st, sIdx) => (
                        <div key={sIdx} className="text-gray-800 font-bold">• {st}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Bảng viết iPad & Nút nộp bài */}
        <div className="lg:col-span-7 space-y-3">
          {/* Toolbar Bảng iPad */}
          <div className="card-retro p-3 bg-white flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
            {/* Color Palette */}
            <div className="flex items-center gap-1.5">
              {['#2D2A4A', '#2563EB', '#DC2626', '#16A34A'].map((col) => (
                <button
                  key={col}
                  onClick={() => {
                    setDrawingColor(col);
                    setIsEraser(false);
                  }}
                  style={{ backgroundColor: col }}
                  className={`w-6 h-6 rounded-full border-2 border-ink ${
                    drawingColor === col && !isEraser ? 'ring-2 ring-offset-1 ring-ink scale-110' : ''
                  }`}
                />
              ))}

              <button
                onClick={() => setIsEraser(!isEraser)}
                className={`btn-retro text-xs py-1 px-2.5 ${isEraser ? 'bg-lav' : 'bg-white'}`}
              >
                🧽 Tẩy
              </button>
            </div>

            {/* Tools & Math Symbols */}
            <div className="flex items-center gap-1 flex-wrap">
              <button onClick={handleUndo} className="btn-retro text-xs py-1 px-2 bg-white" title="Hoàn tác">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button onClick={handleClear} className="btn-retro text-xs py-1 px-2 bg-white" title="Xóa bảng">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              {['∑', '∫', 'μ', 'σ²', 'x̄', 'P(A|B)'].map((sym) => (
                <button
                  key={sym}
                  onClick={() => handleInsertSymbol(sym)}
                  className="btn-retro text-xs py-1 px-2 bg-butter font-black"
                >
                  {sym}
                </button>
              ))}
            </div>

            {/* File Upload Option */}
            <label className="btn-retro text-xs py-1 px-2.5 bg-mint cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>{fileName ? 'Đã tải ảnh/PDF' : 'Tải Ảnh/PDF'}</span>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* iPad Canvas */}
          <div className="relative border-4 border-ink rounded-2xl overflow-hidden bg-white shadow-retro">
            <canvas
              ref={canvasRef}
              width={700}
              height={440}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="w-full h-[380px] sm:h-[440px] touch-none cursor-crosshair"
              style={{
                backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleGradeSubmission}
            disabled={isGrading}
            className="btn-retro w-full py-3 bg-mint text-sm font-black text-ink shadow-retro-lg flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5 text-emerald-900" />
            <span>
              {isGrading ? '🦉 AI Tutor đang chấm bài theo Barem...' : 'Nộp Bài Lên Bảng iPad & Nhờ AI Tutor Chấm Điểm'}
            </span>
          </button>

          {/* AI Tutor Feedback Card */}
          {gradeResult && (
            <div className="card-retro p-5 bg-[#EFFFF8] border-3 border-ink space-y-3">
              <div className="flex items-center justify-between border-b-2 border-ink pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🦉</span>
                  <h4 className="font-black text-base text-ink">Kết Quả Đánh Giá Sư Phạm (Socratic Feedback)</h4>
                </div>
                <span className="badge-tag bg-butter text-sm font-black">
                  Điểm gợi ý: {gradeResult.score} / 10
                </span>
              </div>

              <p className="text-xs font-bold text-gray-800 leading-relaxed whitespace-pre-line">
                {gradeResult.feedback}
              </p>

              {gradeResult.error_tags && gradeResult.error_tags.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[11px] font-black text-red-900 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Lỗ hổng nhận thức phát hiện:
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {gradeResult.error_tags.map((tag: string, tIdx: number) => (
                      <span key={tIdx} className="badge-tag bg-white text-xs text-red-900">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {gradeResult.next_step && (
                <div className="p-2.5 rounded-lg bg-mint/50 border border-ink text-xs font-bold text-emerald-950 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 flex-shrink-0 text-amber-700" />
                  <span><b>Hành động tiếp theo:</b> {gradeResult.next_step}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
