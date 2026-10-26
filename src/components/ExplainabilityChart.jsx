export default function ExplainabilityChart({ factors }) {
  const max = Math.max(...factors.map((f) => Math.abs(f.value)), 1);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end gap-4 text-[11px] font-semibold text-gray-500 pb-1 border-b border-gray-100">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span>Positive Driver (+Impact)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <span>Negative Driver (-Impact)</span>
        </span>
      </div>
      {factors
        .slice()
        .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
        .map((f) => {
          const pct = (Math.abs(f.value) / max) * 100;
          const positive = f.value >= 0;
          return (
            <div key={f.label} className="flex items-center gap-3">
              <span className="w-36 shrink-0 text-xs text-ink-muted truncate">{f.label}</span>
              <div className="flex-1 h-6 rounded-md bg-panel-alt relative overflow-hidden">
                <div
                  className={`h-full rounded-md ${positive ? "bg-signal-buy/70" : "bg-signal-sell/70"}`}
                  style={{ width: `${pct}%`, marginLeft: positive ? "0" : "auto" }}
                />
              </div>
              <span className={`w-14 shrink-0 text-right data-num text-xs font-medium ${positive ? "text-signal-buy" : "text-signal-sell"}`}>
                {positive ? "+" : ""}
                {f.value}%
              </span>
            </div>
          );
        })}
    </div>
  );
}
