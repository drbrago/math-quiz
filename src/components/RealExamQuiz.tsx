import { useEffect, useMemo, useState } from "react";
import { realExamQuestions as allRealExamQuestions } from "../data/realExamQuestions";
import type { RealExamPoints, RealExamQuestion } from "../data/questionTypes";
import {
  calculateRealExamMaxScore,
  calculateRealExamResultSummary,
  scoreAutoPart,
  scoreSelfAssessmentPart,
  type SelfAssessmentSelection,
} from "../logic/realExamScoring";
import { RealExamQuestionCard } from "./RealExamQuestionCard";
import { RealExamSummary } from "./RealExamSummary";

interface RealExamQuizProps {
  onRestart: () => void;
  questionsOverride?: RealExamQuestion[];
}

export function RealExamQuiz({ onRestart, questionsOverride }: RealExamQuizProps) {
  const questions = useMemo(() => questionsOverride ?? allRealExamQuestions, [questionsOverride]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [answersByPartId, setAnswersByPartId] = useState<Record<string, string>>({});
  const [selfAssessments, setSelfAssessments] = useState<Record<string, SelfAssessmentSelection>>({});
  const [currentAutoPoints, setCurrentAutoPoints] = useState<Record<string, RealExamPoints>>({});
  const [autoPointEntries, setAutoPointEntries] = useState<RealExamPoints[]>([]);
  const [selfAssessedEntries, setSelfAssessedEntries] = useState<RealExamPoints[]>([]);
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    setCurrentIndex(0);
    setSubmitted(false);
    setAnswersByPartId({});
    setSelfAssessments({});
    setCurrentAutoPoints({});
    setAutoPointEntries([]);
    setSelfAssessedEntries([]);
    setFinished(false);
  }, [questions]);

  function updateAnswer(partId: string, value: string) {
    setAnswersByPartId((prev) => ({ ...prev, [partId]: value }));
  }

  function updateSelfAssessment(partId: string, selection: SelfAssessmentSelection) {
    setSelfAssessments((prev) => ({ ...prev, [partId]: selection }));
  }

  function submitTask() {
    if (!currentQuestion) return;
    const scored: Record<string, RealExamPoints> = {};
    for (const part of currentQuestion.parts) {
      scored[part.id] = scoreAutoPart(part, answersByPartId[part.id] ?? "");
    }
    setCurrentAutoPoints(scored);
    setSubmitted(true);
  }

  function nextTask() {
    if (!currentQuestion) return;
    const taskAutoPoints = currentQuestion.parts.map((part) => currentAutoPoints[part.id] ?? { method: 0, reasoning: 0, communication: 0 });
    const taskSelfPoints = currentQuestion.parts.map((part) =>
      scoreSelfAssessmentPart(part, selfAssessments[part.id] ?? { method: false, reasoning: false, communication: false }),
    );

    setAutoPointEntries((prev) => [...prev, ...taskAutoPoints]);
    setSelfAssessedEntries((prev) => [...prev, ...taskSelfPoints]);

    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSubmitted(false);
    setAnswersByPartId({});
    setSelfAssessments({});
    setCurrentAutoPoints({});
  }

  if (finished || !currentQuestion) {
    return (
      <RealExamSummary
        summary={calculateRealExamResultSummary({
          maxScore: calculateRealExamMaxScore(questions),
          autoPoints: autoPointEntries,
          selfAssessedPoints: selfAssessedEntries,
        })}
        onRestart={onRestart}
      />
    );
  }

  const allAnswered = currentQuestion.parts.every((part) => (answersByPartId[part.id] ?? "").trim() !== "");

  return (
    <section className="quiz-view">
      <header className="quiz-header">
        <button className="link-button" onClick={onRestart}>
          Välj provdel
        </button>
        <p>
          Uppgift {currentIndex + 1} av {questions.length}
        </p>
      </header>
      <RealExamQuestionCard
        question={currentQuestion}
        answers={answersByPartId}
        submitted={submitted}
        selfAssessments={selfAssessments}
        onAnswerChange={updateAnswer}
        onSelfAssessmentChange={updateSelfAssessment}
      />
      <div className="actions">
        {!submitted ? (
          <button className="primary" onClick={submitTask} disabled={!allAnswered}>
            Visa lösning och bedömning
          </button>
        ) : (
          <button className="primary" onClick={nextTask}>
            Nästa uppgift
          </button>
        )}
      </div>
    </section>
  );
}
