import type { RealExamQuestionPart } from "../data/questionTypes";
import type { SelfAssessmentSelection } from "../logic/realExamScoring";

interface SelfAssessmentRubricProps {
  part: RealExamQuestionPart;
  selection: SelfAssessmentSelection;
  onChange: (selection: SelfAssessmentSelection) => void;
}

export function SelfAssessmentRubric({ part, selection, onChange }: SelfAssessmentRubricProps) {
  return (
    <section className="self-assessment">
      <h4>Självbedömning</h4>
      <p>
        <strong>Metodpoäng:</strong> {part.rubric.method} | <strong>Resonemangspoäng:</strong>{" "}
        {part.rubric.reasoning} | <strong>Kommunikationspoäng:</strong> {part.rubric.communication}
      </p>
      <label>
        <input
          type="checkbox"
          checked={selection.method}
          onChange={(event) => onChange({ ...selection, method: event.target.checked })}
        />
        Jag använde en rimlig metod
      </label>
      <label>
        <input
          type="checkbox"
          checked={selection.reasoning}
          onChange={(event) => onChange({ ...selection, reasoning: event.target.checked })}
        />
        Jag resonerade tydligt
      </label>
      <label>
        <input
          type="checkbox"
          checked={selection.communication}
          onChange={(event) => onChange({ ...selection, communication: event.target.checked })}
        />
        Jag redovisade så att någon annan kan förstå
      </label>
    </section>
  );
}
