
export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export interface MCQ {
  id: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  difficulty: Difficulty;
  explanation: string;
  topicTag: string;
  estimatedTime: string;
}

export interface CQ {
  id: string;
  stimulus: string;
  questions: {
    a: string; // Knowledge (1)
    b: string; // Comprehension (2)
    c: string; // Application (3)
    d: string; // Higher Order (4)
  };
  answers: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  marks: number;
  topicTag: string;
  estimatedTime: string;
}

export interface Chapter {
  id: number;
  name: string;
  englishName: string;
}

export enum AppMode {
  HOME = 'home',
  QUIZ = 'quiz',
  RESULT = 'result',
  CQ_VIEW = 'cq_view'
}

export interface UserResponse {
  mcqId: string;
  selectedOption: string | null;
  isCorrect: boolean;
}

export interface ExamSession {
  chapter: Chapter;
  mcqs: MCQ[];
  cqs: CQ[];
  startTime: number;
  endTime?: number;
  responses: UserResponse[];
  isHardMode: boolean;
  timeLimit: number; // minutes
}
