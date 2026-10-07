import { useEffect, useMemo, useState } from "react";
import AuditTable from "../components/AuditTable";
import { LoadingState } from "../components/States";
import { getAuditLogs } from "../services/api";

export default function AuditLogs() {
  const [logs, setLogs] = useState(null);
  const [module, setModule] = useState("All");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    getAuditLogs().then(setLogs);
  }, []);

  const modules = useMemo(() => (logs ? ["All", ...new Set(logs.map((l) => l.module))] : ["All"]), [logs]);
  const statuses = ["All", "Success", "Warning", "Error"];

  const filtered = logs
    ? logs.filter((l) => (module === "All" || l.module === module) && (status === "All" || l.status === status))
    : null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink">System Audit Logs</h1>
        <p className="text-xs text-ink-muted mt-1">Chronological record of pipeline and user activity.</p>
      </div>

      <div className="nsv-panel p-4 flex flex-wrap gap-3">
        <FilterSelect label="Module" value={module} onChange={setModule} options={modules} />
        <FilterSelect label="Status" value={status} onChange={setStatus} options={statuses} />
      </div>

      <div className="nsv-panel p-5">
        {!filtered ? <LoadingState label="Loading audit trail" /> : <AuditTable logs={filtered} />}
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-wider text-ink-faint mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="focus-ring rounded-lg border border-panel-border bg-panel-alt px-3 py-2 text-sm text-ink min-w-[140px]"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
