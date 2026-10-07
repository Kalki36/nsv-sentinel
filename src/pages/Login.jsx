import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Lock, Mail, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { loginRequest } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Enter both email/username and password to continue.");
      return;
    }
    setLoading(true);
    await loginRequest(email, password);
    setLoading(false);
    login();
    navigate("/overview");
  }

  return (
    <div className="min-h-screen bg-base bg-grid bg-[length:28px_28px] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="rounded-2xl border border-signal-ai/25 bg-signal-aisoft p-3 mb-4">
            <ShieldCheck className="h-7 w-7 text-signal-ai" strokeWidth={1.6} />
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink tracking-wide">NSV SENTINEL</h1>
          <p className="text-sm text-ink-muted mt-1">Secure Financial Market Intelligence</p>
        </div>

        <form onSubmit={handleSubmit} className="nsv-panel p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1.5" htmlFor="email">
              Email / Username
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" strokeWidth={1.8} />
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@nsv-sentinel.edu"
                className="focus-ring w-full rounded-lg border border-panel-border bg-panel-alt py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1.5" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" strokeWidth={1.8} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="focus-ring w-full rounded-lg border border-panel-border bg-panel-alt py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint"
              />
            </div>
          </div>

          {error && <p className="text-xs text-signal-sell">{error}</p>}

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-ink-muted cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded border-panel-border bg-panel-alt accent-signal-ai"
              />
              Remember me
            </label>
            <button type="button" className="focus-ring text-signal-ai hover:underline">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="focus-ring w-full flex items-center justify-center gap-2 rounded-lg bg-signal-ai text-base font-medium py-2.5 text-sm hover:brightness-110 transition disabled:opacity-70"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Authenticating…" : "Login"}
          </button>

          <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-ink-faint">
            <Lock className="h-3 w-3" strokeWidth={1.8} />
            Secure encrypted connection
          </div>

          <div className="pt-3 border-t border-panel-border text-center text-xs text-ink-muted">
            Don't have an account?{" "}
            <Link to="/register" className="focus-ring text-signal-ai font-medium hover:underline">
              Sign Up
            </Link>
          </div>
        </form>

        <p className="text-center text-[11px] text-ink-faint mt-6 leading-relaxed">
          Academic prototype — Team Nikhil · Samyak · Vrind. Not a licensed financial
          advisory platform. Mock data only.
        </p>
      </div>
    </div>
  );
}
