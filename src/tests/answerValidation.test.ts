import { describe, expect, it } from "vitest";
import { validateAnswer } from "../logic/answerValidation";
import type { Question } from "../data/questionTypes";

const baseQuestion: Question = {
  id: "test",
  part: "B",
  topic: "Test",
  difficulty: 1,
  prompt: "Test",
  type: "numericInput",
  correctAnswer: 2.5,
  explanation: "Test",
  points: 1,
  tags: ["test"],
};

describe("validateAnswer", () => {
  it("accepts comma and dot decimals", () => {
    expect(validateAnswer(baseQuestion, "2,5")).toBe(true);
    expect(validateAnswer(baseQuestion, "2.5")).toBe(true);
  });

  it("accepts equivalent fractions", () => {
    const question = { ...baseQuestion, type: "fractionInput" as const, correctAnswer: "1/2" };
    expect(validateAnswer(question, "2/4")).toBe(true);
    expect(validateAnswer(question, " 3 / 6 ")).toBe(true);
  });

  it("strips common units", () => {
    const question = { ...baseQuestion, correctAnswer: "25" };
    expect(validateAnswer(question, "25 cm")).toBe(true);
    expect(validateAnswer(question, "25 kronor")).toBe(true);
  });

  it("is case insensitive for text", () => {
    const question = { ...baseQuestion, type: "textInput" as const, correctAnswer: "symmetri" };
    expect(validateAnswer(question, " SYMMETRI ")).toBe(true);
  });

  it("uses accepted answers", () => {
    const question = { ...baseQuestion, correctAnswer: "0.75", acceptedAnswers: ["3/4", "75 %"] };
    expect(validateAnswer(question, "3/4")).toBe(true);
    expect(validateAnswer(question, "75%")).toBe(true);
  });

  it("rejects wrong answers", () => {
    expect(validateAnswer(baseQuestion, "2,4")).toBe(false);
  });
});
