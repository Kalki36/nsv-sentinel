const TONE_TEXT = {
  buy: "text-signal-buy",
  sell: "text-signal-sell",
  warn: "text-signal-warn",
  ai: "text-zerodha-red",
  neutral: "text-gray-900",
};

export default function KpiCard({ icon: Icon, label, value, sub, tone = "neutral" }) {
  return (
    <div className="nsv-panel p-4 flex flex-col gap-2.5 min-w-0 bg-white border border-gray-200 rounded-xl shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{label}</span>
        {Icon && <Icon className={`h-4 w-4 ${TONE_TEXT[tone]}`} strokeWidth={2} />}
      </div>
      <div className={`font-display text-2xl font-bold ${TONE_TEXT[tone]} truncate`}>{value}</div>
      {sub && <p className="text-xs font-medium text-gray-500 truncate">{sub}</p>}
    </div>
  );
}
