import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound, Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { forgotPasswordRequest } from "../services/api";
import { sendFirebasePasswordReset } from "../services/firebase";
import GoogleOAuthModal from "../components/GoogleOAuthModal";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [devLink, setDevLink] = useState(null);
  const [devCode, setDevCode] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const navigate = useNavigate();

  function handleGoogleAccountSelect(accountData) {
    setShowGoogleModal(false);
    navigate(`/reset-password?email=${encodeURIComponent(accountData.email)}&oauth=true`);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    // Send password reset OTP / verification via Firebase Authentication
    const fbRes = await sendFirebasePasswordReset(email.trim().toLowerCase());
    const res = await forgotPasswordRequest(email.trim().toLowerCase());
    setLoading(false);

    if (fbRes.ok || res.ok) {
      setSubmitted(true);
      setInfo(fbRes.message || res.message || "Password reset instructions have been sent via Firebase.");
      setDevLink(res.devLink || `/reset-password?email=${encodeURIComponent(email)}&firebase=true`);
      setDevCode(fbRes.devCode || res.devCode || null);
    } else {
      setError(fbRes.error || res.error || "Unable to send password reset instructions. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-base bg-grid bg-[length:28px_28px] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="rounded-2xl border border-signal-ai/25 bg-signal-aisoft p-3 mb-4 shadow-sm">
            <KeyRound className="h-7 w-7 text-signal-ai" strokeWidth={1.8} />
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink tracking-wide">NSV SENTINEL</h1>
          <p className="text-sm text-ink-muted mt-1">Reset Your Account Password</p>
        </div>

        <div className="nsv-panel p-6 space-y-4 shadow-md">
          {/* 1-Click Google OAuth Reset Option */}
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
            <span>Verify with Google to Reset Password</span>
          </button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-panel-border" />
            </div>
            <div className="relative flex justify-center text-[11px]">
              <span className="bg-panel px-2 text-ink-faint">or reset via email PIN</span>
            </div>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-ink-muted leading-relaxed">
                Enter your registered Gmail or institutional email address below. We will send you a secure link and a 6-digit PIN to reset your password.
              </p>

              <div>
                <label className="block text-xs font-medium text-ink-muted mb-1.5" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" strokeWidth={1.8} />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sammmy9923@gmail.com"
                    className="focus-ring w-full rounded-lg border border-panel-border bg-panel-alt py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint"
                  />
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
                disabled={loading || !email}
                className="focus-ring w-full flex items-center justify-center gap-2 rounded-lg bg-signal-ai text-white font-medium py-2.5 text-sm hover:brightness-110 transition disabled:opacity-50 shadow-sm"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Sending Reset Email…" : "Send Reset Link & PIN"}
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
            <div className="space-y-4">
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-signal-buy/10 border border-signal-buy/30 text-xs text-signal-buy">
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-sm">Reset Instructions Sent</p>
                  <p className="text-ink-muted text-xs leading-relaxed">{info}</p>
                </div>
              </div>

              <p className="text-xs text-ink-muted leading-relaxed">
                Please check your inbox at <strong className="text-ink font-mono">{email}</strong> (and your Spam folder). Click the link in the email or enter your 6-digit PIN to set a new password.
              </p>

              {devCode && (
                <div className="p-3 rounded-lg bg-panel-alt border border-panel-border space-y-1.5 text-center">
                  <p className="text-[11px] text-ink-muted">Immediate Security Code (Local Testing):</p>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(devCode);
                      navigate(`/reset-password?email=${encodeURIComponent(email)}&token=${devCode}&firebase=true`);
                    }}
                    className="inline-flex items-center gap-2 font-mono text-lg font-bold text-signal-ai bg-base px-3 py-1.5 rounded border border-signal-ai/30 hover:bg-signal-ai/10 transition cursor-pointer"
                  >
                    <span>{devCode}</span>
                    <span className="text-[11px] font-sans font-normal text-ink-muted">(Click to Auto-fill)</span>
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => navigate(`/reset-password?email=${encodeURIComponent(email)}&token=${devCode || ""}&firebase=true`)}
                className="focus-ring w-full rounded-lg bg-signal-ai text-white font-medium py-2.5 text-sm hover:brightness-110 transition shadow-sm text-center block"
              >
                Enter Firebase Reset PIN or Code
              </button>

              <div className="pt-2 border-t border-panel-border flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setError("");
                  }}
                  className="text-ink-muted hover:text-ink transition inline-flex items-center gap-1"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Try another email
                </button>
                <Link to="/login" className="text-signal-ai font-medium hover:underline">
                  Return to Sign In
                </Link>
              </div>
            </div>
          )}

          {/* Collapsible Firebase & Email Delivery Help */}
          <div className="pt-2 border-t border-panel-border">
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="w-full flex items-center justify-between text-[11px] text-ink-faint hover:text-ink transition py-1"
            >
              <span className="flex items-center gap-1">
                <HelpCircle className="h-3 w-3" />
                Live Firebase & Email Delivery Setup
              </span>
              {showHelp ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>

            {showHelp && (
              <div className="mt-2 p-3 rounded-lg bg-panel-alt border border-panel-border text-[11px] text-ink-muted space-y-2.5 leading-relaxed">
                <div>
                  <p className="font-semibold text-ink">Option 1: Instant 1-Click Verification (Zero Setup)</p>
                  <p className="mt-0.5">Click the white <strong>&quot;Verify with Google to Reset Password&quot;</strong> button above. It verifies your Gmail identity directly via OAuth and skips the PIN entirely.</p>
                </div>

                <div className="pt-2 border-t border-panel-border">
                  <p className="font-semibold text-ink">Option 2: Live Firebase Email Setup (Free)</p>
                  <ol className="list-decimal pl-4 space-y-1 mt-1">
                    <li>Create a free project at <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-signal-ai underline">console.firebase.google.com</a>.</li>
                    <li>Under <strong>Build &gt; Authentication</strong>, enable <strong>Email/Password</strong>.</li>
                    <li>In Project Settings, add a Web App (<code className="text-signal-ai">&lt;/&gt;</code>) and copy the config.</li>
                    <li>Paste the values into root <code className="bg-base px-1 py-0.5 rounded text-signal-ai font-mono">.env</code> under <code className="text-ink font-mono">VITE_FIREBASE_API_KEY</code>, etc.</li>
                  </ol>
                  <p className="mt-1 text-[10px] text-ink-faint">Google Firebase will then send real password reset emails directly without needing any personal password in code.</p>
                </div>
              </div>
            )}
          </div>
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
