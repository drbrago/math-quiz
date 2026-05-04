import { describe, expect, it } from "vitest";
import { realExamQuestions } from "../data/realExamQuestions";
import {
  calculateRealExamMaxScore,
  calculateRealExamResultSummary,
  scoreAutoPart,
  scoreSelfAssessmentPart,
} from "../logic/realExamScoring";

describe("realExamScoring", () => {
  const question = realExamQuestions[0];
  const part = question.parts[0];

  it("awards full auto points for a correct answer", () => {
    const answer = Array.isArray(part.expectedAnswer) ? part.expectedAnswer[0] : String(part.expectedAnswer);
    expect(scoreAutoPart(part, answer)).toEqual(part.rubric);
  });

  it("awards zero auto points for an incorrect answer", () => {
    expect(scoreAutoPart(part, "__fel_svar__")).toEqual({
      method: 0,
      reasoning: 0,
      communication: 0,
    });
  });

  it("adds selected self-assessment points by category", () => {
    expect(
      scoreSelfAssessmentPart(part, {
        method: true,
        reasoning: false,
        communication: true,
      }),
    ).toEqual({
      method: part.rubric.method,
      reasoning: 0,
      communication: part.rubric.communication,
    });
  });

  it("calculates max score correctly", () => {
    const expectedMax = realExamQuestions.reduce(
      (sum, item) => sum + item.totalPoints.method + item.totalPoints.reasoning + item.totalPoints.communication,
      0,
    );
    expect(calculateRealExamMaxScore(realExamQuestions)).toBe(expectedMax);
  });

  it("calculates total score and percentage correctly", () => {
    const maxScore = calculateRealExamMaxScore([question]);
    const summary = calculateRealExamResultSummary({
      maxScore,
      autoPoints: [{ method: 2, reasoning: 1, communication: 0 }],
      selfAssessedPoints: [{ method: 0, reasoning: 1, communication: 1 }],
    });

    expect(summary.earned.method).toBe(2);
    expect(summary.earned.reasoning).toBe(2);
    expect(summary.earned.communication).toBe(1);
    expect(summary.total).toBe(5);
    expect(summary.maxScore).toBe(maxScore);
    expect(summary.percentage).toBe(Math.round((5 / maxScore) * 100));
  });
});
