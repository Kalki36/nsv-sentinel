export default function MetricRow({ label, value, tone }) {
  const toneCls = tone === "buy" ? "text-signal-buy" : tone === "sell" ? "text-signal-sell" : tone === "warn" ? "text-signal-warn" : "text-gray-900";
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <span className={`data-num text-xs font-bold ${toneCls}`}>{value}</span>
    </div>
  );
}
