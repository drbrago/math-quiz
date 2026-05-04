import type { RealExamQuestion } from "../data/questionTypes";
import type { SelfAssessmentSelection } from "../logic/realExamScoring";
import { SelfAssessmentRubric } from "./SelfAssessmentRubric";

interface RealExamQuestionCardProps {
  question: RealExamQuestion;
  answers: Record<string, string>;
  submitted: boolean;
  selfAssessments: Record<string, SelfAssessmentSelection>;
  onAnswerChange: (partId: string, value: string) => void;
  onSelfAssessmentChange: (partId: string, selection: SelfAssessmentSelection) => void;
}

function formatExpectedAnswer(answer: string | number | string[]): string {
  if (Array.isArray(answer)) return answer.join(" / ");
  return String(answer);
}

export function RealExamQuestionCard({
  question,
  answers,
  submitted,
  selfAssessments,
  onAnswerChange,
  onSelfAssessmentChange,
}: RealExamQuestionCardProps) {
  return (
    <article className="question-card">
      <h2>{question.title}</h2>
      {question.intro && <p>{question.intro}</p>}

      {question.parts.map((part) => (
        <section key={part.id} className="real-exam-part">
          <h3>
            Deluppgift {part.label}
          </h3>
          <p>{part.prompt}</p>
          <label className="answer-field">
            <span>Svar</span>
            <input
              aria-label={`Deluppgift ${part.label} svar`}
              value={answers[part.id] ?? ""}
              disabled={submitted}
              onChange={(event) => onAnswerChange(part.id, event.target.value)}
              placeholder="Skriv ditt svar"
            />
          </label>

          {submitted && (
            <div className="feedback">
              <p>
                <strong>Förväntat svar:</strong> {formatExpectedAnswer(part.expectedAnswer)}
              </p>
              <p>{part.explanation}</p>
              <SelfAssessmentRubric
                part={part}
                selection={
                  selfAssessments[part.id] ?? {
                    method: false,
                    reasoning: false,
                    communication: false,
                  }
                }
                onChange={(selection) => onSelfAssessmentChange(part.id, selection)}
              />
            </div>
          )}
        </section>
      ))}
    </article>
  );
}
