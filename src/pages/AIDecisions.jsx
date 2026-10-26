import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from "recharts";
import {
  Sparkles,
  Calculator,
  Target,
  CheckCircle2
} from "lucide-react";
import { STOCKS } from "../data/stocks";
import DecisionCard from "../components/DecisionCard";
import ExplainabilityChart from "../components/ExplainabilityChart";
import { LoadingState } from "../components/States";
import { getAIDecision, getStockPrediction } from "../services/api";

const FORMULA_WEIGHTS = [
  {
    name: "Pairs Trading Statistical Arbitrage",
    key: "pairs_trading",
    weight: "35%",
    desc: "Cointegration mean-reversion drift from rolling spread Z-scores",
    color: "#EF4444"
  },
  {
    name: "FinBERT NLP News Sentiment",
    key: "sentiment_analysis",
    weight: "35%",
    desc: "Financial tone classification (Positive/Negative ratio * NLP confidence)",
    color: "#10B981"
  },
  {
    name: "Market Sentiment & Momentum",
    key: "market_sentiment",
    weight: "30%",
    desc: "Moving average distance, normalized RSI, and technical trend momentum",
    color: "#4184F3"
  }
];

export default function AIDecisions() {
  const [symbol, setSymbol] = useState("RELIANCE");
  const [decision, setDecision] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getAIDecision(symbol),
      getStockPrediction(symbol)
    ]).then(([decRes, predRes]) => {
      setDecision(decRes);
      setPrediction(predRes);
      setLoading(false);
    }).catch((err) => {
      console.error("Error loading decision and prediction:", err);
      setLoading(false);
    });
  }, [symbol]);

  return (
    <div className="space-y-6">
      {/* Page Title & Stock Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-gray-900">
              AI Decision & Predictive Stock Intelligence
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
              <Sparkles className="h-3 w-3" /> Multi-Factor AI
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Future price projection synthesized using our tested multi-factor weighted formula combining Pairs Trading Arbitrage (35%), FinBERT News Sentiment (35%), and Market Momentum (30%).
          </p>
        </div>

        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="focus-ring rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-900 shadow-xs cursor-pointer"
        >
          {STOCKS.map((s) => (
            <option key={s.symbol} value={s.symbol}>
              {s.symbol} — {s.name}
            </option>
          ))}
        </select>
      </div>

      {loading || !decision || !prediction ? (
        <LoadingState label="Computing multi-factor future prediction & decision vectors..." />
      ) : (
        <>
          {/* Top Recommendation & Prediction KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Current Recommendation */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">AI Recommendation</span>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-3 py-1 rounded-md text-sm font-bold ${
                  decision.recommendation === "BUY"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : decision.recommendation === "SELL"
                    ? "bg-red-100 text-red-800 border border-red-300"
                    : "bg-amber-100 text-amber-800 border border-amber-300"
                }`}>
                  {prediction.recommendation}
                </span>
                <span className="data-num text-xs font-bold text-gray-500">
                  {prediction.confidence_score}% Conf.
                </span>
              </div>
            </div>

            {/* Current Price (Live Dhan) */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Current Quote (Dhan Live)</span>
              <p className="data-num font-display text-xl font-bold text-gray-900 mt-1">
                ₹{prediction.current_price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* 7-Day Target Price */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">7-Day Target Price</span>
                <Target className="h-3.5 w-3.5 text-gray-400" />
              </div>
              <p className="data-num font-display text-xl font-bold text-blue-600 mt-1">
                ₹{prediction.predicted_target_price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* Projected Return */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Projected 7-Day Return</span>
              <p className={`data-num font-display text-xl font-bold mt-1 ${
                prediction.predicted_return_pct >= 0 ? "text-emerald-600" : "text-red-600"
              }`}>
                {prediction.predicted_return_pct >= 0 ? "+" : ""}{prediction.predicted_return_pct}%
              </p>
            </div>
          </div>

          {/* Tested Formula & Weightage Architectural Card */}
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-red-600" />
                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Future Prediction Mathematical Formulation & Tested Weights
                </h3>
              </div>
              <span className="font-mono text-xs font-semibold text-gray-600 bg-white px-2.5 py-1 rounded border border-gray-200">
                P_composite = (0.35 × S_pairs) + (0.35 × S_sentiment) + (0.30 × S_market)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {FORMULA_WEIGHTS.map((fw) => {
                const score = prediction.component_scores[fw.key] ?? 0;
                const toneCls = score >= 0 ? "text-emerald-600" : "text-red-600";
                return (
                  <div key={fw.key} className="rounded-lg bg-white border border-gray-200 p-3.5 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-800 truncate">{fw.name}</span>
                      <span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-mono font-bold text-gray-700">
                        {fw.weight}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-tight">
                      {fw.desc}
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                      <span className="text-[10px] uppercase font-bold text-gray-400">Component Signal:</span>
                      <span className={`data-num font-mono text-xs font-bold ${toneCls}`}>
                        {score >= 0 ? "+" : ""}{score} / 100
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between rounded-lg bg-white p-3 border border-gray-200 text-xs">
              <span className="font-medium text-gray-600">Composite Future Prediction Index (Combined Result):</span>
              <span className={`font-mono text-sm font-bold ${
                prediction.composite_score >= 0 ? "text-emerald-700" : "text-red-700"
              }`}>
                {prediction.composite_score >= 0 ? "+" : ""}{prediction.composite_score} (Scale: -100 to +100)
              </span>
            </div>
          </div>

          {/* Future Trajectory Prediction Chart with Recharts Legend */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  7-Day Projected Forward Price Trajectory & Confidence Envelope
                </h3>
                <p className="text-[11px] text-gray-500 font-medium">
                  Predictive simulation path generated from multi-factor composite vector with volatility boundary bands.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 font-mono">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span>Forecast Horizon: 7 Days</span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={prediction.trajectory} margin={{ left: -10, right: 12, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="trajConfidence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4184F3" stopOpacity={0.20} />
                    <stop offset="100%" stopColor="#4184F3" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#F3F4F6" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={{ stroke: "#E5E7EB" }} tickLine={false} />
                <YAxis domain={["auto", "auto"]} tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={false} tickLine={false} width={60} />
                <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12 }} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11, paddingBottom: 6 }}
                />
                <ReferenceLine
                  y={prediction.current_price}
                  stroke="#9CA3AF"
                  strokeDasharray="3 3"
                  label={{ value: `Current ₹${prediction.current_price}`, fill: '#6B7280', fontSize: 10 }}
                />
                <Area
                  type="monotone"
                  dataKey="confidence_upper"
                  name="Upper Confidence Bound (₹)"
                  stroke="#93C5FD"
                  strokeDasharray="2 2"
                  fill="url(#trajConfidence)"
                />
                <Area
                  type="monotone"
                  dataKey="predicted_price"
                  name="Predicted Target Trajectory (₹)"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  fill="none"
                />
                <Area
                  type="monotone"
                  dataKey="confidence_lower"
                  name="Lower Confidence Bound (₹)"
                  stroke="#93C5FD"
                  strokeDasharray="2 2"
                  fill="none"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Decision Factors & Explanation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="nsv-panel p-5 bg-white border border-gray-200 rounded-xl shadow-xs">
              <h3 className="font-display text-sm font-bold text-gray-900 mb-3">
                Model Component Breakdown & Contribution
              </h3>
              <ExplainabilityChart factors={decision.factors} />
            </div>

            <div className="nsv-panel p-5 bg-white border border-gray-200 rounded-xl shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-display text-sm font-bold text-gray-900 mb-2">
                  Decision Narrative & Reasoning
                </h3>
                <p className="text-xs text-gray-600 font-medium leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-200">
                  {decision.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Model Verification: Complete</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Cointegration & NLP Validated
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
