import { Database, ShieldCheck, Cpu, Radar, MessageSquareText, Gauge, BrainCircuit, MonitorCheck } from "lucide-react";

const STAGES = [
  { label: "Data Sources", icon: Database },
  { label: "Cybersecurity Validation", icon: ShieldCheck, emphasis: true },
  { label: "Preprocessing", icon: Cpu },
  { label: "AI Analysis", icon: Radar },
  { label: "Sentiment Analysis", icon: MessageSquareText },
  { label: "Risk Analysis", icon: Gauge },
  { label: "Decision Engine", icon: BrainCircuit },
  { label: "Dashboard", icon: MonitorCheck },
];

export default function PipelineRibbon() {
  return (
    <div className="nsv-panel px-4 py-3 overflow-x-auto">
      <div className="flex items-center gap-1 min-w-max">
        {STAGES.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex items-center">
              <div
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                  s.emphasis
                    ? "border-signal-ai/40 bg-signal-aisoft text-signal-ai"
                    : "border-panel-border bg-panel-alt text-ink-muted"
                }`}
              >
                <Icon className="h-3 w-3" strokeWidth={2} />
                {s.label}
              </div>
              {i < STAGES.length - 1 && <div className="h-px w-4 bg-panel-border mx-1" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
