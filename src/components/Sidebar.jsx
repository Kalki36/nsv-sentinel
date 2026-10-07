import { NavLink } from "react-router-dom";
import {
  ShieldCheck,
  LayoutGrid,
  LineChart,
  Radar,
  MessageSquareText,
  Lock,
  BrainCircuit,
  Gauge,
  Workflow,
  GitCompare,
  ScrollText,
  Settings,
  HelpCircle,
} from "lucide-react";

const NAV = [
  { to: "/overview", label: "Overview", icon: LayoutGrid },
  { to: "/analytics", label: "Market Analytics", icon: LineChart },
  { to: "/surveillance", label: "Market Surveillance", icon: Radar },
  { to: "/sentiment", label: "Sentiment Intelligence", icon: MessageSquareText },
  { to: "/security", label: "Security Center", icon: Lock },
  { to: "/ai-decisions", label: "AI Decisions", icon: BrainCircuit },
  { to: "/risk", label: "Risk Analysis", icon: Gauge },
  { to: "/explainability", label: "Explainability", icon: Workflow },
  { to: "/pairs-trading", label: "Pairs Trading", icon: GitCompare },
  { to: "/audit-logs", label: "Audit Logs", icon: ScrollText },
  { to: "/faq", label: "FAQ & Support", icon: HelpCircle },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-gray-200 bg-white shadow-sm">
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-gray-200">
        <div className="p-1.5 rounded-lg bg-zerodha-redsoft text-zerodha-red">
          <ShieldCheck className="h-5 w-5" strokeWidth={2} />
        </div>
        <div className="leading-tight">
          <p className="font-display text-sm font-bold tracking-wide text-gray-900">NSV SENTINEL</p>
          <p className="text-[10px] text-gray-500 tracking-wider font-medium uppercase">Financial Surveillance</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `focus-ring group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-zerodha-redsoft text-zerodha-red border border-zerodha-red/20 font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent"
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* System Status Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50/50 space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">System Status</p>
        {[
          ["Dhan Live Feed Active", "buy"],
          ["AI Engine Operational", "buy"],
          ["Security Layer Active", "buy"],
        ].map(([label, tone]) => (
          <div key={label} className="flex items-center gap-2 text-xs font-medium text-gray-600">
            <span className="h-2 w-2 rounded-full bg-signal-buy pulse-dot" />
            {label}
          </div>
        ))}
      </div>
    </aside>
  );
}
