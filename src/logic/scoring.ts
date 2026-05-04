import type { Question, QuizResult, UserAnswer } from "../data/questionTypes";

export function calculateResult(questions: Question[], answers: UserAnswer[]): QuizResult {
  const maxScore = questions.reduce((sum, question) => sum + question.points, 0);
  const score = answers.reduce((sum, answer) => sum + answer.pointsAwarded, 0);
  const percentage = maxScore === 0 ? 0 : Math.round((score / maxScore) * 100);

  return {
    score,
    maxScore,
    percentage,
    answers,
    incorrect: answers
      .filter((answer) => !answer.isCorrect)
      .map((answer) => ({
        question: questions.find((question) => question.id === answer.questionId)!,
        answer: answer.answer,
      }))
      .filter((item) => Boolean(item.question)),
  };
}
