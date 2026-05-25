export type TestPointType =
  | "개념"
  | "계산"
  | "그래프해석"
  | "실험해석"
  | "비교"
  | "분류";

export interface TestPoint {
  type: TestPointType;
  question: string;
  trap?: string;
  hint?: string;
}

export interface QuizItem {
  q: string;
  choices: string[];
  answer: number;
  explain: string;
}

export interface ConceptFrontmatter {
  title: string;
  slug: string;
  order: number;
  summary: string;
  keyPoints: string[];
  testPoints: TestPoint[];
  quiz: QuizItem[];
}

export interface ConceptFile extends ConceptFrontmatter {
  body: string;
  unit: string;
  subject: string;
}

export interface UnitMeta {
  slug: string;
  title: string;
  subject: string;
  grade: string;
  summary: string;
  objectives: string[];
}

export interface SubjectMeta {
  slug: string;
  title: string;
  description: string;
  available: boolean;
}
