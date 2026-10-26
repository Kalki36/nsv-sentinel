import StatusBadge from "./StatusBadge";
import { EmptyState } from "./States";

export default function AlertTable({ alerts, onSelect, compact = false }) {
  if (!alerts?.length) return <EmptyState label="No surveillance alerts" hint="All monitored symbols are within expected range." />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wider text-ink-faint border-b border-panel-border">
            <th className="py-2.5 pr-4 font-medium">Stock</th>
            <th className="py-2.5 pr-4 font-medium">Activity</th>
            <th className="py-2.5 pr-4 font-medium">Anomaly Score</th>
            {!compact && <th className="py-2.5 pr-4 font-medium">Detected At</th>}
            <th className="py-2.5 pr-4 font-medium">Risk</th>
            <th className="py-2.5 pr-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((a) => (
            <tr
              key={a.id}
              onClick={() => onSelect?.(a)}
              className="border-b border-panel-border/60 last:border-0 hover:bg-panel-alt cursor-pointer transition-colors focus-ring"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onSelect?.(a)}
            >
              <td className="py-3 pr-4 font-medium text-ink">{a.symbol}</td>
              <td className="py-3 pr-4 text-ink-muted">{a.activity}</td>
              <td className="py-3 pr-4 data-num text-ink">{a.anomalyScore.toFixed(2)}</td>
              {!compact && <td className="py-3 pr-4 data-num text-ink-faint">{a.detectedAt}</td>}
              <td className="py-3 pr-4">
                <StatusBadge label={a.risk} />
              </td>
              <td className="py-3 pr-4">
                <StatusBadge label={a.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
