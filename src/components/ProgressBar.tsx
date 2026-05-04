interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const value = total === 0 ? 0 : Math.round((current / total) * 100);

  return (
    <div className="progress-wrap" aria-label={`Fråga ${current} av ${total}`}>
      <div className="progress-label">
        <span>Fråga {current} av {total}</span>
        <span>{value}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
