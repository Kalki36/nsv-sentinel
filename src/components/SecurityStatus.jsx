import { ShieldCheck, FileCheck2, KeyRound, ScanEye } from "lucide-react";
import { EmptyState } from "./States";

const ICONS = { integrity: FileCheck2, auth: KeyRound, api: ShieldCheck, adversarial: ScanEye };

export function SecurityStatusCards({ status }) {
  if (!status) return <EmptyState label="Security status unavailable" />;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {status.cards.map((c) => {
        const Icon = ICONS[c.id] || ShieldCheck;
        return (
          <div key={c.id} className="nsv-panel p-4 flex flex-col gap-3">
            <Icon className="h-5 w-5 text-signal-buy" strokeWidth={1.7} />
            <div>
              <p className="text-[11px] uppercase tracking-wider text-ink-faint mb-1">{c.label}</p>
              <p className="font-display text-lg font-semibold text-signal-buy">{c.status}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function SecurityEventTable({ events, onSelect }) {
  if (!events?.length) return <EmptyState label="No security events logged" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wider text-ink-faint border-b border-panel-border">
            <th className="py-2.5 pr-4 font-medium">Time</th>
            <th className="py-2.5 pr-4 font-medium">Event</th>
            <th className="py-2.5 pr-4 font-medium">Severity</th>
            <th className="py-2.5 pr-4 font-medium">Action</th>
            <th className="py-2.5 pr-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr
              key={e.id}
              onClick={() => onSelect?.(e)}
              className="border-b border-panel-border/60 last:border-0 hover:bg-panel-alt cursor-pointer transition-colors"
            >
              <td className="py-3 pr-4 data-num text-ink-faint">{e.time}</td>
              <td className="py-3 pr-4 text-ink">{e.event}</td>
              <td className="py-3 pr-4">
                <SeverityDot severity={e.severity} />
              </td>
              <td className="py-3 pr-4 text-ink-muted">{e.action}</td>
              <td className="py-3 pr-4">
                <span className={`text-xs font-medium ${e.status === "Verified" ? "text-signal-buy" : "text-signal-warn"}`}>{e.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SeverityDot({ severity }) {
  const tone = severity === "High" ? "bg-signal-sell" : severity === "Medium" ? "bg-signal-warn" : "bg-ink-faint";
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
      <span className={`h-1.5 w-1.5 rounded-full ${tone}`} />
      {severity}
    </span>
  );
}
