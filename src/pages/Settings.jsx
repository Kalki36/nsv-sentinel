import { useState } from "react";
import { User, Lock, Bell, Database, LayoutDashboard, CheckCircle2, AlertCircle } from "lucide-react";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "data", label: "Data Sources", icon: Database },
  { id: "dashboard", label: "Dashboard Preferences", icon: LayoutDashboard },
];

export default function Settings() {
  const [tab, setTab] = useState("profile");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink">Settings</h1>
        <p className="text-xs text-ink-muted mt-1">Configure your analyst account, security credentials, and dashboard parameters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5">
        <div className="nsv-panel p-2 flex md:flex-col gap-1 overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`focus-ring flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm shrink-0 transition-colors cursor-pointer ${
                tab === id ? "bg-signal-aisoft text-signal-ai font-medium" : "text-ink-muted hover:text-ink hover:bg-panel-alt"
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={1.8} />
              {label}
            </button>
          ))}
        </div>

        <div className="nsv-panel p-6">
          {tab === "profile" && <ProfilePane />}
          {tab === "security" && <SecurityPane />}
          {tab === "notifications" && <NotificationsPane />}
          {tab === "data" && <DataSourcesPane />}
          {tab === "dashboard" && <DashboardPane />}
        </div>
      </div>
    </div>
  );
}

function ProfilePane() {
  const [name, setName] = useState("N. Sharma");
  const [email, setEmail] = useState("analyst@nsv-sentinel.edu");
  const [msg, setMsg] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setMsg("Profile details updated successfully.");
    setTimeout(() => setMsg(""), 3500);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <h3 className="font-display text-sm font-semibold text-ink mb-1">Profile Information</h3>
      
      {msg && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-signal-buysoft text-signal-buy text-xs">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {msg}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-ink-muted mb-1.5">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="focus-ring w-full rounded-lg border border-panel-border bg-panel-alt px-3 py-2 text-sm text-ink"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-ink-muted mb-1.5">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="focus-ring w-full rounded-lg border border-panel-border bg-panel-alt px-3 py-2 text-sm text-ink"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-ink-muted mb-1.5">Assigned Role</label>
        <input
          type="text"
          disabled
          value="Compliance Analyst"
          className="w-full rounded-lg border border-panel-border bg-panel-alt/50 px-3 py-2 text-sm text-ink-faint cursor-not-allowed"
        />
      </div>

      <button type="submit" className="focus-ring rounded-lg bg-signal-ai text-base text-sm font-medium px-4 py-2 hover:brightness-110 cursor-pointer">
        Save changes
      </button>
    </form>
  );
}

function SecurityPane() {
  const [curr, setCurr] = useState("");
  const [next, setNext] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [sessions, setSessions] = useState([
    "Chrome — Bengaluru, IN (this device)",
    "Mobile App — Bengaluru, IN"
  ]);

  function handlePasswordSubmit(e) {
    e.preventDefault();
    setMsg("");
    setErr("");
    if (!curr) {
      setErr("Please enter your current password.");
      return;
    }
    if (next.length < 8) {
      setErr("New password must be at least 8 characters.");
      return;
    }
    setMsg("Password updated successfully.");
    setCurr("");
    setNext("");
    setTimeout(() => setMsg(""), 3500);
  }

  function revokeSession(s) {
    setSessions(sessions.filter(item => item !== s));
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-sm">
        <h3 className="font-display text-sm font-semibold text-ink mb-1">Change Password</h3>
        
        {msg && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-signal-buysoft text-signal-buy text-xs">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {msg}
          </div>
        )}
        {err && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-signal-sellsoft text-signal-sell text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {err}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-ink-muted mb-1.5">Current Password</label>
          <input
            type="password"
            value={curr}
            onChange={(e) => setCurr(e.target.value)}
            placeholder="••••••••"
            className="focus-ring w-full rounded-lg border border-panel-border bg-panel-alt px-3 py-2 text-sm text-ink"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-muted mb-1.5">New Password</label>
          <input
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            placeholder="••••••••"
            className="focus-ring w-full rounded-lg border border-panel-border bg-panel-alt px-3 py-2 text-sm text-ink"
          />
        </div>

        <button type="submit" className="focus-ring rounded-lg bg-signal-ai text-base text-sm font-medium px-4 py-2 hover:brightness-110 cursor-pointer">
          Update password
        </button>
      </form>

      <div>
        <h3 className="font-display text-sm font-semibold text-ink mb-3">Active Sessions</h3>
        <div className="nsv-panel-alt rounded-lg divide-y divide-panel-border max-w-lg">
          {sessions.length === 0 ? (
            <div className="px-3 py-2.5 text-xs text-ink-faint">No other active sessions.</div>
          ) : (
            sessions.map((s) => (
              <div key={s} className="flex items-center justify-between px-3 py-2.5 text-sm">
                <span className="text-ink-muted text-xs">{s}</span>
                {s.includes("this device") ? (
                  <span className="text-[11px] text-signal-buy font-medium">Active</span>
                ) : (
                  <button
                    onClick={() => revokeSession(s)}
                    className="focus-ring text-xs text-signal-sell hover:underline cursor-pointer"
                  >
                    Revoke
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function NotificationsPane() {
  const [msg, setMsg] = useState("");
  const options = ["Critical surveillance alerts", "Security events", "AI recommendation changes", "Weekly summary report"];

  return (
    <div className="space-y-4 max-w-sm">
      <h3 className="font-display text-sm font-semibold text-ink mb-1">Notification Preferences</h3>
      {msg && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-signal-buysoft text-signal-buy text-xs">
          <CheckCircle2 className="h-4 w-4" />
          {msg}
        </div>
      )}
      {options.map((o) => (
        <label key={o} className="flex items-center justify-between text-sm text-ink-muted py-1.5 cursor-pointer">
          {o}
          <input
            type="checkbox"
            defaultChecked
            onChange={() => {
              setMsg("Preferences saved");
              setTimeout(() => setMsg(""), 2500);
            }}
            className="rounded border-panel-border bg-panel-alt accent-signal-ai cursor-pointer"
          />
        </label>
      ))}
    </div>
  );
}

function DataSourcesPane() {
  const sources = [
    { name: "NSE Market Feed Provider", status: "Connected (FastAPI Live)", tone: "buy" },
    { name: "BSE Market Feed Provider", status: "Connected (FastAPI Live)", tone: "buy" },
    { name: "Financial News Aggregator", status: "Connected (Live Feed)", tone: "buy" },
    { name: "FinBERT Sentiment Service", status: "Active (Transformers ML)", tone: "buy" },
    { name: "Statistical Anomaly Engine", status: "Active (Z-Score / Isolation Forest)", tone: "buy" },
  ];
  return (
    <div className="max-w-lg">
      <h3 className="font-display text-sm font-semibold text-ink mb-3">Live Backend Services & Data Sources</h3>
      <div className="nsv-panel-alt rounded-lg divide-y divide-panel-border">
        {sources.map((s) => (
          <div key={s.name} className="flex items-center justify-between px-3.5 py-3 text-sm">
            <span className="text-ink font-medium text-xs">{s.name}</span>
            <span className="text-xs text-signal-buy font-medium">{s.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardPane() {
  const [msg, setMsg] = useState("");
  return (
    <div className="space-y-4 max-w-sm">
      <h3 className="font-display text-sm font-semibold text-ink mb-1">Dashboard Preferences</h3>
      {msg && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-signal-buysoft text-signal-buy text-xs">
          <CheckCircle2 className="h-4 w-4" />
          {msg}
        </div>
      )}
      <label className="flex items-center justify-between text-sm text-ink-muted py-1.5">
        Default Market
        <select
          onChange={() => { setMsg("Preferences saved"); setTimeout(() => setMsg(""), 2000); }}
          className="focus-ring rounded-lg border border-panel-border bg-panel-alt px-2 py-1 text-sm text-ink"
        >
          <option>NSE</option>
          <option>BSE</option>
        </select>
      </label>
      <label className="flex items-center justify-between text-sm text-ink-muted py-1.5">
        Default Chart Range
        <select
          onChange={() => { setMsg("Preferences saved"); setTimeout(() => setMsg(""), 2000); }}
          className="focus-ring rounded-lg border border-panel-border bg-panel-alt px-2 py-1 text-sm text-ink"
        >
          <option>1D</option>
          <option>1W</option>
          <option>1M</option>
        </select>
      </label>
    </div>
  );
}
