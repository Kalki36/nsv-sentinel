import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { TrendingUp, DollarSign, Activity, FileText, PieChart as PieIcon, ShieldAlert } from "lucide-react";

export default function FundamentalGauge({ fundamental }) {
  if (!fundamental) return null;

  const score = fundamental.healthScore || 85.0;
  
  // Hemispherical semi-circle meter data (180 degrees total)
  const gaugeData = [
    { name: "Score", value: score },
    { name: "Remaining", value: 100 - score }
  ];

  const ratingColor = 
    fundamental.healthRating === "Strong" ? "text-emerald-700 bg-emerald-50 border border-emerald-200" :
    fundamental.healthRating === "Stable" ? "text-emerald-700 bg-emerald-50 border border-emerald-200" :
    fundamental.healthRating === "Moderate" ? "text-amber-700 bg-amber-50 border border-amber-200" : "text-zerodha-red bg-zerodha-redsoft border border-zerodha-red/30";

  return (
    <div className="nsv-panel p-5 space-y-4 bg-white border border-gray-200 rounded-xl shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Company Fundamental Analysis</span>
          <h3 className="font-display text-base font-bold text-gray-900">{fundamental.companyName} ({fundamental.symbol})</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded text-xs font-bold ${ratingColor}`}>
            {fundamental.healthRating} Health ({score} / 100)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 items-center">
        {/* Hemispherical Meter Visualizer */}
        <div className="flex flex-col items-center justify-center p-2 relative">
          <div className="w-48 h-28 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="75%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="#E24A4A" /> {/* Zerodha Red */}
                  <Cell fill="#E5E7EB" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="data-num font-display text-2xl font-bold text-gray-900">{score}</span>
              <span className="block text-[10px] text-gray-400 uppercase font-bold">Health Score</span>
            </div>
          </div>
          <span className="text-[11px] font-medium text-gray-500 text-center mt-1">
            Hemispherical Fundamental Meter
          </span>
        </div>

        {/* 7 Core Financial Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MetricBox label="Net Sales" value={`₹${fundamental.netSales.toLocaleString("en-IN")} Cr`} />
          <MetricBox label="Cash & Cash Eq." value={`₹${fundamental.cashEquivalents.toLocaleString("en-IN")} Cr`} />
          <MetricBox label="PBDIT" value={`₹${fundamental.pbdit.toLocaleString("en-IN")} Cr`} />
          <MetricBox label="Op Margin (%)" value={`${fundamental.opMargin}%`} tone={fundamental.opMargin >= 18 ? "buy" : "neutral"} />
          <MetricBox label="PBT Less OI" value={`₹${fundamental.pbtLessOi.toLocaleString("en-IN")} Cr`} />
          <MetricBox label="PAT" value={`₹${fundamental.pat.toLocaleString("en-IN")} Cr`} tone="buy" />
          <MetricBox label="EPS" value={`₹${fundamental.eps}`} tone="buy" />
          <MetricBox label="Rating" value={fundamental.healthRating} tone={fundamental.healthRating === "Strong" ? "buy" : "sell"} />
        </div>
      </div>
    </div>
  );
}

function MetricBox({ label, value, tone }) {
  const toneCls = tone === "buy" ? "text-emerald-600 font-bold" : tone === "sell" ? "text-zerodha-red font-bold" : "text-gray-900 font-bold";
  return (
    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">{label}</p>
      <p className={`data-num text-xs ${toneCls}`}>{value}</p>
    </div>
  );
}
