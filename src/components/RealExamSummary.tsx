import type { RealExamResultSummary } from "../logic/realExamScoring";

interface RealExamSummaryProps {
  summary: RealExamResultSummary;
  onRestart: () => void;
}

export function RealExamSummary({ summary, onRestart }: RealExamSummaryProps) {
  return (
    <section className="result-view">
      <h1>Sammanfattning</h1>
      <p>
        <strong>Metodpoäng:</strong> {summary.earned.method}
      </p>
      <p>
        <strong>Resonemangspoäng:</strong> {summary.earned.reasoning}
      </p>
      <p>
        <strong>Kommunikationspoäng:</strong> {summary.earned.communication}
      </p>
      <p>
        <strong>Totalt:</strong> {summary.total} / {summary.maxScore} ({summary.percentage}%)
      </p>
      <p>
        Självbedömda poäng: {summary.selfAssessed.method + summary.selfAssessed.reasoning + summary.selfAssessed.communication}
      </p>
      <button className="primary" onClick={onRestart}>
        Välj provdel
      </button>
    </section>
  );
}
