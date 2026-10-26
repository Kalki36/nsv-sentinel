import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Lock, Mail, Loader2, KeyRound, ArrowLeft, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { loginRequest, verifyOtpRequest, resendOtpRequest } from "../services/api";

export default function Login() {
  const [step, setStep] = useState("credentials"); // "credentials" | "otp"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [devOtp, setDevOtp] = useState(null);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);

  const otpInputRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Focus OTP input when transitioning to OTP step
  useEffect(() => {
    if (step === "otp" && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

  // Step 1: Submit Credentials
  async function handleCredentialsSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email || !password) {
      setError("Please enter both email/username and password.");
      return;
    }

    setLoading(true);
    const res = await loginRequest(email, password);
    setLoading(false);

    if (res.ok) {
      if (res.otpRequired) {
        setMaskedEmail(res.maskedEmail || email);
        setDevOtp(res.devOtp || null);
        setEmailSent(Boolean(res.emailSent));
        setStep("otp");
        setCountdown(60);
        if (res.emailSent) {
          setSuccess(res.message || "A 6-digit verification code has been dispatched to your email address.");
        }
      } else {
        login(res.token);
        navigate("/overview");
      }
    } else {
      setError(res.error || "Authentication failed. Please verify your credentials.");
    }
  }

  // Step 2: Submit OTP
  async function handleOtpSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const cleanOtp = otp.trim().replace(/\s/g, "");
    if (!cleanOtp || cleanOtp.length < 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    const res = await verifyOtpRequest(email, cleanOtp);
    setLoading(false);

    if (res.ok) {
      login(res.token);
      navigate("/overview");
    } else {
      setError(res.error || "Invalid verification code. Please check your email or request a new code.");
    }
  }

  // Resend OTP
  async function handleResendOtp() {
    if (countdown > 0 || resending) return;
    setError("");
    setSuccess("");
    setResending(true);

    const res = await resendOtpRequest(email);
    setResending(false);

    if (res.ok) {
      setCountdown(60);
      setDevOtp(res.devOtp || null);
      setEmailSent(Boolean(res.emailSent));
      if (res.emailSent) {
        setSuccess(res.message || "A fresh verification code has been sent to your email.");
      }
    } else {
      setError(res.error || "Unable to resend verification code. Please try again shortly.");
    }
  }

  return (
    <div className="min-h-screen bg-base bg-grid bg-[length:28px_28px] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="rounded-2xl border border-signal-ai/25 bg-signal-aisoft p-3 mb-4 shadow-sm">
            {step === "otp" ? (
              <KeyRound className="h-7 w-7 text-signal-ai" strokeWidth={1.8} />
            ) : (
              <ShieldCheck className="h-7 w-7 text-signal-ai" strokeWidth={1.8} />
            )}
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink tracking-wide">NSV SENTINEL</h1>
          <p className="text-sm text-ink-muted mt-1">Secure Financial Market Intelligence</p>
        </div>

        {/* STEP 1: CREDENTIALS FORM */}
        {step === "credentials" && (
          <form onSubmit={handleCredentialsSubmit} className="nsv-panel p-6 space-y-4 shadow-md">
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
                  autoComplete="username"
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
                  autoComplete="current-password"
                  className="focus-ring w-full rounded-lg border border-panel-border bg-panel-alt py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-signal-sell/10 border border-signal-sell/30 text-xs text-signal-sell">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

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
              className="focus-ring w-full flex items-center justify-center gap-2 rounded-lg bg-signal-ai text-white font-medium py-2.5 text-sm hover:brightness-110 transition disabled:opacity-70 shadow-sm"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Authenticating…" : "Login & Request OTP"}
            </button>

            <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-ink-faint">
              <Lock className="h-3 w-3" strokeWidth={1.8} />
              Argon2id + 2FA Email Verification Enabled
            </div>

            <div className="pt-3 border-t border-panel-border text-center text-xs text-ink-muted">
              Don't have an account?{" "}
              <Link to="/register" className="focus-ring text-signal-ai font-medium hover:underline">
                Sign Up
              </Link>
            </div>
          </form>
        )}

        {/* STEP 2: 2FA OTP VERIFICATION FORM */}
        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} className="nsv-panel p-6 space-y-4 shadow-md">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-2 rounded-full bg-signal-buy/10 text-signal-buy mb-2">
                <Mail className="h-5 w-5" />
              </div>
              <h2 className="text-base font-semibold text-ink">Two-Factor Authentication</h2>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                Enter the 6-digit security code sent to:
                <br />
                <span className="font-semibold text-ink">{maskedEmail}</span>
              </p>
            </div>

            {emailSent && success && (
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-signal-buy/10 border border-signal-buy/30 text-xs text-signal-buy">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Verification code sent to {maskedEmail}! Check your inbox (and spam folder).</span>
              </div>
            )}

            {!emailSent && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-ink space-y-2">
                <div className="flex items-center gap-1.5 font-semibold text-amber-500">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>Outgoing Email Not Configured</span>
                </div>
                <p className="text-[11px] text-ink-muted leading-relaxed">
                  Real email delivery requires a Gmail App Password in <code className="bg-panel-alt px-1 py-0.5 rounded text-amber-400 font-mono">backend/.env</code>.
                </p>
                {devOtp && (
                  <div className="pt-1.5 flex items-center justify-between border-t border-amber-500/20">
                    <span className="text-[11px] text-ink">
                      Verification Code: <strong className="font-mono text-signal-ai text-sm font-bold tracking-widest">{devOtp}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setOtp(devOtp)}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded bg-signal-ai text-white hover:brightness-110 transition shadow-sm"
                    >
                      Auto-fill Code
                    </button>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-signal-sell/10 border border-signal-sell/30 text-xs text-signal-sell">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1.5 text-center" htmlFor="otp">
                Verification Code (OTP)
              </label>
              <input
                ref={otpInputRef}
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  setOtp(val);
                }}
                placeholder="000000"
                className="focus-ring w-full rounded-lg border-2 border-panel-border bg-panel-alt py-3 px-4 text-center text-2xl font-mono font-bold tracking-[0.45em] text-ink placeholder:text-ink-faint focus:border-signal-ai"
              />
            </div>

            {/* Dev helper pill when email was sent as extra convenience */}
            {emailSent && devOtp && (
              <div className="flex items-center justify-between p-2 rounded-lg bg-panel-alt border border-panel-border text-[11px] text-ink-muted">
                <span>
                  Dev Hint: OTP is <strong className="font-mono text-signal-ai">{devOtp}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setOtp(devOtp)}
                  className="px-2 py-0.5 text-[10px] font-medium rounded bg-signal-ai/15 text-signal-ai hover:bg-signal-ai/25 transition"
                >
                  Auto-fill
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="focus-ring w-full flex items-center justify-center gap-2 rounded-lg bg-signal-ai text-white font-medium py-2.5 text-sm hover:brightness-110 transition disabled:opacity-50 shadow-sm"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Verifying Code…" : "Verify & Sign In"}
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => {
                  setStep("credentials");
                  setOtp("");
                  setError("");
                  setSuccess("");
                }}
                className="inline-flex items-center gap-1 text-ink-muted hover:text-ink transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Change email
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={countdown > 0 || resending}
                className="inline-flex items-center gap-1 text-signal-ai hover:underline disabled:opacity-50 disabled:no-underline font-medium"
              >
                {resending ? (
                  <>
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    Sending…
                  </>
                ) : countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : (
                  <>
                    <RefreshCw className="h-3 w-3" />
                    Resend OTP
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        <p className="text-center text-[11px] text-ink-faint mt-6 leading-relaxed">
          Academic prototype — Team Nikhil · Samyak · Vrind. Not a licensed financial
          advisory platform. Mock data only.
        </p>
      </div>
    </div>
  );
}
