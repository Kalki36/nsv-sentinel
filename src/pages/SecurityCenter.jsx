import { useEffect, useState } from "react";
import { ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, X, Lock, FileCode, Shield } from "lucide-react";
import { SecurityStatusCards, SecurityEventTable } from "../components/SecurityStatus";
import { LoadingState } from "../components/States";
import { getSecurityStatus, getSecurityEvents } from "../services/api";

export default function SecurityCenter() {
  const [mode, setMode] = useState("secure"); // "secure" or "unsecure"
  const [status, setStatus] = useState(null);
  const [events, setEvents] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setStatus(null);
    getSecurityStatus(mode).then(setStatus);
    getSecurityEvents().then(setEvents);
  }, [mode]);

  const isSecure = (status?.overall === "SECURE");

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink">Security Center</h1>
          <p className="text-xs text-ink-muted mt-1">
            Backend cybersecurity validation layer — cryptographic data integrity, source authentication, and payload sanitization.
          </p>
        </div>
        
        {/* Interactive Mode Simulator Toggle (SECURE vs UNSECURE) */}
        <div className="flex items-center gap-1.5 rounded-lg border border-panel-border p-1 bg-panel-alt">
          <span className="text-[11px] text-ink-faint px-2 font-medium">Security Mode:</span>
          <button
            onClick={() => setMode("secure")}
            className={`focus-ring rounded px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
              mode === "secure" ? "bg-signal-buy text-base" : "text-ink-muted hover:text-ink"
            }`}
          >
            SECURE
          </button>
          <button
            onClick={() => setMode("unsecure")}
            className={`focus-ring rounded px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
              mode === "unsecure" ? "bg-zerodha-red text-base" : "text-ink-muted hover:text-ink"
            }`}
          >
            UNSECURE (Threat Test)
          </button>
        </div>
      </div>

      {/* Main Status Hero Panel */}
      <div className={`nsv-panel p-6 flex flex-col items-center justify-center gap-2 transition-colors ${
        isSecure ? "bg-signal-buysoft/40 border-signal-buy/30" : "bg-zerodha-redsoft/40 border-zerodha-red/40"
      }`}>
        {isSecure ? (
          <>
            <ShieldCheck className="h-10 w-10 text-signal-buy" strokeWidth={1.6} />
            <span className="font-display text-2xl font-bold text-signal-buy tracking-wide">SYSTEM SECURE</span>
            <span className="text-xs text-ink-muted">All 4 validation layers reporting normal integrity status</span>
          </>
        ) : (
          <>
            <ShieldAlert className="h-10 w-10 text-zerodha-red" strokeWidth={1.6} />
            <span className="font-display text-2xl font-bold text-zerodha-red tracking-wide">SYSTEM UNSECURE (THREAT DETECTED)</span>
            <span className="text-xs text-ink-muted">Anomalous market payload and integrity hash mismatch flagged</span>
          </>
        )}
      </div>

      {status ? <SecurityStatusCards status={status} /> : <LoadingState label="Checking validation layers" />}

      {/* Detailed Security Factor Explanations (Explaining WHY Secure or Unsecure) */}
      {status?.factors && (
        <div className="nsv-panel p-5 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-signal-ai" />
            <h3 className="font-display text-sm font-semibold text-ink">Security Factor Explanations</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {status.factors.map((f, i) => {
              const isPass = f.status === "PASS";
              const isWarn = f.status === "WARNING";
              return (
                <div key={i} className="nsv-panel-alt p-3.5 rounded-lg border border-panel-border space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs text-ink">{f.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isPass ? "bg-signal-buysoft text-signal-buy" : isWarn ? "bg-signal-warnsoft text-signal-warn" : "bg-zerodha-redsoft text-zerodha-red"
                    }`}>
                      {f.status}
                    </span>
                  </div>
                  <p className="text-xs text-ink-muted leading-relaxed">{f.explanation}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Security Event Log */}
      <div className="nsv-panel p-5">
        <h3 className="font-display text-sm font-semibold text-ink mb-4">Security Event Log</h3>
        {events ? <SecurityEventTable events={events} onSelect={setSelected} /> : <LoadingState label="Loading event log" />}
      </div>

      {selected && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-md nsv-panel p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-ink-faint">Security Event</p>
                <p className="font-display text-base font-semibold text-ink">{selected.id}</p>
              </div>
              <button onClick={() => setSelected(null)} className="focus-ring rounded-lg p-1.5 text-ink-muted hover:text-ink hover:bg-panel-alt cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="nsv-panel-alt rounded-lg divide-y divide-panel-border">
              {[
                ["Time", selected.time],
                ["Event", selected.event],
                ["Severity", selected.severity],
                ["Action Taken", selected.action],
                ["Status", selected.status],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between px-3 py-2.5">
                  <span className="text-xs text-ink-muted">{label}</span>
                  <span className="text-sm text-ink">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
