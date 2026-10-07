import { useEffect, useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { STOCKS } from "../data/stocks";
import { RiskGauge, RiskBars, RiskRadar } from "../components/RiskGauge";
import { LoadingState } from "../components/States";
import { getRiskAnalysis } from "../services/api";

function riskLabel(score) {
  if (score >= 70) return "HIGH RISK";
  if (score >= 40) return "MODERATE RISK";
  return "LOW RISK";
}

export default function RiskAnalysis() {
  const [symbol, setSymbol] = useState("RELIANCE");
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(null);
    getRiskAnalysis(symbol).then(setData);
  }, [symbol]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-gray-900">Composite Risk Analysis</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">Weighted composite risk score combining market trend, volatility, anomaly z-scores, FinBERT news sentiment, and security integrity.</p>
        </div>
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="focus-ring rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-900 shadow-xs cursor-pointer"
        >
          {STOCKS.map((s) => (
            <option key={s.symbol} value={s.symbol}>
              {s.symbol}
            </option>
          ))}
        </select>
      </div>

      {!data ? (
        <LoadingState label="Aggregating risk signals" />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="nsv-panel p-6 flex flex-col items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl shadow-xs">
              <RiskGauge score={data.breakdown.overall} />
              <span className="text-xs font-bold text-gray-600">Overall Risk — {riskLabel(data.breakdown.overall)}</span>
            </div>
            <div className="nsv-panel p-5 lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-xs">
              <h3 className="text-xs font-bold text-gray-500 mb-4">Risk Component Breakdown</h3>
              <RiskBars breakdown={data.breakdown} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="nsv-panel p-5 bg-white border border-gray-200 rounded-xl shadow-xs">
              <h3 className="text-xs font-bold text-gray-500 mb-2">Multi-Factor Risk Radar Profile</h3>
              <RiskRadar breakdown={data.breakdown} />
            </div>

            <div className="nsv-panel p-5 bg-white border border-gray-200 rounded-xl shadow-xs">
              <h3 className="text-xs font-bold text-gray-500 mb-3">Historical Risk Trajectory (14-Day)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={data.history} margin={{ left: -20, right: 8, top: 4, bottom: 0 }}>
                  <defs>
                    <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#F3F4F6" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={{ stroke: "#E5E7EB" }} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }} />
                  <Area type="monotone" dataKey="risk" stroke="#F59E0B" strokeWidth={2} fill="url(#riskFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
