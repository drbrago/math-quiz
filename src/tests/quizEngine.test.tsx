import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Quiz } from "../components/Quiz";
import { createQuiz, getQuestionsForMode } from "../logic/quizEngine";
import { questions } from "../data/questions";

describe("quizEngine", () => {
  it("selects questions by mode", () => {
    expect(getQuestionsForMode("B", questions).every((question) => question.part === "B")).toBe(true);
    expect(getQuestionsForMode("mixed", questions)).toHaveLength(20);
    expect(getQuestionsForMode("tenMinute", questions)).toHaveLength(20);
  });

  it("creates a quiz with starting index", () => {
    const quiz = createQuiz("E", questions);
    expect(quiz.mode).toBe("E");
    expect(quiz.currentIndex).toBe(0);
    expect(quiz.questions.every((question) => question.part === "E")).toBe(true);
  });

  it("runs a one-question quiz flow", async () => {
    const user = userEvent.setup();
    render(<Quiz mode="B" questionsOverride={[questions[0]]} onRestart={() => undefined} />);

    expect(screen.getByText(/Fråga 1 av 1/i)).toBeInTheDocument();
    await user.type(screen.getByLabelText(/Ditt svar/i), String(questions[0].correctAnswer));
    await user.click(screen.getByRole("button", { name: /Visa facit/i }));

    expect(screen.getByText(/Rätt!/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Nästa fråga/i }));
    expect(screen.getByText(/Din poäng/i)).toBeInTheDocument();
  });
});
