import { Loader2, Inbox, AlertTriangle } from "lucide-react";

export function LoadingState({ label = "Loading data" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-muted">
      <Loader2 className="h-5 w-5 animate-spin text-signal-ai" />
      <p className="text-sm font-mono">{label}…</p>
    </div>
  );
}

export function EmptyState({ label = "No data available", hint }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-ink-muted">
      <Inbox className="h-6 w-6 text-ink-faint" />
      <p className="text-sm">{label}</p>
      {hint && <p className="text-xs text-ink-faint">{hint}</p>}
    </div>
  );
}

export function ErrorState({ label = "Something went wrong", hint = "Please try again." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-signal-sell">
      <AlertTriangle className="h-6 w-6" />
      <p className="text-sm font-medium">{label}</p>
      {hint && <p className="text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}
