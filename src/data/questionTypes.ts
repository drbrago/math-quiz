export type TestPart = "B" | "C" | "D" | "E";

export type QuestionType =
  | "multipleChoice"
  | "numericInput"
  | "textInput"
  | "fractionInput"
  | "multiStep";

export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface RealExamPoints {
  method: number;
  reasoning: number;
  communication: number;
}

export interface RealExamQuestionPart {
  id: string;
  label: "a" | "b" | "c" | "d" | "e";
  prompt: string;
  expectedAnswer: string | number | string[];
  acceptedAnswers?: string[];
  explanation: string;
  rubric: RealExamPoints;
}

export interface RealExamQuestion {
  id: string;
  mode: "realExam";
  title: string;
  intro?: string;
  parts: RealExamQuestionPart[];
  totalPoints: RealExamPoints;
  tags: string[];
}

export interface Question {
  id: string;
  part: TestPart;
  topic: string;
  difficulty: Difficulty;
  prompt: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string | number | string[];
  acceptedAnswers?: string[];
  explanation: string;
  points: number;
  tags: string[];
}

export type QuizMode = TestPart | "mixed" | "tenMinute" | "realExam";

export interface UserAnswer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  pointsAwarded: number;
}

export interface QuizResult {
  score: number;
  maxScore: number;
  percentage: number;
  answers: UserAnswer[];
  incorrect: Array<{
    question: Question;
    answer: string;
  }>;
}
