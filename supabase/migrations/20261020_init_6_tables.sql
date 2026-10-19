-- ==============================================================================
-- MIGRATION: 6 BẢNG TỐI THIỂU CHO AI TUTOR XÁC SUẤT THỐNG KÊ (MVP THEO TÀI LIỆU)
-- ==============================================================================

-- 1. Profiles (Liên kết user Supabase; role chỉ user/admin)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Topics (Lưu lesson 4 bước và bản đồ tư duy mẫu)
CREATE TABLE IF NOT EXISTS public.topics (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('solve', 'concept', 'theorem')),
  chapter INT NOT NULL DEFAULT 1,
  content_json JSONB NOT NULL,
  mindmap_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Learning History (Một bảng dùng cho tutor, practice, quiz và oral)
CREATE TABLE IF NOT EXISTS public.learning_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic_id TEXT REFERENCES public.topics(id) ON DELETE SET NULL,
  mode TEXT NOT NULL CHECK (mode IN ('tutor', 'practice', 'quiz', 'oral', 'lesson')),
  input_text TEXT,
  result_json JSONB,
  score NUMERIC(4, 2),
  error_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Uploads (Tham chiếu ảnh/PDF/canvas; metadata đủ cho demo)
CREATE TABLE IF NOT EXISTS public.uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  history_id UUID REFERENCES public.learning_history(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Forum Posts (Diễn đàn đơn giản)
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  topic_id TEXT REFERENCES public.topics(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Comments (Comment tùy chọn)
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) TỐI THIỂU
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Profiles: đọc công khai (để hiện tên), user chỉ sửa profile mình
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Topics: đọc công khai, chỉ admin mới sửa
CREATE POLICY "Public read topics" ON public.topics FOR SELECT USING (is_published = true);
CREATE POLICY "Admin write topics" ON public.topics FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Learning History: user chỉ đọc/ghi record của mình
CREATE POLICY "Users read own history" ON public.learning_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own history" ON public.learning_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Uploads: user chỉ đọc/ghi record của mình
CREATE POLICY "Users read own uploads" ON public.uploads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own uploads" ON public.uploads FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Forum Posts: user đăng nhập đều đọc được, chỉ sửa/xóa bài của mình
CREATE POLICY "Users read posts" ON public.forum_posts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users insert posts" ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own posts" ON public.forum_posts FOR UPDATE USING (auth.uid() = user_id);

-- Comments: user đăng nhập đều đọc được, tạo comment của mình
CREATE POLICY "Users read comments" ON public.comments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users insert comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
