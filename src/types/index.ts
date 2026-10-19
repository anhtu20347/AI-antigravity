export type Role = 'user' | 'admin';

export interface Profile {
  id: string;
  display_name: string;
  role: Role;
  created_at?: string;
}

export type TopicType = 'solve' | 'concept' | 'theorem';

export interface FourStep {
  step: number;
  title: string;
  objective: string;
  content: string;
  interactive_prompt: string;
  tips?: string;
}

export interface MindmapNode {
  id: string;
  label: string;
  category: 'root' | 'category' | 'detail' | 'formula';
  color?: string;
}

export interface MindmapEdge {
  from: string;
  to: string;
}

export interface MindmapData {
  root: string;
  nodes: MindmapNode[];
  edges: MindmapEdge[];
}

export interface TopicContent {
  four_steps: FourStep[];
}

export interface Topic {
  id: string;
  title: string;
  type: TopicType;
  chapter: number;
  content_json: TopicContent;
  mindmap_json: MindmapData;
  is_published?: boolean;
  created_at?: string;
}

export type HistoryMode = 'tutor' | 'practice' | 'quiz' | 'oral' | 'lesson';

export interface LearningHistory {
  id: string;
  user_id: string;
  topic_id?: string;
  mode: HistoryMode;
  input_text?: string;
  result_json?: any;
  score?: number;
  error_tags: string[];
  created_at: string;
  topic?: Topic;
}

export interface UploadRecord {
  id: string;
  user_id: string;
  storage_path: string;
  mime_type: string;
  history_id?: string;
  created_at: string;
}

export interface ForumPost {
  id: string;
  user_id: string;
  title: string;
  body: string;
  topic_id?: string;
  created_at: string;
  author_name?: string;
  comments?: CommentRecord[];
}

export interface CommentRecord {
  id: string;
  post_id: string;
  user_id: string;
  body: string;
  created_at: string;
  author_name?: string;
}

export interface QuizQuestion {
  id: string;
  chapter: number;
  topic_id?: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  difficulty: 'Cơ bản' | 'Vận dụng' | 'Vận dụng cao';
}

export interface PracticeProblem {
  id: string;
  title: string;
  question: string;
  context: string;
  strategy: string[];
}
