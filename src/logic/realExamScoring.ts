import type {
  Question,
  RealExamPoints,
  RealExamQuestion,
  RealExamQuestionPart,
} from "../data/questionTypes";
import { validateAnswer } from "./answerValidation";

export interface SelfAssessmentSelection {
  method: boolean;
  reasoning: boolean;
  communication: boolean;
}

export interface RealExamResultSummary {
  earned: RealExamPoints;
  selfAssessed: RealExamPoints;
  total: number;
  maxScore: number;
  percentage: number;
}

const ZERO_POINTS: RealExamPoints = { method: 0, reasoning: 0, communication: 0 };

function sumPoints(points: RealExamPoints[]): RealExamPoints {
  return points.reduce(
    (acc, current) => ({
      method: acc.method + current.method,
      reasoning: acc.reasoning + current.reasoning,
      communication: acc.communication + current.communication,
    }),
    { ...ZERO_POINTS },
  );
}

function toValidationQuestion(part: RealExamQuestionPart): Question {
  return {
    id: part.id,
    part: "E",
    topic: "realExam",
    difficulty: 3,
    prompt: part.prompt,
    type: "textInput",
    correctAnswer: part.expectedAnswer,
    acceptedAnswers: part.acceptedAnswers,
    explanation: part.explanation,
    points: 1,
    tags: ["realExam"],
  };
}

export function scoreAutoPart(part: RealExamQuestionPart, answer: string): RealExamPoints {
  return validateAnswer(toValidationQuestion(part), answer) ? part.rubric : { ...ZERO_POINTS };
}

export function scoreSelfAssessmentPart(
  part: RealExamQuestionPart,
  selection: SelfAssessmentSelection,
): RealExamPoints {
  return {
    method: selection.method ? part.rubric.method : 0,
    reasoning: selection.reasoning ? part.rubric.reasoning : 0,
    communication: selection.communication ? part.rubric.communication : 0,
  };
}

export function calculateRealExamMaxScore(questions: RealExamQuestion[]): number {
  return questions.reduce(
    (sum, question) =>
      sum + question.totalPoints.method + question.totalPoints.reasoning + question.totalPoints.communication,
    0,
  );
}

export function calculateRealExamResultSummary(input: {
  maxScore: number;
  autoPoints: RealExamPoints[];
  selfAssessedPoints: RealExamPoints[];
}): RealExamResultSummary {
  const autoTotals = sumPoints(input.autoPoints);
  const selfTotals = sumPoints(input.selfAssessedPoints);
  const earned = {
    method: autoTotals.method + selfTotals.method,
    reasoning: autoTotals.reasoning + selfTotals.reasoning,
    communication: autoTotals.communication + selfTotals.communication,
  };
  const total = earned.method + earned.reasoning + earned.communication;
  const percentage = input.maxScore === 0 ? 0 : Math.round((total / input.maxScore) * 100);

  return {
    earned,
    selfAssessed: selfTotals,
    total,
    maxScore: input.maxScore,
    percentage,
  };
}
