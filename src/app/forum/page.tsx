'use client';

import React, { useState, useEffect } from 'react';
import { supabase, isDemoMode } from '@/lib/supabase';
import { ForumPost, CommentRecord } from '@/types';
import {
  MessageSquare,
  PlusCircle,
  Send,
  User,
  Clock,
  ThumbsUp,
  Tag,
  Search,
  MessageCircle,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const SEED_FORUM_POSTS: ForumPost[] = [
  {
    id: 'post_1',
    user_id: 'user_1',
    author_name: 'Trần Minh Anh (K65 NEU)',
    title: 'Làm sao để không bị nhầm lẫn giữa Biến cố Độc lập và Biến cố Xung khắc?',
    body: 'Em hay bị nhầm hai khái niệm này khi làm trắc nghiệm. Thầy cô và các bạn cho em hỏi: Nếu hai biến cố xung khắc có xác suất dương thì chúng có độc lập được không ạ?',
    topic_id: 'bayes_test',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    comments: [
      {
        id: 'c1',
        post_id: 'post_1',
        user_id: 'user_tutor',
        author_name: 'AI Tutor Socratic 🤖',
        body: 'Câu hỏi rất hay! Hãy nhớ nguyên tắc: "Xung khắc tức là P(A ∩ B) = 0". Nếu A và B độc lập thì P(A ∩ B) = P(A) * P(B). Vì P(A) > 0 và P(B) > 0 nên tích của chúng > 0, không thể bằng 0 được! Do đó hai biến cố có xác suất dương đã xung khắc thì KHÔNG THỂ độc lập.',
        created_at: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: 'c2',
        post_id: 'post_1',
        user_id: 'user_2',
        author_name: 'Lê Hoàng Nam',
        body: 'Cảm ơn AI Tutor, giải thích ngắn gọn bằng công thức thế này dễ nhớ hơn hẳn!',
        created_at: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    ]
  },
  {
    id: 'post_2',
    user_id: 'user_3',
    author_name: 'Nguyễn Văn Đạt (Bách Khoa)',
    title: 'Giải thích trực giác vì sao chia (n - 1) ở phương sai mẫu lại không chệch?',
    body: 'Em hiểu phép chứng minh đại số E(s^2) = sigma^2 nhưng trực giác hình học hoặc xác suất đằng sau bậc tự do (n - 1) là gì vậy mọi người?',
    topic_id: 'general',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    comments: [
      {
        id: 'c3',
        post_id: 'post_2',
        user_id: 'user_tutor',
        author_name: 'AI Tutor Socratic 🤖',
        body: 'Trực giác là: Các điểm dữ liệu x_i trong mẫu luôn có xu hướng "gần" với trung bình mẫu x̄ hơn là gần với trung bình tổng thể μ thực sự. Do đó nếu chia cho n, độ lệch bình phương sẽ bị "đánh giá thấp" (chệch dưới). Ta phải chia cho (n - 1) để phóng to giá trị lên bù lại phần bậc tự do đã bị mất khi ước lượng x̄.',
        created_at: new Date(Date.now() - 3600000 * 20).toISOString()
      }
    ]
  },
  {
    id: 'post_3',
    user_id: 'user_4',
    author_name: 'Hoàng Phương Thảo',
    title: 'Kinh nghiệm luyện thi vấn đáp XSTK với AI Tutor cực hiệu quả',
    body: 'Mình vừa thử tính năng Phòng thi vấn đáp ở tab Oral Exam, AI hỏi truy vấn rất sâu về Định lí Giới hạn Trung tâm. Khuyên các bạn nên bật mic luyện phản xạ nói định nghĩa bằng lời trước khi vào phòng thi thật!',
    topic_id: 'clt_theorem',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    comments: []
  }
];

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>(SEED_FORUM_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPostId, setExpandedPostId] = useState<string | null>('post_1');

  // Form states
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newTopic, setNewTopic] = useState('Chương 1: Xác suất');
  const [authorName, setAuthorName] = useState('Sinh viên Khách');

  // Comment input
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;

    const newPost: ForumPost = {
      id: `post_${Date.now()}`,
      user_id: 'guest_user',
      author_name: authorName.trim() || 'Sinh viên Ẩn danh',
      title: newTitle.trim(),
      body: newBody.trim(),
      topic_id: newTopic,
      created_at: new Date().toISOString(),
      comments: []
    };

    setPosts([newPost, ...posts]);
    setNewTitle('');
    setNewBody('');
    setShowNewPostForm(false);
    setExpandedPostId(newPost.id);
  };

  const handleAddComment = (postId: string) => {
    const text = commentText[postId]?.trim();
    if (!text) return;

    const newComment: CommentRecord = {
      id: `c_${Date.now()}`,
      post_id: postId,
      user_id: 'guest_user',
      author_name: authorName.trim() || 'Bạn',
      body: text,
      created_at: new Date().toISOString()
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...(p.comments || []), newComment]
          };
        }
        return p;
      })
    );

    setCommentText((prev) => ({ ...prev, [postId]: '' }));
  };

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="retro-card bg-mint/40 p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge bg-ink text-white font-mono text-xs">TN9</span>
            <span className="badge bg-white">Diễn Đàn Thảo Luận XSTK</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-ink">
            Giao Lưu, Hỏi Đáp & Thảo Luận Bẫy Toán Học
          </h1>
          <p className="text-sm text-gray-700 mt-1">
            Không gian trao đổi giữa sinh viên và trợ lý AI Socratic. Đặt câu hỏi về bẫy toán học và nhận lời giải đáp tận tình.
          </p>
        </div>

        <button
          onClick={() => setShowNewPostForm(!showNewPostForm)}
          className="retro-btn bg-ink text-white font-bold text-xs md:text-sm py-2.5 px-5 flex items-center gap-2 shrink-0 shadow-md"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showNewPostForm ? 'Đóng biểu mẫu' : 'Đăng câu hỏi mới'}</span>
        </button>
      </div>

      {/* New Post Form Modal/Panel */}
      {showNewPostForm && (
        <form
          onSubmit={handleCreatePost}
          className="retro-card bg-white p-6 md:p-8 mb-8 border-2 border-ink space-y-4 animate-scale-up"
        >
          <h3 className="text-lg font-black text-ink flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-mint" />
            <span>Tạo chủ đề thảo luận mới</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Tên của bạn / Nickname:</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full p-2.5 rounded-lg border-2 border-ink text-sm bg-gray-50 focus:outline-none"
                placeholder="Ví dụ: Minh Khôi (ĐH Kinh Tế)"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Chủ đề bài học:</label>
              <select
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                className="w-full p-2.5 rounded-lg border-2 border-ink text-sm bg-gray-50 focus:outline-none"
              >
                <option value="Chương 1: Xác suất">Chương 1: Biến cố & Bayes</option>
                <option value="Chương 2: Kỳ vọng E(X)">Chương 2: Biến ngẫu nhiên & E(X)</option>
                <option value="Chương 3: CLT">Chương 3: Định lí giới hạn CLT</option>
                <option value="Chương 4-6: Thống kê">Chương 4-6: Ước lượng & Kiểm định</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Tiêu đề thắc mắc:</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-2.5 rounded-lg border-2 border-ink text-sm bg-gray-50 focus:outline-none"
              placeholder="Ví dụ: Giúp em giải thích bài toán 3 cánh cửa Monty Hall..."
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Chi tiết câu hỏi / băn khoăn:</label>
            <textarea
              required
              rows={4}
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              className="w-full p-3 rounded-lg border-2 border-ink text-sm bg-gray-50 focus:outline-none"
              placeholder="Mô tả cụ thể đề bài, bước bạn đang vướng mắc hoặc giả thuyết bạn đang phân vân..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowNewPostForm(false)}
              className="retro-btn bg-gray-200 text-ink font-bold text-xs py-2 px-4"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="retro-btn bg-ink text-white font-bold text-xs py-2 px-6 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Đăng thảo luận</span>
            </button>
          </div>
        </form>
      )}

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm câu hỏi, từ khóa (Bayes, kỳ vọng, sai lầm loại 1, CLT)..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-ink text-sm bg-white focus:outline-none focus:ring-2 focus:ring-mint"
        />
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const isExpanded = expandedPostId === post.id;
          const commentCount = post.comments?.length || 0;

          return (
            <div key={post.id} className="retro-card bg-white p-6 border-2 border-ink space-y-4">
              {/* Post Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="badge bg-mint/40 text-ink text-[11px] font-bold">
                      {post.topic_id || 'Thảo luận chung'}
                    </span>
                    <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(post.created_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <h3 className="text-base md:text-lg font-black text-ink">{post.title}</h3>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Đăng bởi: <strong className="text-ink">{post.author_name}</strong>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                  className="retro-btn bg-gray-100 hover:bg-gray-200 text-ink text-xs font-bold py-1.5 px-3 flex items-center gap-1 shrink-0"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{commentCount} phản hồi</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Post Body */}
              <p className="text-sm text-gray-800 leading-relaxed bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                {post.body}
              </p>

              {/* Comments Section */}
              {isExpanded && (
                <div className="pt-4 border-t-2 border-ink/20 space-y-3 animate-fade-in">
                  <span className="font-bold text-xs text-gray-500 uppercase tracking-wide block">
                    Bình luận & Giải đáp ({commentCount}):
                  </span>

                  {post.comments && post.comments.length > 0 ? (
                    <div className="space-y-2.5">
                      {post.comments.map((c) => (
                        <div
                          key={c.id}
                          className={`p-3.5 rounded-xl border-2 text-xs md:text-sm ${
                            c.author_name?.includes('AI Tutor')
                              ? 'bg-lav/20 border-lav'
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-ink flex items-center gap-1">
                              {c.author_name?.includes('AI Tutor') && <Sparkles className="w-3.5 h-3.5 text-lav" />}
                              {c.author_name}
                            </span>
                            <span className="text-[10px] font-mono text-gray-400">
                              {new Date(c.created_at).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="text-gray-800 leading-relaxed">{c.body}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">Chưa có bình luận nào. Hãy là người đầu tiên trả lời!</p>
                  )}

                  {/* Comment Input */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      value={commentText[post.id] || ''}
                      onChange={(e) =>
                        setCommentText((prev) => ({ ...prev, [post.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddComment(post.id);
                      }}
                      placeholder="Viết phản hồi hoặc chia sẻ quan điểm của bạn..."
                      className="flex-1 p-2.5 rounded-xl border-2 border-ink text-xs bg-gray-50 focus:outline-none"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="retro-btn bg-ink text-white font-bold text-xs py-2.5 px-4 flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
