import { useState } from "react";
import { ModeSelect } from "./components/ModeSelect";
import { Quiz } from "./components/Quiz";
import { RealExamQuiz } from "./components/RealExamQuiz";
import type { QuizMode } from "./data/questionTypes";

export default function App() {
  const [mode, setMode] = useState<QuizMode | null>(null);

  return (
    <main className="app-shell">
      {!mode ? (
        <ModeSelect onSelect={setMode} />
      ) : mode === "realExam" ? (
        <RealExamQuiz onRestart={() => setMode(null)} />
      ) : (
        <Quiz mode={mode} onRestart={() => setMode(null)} />
      )}
    </main>
  );
}
