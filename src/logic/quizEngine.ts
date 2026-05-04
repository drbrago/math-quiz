import { questions as allQuestions } from "../data/questions";
import type { Question, QuizMode, UserAnswer } from "../data/questionTypes";
import { validateAnswer } from "./answerValidation";

export interface QuizState {
  mode: QuizMode;
  questions: Question[];
  currentIndex: number;
  answers: UserAnswer[];
}

function seededShuffle<T>(items: T[]): T[] {
  return [...items]
    .map((item, index) => ({ item, sort: Math.sin((index + 1) * 999) }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

export function getQuestionsForMode(mode: QuizMode, source: Question[] = allQuestions): Question[] {
  if (mode === "mixed" || mode === "tenMinute") {
    return seededShuffle(source).slice(0, 20);
  }

  return source.filter((question) => question.part === mode);
}

export function createQuiz(mode: QuizMode, source: Question[] = allQuestions): QuizState {
  return {
    mode,
    questions: getQuestionsForMode(mode, source),
    currentIndex: 0,
    answers: [],
  };
}

export function gradeAnswer(question: Question, answer: string): UserAnswer {
  const isCorrect = validateAnswer(question, answer);
  return {
    questionId: question.id,
    answer,
    isCorrect,
    pointsAwarded: isCorrect ? question.points : 0,
  };
}
