import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";

function riskTone(score) {
  if (score >= 70) return { text: "text-signal-sell", bg: "#E5484D", label: "High" };
  if (score >= 40) return { text: "text-signal-warn", bg: "#E8A33D", label: "Moderate" };
  return { text: "text-signal-buy", bg: "#2FBF71", label: "Low" };
}

export function RiskGauge({ score, size = 160 }) {
  const tone = riskTone(score);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference * (1 - score / 100);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 128 128" className="-rotate-90">
        <circle cx="64" cy="64" r="54" fill="none" stroke="#1B2230" strokeWidth="10" />
        <circle
          cx="64"
          cy="64"
          r="54"
          fill="none"
          stroke={tone.bg}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`font-display text-3xl font-semibold ${tone.text}`}>{score}</span>
        <span className="text-[10px] text-ink-faint">/ 100</span>
        <span className={`text-xs font-medium mt-1 ${tone.text}`}>{tone.label.toUpperCase()}</span>
      </div>
    </div>
  );
}

export function RiskBars({ breakdown }) {
  const rows = [
    ["Market Risk", breakdown.market],
    ["Volatility Risk", breakdown.volatility],
    ["Manipulation Risk", breakdown.manipulation],
    ["Sentiment Risk", breakdown.sentiment],
    ["Security Risk", breakdown.security],
  ];
  return (
    <div className="space-y-4">
      {rows.map(([label, value]) => {
        const tone = riskTone(value);
        return (
          <div key={label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-ink-muted">{label}</span>
              <span className={`data-num text-xs font-medium ${tone.text}`}>{value}</span>
            </div>
            <div className="h-1.5 rounded-full bg-panel-alt overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${value}%`, background: tone.bg }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function RiskRadar({ breakdown }) {
  const data = [
    { metric: "Market", value: breakdown.market },
    { metric: "Volatility", value: breakdown.volatility },
    { metric: "Manipulation", value: breakdown.manipulation },
    { metric: "Sentiment", value: breakdown.sentiment },
    { metric: "Security", value: breakdown.security },
  ];
  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data} outerRadius="75%">
        <PolarGrid stroke="#232A38" />
        <PolarAngleAxis dataKey="metric" tick={{ fill: "#8993A6", fontSize: 11 }} />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <Radar dataKey="value" stroke="#4FC3E8" fill="#4FC3E8" fillOpacity={0.25} strokeWidth={2} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
