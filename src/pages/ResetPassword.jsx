import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { KeyRound, Lock, Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { resetPasswordRequest, oauthResetPasswordRequest, firebaseResetPasswordRequest } from "../services/api";
import { verifyFirebaseResetCode } from "../services/firebase";
import GoogleOAuthModal from "../components/GoogleOAuthModal";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [tokenOrCode, setTokenOrCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isOAuthVerified, setIsOAuthVerified] = useState(false);
  const [isFirebase, setIsFirebase] = useState(false);
  const [googleAccount, setGoogleAccount] = useState(null);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const qEmail = searchParams.get("email");
    const qToken = searchParams.get("token");
    const qOAuth = searchParams.get("oauth");
    const qFirebase = searchParams.get("firebase");

    if (qEmail) setEmail(qEmail);
    if (qToken) setTokenOrCode(qToken);
    if (qOAuth === "true") {
      setIsOAuthVerified(true);
    }
    if (qFirebase === "true") {
      setIsFirebase(true);
    }
  }, [searchParams]);

  function handleGoogleAccountSelect(accountData) {
    setShowGoogleModal(false);
    setEmail(accountData.email);
    setIsOAuthVerified(true);
    setGoogleAccount(accountData);
  }

  const passwordStrength =
    newPassword.length === 0
      ? ""
      : newPassword.length < 6
      ? "Weak"
      : newPassword.length < 10 || !/[0-9]/.test(newPassword)
      ? "Medium"
      : "Strong";

  const strengthColor =
    passwordStrength === "Weak"
      ? "text-signal-sell"
      : passwordStrength === "Medium"
      ? "text-signal-warn"
      : "text-signal-buy";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter your registered email address.");
      return;
    }
    if (!isOAuthVerified && (!tokenOrCode || tokenOrCode.trim().length < 4)) {
      setError("Please provide the reset PIN or token sent to your email, or verify with Google.");
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    let res;
    if (isOAuthVerified) {
      res = await oauthResetPasswordRequest(
        email.trim().toLowerCase(),
        newPassword,
        googleAccount?.googleId,
        googleAccount?.credential
      );
    } else if (isFirebase) {
      const fbVerify = await verifyFirebaseResetCode(email.trim().toLowerCase(), tokenOrCode.trim());
      res = await firebaseResetPasswordRequest(
        email.trim().toLowerCase(),
        newPassword,
        tokenOrCode.trim(),
        fbVerify.token || null
      );
      if (!res.ok) {
        res = await resetPasswordRequest(email.trim().toLowerCase(), tokenOrCode.trim(), newPassword);
      }
    } else {
      res = await resetPasswordRequest(email.trim().toLowerCase(), tokenOrCode.trim(), newPassword);
    }

    setLoading(false);

    if (res.ok) {
      setSuccess(true);
    } else {
      setError(res.error || "Password reset failed. The code may be invalid or expired.");
    }
  }

  return (
    <div className="min-h-screen bg-base bg-grid bg-[length:28px_28px] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="rounded-2xl border border-signal-ai/25 bg-signal-aisoft p-3 mb-4 shadow-sm">
            <ShieldCheck className="h-7 w-7 text-signal-ai" strokeWidth={1.8} />
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink tracking-wide">NSV SENTINEL</h1>
          <p className="text-sm text-ink-muted mt-1">Set New Password</p>
        </div>

        <div className="nsv-panel p-6 space-y-4 shadow-md">
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {isOAuthVerified ? (
                <div className="p-3 rounded-lg bg-signal-buy/10 border border-signal-buy/30 flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-signal-buy shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-semibold text-signal-buy">Google Identity Verified</p>
                    <p className="text-ink-muted mt-0.5 break-all">
                      Authenticated as <strong className="text-ink font-mono">{email}</strong>. 6-digit PIN bypassed.
                    </p>
                  </div>
                </div>
              ) : isFirebase ? (
                <div className="p-3 rounded-lg bg-signal-ai/10 border border-signal-ai/30 flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-signal-ai shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-semibold text-signal-ai">Firebase Authentication Active</p>
                    <p className="text-ink-muted mt-0.5 leading-relaxed">
                      Password reset PIN dispatched via Google Firebase. Enter your 6-digit verification code below.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setShowGoogleModal(true)}
                    className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-2 px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-xs transition cursor-pointer"
                  >
                    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Verify with Google OAuth (Skip PIN)</span>
                  </button>

                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-panel-border" />
                    </div>
                    <div className="relative flex justify-center text-[10px]">
                      <span className="bg-panel px-2 text-ink-faint">or verify with email PIN</span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-ink-muted mb-1.5" htmlFor="email">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" strokeWidth={1.8} />
                  <input
                    id="email"
                    type="email"
                    required
                    readOnly={isOAuthVerified}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sammmy9923@gmail.com"
                    className={`focus-ring w-full rounded-lg border border-panel-border py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint ${
                      isOAuthVerified ? "bg-panel opacity-90 cursor-not-allowed" : "bg-panel-alt"
                    }`}
                  />
                </div>
              </div>

              {!isOAuthVerified && (
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5" htmlFor="token">
                    6-Digit Reset PIN or Token
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" strokeWidth={1.8} />
                    <input
                      id="token"
                      type="text"
                      required={!isOAuthVerified}
                      value={tokenOrCode}
                      onChange={(e) => setTokenOrCode(e.target.value)}
                      placeholder="Enter 6-digit PIN from email"
                      className="focus-ring w-full rounded-lg border border-panel-border bg-panel-alt py-2 pl-9 pr-3 text-sm font-mono text-ink placeholder:text-ink-faint"
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-ink-muted" htmlFor="newPassword">
                    New Password
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
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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

              <div>
                <label className="block text-xs font-medium text-ink-muted mb-1.5" htmlFor="confirmPassword">
                  Confirm New Password
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
                    className="focus-ring w-full rounded-lg border border-panel-border bg-panel-alt py-2 pl-9 pr-10 text-sm text-ink placeholder:text-ink-faint"
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

              {error && (
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-signal-sell/10 border border-signal-sell/30 text-xs text-signal-sell">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || (!isOAuthVerified && !tokenOrCode) || newPassword.length < 8 || newPassword !== confirmPassword}
                className="focus-ring w-full flex items-center justify-center gap-2 rounded-lg bg-signal-ai text-white font-medium py-2.5 text-sm hover:brightness-110 transition disabled:opacity-50 shadow-sm"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Updating Password…" : "Save New Password"}
              </button>

              <div className="pt-2 border-t border-panel-border text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink transition"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-signal-buy/15 flex items-center justify-center border border-signal-buy/30">
                <CheckCircle2 className="h-6 w-6 text-signal-buy" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-base text-ink">Password Reset Successfully</p>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Your credentials have been securely updated with Argon2id hashing. You may now sign in using your new password.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate(isOAuthVerified ? "/" : "/login")}
                className="focus-ring w-full rounded-lg bg-signal-ai text-white font-medium py-2.5 text-sm hover:brightness-110 transition shadow-sm block text-center"
              >
                {isOAuthVerified ? "Proceed to Dashboard" : "Proceed to Sign In"}
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-ink-faint mt-6 leading-relaxed">
          Academic prototype — OWASP Top 10 Aligned Security Layer.
        </p>

        <GoogleOAuthModal
          isOpen={showGoogleModal}
          onClose={() => setShowGoogleModal(false)}
          onSelectAccount={handleGoogleAccountSelect}
          loading={false}
        />
      </div>
    </div>
  );
}
