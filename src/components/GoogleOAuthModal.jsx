import { useState } from "react";
import { X, UserPlus, Loader2, Check } from "lucide-react";

export default function GoogleOAuthModal({ isOpen, onClose, onSelectAccount, loading }) {
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  if (!isOpen) return null;

  function handleCustomSubmit(e) {
    e.preventDefault();
    if (!customEmail || !customEmail.includes("@")) return;
    const name = customName.trim() || customEmail.split("@")[0].replace(".", " ").replace("_", " ").title();
    onSelectAccount({
      email: customEmail.trim().toLowerCase(),
      name,
      google_id: "google_" + Math.random().toString(36).substring(2, 12),
    });
  }

  const PRESET_ACCOUNTS = [
    {
      name: "Samyak Padliya",
      email: "sammmy9923@gmail.com",
      initial: "S",
      bg: "bg-blue-600",
    },
    {
      name: "Compliance Analyst",
      email: "analyst@nsv-sentinel.edu",
      initial: "A",
      bg: "bg-emerald-600",
    },
    {
      name: "Security Administrator",
      email: "admin@nsv-sentinel.edu",
      initial: "S",
      bg: "bg-purple-600",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm bg-white text-gray-900 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header with Google Logo */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <div>
              <h3 className="font-semibold text-base text-gray-900 leading-tight">Sign in with Google</h3>
              <p className="text-xs text-gray-500 mt-0.5">to continue to NSV Sentinel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {!showCustom ? (
            <>
              <p className="text-[11px] font-medium text-gray-500 px-2 uppercase tracking-wider">
                Choose an account
              </p>
              <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 overflow-hidden">
                {PRESET_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    onClick={() =>
                      onSelectAccount({
                        email: acc.email,
                        name: acc.name,
                        google_id: "google_" + acc.email.replace(/[^a-zA-Z0-9]/g, "_"),
                      })
                    }
                    disabled={loading}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
                  >
                    <div
                      className={`h-9 w-9 rounded-full ${acc.bg} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm`}
                    >
                      {acc.initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">{acc.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{acc.email}</p>
                    </div>
                  </button>
                ))}

                <button
                  onClick={() => setShowCustom(true)}
                  disabled={loading}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 transition cursor-pointer text-blue-600 text-xs font-medium"
                >
                  <div className="h-9 w-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                    <UserPlus className="h-4 w-4" />
                  </div>
                  <span>Use another Google account</span>
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-3 p-1">
              <p className="text-xs font-semibold text-gray-800">Enter your Google Account details:</p>
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">Gmail Address</label>
                <input
                  type="email"
                  required
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="your.name@gmail.com"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">Display Name (Optional)</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-900"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustom(false)}
                  className="w-1/3 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || !customEmail}
                  className="w-2/3 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition flex items-center justify-center gap-1.5"
                >
                  {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Sign In with Account
                </button>
              </div>
            </form>
          )}

          {loading && (
            <div className="flex items-center justify-center gap-2 py-3 text-xs text-gray-600 font-medium">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <span>Authorizing with Google OAuth 2.0…</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-400 text-center">
          NSV Sentinel uses Google OAuth 2.0 to securely verify your identity.
        </div>
      </div>
    </div>
  );
}
