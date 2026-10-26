import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const CONFIG = {
  BUY: { icon: TrendingUp, text: "text-signal-buy", bg: "bg-signal-buysoft", ring: "ring-signal-buy/30" },
  SELL: { icon: TrendingDown, text: "text-signal-sell", bg: "bg-signal-sellsoft", ring: "ring-signal-sell/30" },
  HOLD: { icon: Minus, text: "text-signal-warn", bg: "bg-signal-warnsoft", ring: "ring-signal-warn/30" },
};

export default function DecisionCard({ recommendation, confidence }) {
  const cfg = CONFIG[recommendation] || CONFIG.HOLD;
  const Icon = cfg.icon;
  return (
    <div className={`nsv-panel p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-stretch gap-6 sm:gap-10`}>
      <div className={`flex flex-col items-center justify-center rounded-xl ${cfg.bg} ring-1 ${cfg.ring} px-8 py-6 shrink-0`}>
        <Icon className={`h-9 w-9 ${cfg.text} mb-2`} strokeWidth={1.8} />
        <span className={`font-display text-4xl font-bold ${cfg.text} tracking-wide`}>{recommendation}</span>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-ink-faint mb-1">AI Confidence</p>
          <div className="flex items-center gap-3">
            <span className={`font-display text-2xl font-semibold ${cfg.text}`}>{confidence}%</span>
            <div className="flex-1 h-1.5 rounded-full bg-panel-alt overflow-hidden max-w-xs">
              <div className={`h-full rounded-full ${cfg.text.replace("text-", "bg-")}`} style={{ width: `${confidence}%` }} />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {Object.keys(CONFIG).map((r) => (
            <span
              key={r}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium border ${
                r === recommendation
                  ? `${CONFIG[r].bg} ${CONFIG[r].text} border-current/30`
                  : "text-ink-faint border-panel-border"
              }`}
            >
              {r}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
