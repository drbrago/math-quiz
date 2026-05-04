import { describe, expect, it } from "vitest";
import type { Question } from "../data/questionTypes";
import { realExamQuestions } from "../data/realExamQuestions";
import { validateAnswer } from "../logic/answerValidation";

const bannedThemeWords = [
  "rymdklubb",
  "stjärnkarta",
  "kikare",
  "teleskop",
  "rymddryck",
  "marsvarelser",
  "venusvarelser",
];

describe("realExamQuestions data", () => {
  it("contains at least 8 real exam questions and at least 30 subquestions", () => {
    const totalSubquestions = realExamQuestions.reduce((sum, question) => sum + question.parts.length, 0);
    expect(realExamQuestions.length).toBeGreaterThanOrEqual(8);
    expect(totalSubquestions).toBeGreaterThanOrEqual(30);
  });

  it("has unique question ids and unique subquestion ids per question", () => {
    expect(new Set(realExamQuestions.map((question) => question.id)).size).toBe(realExamQuestions.length);

    for (const question of realExamQuestions) {
      expect(new Set(question.parts.map((part) => part.id)).size).toBe(question.parts.length);
    }
  });

  it("has complete content and valid rubric values", () => {
    for (const question of realExamQuestions) {
      expect(question.title.trim()).not.toBe("");
      expect(question.tags.length).toBeGreaterThan(0);

      const summed = question.parts.reduce(
        (acc, part) => ({
          method: acc.method + part.rubric.method,
          reasoning: acc.reasoning + part.rubric.reasoning,
          communication: acc.communication + part.rubric.communication,
        }),
        { method: 0, reasoning: 0, communication: 0 },
      );

      expect(question.totalPoints).toEqual(summed);

      for (const part of question.parts) {
        expect(part.prompt.trim()).not.toBe("");
        expect(part.explanation.trim()).not.toBe("");
        expect(part.expectedAnswer).toBeDefined();

        expect(Number.isInteger(part.rubric.method)).toBe(true);
        expect(Number.isInteger(part.rubric.reasoning)).toBe(true);
        expect(Number.isInteger(part.rubric.communication)).toBe(true);
        expect(part.rubric.method).toBeGreaterThanOrEqual(0);
        expect(part.rubric.reasoning).toBeGreaterThanOrEqual(0);
        expect(part.rubric.communication).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("validates expected and accepted answers for every subquestion", () => {
    for (const question of realExamQuestions) {
      for (const part of question.parts) {
        const validationQuestion: Question = {
          id: `${question.id}-${part.id}`,
          part: "E",
          topic: "realExamValidation",
          difficulty: 3,
          prompt: part.prompt,
          type: "textInput",
          correctAnswer: part.expectedAnswer,
          acceptedAnswers: part.acceptedAnswers,
          explanation: part.explanation,
          points: 1,
          tags: ["real-exam"],
        };

        if (Array.isArray(part.expectedAnswer)) {
          expect(part.expectedAnswer.length).toBeGreaterThan(0);
          expect(validateAnswer(validationQuestion, part.expectedAnswer[0])).toBe(true);
        } else {
          expect(validateAnswer(validationQuestion, String(part.expectedAnswer))).toBe(true);
        }

        for (const accepted of part.acceptedAnswers ?? []) {
          expect(validateAnswer(validationQuestion, accepted)).toBe(true);
        }
      }
    }
  });

  it("does not contain empty strings or references to banned original PDF theme words", () => {
    const serialized = JSON.stringify(realExamQuestions).toLowerCase();

    for (const question of realExamQuestions) {
      expect(question.id.trim()).not.toBe("");
      expect(question.title.trim()).not.toBe("");
      if (question.intro) expect(question.intro.trim()).not.toBe("");
      for (const tag of question.tags) expect(tag.trim()).not.toBe("");

      for (const part of question.parts) {
        expect(part.id.trim()).not.toBe("");
        expect(part.prompt.trim()).not.toBe("");
        expect(part.explanation.trim()).not.toBe("");
        for (const accepted of part.acceptedAnswers ?? []) {
          expect(accepted.trim()).not.toBe("");
        }
      }
    }

    for (const word of bannedThemeWords) {
      expect(serialized).not.toContain(word);
    }
  });
});
