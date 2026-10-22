export type UserRole = 'teacher' | 'student' | 'demo';

export type GradeLevel = 6 | 7 | 8 | 9;

export type HelpLevel = 1 | 2 | 3; // 1: Câu hỏi gợi mở, 2: Gợi ý & Hướng dẫn, 3: Minh họa phương pháp

export type TaskStatus = 'not_started' | 'in_progress' | 'submitted' | 'critiqued' | 'completed';

export interface StudentAccount {
  id: string;
  code: string; // e.g., HS-DEMO-01
  name: string; // Anonymous code or pseudo name
  className: string;
  grade: GradeLevel;
  preTestScore: number; // 0-10 or 1-4 scale
  postTestScore: number;
  editCount: number;
  completedTasks: number;
  totalTasks: number;
}

export interface LiteraryWork {
  id: string;
  title: string;
  author: string;
  grade: GradeLevel;
  genre: string; // Thơ, Truyện ngắn, Ký, Nghị luận...
  skill: string; // Đọc hiểu, Tiếng Việt, Viết, Nói & Nghe
  difficulty: 'Cơ bản' | 'Trung bình' | 'Nâng cao';
  text: string;
  notes?: string;
  isDemo?: boolean;
}

export interface WritingVersion {
  versionNumber: number; // 1: Trước phản hồi, 2: Sau phản hồi, 3+: Hoàn thiện
  label: string;
  text: string;
  outline?: string;
  createdAt: string;
  wordCount: number;
  diffSummary?: string;
}

export interface StudentSubmission {
  id: string;
  studentId: string;
  studentCode: string;
  taskId: string;
  taskTitle: string;
  grade: GradeLevel;
  genre: string;
  versions: WritingVersion[];
  currentVersionIndex: number;
  status: TaskStatus;
  rubricScores?: {
    understanding: number; // 1-4
    evidence: number;      // 1-4
    argument: number;      // 1-4
    expression: number;    // 1-4
    creativity: number;    // 1-4
  };
  critiqueReport?: CritiqueReport;
  studentRebuttal?: string;
  rebuttalFeedback?: string;
  teacherOfficialFeedback?: string;
  teacherApproved?: boolean;
  updatedAt: string;
}

export interface AssignmentTask {
  id: string;
  title: string;
  grade: GradeLevel;
  workId?: string;
  genre: string;
  description: string;
  dueDate: string;
  rubricRequirements: string[];
  status: 'active' | 'closed';
  isDemo?: boolean;
}

export interface CritiqueCriterion {
  name: string;
  score: number; // 1-4
  levelName: string; // Cần hỗ trợ, Đạt bước đầu, Đạt yêu cầu, Tốt
  strength: string;
  weakness: string;
  suggestion: string;
}

export interface CritiqueReport {
  overallSummary: string;
  criteria: CritiqueCriterion[];
  quotesToReview: Array<{ quote: string; comment: string }>;
  counterQuestions: string[];
  suggestedActions: string[];
}

export interface MindmapNode {
  id: string;
  label: string;
  type: 'root' | 'branch' | 'leaf';
  color: string;
  x: number;
  y: number;
  details?: string;
}

export interface MindmapEdge {
  from: string;
  to: string;
  label?: string;
}

export interface MindmapData {
  id: string;
  title: string;
  mapType: 'tree' | 'radial' | 'hierarchical' | 'compare';
  nodes: MindmapNode[];
  edges: MindmapEdge[];
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  helpLevel?: HelpLevel;
  suggestedActions?: string[];
}

export interface GameQuestion {
  id: number;
  level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CompetitionCriterion {
  id: string;
  number: number;
  name: string;
  weight: string; // e.g. "25%"
  description: string;
  requiredEvidence: string;
  addedEvidence: string;
  status: 'CHƯA CÓ MINH CHỨNG' | 'ĐANG THU THẬP' | 'ĐÃ BỔ SUNG' | 'ĐÃ KIỂM TRA';
  notes: string;
}
