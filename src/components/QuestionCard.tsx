import type { Question } from "../data/questionTypes";

interface QuestionCardProps {
  question: Question;
  answer: string;
  submitted: boolean;
  isCorrect: boolean | null;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  onNext: () => void;
}

export function QuestionCard({
  question,
  answer,
  submitted,
  isCorrect,
  onAnswerChange,
  onSubmit,
  onNext,
}: QuestionCardProps) {
  return (
    <article className="question-card">
      <div className="question-meta">
        <span>Delprov {question.part}</span>
        <span>{question.topic}</span>
        <span>{question.points} p</span>
      </div>

      <h2>{question.prompt}</h2>

      {question.options ? (
        <div className="options" role="radiogroup" aria-label="Svarsalternativ">
          {question.options.map((option) => (
            <label className="option" key={option}>
              <input
                type="radio"
                name={question.id}
                value={option}
                checked={answer === option}
                disabled={submitted}
                onChange={(event) => onAnswerChange(event.target.value)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      ) : (
        <label className="answer-field">
          <span>Ditt svar</span>
          <input
            value={answer}
            disabled={submitted}
            onChange={(event) => onAnswerChange(event.target.value)}
            placeholder="Skriv svaret här"
          />
        </label>
      )}

      {submitted && (
        <section className={isCorrect ? "feedback correct" : "feedback incorrect"} aria-live="polite">
          <strong>{isCorrect ? "Rätt!" : "Inte riktigt"}</strong>
          <p>{question.explanation}</p>
        </section>
      )}

      <div className="actions">
        {!submitted ? (
          <button className="primary" onClick={onSubmit} disabled={!answer.trim()}>
            Visa facit
          </button>
        ) : (
          <button className="primary" onClick={onNext}>
            Nästa fråga
          </button>
        )}
      </div>
    </article>
  );
}
