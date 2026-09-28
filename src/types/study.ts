export type NavTab =
  | 'dashboard'
  | 'ask'
  | 'plan'
  | 'quiz'
  | 'notes'
  | 'exam'
  | 'progress'
  | 'timer';

export interface SubjectTopic {
  id: string;
  title: string;
  completed: boolean;
  estimatedMinutes: number;
}

export interface SubjectItem {
  id: string;
  name: string;
  difficulty: 'Difficult' | 'Moderate' | 'Easy';
  examDate: string;
  topics: SubjectTopic[];
}

export interface StudyBlock {
  id: string;
  timeRange: string;
  title: string;
  subject: string;
  blockType: 'study' | 'break' | 'revision';
  difficultyTag: string;
  durationMinutes: number;
  actionTip: string;
  completed: boolean;
}

export interface StudyPlanData {
  planTitle: string;
  encouragementMessage: string;
  strategyTip: string;
  examDate: string;
  availableHours: number;
  difficultSubjects: string;
  easySubjects: string;
  dailyBlocks: StudyBlock[];
  examCountdownPhases: {
    phaseName: string;
    timeframe: string;
    focusDescription: string;
  }[];
}

export interface DoubtResponse {
  id: string;
  question: string;
  subject: string;
  createdAt: string;
  encouragingOpening: string;
  simpleExplanation: string;
  steps: {
    stepNumber: number;
    title: string;
    detail: string;
  }[];
  realLifeAnalogy: {
    title: string;
    analogyText: string;
  };
  concreteExample: string;
  examTakeaway: string;
  followUpQuestions: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  memoryTip: string;
}

export interface QuizData {
  quizTitle: string;
  subject: string;
  topic: string;
  encouragement: string;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  subject: string;
  topic: string;
  score: number;
  total: number;
  percentage: number;
  dateLabel: string;
}

export interface NotesSummary {
  id: string;
  summaryTitle: string;
  subject: string;
  createdAt: string;
  simpleExplanation: string;
  quickAnalogy: string;
  importantKeywords: {
    term: string;
    meaning: string;
  }[];
  revisionPoints: string[];
  possibleExamQuestions: {
    question: string;
    marks: string;
    answerHint: string;
  }[];
}

export interface ExamPrepQuestion {
  id: string;
  marks: number;
  question: string;
  introSummary: string;
  structuredPoints: string[];
  keywords: string[];
  memoryTrick: string;
}

export interface ExamPrepGuide {
  id: string;
  subject: string;
  topicTitle: string;
  examinerTip: string;
  threeMarkQuestions: ExamPrepQuestion[];
  fiveMarkQuestions: ExamPrepQuestion[];
  tenMarkQuestions: ExamPrepQuestion[];
}

export interface PomodoroSessionLog {
  id: string;
  subject: string;
  taskTitle: string;
  durationMinutes: number;
  completedAt: string;
  mode: 'study' | 'break';
}
