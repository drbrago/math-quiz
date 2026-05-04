import { Award, RotateCcw } from "lucide-react";
import type { QuizResult } from "../data/questionTypes";

interface ResultSummaryProps {
  result: QuizResult;
  onRestart: () => void;
  onRetryWrong?: () => void;
}

function badgeText(result: QuizResult): string | null {
  const wrongTags = result.incorrect.flatMap((item) => item.question.tags);
  if (result.percentage >= 85) return "Mattehjälte";
  if (!wrongTags.includes("fractions")) return "Bråk-mästare";
  if (!wrongTags.includes("percent")) return "Procent-proffs";
  if (!wrongTags.includes("geometry") && !wrongTags.includes("area")) return "Geometrihjälte";
  return null;
}

export function ResultSummary({ result, onRestart, onRetryWrong }: ResultSummaryProps) {
  const badge = badgeText(result);

  return (
    <section className="result-view">
      <div className="result-header">
        <Award aria-hidden="true" />
        <div>
          <p className="eyebrow">Din poäng</p>
          <h1>
            {result.score} av {result.maxScore}
          </h1>
          <p>{result.percentage}% rätt</p>
        </div>
      </div>

      {badge && <p className="badge">{badge}</p>}

      {result.incorrect.length > 0 ? (
        <div className="wrong-list">
          <h2>Frågor att träna mer på</h2>
          {result.incorrect.map(({ question, answer }) => (
            <article className="wrong-item" key={question.id}>
              <strong>{question.prompt}</strong>
              <p>Ditt svar: {answer || "inget svar"}</p>
              <p>{question.explanation}</p>
            </article>
          ))}
        </div>
      ) : (
        <p>Alla svar blev rätt.</p>
      )}

      <div className="actions">
        {result.incorrect.length > 0 && onRetryWrong && (
          <button className="secondary" onClick={onRetryWrong}>
            Försök igen
          </button>
        )}
        <button className="primary" onClick={onRestart}>
          <RotateCcw aria-hidden="true" size={18} />
          Välj provdel
        </button>
      </div>
    </section>
  );
}
