const TONES = {
  buy: "bg-signal-buysoft text-signal-buy border-signal-buy/30",
  sell: "bg-signal-sellsoft text-signal-sell border-signal-sell/30",
  warn: "bg-signal-warnsoft text-signal-warn border-signal-warn/30",
  ai: "bg-signal-aisoft text-signal-ai border-signal-ai/30",
  neutral: "bg-panel-alt text-ink-muted border-panel-border",
};

const RISK_TONE = {
  High: "sell",
  Medium: "warn",
  Low: "buy",
};

const STATUS_TONE = {
  Alert: "sell",
  Review: "warn",
  Normal: "buy",
  Verified: "buy",
  Secure: "buy",
  Contained: "warn",
  Success: "buy",
  Warning: "warn",
  Error: "sell",
};

export default function StatusBadge({ tone, label, dot = false }) {
  const resolved = tone || STATUS_TONE[label] || RISK_TONE[label] || "neutral";
  const cls = TONES[resolved] || TONES.neutral;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium tracking-wide ${cls}`}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {label}
    </span>
  );
}
