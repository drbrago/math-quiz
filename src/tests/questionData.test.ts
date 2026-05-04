import { describe, expect, it } from "vitest";
import { questions } from "../data/questions";
import { validateAnswer } from "../logic/answerValidation";
import type { TestPart } from "../data/questionTypes";

const validParts: TestPart[] = ["B", "C", "D", "E"];

describe("question data", () => {
  it("has enough original questions per part and in total", () => {
    expect(questions.length).toBeGreaterThanOrEqual(120);
    for (const part of validParts) {
      expect(questions.filter((question) => question.part === part)).toHaveLength(30);
    }
  });

  it("has unique ids", () => {
    expect(new Set(questions.map((question) => question.id)).size).toBe(questions.length);
  });

  it("has valid structure and answer keys", () => {
    for (const question of questions) {
      expect(validParts).toContain(question.part);
      expect(question.prompt.trim()).not.toBe("");
      expect(question.explanation.trim()).not.toBe("");
      expect(question.points).toBeGreaterThan(0);
      expect(question.tags.length).toBeGreaterThan(0);
      expect(question.correctAnswer).not.toBeUndefined();
      expect(validateAnswer(question, Array.isArray(question.correctAnswer) ? question.correctAnswer[0] : String(question.correctAnswer))).toBe(true);

      for (const answer of question.acceptedAnswers ?? []) {
        expect(validateAnswer(question, answer)).toBe(true);
      }

      if (question.type === "multipleChoice") {
        expect(question.options?.length).toBeGreaterThanOrEqual(3);
        expect(question.options).toContain(String(question.correctAnswer));
      }
    }
  });
});
