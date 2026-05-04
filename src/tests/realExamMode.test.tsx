import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "../App";
import { realExamQuestions } from "../data/realExamQuestions";
import { RealExamQuiz } from "../components/RealExamQuiz";

describe("real exam mode", () => {
  it("shows Prov på riktigt in mode selection and renders real exam mode when selected", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /Prov på riktigt/i }));
    expect(screen.getAllByText(/Deluppgift/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /Visa lösning och bedömning/i })).toBeInTheDocument();
  });

  it("lets user answer subquestions, submit, and view rubric/explanations", async () => {
    const user = userEvent.setup();
    render(<RealExamQuiz questionsOverride={[realExamQuestions[0]]} onRestart={() => undefined} />);

    for (const input of screen.getAllByRole("textbox")) {
      await user.type(input, "test-svar");
    }

    await user.click(screen.getByRole("button", { name: /Visa lösning och bedömning/i }));
    expect(screen.getAllByText(/Självbedömning/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Metodpoäng/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Resonemangspoäng/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Kommunikationspoäng/i).length).toBeGreaterThan(0);
  });

  it("shows result summary with method, reasoning and communication points", async () => {
    const user = userEvent.setup();
    render(<RealExamQuiz questionsOverride={[realExamQuestions[0]]} onRestart={() => undefined} />);

    for (const input of screen.getAllByRole("textbox")) {
      await user.type(input, "test-svar");
    }

    await user.click(screen.getByRole("button", { name: /Visa lösning och bedömning/i }));
    const checkboxes = screen.getAllByRole("checkbox");
    for (const checkbox of checkboxes) {
      await user.click(checkbox);
    }
    await user.click(screen.getByRole("button", { name: /Nästa uppgift/i }));

    expect(screen.getByText(/Sammanfattning/i)).toBeInTheDocument();
    expect(screen.getByText(/Metodpoäng/i)).toBeInTheDocument();
    expect(screen.getByText(/Resonemangspoäng/i)).toBeInTheDocument();
    expect(screen.getByText(/Kommunikationspoäng/i)).toBeInTheDocument();
    expect(screen.getByText(/Totalt/i)).toBeInTheDocument();
  });
});
