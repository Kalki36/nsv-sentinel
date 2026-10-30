import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  Mail,
  Loader2,
  KeyRound,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Sparkles
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { loginRequest, verifyOtpRequest, resendOtpRequest, googleAuthRequest, oauthVerifyOtpRequest } from "../services/api";
import GoogleOAuthModal from "../components/GoogleOAuthModal";

export default function Login() {
  const [step, setStep] = useState("credentials"); // "credentials" | "otp"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [devOtp, setDevOtp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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

  // Quick fill helper
  function quickFill(presetEmail, presetPw) {
    setEmail(presetEmail);
    setPassword(presetPw);
    setError("");
  }

  // Handle Google OAuth Sign-in or Instant OTP Verification
  async function handleGoogleOAuth(accountData) {
    setError("");
    setGoogleLoading(true);
    let res;
    if (step === "otp") {
      res = await oauthVerifyOtpRequest(accountData.email || email, accountData.google_id);
    } else {
      res = await googleAuthRequest(accountData);
    }
    setGoogleLoading(false);

    if (res.ok) {
      setShowGoogleModal(false);
      login(res.token, res.user);
      navigate("/overview");
    } else {
      setError(res.error || "Google authentication failed. Please try again.");
    }
  }

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
    const res = await loginRequest(email.trim().toLowerCase(), password);
    setLoading(false);

    if (res.ok) {
      if (res.otpRequired) {
        setMaskedEmail(res.maskedEmail || email);
        setDevOtp(res.devOtp || null);
        setEmailSent(Boolean(res.emailSent));
        setStep("otp");
        setCountdown(60);
      } else {
        login(res.token, res.user);
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
    const res = await verifyOtpRequest(email.trim().toLowerCase(), cleanOtp);
    setLoading(false);

    if (res.ok) {
      login(res.token, res.user);
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

    const res = await resendOtpRequest(email.trim().toLowerCase());
    setResending(false);

    if (res.ok) {
      setCountdown(60);
      setDevOtp(res.devOtp || null);
      setEmailSent(Boolean(res.emailSent));
      setSuccess("A fresh verification code has been dispatched to your email.");
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
          <p className="text-sm text-ink-muted mt-1">
            {step === "credentials" ? "Secure Financial Market Intelligence" : "Two-Factor Authentication"}
          </p>
        </div>

        {/* STEP 1: CREDENTIALS FORM */}
        {step === "credentials" && (
          <div className="nsv-panel p-6 space-y-4 shadow-md">
            {/* GOOGLE OAUTH ONE-CLICK SIGN IN */}
            <button
              type="button"
              onClick={() => setShowGoogleModal(true)}
              className="w-full flex items-center justify-center gap-3 rounded-lg border border-panel-border bg-white text-gray-800 font-medium py-2.5 px-4 text-sm hover:bg-gray-50 transition shadow-sm cursor-pointer"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-panel-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-panel px-2 text-ink-faint">or sign in with email</span>
              </div>
            </div>

            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink-muted mb-1.5" htmlFor="email">
                  Email Address / Gmail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" strokeWidth={1.8} />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="analyst@nsv-sentinel.edu or gmail"
                    className="focus-ring w-full rounded-lg border border-panel-border bg-panel-alt py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-ink-muted" htmlFor="password">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[11px] text-signal-ai hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" strokeWidth={1.8} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="focus-ring w-full rounded-lg border border-panel-border bg-panel-alt py-2 pl-9 pr-10 text-sm text-ink placeholder:text-ink-faint"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-signal-sell/10 border border-signal-sell/30 text-xs text-signal-sell">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="focus-ring w-full flex items-center justify-center gap-2 rounded-lg bg-signal-ai text-white font-medium py-2.5 text-sm hover:brightness-110 transition disabled:opacity-50 shadow-sm"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Authenticating…" : "Continue with 2FA"}
              </button>

              {/* Quick-fill sample credentials for evaluators */}
              <div className="pt-2">
                <p className="text-[10px] uppercase font-semibold tracking-wider text-ink-faint mb-1.5 text-center">
                  Quick-Fill Accounts
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => quickFill("analyst@nsv-sentinel.edu", "Sentinel@2026")}
                    className="px-2 py-1 text-[11px] font-medium rounded border border-panel-border bg-panel-alt text-ink hover:border-signal-ai hover:text-signal-ai transition"
                  >
                    Analyst
                  </button>
                  <button
                    type="button"
                    onClick={() => quickFill("admin@nsv-sentinel.edu", "Admin@Sentinel2026")}
                    className="px-2 py-1 text-[11px] font-medium rounded border border-panel-border bg-panel-alt text-ink hover:border-signal-ai hover:text-signal-ai transition"
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => quickFill("sammmy9923@gmail.com", "Password@123")}
                    className="px-2 py-1 text-[11px] font-medium rounded border border-panel-border bg-panel-alt text-ink hover:border-signal-ai hover:text-signal-ai transition truncate"
                    title="sammmy9923@gmail.com"
                  >
                    Gmail
                  </button>
                </div>
              </div>

              {/* Direct Link to Register */}
              <div className="pt-3 border-t border-panel-border text-center text-xs text-ink-muted">
                Don't have an account?{" "}
                <Link to="/register" className="focus-ring text-signal-ai font-semibold hover:underline">
                  Create Account
                </Link>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: OTP VERIFICATION FORM */}
        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} className="nsv-panel p-6 space-y-4 shadow-md">
            <div className="text-center space-y-1">
              <p className="text-xs text-ink-muted">
                A 6-digit authentication code was sent to:
              </p>
              <p className="text-sm font-semibold text-ink font-mono bg-panel-alt py-1 px-3 rounded-lg inline-block border border-panel-border">
                {email}
              </p>
            </div>

            {/* Status alerts */}
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-signal-buy/10 border border-signal-buy/30 text-xs text-signal-buy">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Verification Code Dispatched</p>
                <p className="text-[11px] text-ink-muted mt-0.5 leading-relaxed">
                  Please check your Gmail inbox (and Spam/Junk folder if not immediately visible).
                </p>
              </div>
            </div>

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

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="focus-ring w-full flex items-center justify-center gap-2 rounded-lg bg-signal-ai text-white font-medium py-2.5 text-sm hover:brightness-110 transition disabled:opacity-50 shadow-sm"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Verifying Code…" : "Verify & Sign In"}
            </button>

            {/* Google OAuth Instant Verification */}
            <div className="pt-2 border-t border-panel-border space-y-2">
              <button
                type="button"
                onClick={() => setShowGoogleModal(true)}
                className="w-full flex items-center justify-center gap-2.5 rounded-lg border border-gray-200 bg-white py-2.5 px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-xs transition cursor-pointer"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Verify Instantly with Google OAuth</span>
              </button>
              <p className="text-[11px] text-ink-muted text-center">
                Skips manual OTP and verifies email identity via Google directly.
              </p>
            </div>

            {devOtp && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setOtp(devOtp)}
                  className="text-[11px] text-signal-ai hover:underline font-mono font-medium"
                >
                  ⚡ Auto-fill verification code ({devOtp})
                </button>
              </div>
            )}

            <div className="flex items-center justify-between text-xs pt-1 border-t border-panel-border">
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

            {/* Collapsible Google App Password Help */}
            <div className="pt-2 border-t border-panel-border">
              <button
                type="button"
                onClick={() => setShowHelp(!showHelp)}
                className="w-full flex items-center justify-between text-[11px] text-ink-faint hover:text-ink transition py-1"
              >
                <span className="flex items-center gap-1">
                  <HelpCircle className="h-3 w-3" />
                  Live email delivery setup
                </span>
                {showHelp ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>

              {showHelp && (
                <div className="mt-2 p-2.5 rounded-lg bg-panel-alt border border-panel-border text-[11px] text-ink-muted space-y-1.5 leading-relaxed">
                  <p className="font-semibold text-ink">Gmail Live Delivery Setup (30 Seconds):</p>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Enable <strong>2-Step Verification</strong> at <a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer" className="text-signal-ai underline">Google Security</a>.</li>
                    <li>Generate a 16-character App Password at <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="text-signal-ai underline">Google App Passwords</a>.</li>
                    <li>Paste the 16 characters in <code className="bg-base px-1 py-0.5 rounded text-signal-ai font-mono">backend/.env</code> under <code className="text-ink font-mono">SMTP_PASSWORD</code>.</li>
                  </ol>
                </div>
              )}
            </div>
          </form>
        )}

        {/* GOOGLE OAUTH MODAL */}
        <GoogleOAuthModal
          isOpen={showGoogleModal}
          onClose={() => setShowGoogleModal(false)}
          onSelectAccount={handleGoogleOAuth}
          loading={googleLoading}
        />

        <p className="text-center text-[11px] text-ink-faint mt-6 leading-relaxed">
          Academic prototype — Team Nikhil · Samyak · Vrind. OWASP Top 10 Aligned.
        </p>
      </div>
    </div>
  );
}
