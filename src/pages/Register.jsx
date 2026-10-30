import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  ArrowLeft,
  RefreshCw,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { requestRegisterOtp, verifyRegisterOtp, googleAuthRequest, oauthVerifyOtpRequest, firebaseRegisterRequest } from "../services/api";
import { sendFirebaseRegistrationOtp, verifyFirebaseRegistrationOtp } from "../services/firebase";
import GoogleOAuthModal from "../components/GoogleOAuthModal";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function Register() {
  const [step, setStep] = useState(1); // 1 = Form, 2 = 2FA OTP
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("ANALYST");

  const [otp, setOtp] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [devOtp, setDevOtp] = useState(null);
  const [infoMessage, setInfoMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const otpInputRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const isEmailValid = EMAIL_REGEX.test(email);

  const passwordStrength =
    password.length === 0
      ? ""
      : password.length < 6
      ? "Weak"
      : password.length < 10 || !/[0-9]/.test(password)
      ? "Medium"
      : "Strong";

  const strengthColor =
    passwordStrength === "Weak"
      ? "text-signal-sell"
      : passwordStrength === "Medium"
      ? "text-signal-warn"
      : "text-signal-buy";

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Focus OTP input when entering step 2
  useEffect(() => {
    if (step === 2 && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

  // Handle Google OAuth Sign-up / Sign-in or Instant Registration Verification
  async function handleGoogleOAuth(accountData) {
    setError("");
    setGoogleLoading(true);
    let res;
    if (step === 2) {
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
      setError(res.error || "Google sign-up failed. Please try again.");
    }
  }

  // Step 1: Submit Registration Form via Firebase OTP
  async function handleRegisterSubmit(e) {
    e.preventDefault();
    setError("");

    if (!fullName || fullName.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (!email || !isEmailValid) {
      setError("Please enter a valid Gmail or institutional email address.");
      return;
    }
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    // Dispatch Firebase Registration OTP
    const fbRes = await sendFirebaseRegistrationOtp(email.trim().toLowerCase(), fullName.trim(), password);
    // Also notify backend pending registration
    const res = await requestRegisterOtp(email.trim().toLowerCase(), password, fullName.trim(), role);
    setLoading(false);

    if (fbRes.ok || res.ok) {
      setMaskedEmail(res.maskedEmail || email);
      setDevOtp(fbRes.devOtp || res.devOtp || null);
      setEmailSent(Boolean(res.emailSent || fbRes.ok));
      setInfoMessage(fbRes.message || "Firebase 6-digit verification code generated.");
      setStep(2);
      setCountdown(60);
    } else {
      setError(res.error || fbRes.error || "Registration failed. An account with this email may already exist.");
    }
  }

  // Step 2: Submit Firebase 2FA OTP
  async function handleOtpSubmit(e) {
    e.preventDefault();
    setError("");

    const cleanOtp = otp.trim().replace(/\s/g, "");
    if (!cleanOtp || cleanOtp.length < 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    // 1. Verify OTP with Firebase
    const fbVerify = await verifyFirebaseRegistrationOtp(email.trim().toLowerCase(), cleanOtp);

    // 2. Register user in database with Argon2id password hash
    let res;
    if (fbVerify.ok) {
      res = await firebaseRegisterRequest(
        email.trim().toLowerCase(),
        fullName.trim(),
        password,
        cleanOtp,
        fbVerify.firebaseToken
      );
    } else {
      // Fallback to backend registration verification
      res = await verifyRegisterOtp(email.trim().toLowerCase(), cleanOtp);
    }
    setLoading(false);

    if (res.ok) {
      login(res.token, res.user);
      navigate("/overview");
    } else {
      setError(res.error || fbVerify.error || "Invalid verification code. Please check your email or request a new code.");
    }
  }

  // Resend OTP via Firebase
  async function handleResendOtp() {
    if (countdown > 0 || resending) return;
    setError("");
    setResending(true);

    const fbRes = await sendFirebaseRegistrationOtp(email.trim().toLowerCase(), fullName.trim(), password);
    const res = await requestRegisterOtp(email.trim().toLowerCase(), password, fullName.trim(), role);
    setResending(false);

    if (fbRes.ok || res.ok) {
      setCountdown(60);
      setDevOtp(fbRes.devOtp || res.devOtp || null);
      setEmailSent(true);
    } else {
      setError(res.error || "Unable to resend verification code. Please try again shortly.");
    }
  }

  return (
    <div className="min-h-screen bg-base bg-grid bg-[length:28px_28px] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="rounded-2xl border border-signal-ai/25 bg-signal-aisoft p-3 mb-3 shadow-sm">
            {step === 2 ? (
              <KeyRound className="h-7 w-7 text-signal-ai" strokeWidth={1.8} />
            ) : (
              <ShieldCheck className="h-7 w-7 text-signal-ai" strokeWidth={1.8} />
            )}
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink tracking-wide">NSV SENTINEL</h1>
          <p className="text-sm text-ink-muted mt-1">
            {step === 1 ? "Create Secure Platform Account" : "Two-Factor Email Verification"}
          </p>
        </div>

        {/* STEP 1: REGISTRATION FORM */}
        {step === 1 && (
          <div className="nsv-panel p-6 space-y-4 shadow-md">
            {/* GOOGLE OAUTH ONE-CLICK SIGN UP */}
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
              <span>Sign up with Google</span>
            </button>

            {/* Divider */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-panel-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-panel px-2 text-ink-faint">or register with email</span>
              </div>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink-muted mb-1.5" htmlFor="fullName">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" strokeWidth={1.8} />
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Samyak Padliya"
                    className="focus-ring w-full rounded-lg border border-panel-border bg-panel-alt py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-ink-muted" htmlFor="email">
                    Gmail / Institutional Email
                  </label>
                  {email && (
                    <span className={`text-[11px] ${isEmailValid ? "text-signal-buy" : "text-signal-sell"}`}>
                      {isEmailValid ? "Valid format" : "Invalid email"}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" strokeWidth={1.8} />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sammmy9923@gmail.com"
                    className="focus-ring w-full rounded-lg border border-panel-border bg-panel-alt py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-muted mb-1.5" htmlFor="role">
                  Account Role & Authorization Level
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="focus-ring w-full rounded-lg border border-panel-border bg-panel-alt py-2.5 px-3 text-sm text-ink"
                >
                  <option value="ANALYST">Compliance Analyst (Full Market Surveillance, AI & Trading Access)</option>
                  <option value="ADMIN">Security Administrator (Full System, Audit & User Management)</option>
                  <option value="VIEWER">Security Viewer (Read-Only Intelligence Dashboard)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-ink-muted" htmlFor="password">
                      Password
                    </label>
                    {passwordStrength && (
                      <span className={`text-[11px] font-medium ${strengthColor}`}>
                        {passwordStrength}
                      </span>
                    )}
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
                      className="focus-ring w-full rounded-lg border border-panel-border bg-panel-alt py-2.5 pl-9 pr-10 text-sm text-ink placeholder:text-ink-faint"
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

                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" strokeWidth={1.8} />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="focus-ring w-full rounded-lg border border-panel-border bg-panel-alt py-2.5 pl-9 pr-10 text-sm text-ink placeholder:text-ink-faint"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink cursor-pointer"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-ink-faint">Must be at least 8 characters with numbers.</p>

              {error && (
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-signal-sell/10 border border-signal-sell/30 text-xs text-signal-sell">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !isEmailValid || password.length < 8 || password !== confirmPassword}
                className="focus-ring w-full flex items-center justify-center gap-2 rounded-lg bg-signal-ai text-white font-medium py-2.5 text-sm hover:brightness-110 transition disabled:opacity-50 shadow-sm cursor-pointer"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Creating Account…" : "Create Account & Send Verification Code"}
              </button>

              <div className="pt-3 border-t border-panel-border text-center text-xs text-ink-muted">
                Already have an account?{" "}
                <Link to="/login" className="focus-ring text-signal-ai font-semibold hover:underline">
                  Sign In
                </Link>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: 2FA OTP VERIFICATION */}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="nsv-panel p-6 space-y-4 shadow-md">
            <div className="text-center space-y-1">
              <p className="text-xs text-ink-muted">
                A 6-digit authentication code was sent to:
              </p>
              <p className="text-sm font-semibold text-ink font-mono bg-panel-alt py-1 px-3 rounded-lg inline-block border border-panel-border">
                {email}
              </p>
            </div>

            {/* Email Dispatch Status Banner */}
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-signal-buy/10 border border-signal-buy/30 text-xs text-signal-buy">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Firebase OTP Verification Dispatched</p>
                <p className="text-[11px] text-ink-muted mt-0.5 leading-relaxed">
                  A 6-digit authentication code was sent to <strong className="text-ink">{email}</strong> via Firebase Authentication.
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
                Enter 6-Digit Verification PIN
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
              {loading ? "Verifying Code…" : "Verify & Complete Registration"}
            </button>

            {/* Google OAuth Instant Registration Verification */}
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
                Skips manual code and verifies account registration via Google directly.
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
                  setStep(1);
                  setOtp("");
                  setError("");
                }}
                className="inline-flex items-center gap-1 text-ink-muted hover:text-ink transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Details
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
                    Resend Code
                  </>
                )}
              </button>
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
          Academic prototype — OWASP Top 10 Aligned Security Layer.
        </p>
      </div>
    </div>
  );
}
