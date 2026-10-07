import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ShieldCheck, ChevronDown, UserCircle2, LogOut, Settings as SettingsIcon, X } from "lucide-react";
import StockSearch from "./StockSearch";
import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const [time, setTime] = useState(new Date());
  const [market, setMarket] = useState("NSE");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const notifications = [
    { id: 1, title: "Surveillance Alert Flagged", time: "10:41 AM", desc: "RELIANCE volume spike +383% above baseline." },
    { id: 2, title: "Security Integrity Check", time: "10:37 AM", desc: "SHA-256 data record signatures verified." },
    { id: 3, title: "FinBERT Model Update", time: "09:42 AM", desc: "Processed 7 financial news articles." }
  ];

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-gray-200 bg-white shadow-xs flex items-center gap-4 px-4 md:px-6">
      <div className="hidden lg:block">
        <StockSearch />
      </div>

      <div className="relative">
        <select
          value={market}
          onChange={(e) => setMarket(e.target.value)}
          className="focus-ring appearance-none rounded-lg border border-gray-300 bg-gray-50 pl-3 pr-8 py-1.5 text-xs font-semibold text-gray-800 cursor-pointer"
        >
          <option value="NSE">NSE</option>
          <option value="BSE">BSE</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
      </div>

      <div className="ml-auto flex items-center gap-3 md:gap-5">
        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-gray-600 font-mono">
          <span className="h-2 w-2 rounded-full bg-signal-buy pulse-dot" />
          <span className="text-gray-900 font-bold">LIVE</span>
          <span className="text-gray-500">{time.toLocaleTimeString("en-IN", { hour12: true })}</span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700">
          <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
          Secure
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
            className="focus-ring relative rounded-lg p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5" strokeWidth={1.8} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-zerodha-red" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 p-4 rounded-xl shadow-xl z-50">
              <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                <h4 className="font-display text-xs font-bold text-gray-900">Notifications</h4>
                <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-700">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-900">{n.title}</span>
                      <span className="text-[10px] text-gray-400">{n.time}</span>
                    </div>
                    <p className="text-gray-600 text-[11px] leading-tight">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Logout Menu */}
        <div className="relative">
          <button
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
            className="focus-ring flex items-center gap-2 rounded-lg pl-1 pr-2 py-1 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Profile"
          >
            <UserCircle2 className="h-7 w-7 text-gray-600" strokeWidth={1.5} />
            <div className="hidden lg:block text-left leading-tight">
              <p className="text-xs font-bold text-gray-900">N. Sharma</p>
              <p className="text-[10px] font-medium text-gray-500">Compliance Analyst</p>
            </div>
            <ChevronDown className="h-3 w-3 text-gray-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 p-1.5 rounded-xl shadow-xl z-50 divide-y divide-gray-100">
              <div className="px-3 py-2 text-xs">
                <p className="font-bold text-gray-900">N. Sharma</p>
                <p className="text-gray-500 text-[11px]">analyst@nsv-sentinel.edu</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => { navigate("/settings"); setShowUserMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer"
                >
                  <SettingsIcon className="h-3.5 w-3.5" />
                  Settings
                </button>
                <button
                  onClick={() => { logout(); navigate("/login"); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zerodha-red hover:bg-red-50 rounded-md cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
