import { createClient } from '@supabase/supabase-js';
import { SEED_TOPICS, SEED_QUIZZES } from './seed-data';
import { Topic, LearningHistory, ForumPost, Profile } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project')
);

export const isDemoMode = () => !isSupabaseConfigured;

// ==============================================================================
// DEMO MOCK STORE (Hoạt động tức thì khi chưa kết nối Supabase cloud)
// ==============================================================================

class LocalStorageMockStore {
  private topics: Topic[] = [...SEED_TOPICS];
  private history: LearningHistory[] = [
    {
      id: 'h_seed_1',
      user_id: 'guest_user',
      topic_id: 'bayes_test',
      mode: 'tutor',
      input_text: 'Giải bài toán xét nghiệm y tế và nghịch lý tỷ lệ nền',
      score: 85,
      error_tags: ['nghich_ly_ty_le_nen'],
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'h_seed_2',
      user_id: 'guest_user',
      topic_id: 'expectation_concept',
      mode: 'quiz',
      input_text: 'Trắc nghiệm: Tính kỳ vọng E(2X - 3)',
      score: 100,
      error_tags: [],
      created_at: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: 'h_seed_3',
      user_id: 'guest_user',
      topic_id: 'clt_theorem',
      mode: 'oral',
      input_text: 'Vấn đáp: Điều kiện áp dụng định lí giới hạn trung tâm',
      score: 75,
      error_tags: ['dieu_kien_clt'],
      created_at: new Date(Date.now() - 3600000 * 8).toISOString()
    }
  ];
  private posts: ForumPost[] = [
    {
      id: 'p1',
      user_id: 'u_demo',
      author_name: 'Nguyễn Văn Minh (SV)',
      title: 'Hỏi về điều kiện áp dụng Công thức Bayes trong bài toán Y tế',
      body: 'Mọi người cho mình hỏi tại sao khi tỷ lệ mắc bệnh rất nhỏ (1%) thì dù độ nhạy test đạt 98% xác suất thực tế chỉ có 24% vậy ạ?',
      topic_id: 'bayes_test',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      comments: [
        {
          id: 'c1',
          post_id: 'p1',
          user_id: 'u_tutor',
          author_name: 'Giáo sư Cú Đêm 🦉',
          body: 'Chào bạn! Đó chính là hiện tượng "Nghịch lý tỷ lệ nền" (Base Rate Fallacy). Số người khỏe rất đông (99%) nên 3% dương tính giả sẽ áp đảo số người thực sự mắc bệnh. Bạn xem chi tiết ở mục Học 4 Bước nhé!',
          created_at: new Date(Date.now() - 1800000).toISOString()
        }
      ]
    }
  ];
  private currentProfile: Profile = {
    id: 'u_demo',
    display_name: 'Sinh viên Demo',
    role: 'user',
    created_at: new Date().toISOString()
  };

  getTopics(): Topic[] {
    return this.topics;
  }

  getTopic(id: string): Topic | undefined {
    return this.topics.find((t) => t.id === id);
  }

  addTopic(topic: Topic): Topic {
    this.topics.unshift(topic);
    return topic;
  }

  getHistory(userId?: string): LearningHistory[] {
    return this.history.filter((h) => !userId || h.user_id === userId);
  }

  addHistory(record: Omit<LearningHistory, 'id' | 'created_at'>): LearningHistory {
    const newRecord: LearningHistory = {
      ...record,
      id: 'h_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      created_at: new Date().toISOString()
    };
    this.history.unshift(newRecord);
    return newRecord;
  }

  getPosts(): ForumPost[] {
    return this.posts;
  }

  addPost(title: string, body: string, topicId?: string): ForumPost {
    const newPost: ForumPost = {
      id: 'p_' + Date.now(),
      user_id: this.currentProfile.id,
      author_name: this.currentProfile.display_name,
      title,
      body,
      topic_id: topicId,
      created_at: new Date().toISOString(),
      comments: []
    };
    this.posts.unshift(newPost);
    return newPost;
  }

  addComment(postId: string, body: string): boolean {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) return false;
    post.comments = post.comments || [];
    post.comments.push({
      id: 'c_' + Date.now(),
      post_id: postId,
      user_id: this.currentProfile.id,
      author_name: this.currentProfile.display_name,
      body,
      created_at: new Date().toISOString()
    });
    return true;
  }

  getProfile(): Profile {
    return this.currentProfile;
  }

  updateProfile(name: string, role?: 'user' | 'admin'): Profile {
    this.currentProfile.display_name = name;
    if (role) this.currentProfile.role = role;
    return this.currentProfile;
  }
}

// Global Singleton Store for mock/demo mode
declare global {
  var __demoStore: LocalStorageMockStore | undefined;
}

export const demoStore = global.__demoStore || (global.__demoStore = new LocalStorageMockStore());

/**
 * Tạo mock Supabase client fallback khi chưa cấu hình Supabase Cloud.
 * Giúp app chạy mượt mà 100% không báo lỗi kết nối.
 */
function createMockSupabaseClient() {
  return {
    from: (table: string) => {
      let queryData: any[] = [];
      if (table === 'topics') queryData = [...demoStore.getTopics()];
      else if (table === 'learning_history') queryData = [...demoStore.getHistory()];
      else if (table === 'forum_posts') queryData = [...demoStore.getPosts()];
      else if (table === 'profiles') queryData = [demoStore.getProfile()];

      const builder: any = {
        select: (_cols?: string) => builder,
        order: (_col: string, _opts?: any) => builder,
        limit: (n: number) => {
          queryData = queryData.slice(0, n);
          return builder;
        },
        eq: (col: string, val: any) => {
          queryData = queryData.filter((item: any) => item[col] === val);
          return builder;
        },
        single: async () => ({
          data: queryData[0] || null,
          error: queryData[0] ? null : { message: 'Not found' }
        }),
        then: (resolve: any, reject?: any) =>
          Promise.resolve({ data: queryData, error: null }).then(resolve, reject),
        insert: async (records: any) => {
          const recArray = Array.isArray(records) ? records : [records];
          for (const r of recArray) {
            if (table === 'topics') demoStore.addTopic(r);
            if (table === 'learning_history') demoStore.addHistory(r);
            if (table === 'forum_posts') demoStore.addPost(r.title, r.body, r.topic_id);
          }
          return { data: recArray, error: null };
        }
      };

      return builder;
    }
  };
}

export const supabase: any = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : createMockSupabaseClient();
