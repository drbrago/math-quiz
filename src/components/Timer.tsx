import { Clock } from "lucide-react";

interface TimerProps {
  secondsLeft: number;
}

export function Timer({ secondsLeft }: TimerProps) {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="timer" aria-live="polite">
      <Clock aria-hidden="true" size={18} />
      <span>
        {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
