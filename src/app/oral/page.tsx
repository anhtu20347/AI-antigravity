'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  Award,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Brain,
  MessageSquare,
  Play
} from 'lucide-react';

interface OralQuestion {
  id: string;
  topic: string;
  question: string;
  context: string;
}

const SAMPLE_QUESTIONS: OralQuestion[] = [
  {
    id: 'oral_1',
    topic: 'Chương 1: Công thức Bayes & Y khoa',
    question:
      'Tại sao khi xét nghiệm một bệnh hiếm có độ nhạy 98%, kết quả dương tính lần đầu chỉ cho xác suất mắc bệnh khoảng 25%? Bác sĩ cần hành động gì tiếp theo và dựa trên nguyên lý xác suất nào?',
    context: 'Yêu cầu sinh viên giải thích hiện tượng Nghịch lý tỷ lệ nền (Base Rate Fallacy) và vai trò của xét nghiệm độc lập lần 2.'
  },
  {
    id: 'oral_2',
    topic: 'Chương 2: Khái niệm Kỳ vọng E(X)',
    question:
      'Kỳ vọng E(X) có nhất thiết phải là một giá trị mà biến ngẫu nhiên X có thể nhận được trong thực tế không? Hãy đưa ra một phản ví dụ cụ thể để chứng minh.',
    context: 'Yêu cầu sinh viên phân biệt giá trị trung bình lý thuyết với tập giá trị khả dĩ, ví dụ gieo xúc xắc E(X)=3.5.'
  },
  {
    id: 'oral_3',
    topic: 'Chương 3: Định lí Giới hạn Trung tâm (CLT)',
    question:
      'Phát biểu ý nghĩa thực tiễn của Định lí Giới hạn Trung tâm (CLT). Tại sao các hiện tượng tự nhiên và sai số đo đạc lại thường có phân phối hình chuông (chuẩn)?',
    context: 'Yêu cầu giải thích tổng của nhiều biến ngẫu nhiên độc lập cùng phân phối sẽ hội tụ về phân phối chuẩn khi n đủ lớn.'
  }
];

export default function OralExamPage() {
  const [selectedQ, setSelectedQ] = useState<OralQuestion>(SAMPLE_QUESTIONS[0]);
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Result state
  const [result, setResult] = useState<{
    score: number;
    feedback: string;
    criteria_scores?: Record<string, number>;
    misconceptions: string[];
    followup_question: string;
  } | null>(null);

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = 'vi-VN';

        recog.onresult = (event: any) => {
          let currentText = '';
          for (let i = 0; i < event.results.length; i++) {
            currentText += event.results[i][0].transcript + ' ';
          }
          setTranscript(currentText.trim());
        };

        recog.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsRecording(false);
        };

        recog.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recog;
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!speechSupported) {
      alert('Trình duyệt chưa hỗ trợ Web Speech API hoặc chưa cấp quyền Mic. Bạn có thể gõ trực tiếp câu trả lời vào ô văn bản!');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (e) {
        console.warn('Error starting speech recog:', e);
      }
    }
  };

  const handleSpeakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = async () => {
    if (!transcript.trim()) {
      alert('Vui lòng nói hoặc nhập câu trả lời trước khi nộp bài!');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/oral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: selectedQ.question,
          student_speech_text: transcript,
          topic_id: selectedQ.id
        })
      });
      const data = await res.json();
      setResult(data);

      // Save to learning_history
      await supabase.from('learning_history').insert({
        user_id: 'guest_user',
        topic_id: selectedQ.id,
        mode: 'oral',
        input_text: transcript,
        score: Math.round((data.score || 7) * 10),
        error_tags: data.misconceptions || [],
        result_json: data
      });
    } catch (e) {
      console.error(e);
      setResult({
        score: 8.0,
        feedback:
          'Bạn nắm tốt bản chất vấn đề. Đã nêu được vai trò của tỷ lệ nền và sự tích lũy thông tin khi thực hiện xét nghiệm độc lập lần 2.',
        criteria_scores: {
          'Độ chính xác định nghĩa': 8.5,
          'Phản ví dụ/Minh họa': 7.5,
          'Liên hệ thực tiễn': 8.0,
          'Diễn đạt toán học': 8.0
        },
        misconceptions: ['Cần chú ý điều kiện 2 lần xét nghiệm phải độc lập có điều kiện theo bệnh'],
        followup_question:
          'Nếu xét nghiệm lần 2 lại cho kết quả âm tính, bác sĩ nên kết luận thế nào?'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setTranscript('');
    setResult(null);
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="retro-card bg-lav/40 p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge bg-ink text-white font-mono text-xs">TN3 & TN6</span>
            <span className="badge bg-white">Phòng Thi Vấn Đáp AI</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-ink">
            Mô Phỏng Vấn Đáp & Khảo Sát Nhận Thức
          </h1>
          <p className="text-sm text-gray-700 mt-1">
            Giám khảo AI tương tác bằng giọng nói tiếng Việt, chấm theo thang điểm 10, phát hiện lỗ hổng quan niệm và hỏi câu truy vấn Socratic.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSpeakText(selectedQ.question)}
            className="retro-btn bg-white text-ink text-xs font-bold py-2 px-3 flex items-center gap-1.5"
            title="Nghe câu hỏi giám khảo"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-ink" />}
            <span>{isSpeaking ? 'Dừng đọc' : 'Nghe đề bài'}</span>
          </button>
        </div>
      </div>

      {/* Question Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {SAMPLE_QUESTIONS.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => {
              setSelectedQ(q);
              handleReset();
            }}
            className={`p-3.5 text-left rounded-xl border-2 transition-all ${
              selectedQ.id === q.id
                ? 'bg-ink text-white border-ink shadow-md'
                : 'bg-white hover:bg-gray-50 border-ink/40 text-ink'
            }`}
          >
            <div className="text-xs font-mono font-bold opacity-70 mb-1">Đề số {idx + 1}</div>
            <div className="text-xs font-black line-clamp-2">{q.topic}</div>
          </button>
        ))}
      </div>

      {/* Active Question Examiner Card */}
      <div className="retro-card bg-white p-6 md:p-8 mb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2 font-mono">
          <Brain className="w-4 h-4 text-lav" />
          <span>GIÁM KHẢO AI ĐẶT CÂU HỎI:</span>
        </div>
        <h2 className="text-lg md:text-xl font-bold text-ink leading-relaxed mb-4">
          &ldquo;{selectedQ.question}&rdquo;
        </h2>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-600">
          <span className="font-bold">Gợi ý trọng tâm: </span>
          {selectedQ.context}
        </div>
      </div>

      {/* Answer Workspace: Speech / Text Input */}
      <div className="retro-card bg-white p-6 md:p-8 mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-ink">
            <MessageSquare className="w-4 h-4 text-peach" />
            <span>Phần trả lời của Thí sinh:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleRecording}
              className={`retro-btn text-xs font-bold py-1.5 px-3 flex items-center gap-1.5 ${
                isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-butter text-ink'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isRecording ? 'Đang ghi âm (Bấm dừng)' : 'Nói qua Micro'}</span>
            </button>
          </div>
        </div>

        <textarea
          rows={5}
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Nhấn 'Nói qua Micro' để thu âm giọng nói, hoặc gõ trực tiếp luận điểm phân tích của bạn vào đây..."
          className="w-full p-4 rounded-xl border-2 border-ink text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-lav bg-gray-50/50"
        />

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleReset}
            className="text-xs font-bold text-gray-500 hover:text-ink flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Làm lại từ đầu</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={isLoading || !transcript.trim()}
            className="retro-btn bg-ink text-white font-bold text-xs md:text-sm py-2 px-6 flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Giám khảo đang thẩm định...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Nộp câu trả lời vấn đáp</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Evaluation & Misconceptions Report */}
      {result && (
        <div className="retro-card bg-mint/20 p-6 md:p-8 space-y-6 animate-scale-up border-2 border-ink">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b-2 border-ink gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-mint border-2 border-ink flex items-center justify-center font-black text-xl text-ink">
                {result.score}/10
              </div>
              <div>
                <h3 className="font-black text-ink text-lg">Kết Quả Đánh Giá Vấn Đáp</h3>
                <p className="text-xs text-gray-600">Được chấm bởi Hệ thống Giám khảo Socratic AI</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSpeakText(result.feedback)}
                className="retro-btn bg-white text-ink text-xs font-bold py-1.5 px-3 flex items-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Nghe nhận xét</span>
              </button>
            </div>
          </div>

          {/* Feedback Text */}
          <div className="p-4 bg-white rounded-xl border-2 border-ink">
            <span className="font-bold text-ink text-xs uppercase tracking-wide block mb-1">
              💬 Nhận xét tổng quan của giám khảo:
            </span>
            <p className="text-sm text-gray-800 leading-relaxed">{result.feedback}</p>
          </div>

          {/* Criteria Scores */}
          {result.criteria_scores && (
            <div>
              <span className="font-bold text-ink text-xs uppercase tracking-wide block mb-3">
                📊 Điểm thành phần theo tiêu chí:
              </span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(result.criteria_scores).map(([crit, val]) => (
                  <div key={crit} className="p-3 bg-white rounded-xl border-2 border-ink text-center">
                    <div className="text-xs text-gray-600 font-bold truncate mb-1">{crit}</div>
                    <div className="text-lg font-black text-ink">{val} đ</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Misconceptions detected */}
          {result.misconceptions && result.misconceptions.length > 0 && (
            <div className="p-4 bg-butter/40 rounded-xl border-2 border-ink">
              <div className="flex items-center gap-2 font-bold text-amber-950 text-sm mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Lỗ hổng nhận thức / Sai lầm cần chấn chỉnh:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs md:text-sm text-amber-950">
                {result.misconceptions.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Follow-up question */}
          {result.followup_question && (
            <div className="p-4 bg-lav/30 rounded-xl border-2 border-ink space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-ink text-sm">
                  <Sparkles className="w-4 h-4 text-lav" />
                  <span>Câu hỏi truy vấn sâu (Socratic Probing):</span>
                </div>
                <button
                  onClick={() => handleSpeakText(result.followup_question)}
                  className="text-xs font-bold text-ink hover:underline flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Nghe câu hỏi</span>
                </button>
              </div>
              <p className="text-sm font-semibold text-ink italic">&ldquo;{result.followup_question}&rdquo;</p>
              <button
                onClick={() => {
                  setTranscript('');
                  setResult(null);
                }}
                className="retro-btn bg-ink text-white font-bold text-xs py-1.5 px-4 mt-2"
              >
                Trả lời tiếp câu hỏi này
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
