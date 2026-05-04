import { describe, expect, it } from "vitest";
import { calculateResult } from "../logic/scoring";
import type { Question } from "../data/questionTypes";

const questions: Question[] = [
  {
    id: "q1",
    part: "B",
    topic: "Tal",
    difficulty: 1,
    prompt: "1+1",
    type: "numericInput",
    correctAnswer: 2,
    explanation: "1+1=2",
    points: 1,
    tags: ["arithmetic"],
  },
  {
    id: "q2",
    part: "C",
    topic: "Procent",
    difficulty: 2,
    prompt: "10% av 50",
    type: "numericInput",
    correctAnswer: 5,
    explanation: "0,1*50=5",
    points: 2,
    tags: ["percent"],
  },
];

describe("calculateResult", () => {
  it("sums score, max score, percentage and incorrect answers", () => {
    const result = calculateResult(questions, [
      { questionId: "q1", answer: "2", isCorrect: true, pointsAwarded: 1 },
      { questionId: "q2", answer: "4", isCorrect: false, pointsAwarded: 0 },
    ]);

    expect(result.score).toBe(1);
    expect(result.maxScore).toBe(3);
    expect(result.percentage).toBe(33);
    expect(result.incorrect).toHaveLength(1);
    expect(result.incorrect[0].question.id).toBe("q2");
  });
});
