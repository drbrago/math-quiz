import { Calculator, Clock, Shuffle } from "lucide-react";
import type { QuizMode } from "../data/questionTypes";

interface ModeSelectProps {
  onSelect: (mode: QuizMode) => void;
}

const modes: Array<{ mode: QuizMode; title: string; description: string; icon: "part" | "mixed" | "timer" }> = [
  { mode: "B", title: "Matte B", description: "Korta uppgifter utan räknare", icon: "part" },
  { mode: "C", title: "Matte C", description: "Textuppgifter och enheter", icon: "part" },
  { mode: "D", title: "Matte D", description: "Större problem och resonemang", icon: "part" },
  { mode: "E", title: "Matte E", description: "Mönster, formler och förklaringar", icon: "part" },
  { mode: "mixed", title: "Blandat prov", description: "Frågor från alla provdelar", icon: "mixed" },
  { mode: "tenMinute", title: "Prov på 10 minuter", description: "Blandade frågor med nedräkning", icon: "timer" },
  { mode: "realExam", title: "Prov på riktigt", description: "Större uppgifter med deluppgifter och bedömning", icon: "part" },
];

function Icon({ type }: { type: "part" | "mixed" | "timer" }) {
  if (type === "timer") return <Clock aria-hidden="true" />;
  if (type === "mixed") return <Shuffle aria-hidden="true" />;
  return <Calculator aria-hidden="true" />;
}

export function ModeSelect({ onSelect }: ModeSelectProps) {
  return (
    <section className="mode-view">
      <div className="intro">
        <p className="eyebrow">Nationella prov i matematik, åk 6</p>
        <h1>Välj provdel</h1>
        <p>Träna med originalskrivna frågor inspirerade av delprov B, C, D och E.</p>
      </div>

      <div className="mode-grid">
        {modes.map((item) => (
          <button className="mode-button" key={item.mode} onClick={() => onSelect(item.mode)}>
            <span className="mode-icon">
              <Icon type={item.icon} />
            </span>
            <span>
              <strong>{item.title}</strong>
              <small>{item.description}</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
