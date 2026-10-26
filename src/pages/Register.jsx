import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Lock, Mail, User, CheckCircle2, AlertCircle, Loader2, KeyRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { registerRequest } from "../services/api";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ANALYST");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState(1); // Step 1: Form, Step 2: Email Verification
  const [sentCode, setSentCode] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const isEmailValid = EMAIL_REGEX.test(email);
  
  const passwordStrength = 
    password.length === 0 ? "" :
    password.length < 6 ? "Weak" :
    password.length < 10 || !/[0-9]/.test(password) ? "Medium" : "Strong";

  const strengthColor = 
    passwordStrength === "Weak" ? "text-signal-sell" :
    passwordStrength === "Medium" ? "text-signal-warn" : "text-signal-buy";

  function handleSendVerification(e) {
    e.preventDefault();
    setError("");
    if (!fullName || fullName.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (!email || !isEmailValid) {
      setError("Please enter a valid academic/institutional email address.");
      return;
    }
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    // Simulate sending 6-digit verification code
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setTimeout(() => {
      setSentCode(generated);
      setLoading(false);
      setStep(2);
      setInfo(`Security verification code sent to ${email}. (Demo Code: ${generated})`);
    }, 600);
  }

  async function handleFinalSubmit(e) {
    e.preventDefault();
    setError("");
    if (!verificationCode || verificationCode.trim() !== sentCode) {
      setError("Invalid security verification code. Please check your email code.");
      return;
    }

    setLoading(true);
    const res = await registerRequest(email, password, fullName, role);
    setLoading(false);

    if (res.ok) {
      login(res.token);
      navigate("/overview");
    } else {
      setError(res.error || "Registration failed. Email may already be registered.");
    }
  }

  return (
    <div className="min-h-screen bg-base bg-grid bg-[length:28px_28px] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="rounded-2xl border border-signal-ai/25 bg-signal-aisoft p-3 mb-3">
            <ShieldCheck className="h-7 w-7 text-signal-ai" strokeWidth={1.6} />
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink tracking-wide">NSV SENTINEL</h1>
          <p className="text-sm text-ink-muted mt-1">Create Institutional Account</p>
        </div>

        <form onSubmit={step === 1 ? handleSendVerification : handleFinalSubmit} className="nsv-panel p-6 space-y-4">
          {step === 1 ? (
            <>
              <div>
                <label className="block text-xs font-medium text-ink-muted mb-1.5" htmlFor="fullName">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" strokeWidth={1.8} />
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="N. Sharma"
                    className="focus-ring w-full rounded-lg border border-panel-border bg-panel-alt py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-ink-muted" htmlFor="email">
                    Institutional Email
                  </label>
                  {email && (
                    <span className={`flex items-center gap-1 text-[11px] ${isEmailValid ? "text-signal-buy" : "text-signal-sell"}`}>
                      {isEmailValid ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" /> Valid email
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3" /> Invalid format
                        </>
                      )}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" strokeWidth={1.8} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="analyst@nsv-sentinel.edu"
                    className={`focus-ring w-full rounded-lg border bg-panel-alt py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint ${
                      email ? (isEmailValid ? "border-signal-buy/40" : "border-signal-sell/50") : "border-panel-border"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-muted mb-1.5" htmlFor="role">
                  Access Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="focus-ring w-full rounded-lg border border-panel-border bg-panel-alt py-2.5 px-3 text-sm text-ink"
                >
                  <option value="ANALYST">Compliance Analyst (Full Surveillance & AI Access)</option>
                  <option value="VIEWER">Security Viewer (Read-only Intelligence)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-ink-muted" htmlFor="password">
                    Password
                  </label>
                  {passwordStrength && (
                    <span className={`text-[11px] font-medium ${strengthColor}`}>
                      Strength: {passwordStrength}
                    </span>
                  )}
                </div>
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
                <p className="text-[10px] text-ink-faint mt-1">Minimum 8 characters with at least 1 number.</p>
              </div>

              {error && <p className="text-xs text-signal-sell bg-signal-sellsoft p-2.5 rounded-lg">{error}</p>}

              <button
                type="submit"
                disabled={loading || !isEmailValid || password.length < 8}
                className="focus-ring w-full flex items-center justify-center gap-2 rounded-lg bg-signal-ai text-base font-medium py-2.5 text-sm hover:brightness-110 transition disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Email Verification Code"}
              </button>
            </>
          ) : (
            <>
              <div className="p-3 rounded-lg bg-signal-aisoft border border-signal-ai/30 text-xs text-ink-muted space-y-1">
                <p className="font-semibold text-signal-ai">Security Verification Code Required</p>
                <p>{info}</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-muted mb-1.5" htmlFor="code">
                  6-Digit Verification PIN Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" strokeWidth={1.8} />
                  <input
                    id="code"
                    type="text"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="123456"
                    className="focus-ring w-full rounded-lg border border-panel-border bg-panel-alt py-2.5 pl-9 pr-3 text-base data-num text-ink tracking-widest placeholder:text-ink-faint"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-signal-sell bg-signal-sellsoft p-2.5 rounded-lg">{error}</p>}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="focus-ring w-1/3 rounded-lg border border-panel-border py-2.5 text-xs text-ink-muted hover:bg-panel-alt"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || verificationCode.length !== 6}
                  className="focus-ring w-2/3 flex items-center justify-center gap-2 rounded-lg bg-signal-ai text-base font-medium py-2.5 text-sm hover:brightness-110 transition disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Complete Signup"}
                </button>
              </div>
            </>
          )}

          <div className="pt-2 border-t border-panel-border text-center text-xs text-ink-muted">
            Already have an account?{" "}
            <Link to="/login" className="focus-ring text-signal-ai font-medium hover:underline">
              Sign In
            </Link>
          </div>
        </form>

        <p className="text-center text-[11px] text-ink-faint mt-6 leading-relaxed">
          Academic prototype — OWASP Top 10 Aligned Security Layer.
        </p>
      </div>
    </div>
  );
}
