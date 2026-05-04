import { useEffect, useMemo, useState } from "react";
import { questions as allQuestions } from "../data/questions";
import type { Question, QuizMode, UserAnswer } from "../data/questionTypes";
import { calculateResult } from "../logic/scoring";
import { createQuiz, gradeAnswer } from "../logic/quizEngine";
import { ProgressBar } from "./ProgressBar";
import { QuestionCard } from "./QuestionCard";
import { ResultSummary } from "./ResultSummary";
import { Timer } from "./Timer";

interface QuizProps {
  mode: QuizMode;
  onRestart: () => void;
  questionsOverride?: Question[];
}

const TEN_MINUTES = 10 * 60;

export function Quiz({ mode, onRestart, questionsOverride }: QuizProps) {
  const initialQuestions = useMemo(
    () => questionsOverride ?? createQuiz(mode, allQuestions).questions,
    [mode, questionsOverride],
  );
  const [quizQuestions, setQuizQuestions] = useState(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [draftAnswer, setDraftAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TEN_MINUTES);
  const [finished, setFinished] = useState(false);

  const currentQuestion = quizQuestions[currentIndex];
  const latestAnswer = answers[answers.length - 1];
  const isTenMinute = mode === "tenMinute";

  useEffect(() => {
    setQuizQuestions(initialQuestions);
    setCurrentIndex(0);
    setAnswers([]);
    setDraftAnswer("");
    setSubmitted(false);
    setSecondsLeft(TEN_MINUTES);
    setFinished(false);
  }, [initialQuestions]);

  useEffect(() => {
    if (!isTenMinute || finished) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          setFinished(true);
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [finished, isTenMinute]);

  useEffect(() => {
    if (answers.length > 0 && typeof window.localStorage?.setItem === "function") {
      window.localStorage.setItem("mathQuizLastScore", JSON.stringify(answers));
    }
  }, [answers]);

  function submitAnswer() {
    const graded = gradeAnswer(currentQuestion, draftAnswer);
    setAnswers((value) => [...value, graded]);
    setSubmitted(true);
  }

  function nextQuestion() {
    if (currentIndex + 1 >= quizQuestions.length) {
      setFinished(true);
      return;
    }

    setCurrentIndex((value) => value + 1);
    setDraftAnswer("");
    setSubmitted(false);
  }

  function retryWrong() {
    const wrongIds = new Set(result.incorrect.map((item) => item.question.id));
    setQuizQuestions(quizQuestions.filter((question) => wrongIds.has(question.id)));
    setCurrentIndex(0);
    setAnswers([]);
    setDraftAnswer("");
    setSubmitted(false);
    setFinished(false);
    setSecondsLeft(TEN_MINUTES);
  }

  const result = calculateResult(quizQuestions, answers);

  if (finished || !currentQuestion) {
    return <ResultSummary result={result} onRestart={onRestart} onRetryWrong={retryWrong} />;
  }

  return (
    <section className="quiz-view">
      <header className="quiz-header">
        <button className="link-button" onClick={onRestart}>
          Välj provdel
        </button>
        {isTenMinute && <Timer secondsLeft={secondsLeft} />}
      </header>

      <ProgressBar current={currentIndex + 1} total={quizQuestions.length} />
      <QuestionCard
        question={currentQuestion}
        answer={draftAnswer}
        submitted={submitted}
        isCorrect={submitted ? latestAnswer?.isCorrect ?? false : null}
        onAnswerChange={setDraftAnswer}
        onSubmit={submitAnswer}
        onNext={nextQuestion}
      />
    </section>
  );
}
