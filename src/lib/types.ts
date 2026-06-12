export type QuestionType =
  | "mcq"
  | "true_false"
  | "true_false_justification"
  | "descriptive"
  | "coding"
  | "coding_project"
  | "live_coding"
  | "other";

export interface AssessmentOption {
  key: string;
  text: string;
  isCorrect: boolean;
}

export interface AssessmentQuestion {
  id: string;
  number: number;
  type: QuestionType;
  difficulty?: string;
  marks: number;
  text: string;
  options?: AssessmentOption[];
  correctAnswer?: string;
  explanation?: string;
  modelAnswer?: string;
  starterCode?: string;
  language?: string;
  tfVerdict?: string;
}

export interface Assessment {
  submoduleId: string;
  totalMarks: number;
  questions: AssessmentQuestion[];
}

export interface SubmoduleMeta {
  id: string;
  slug: string;
  filename: string;
  title: string;
  subtitle: string;
  hasAssessment: boolean;
  totalMarks: number;
  toc: { id: string; title: string }[];
}

export interface ModuleMeta {
  id: number;
  slug: string;
  title: string;
  phaseId: string;
  description: string;
  submodules: SubmoduleMeta[];
  index?: number;
}

export interface Phase {
  id: string;
  title: string;
  modules: number[];
}

export interface Curriculum {
  phases: Phase[];
  modules: ModuleMeta[];
}

export interface UserAnswer {
  questionId: string;
  value: string;
  selectedKey?: string;
  codingResults?: any;
}

export interface QuestionResult {
  questionId: string;
  earned: number;
  max: number;
  isAutoGraded: boolean;
  isCorrect?: boolean;
  userAnswer: string;
  correctAnswer?: string;
  explanation?: string;
  modelAnswer?: string;
  codingResults?: any;
}
