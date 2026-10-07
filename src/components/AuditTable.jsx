import { EmptyState } from "./States";

const STATUS_TONE = { Success: "text-signal-buy", Warning: "text-signal-warn", Error: "text-signal-sell" };

export default function AuditTable({ logs }) {
  if (!logs?.length) return <EmptyState label="No audit events for this filter" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wider text-ink-faint border-b border-panel-border">
            <th className="py-2.5 pr-4 font-medium">Timestamp</th>
            <th className="py-2.5 pr-4 font-medium">User / System</th>
            <th className="py-2.5 pr-4 font-medium">Event</th>
            <th className="py-2.5 pr-4 font-medium">Module</th>
            <th className="py-2.5 pr-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l.id} className="border-b border-panel-border/60 last:border-0 hover:bg-panel-alt transition-colors">
              <td className="py-3 pr-4 data-num text-ink-faint">{l.timestamp}</td>
              <td className="py-3 pr-4 text-ink-muted">{l.actor}</td>
              <td className="py-3 pr-4 text-ink">{l.event}</td>
              <td className="py-3 pr-4">
                <span className="rounded-md border border-panel-border bg-panel-alt px-2 py-0.5 text-[11px] text-ink-muted">{l.module}</span>
              </td>
              <td className={`py-3 pr-4 text-xs font-medium ${STATUS_TONE[l.status] || "text-ink-muted"}`}>{l.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
