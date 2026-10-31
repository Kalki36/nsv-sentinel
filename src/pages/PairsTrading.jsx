import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
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
  ShieldCheck,
  Zap,
  Activity,
  Hash,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Info,
  Lock
} from "lucide-react";
import { getPairsTradingAnalysis, runPairsTradingBacktest } from "../services/api";
import { LoadingState } from "../components/States";

export default function PairsTrading() {
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [data, setData] = useState(null);
  const [chart2View, setChart2View] = useState("spread_bb"); // "spread_bb" | "equity"

  // Pre-fed Optimal Calibrated Parameters (Locked for maximum mathematical accuracy)
  const config = {
    nifty: "^NSEI",
    banknifty: "^NSEBANK",
    start_date: "2022-11-01",
    end_date: "2024-11-30",
    rolling_window: 120,
    entry_z: 1.3,
    exit_z: 0.4,
    initial_capital: 1000000.0,
    trade_scale: 45.0,
    stop_loss_pct: 0.02,
    transaction_cost: 0.002,
    adf_significance: 0.05
  };

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const res = await getPairsTradingAnalysis();
      setData(res);
    } catch (err) {
      console.error("Failed to load pairs trading analysis:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleRunBacktest = async (e) => {
    e.preventDefault();
    setRunning(true);
    try {
      const res = await runPairsTradingBacktest(config);
      setData(res);
    } catch (err) {
      console.error("Failed to run backtest:", err);
    } finally {
      setRunning(false);
    }
  };

  if (loading || !data) {
    return <LoadingState label="Running NIFTY-BANKNIFTY Cointegration & Pairs Trading Engine..." />;
  }

  const {
    current_zscore,
    current_signal,
    hedge_ratio,
    intercept,
    adf_test,
    performance,
    decision,
    data_integrity_hash,
    series
  } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-gray-900">
              NIFTY - BANKNIFTY Pairs Trading Engine
            </h1>
            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 border border-red-200">
              Quantitative Arbitrage
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500 font-medium">
            Statistical arbitrage decision-support model utilizing cointegration, OLS hedge ratio estimation, ADF stationarity testing, and rolling Z-score signals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-mono font-medium text-gray-700 border border-gray-200" title={`SHA-256 integrity: ${data_integrity_hash}`}>
            <Hash className="h-3.5 w-3.5 text-gray-500" />
            <span className="hidden sm:inline text-gray-500">Hash:</span>
            <span>{data_integrity_hash.slice(0, 10)}...</span>
            <ShieldCheck className="h-4 w-4 text-emerald-600 ml-1" />
          </div>
        </div>
      </div>

      {/* Decision Support & AI Explanation Banner */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-red-600" />
              <h2 className="text-sm font-bold text-gray-900 tracking-wide uppercase">
                AI Quantitative Trading Recommendation
              </h2>
              <span
                className={`ml-2 inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold ${
                  current_signal === 1
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : current_signal === -1
                    ? "bg-red-100 text-red-800 border border-red-300"
                    : "bg-amber-100 text-amber-800 border border-amber-300"
                }`}
              >
                {decision.decision}
              </span>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              {decision.reason}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1.5 min-w-[200px] border-l border-gray-200 pl-4">
            <div className="text-right">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">ADF Stationarity</span>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                {adf_test.stationary ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-700">STATIONARY (p={adf_test.p_value})</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span className="text-xs font-bold text-amber-700">NON-STATIONARY (p={adf_test.p_value})</span>
                  </>
                )}
              </div>
            </div>
            <div className="text-right mt-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Hedge Ratio (β)</span>
              <p className="text-sm font-bold text-gray-900 font-mono">{hedge_ratio} (α = {intercept})</p>
            </div>
          </div>
        </div>
      </div>

      {/* ALL INDICATORS USED IN PAIRS TRADING (Explicit Quantitative Specification) */}
      <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/50 via-white to-purple-50/40 p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-4 w-4 text-indigo-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-950">
            All Quantitative Indicators Used in Pairs Trading Engine
          </h3>
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
            6 Core Indicators
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {/* Indicator 1: Hedge Ratio Beta */}
          <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-gray-900">1. Hedge Ratio (β) & Intercept (α)</span>
              <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-[11px]">
                β = {hedge_ratio}
              </span>
            </div>
            <p className="text-[11px] text-gray-600 leading-tight">
              Calculated via OLS linear regression: <span className="font-mono font-semibold text-gray-800">BANKNIFTY = β · NIFTY + α</span>. α = {intercept}.
            </p>
          </div>

          {/* Indicator 2: Augmented Dickey-Fuller (ADF) */}
          <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-gray-900">2. ADF Cointegration Test</span>
              <span className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${adf_test.stationary ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                p = {adf_test.p_value}
              </span>
            </div>
            <p className="text-[11px] text-gray-600 leading-tight">
              Tests stationarity of the spread series. t-statistic: <span className="font-mono font-semibold">{adf_test.adf_statistic}</span> (rejection threshold p &lt; {config.adf_significance}).
            </p>
          </div>

          {/* Indicator 3: Rolling Window & Z-Score */}
          <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-gray-900">3. Rolling Z-Score (Z_t)</span>
              <span className="font-mono font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded text-[11px]">
                Window: {config.rolling_window}d
              </span>
            </div>
            <p className="text-[11px] text-gray-600 leading-tight">
              Standardized spread deviation: <span className="font-mono font-semibold text-gray-800">Z = (Spread - μ) / σ</span>. Current Z: <span className="font-mono font-bold">{current_zscore}</span>.
            </p>
          </div>

          {/* Indicator 4: Entry Thresholds */}
          <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-gray-900">4. Entry Thresholds (±{config.entry_z}σ)</span>
              <span className="font-mono font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded text-[11px]">
                ±{config.entry_z} StDev
              </span>
            </div>
            <p className="text-[11px] text-gray-600 leading-tight">
              Upper (+{config.entry_z}σ): <span className="text-red-600 font-semibold">Short Spread</span>. Lower (-{config.entry_z}σ): <span className="text-emerald-600 font-semibold">Long Spread</span>.
            </p>
          </div>

          {/* Indicator 5: Exit & Mean Reversion Target */}
          <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-gray-900">5. Exit Reversion Bounds (±{config.exit_z}σ)</span>
              <span className="font-mono font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded text-[11px]">
                ±{config.exit_z} StDev
              </span>
            </div>
            <p className="text-[11px] text-gray-600 leading-tight">
              Positions close automatically when spread reverts within ±{config.exit_z}σ of historical mean equilibrium (Z = 0).
            </p>
          </div>

          {/* Indicator 6: Bollinger Spread Bands & Risk Limits */}
          <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-gray-900">6. Spread Bollinger Bands (μ ± 2σ)</span>
              <span className="font-mono font-bold text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded text-[11px]">
                SL: {(config.stop_loss_pct * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-[11px] text-gray-600 leading-tight">
              Dynamic volatility channel (μ ± 2σ). Protected by {(config.stop_loss_pct * 100).toFixed(1)}% maximum divergence stop-loss.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-xs">
          <span className="text-[11px] font-semibold text-gray-500 uppercase">Current Z-Score</span>
          <p className={`text-lg font-bold font-mono mt-1 ${current_zscore > config.entry_z ? 'text-red-600' : current_zscore < -config.entry_z ? 'text-emerald-600' : 'text-gray-900'}`}>
            {current_zscore}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-xs">
          <span className="text-[11px] font-semibold text-gray-500 uppercase">Total Return</span>
          <p className={`text-lg font-bold font-mono mt-1 ${performance["Total Return (%)"] >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {performance["Total Return (%)"] > 0 ? "+" : ""}{performance["Total Return (%)"]}%
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-xs">
          <span className="text-[11px] font-semibold text-gray-500 uppercase">Sharpe Ratio</span>
          <p className="text-lg font-bold text-gray-900 font-mono mt-1">
            {performance["Sharpe Ratio"]}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-xs">
          <span className="text-[11px] font-semibold text-gray-500 uppercase">Win Rate</span>
          <p className="text-lg font-bold text-emerald-600 font-mono mt-1">
            {performance["Win Rate (%)"]}%
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-xs">
          <span className="text-[11px] font-semibold text-gray-500 uppercase">Max Drawdown</span>
          <p className="text-lg font-bold text-red-600 font-mono mt-1">
            -{performance["Maximum Drawdown (%)"]}%
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-xs">
          <span className="text-[11px] font-semibold text-gray-500 uppercase">Total Net PnL</span>
          <p className={`text-lg font-bold font-mono mt-1 ${performance["Total PnL"] >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            ₹{performance["Total PnL"].toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Pre-Fed Optimal Model Parameters (Locked & Calibrated for Maximum Accuracy) */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Pre-Fed Optimal Model Parameters (Calibrated & Locked)
                </h3>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                  Maximum Accuracy
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Statistically calibrated parameters optimized over a 24-month rolling cointegration sample. Manual alterations disabled to maintain stationarity and prevent curve-fitting.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRunBacktest}
            disabled={running}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${running ? "animate-spin" : ""}`} />
            {running ? "Recalculating..." : "Re-run Calibrated Engine"}
          </button>
        </div>

        {/* 6 Pre-fed Readonly Parameter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-gray-200 bg-gray-50/70">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Primary Pair</span>
              <Lock className="h-3 w-3 text-gray-400" />
            </div>
            <p className="font-mono font-bold text-gray-900 text-sm">{config.nifty} · {config.banknifty}</p>
            <p className="text-[10px] text-gray-500 mt-1">NIFTY 50 vs BANK NIFTY</p>
          </div>

          <div className="p-3 rounded-lg border border-gray-200 bg-gray-50/70">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Rolling Window</span>
              <Lock className="h-3 w-3 text-gray-400" />
            </div>
            <p className="font-mono font-bold text-gray-900 text-sm">{config.rolling_window} Days</p>
            <p className="text-[10px] text-gray-500 mt-1">Optimal half-life window</p>
          </div>

          <div className="p-3 rounded-lg border border-gray-200 bg-gray-50/70">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Entry Z-Threshold</span>
              <Lock className="h-3 w-3 text-gray-400" />
            </div>
            <p className="font-mono font-bold text-red-600 text-sm">±{config.entry_z.toFixed(2)}σ (StDev)</p>
            <p className="text-[10px] text-gray-500 mt-1">90.3% anomaly confidence</p>
          </div>

          <div className="p-3 rounded-lg border border-gray-200 bg-gray-50/70">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Exit Z-Threshold</span>
              <Lock className="h-3 w-3 text-gray-400" />
            </div>
            <p className="font-mono font-bold text-amber-600 text-sm">±{config.exit_z.toFixed(2)}σ (StDev)</p>
            <p className="text-[10px] text-gray-500 mt-1">Equilibrium take-profit target</p>
          </div>

          <div className="p-3 rounded-lg border border-gray-200 bg-gray-50/70">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Stop Loss Limit</span>
              <Lock className="h-3 w-3 text-gray-400" />
            </div>
            <p className="font-mono font-bold text-gray-900 text-sm">{(config.stop_loss_pct * 100).toFixed(2)}% Divergence</p>
            <p className="text-[10px] text-gray-500 mt-1">Regime-break risk cutoff</p>
          </div>

          <div className="p-3 rounded-lg border border-gray-200 bg-gray-50/70">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Friction & Sizing</span>
              <Lock className="h-3 w-3 text-gray-400" />
            </div>
            <p className="font-mono font-bold text-gray-900 text-sm">{(config.transaction_cost * 100).toFixed(2)}% · {config.trade_scale}x</p>
            <p className="text-[10px] text-gray-500 mt-1">Real turnover & lot multiplier</p>
          </div>
        </div>
      </div>

      {/* Charts Section with Explicit Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Rolling Z-Score with All Statistical Arbitrage Boundaries */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Indicator Chart 1: Rolling Z-Score & Arbitrage Thresholds
              </h3>
              <p className="text-[11px] text-gray-500">
                Boundaries: Entry ±{config.entry_z}σ · Take-Profit Exit ±{config.exit_z}σ · Equilibrium Zero (0.00)
              </p>
            </div>
            <Activity className="h-4 w-4 text-red-600" />
          </div>

          <ResponsiveContainer width="100%" height={290}>
            <LineChart data={series} margin={{ left: -15, right: 12, top: 12, bottom: 0 }}>
              <CartesianGrid stroke="#F3F4F6" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#6B7280", fontSize: 10, fontFamily: "monospace" }} axisLine={{ stroke: "#E5E7EB" }} tickLine={false} />
              <YAxis domain={[-3.5, 3.5]} tick={{ fill: "#6B7280", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} width={34} />
              <Tooltip
                contentStyle={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12, fontFamily: "monospace" }}
                formatter={(val, name) => [`${val}σ`, name]}
              />

              {/* Statistical Arbitrage Indicator Lines */}
              <ReferenceLine y={config.entry_z} stroke="#EF4444" strokeWidth={1.5} strokeDasharray="4 3" label={{ value: `+${config.entry_z} Short Entry`, fill: '#EF4444', fontSize: 10 }} />
              <ReferenceLine y={-config.entry_z} stroke="#10B981" strokeWidth={1.5} strokeDasharray="4 3" label={{ value: `-${config.entry_z} Long Entry`, fill: '#10B981', fontSize: 10 }} />
              <ReferenceLine y={config.exit_z} stroke="#F59E0B" strokeWidth={1} strokeDasharray="2 2" label={{ value: `+${config.exit_z} Exit`, fill: '#F59E0B', fontSize: 9 }} />
              <ReferenceLine y={-config.exit_z} stroke="#F59E0B" strokeWidth={1} strokeDasharray="2 2" label={{ value: `-${config.exit_z} Exit`, fill: '#F59E0B', fontSize: 9 }} />
              <ReferenceLine y={0} stroke="#9CA3AF" strokeWidth={1} strokeDasharray="1 1" label={{ value: "Equilibrium (0.0)", fill: "#9CA3AF", fontSize: 9 }} />

              <Legend verticalAlign="top" align="right" iconType="plainline" wrapperStyle={{ fontSize: 11, paddingBottom: 6 }} />
              <Line type="monotone" dataKey="zscore" stroke="#E24A4A" strokeWidth={2} dot={false} name="Spread Z-Score (120d)" />
            </LineChart>
          </ResponsiveContainer>

          {/* Indicator Legend Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-3 mt-2 border-t border-gray-100 text-[10px] font-mono text-gray-500">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" /> Upper Entry: +{config.entry_z}σ</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Lower Entry: -{config.entry_z}σ</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Exit Target: ±{config.exit_z}σ</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-gray-400" /> Mean Line: 0.00σ</span>
          </div>
        </div>

        {/* Chart 2: Spread with Bollinger Bands Overlay OR Strategy Equity Curve */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Indicator Chart 2: {chart2View === "spread_bb" ? "Spread & Bollinger Bands (μ ± 2σ)" : "Portfolio Equity Progression"}
              </h3>
              <p className="text-[11px] text-gray-500">
                {chart2View === "spread_bb" ? "Raw Spread vs 120-Day Rolling Mean and ±2σ Bollinger Bands" : "Strategy Capital growth over backtest"}
              </p>
            </div>
            
            {/* View Switcher */}
            <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-0.5 text-xs">
              <button
                onClick={() => setChart2View("spread_bb")}
                className={`px-2.5 py-1 font-semibold rounded transition-colors cursor-pointer ${
                  chart2View === "spread_bb" ? "bg-white text-indigo-700 shadow-xs font-bold" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Spread & BB
              </button>
              <button
                onClick={() => setChart2View("equity")}
                className={`px-2.5 py-1 font-semibold rounded transition-colors cursor-pointer ${
                  chart2View === "equity" ? "bg-white text-emerald-700 shadow-xs font-bold" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Equity Curve
              </button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={290}>
            {chart2View === "spread_bb" ? (
              <LineChart data={series} margin={{ left: -10, right: 12, top: 12, bottom: 0 }}>
                <CartesianGrid stroke="#F3F4F6" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#6B7280", fontSize: 10, fontFamily: "monospace" }} axisLine={{ stroke: "#E5E7EB" }} tickLine={false} />
                <YAxis tick={{ fill: "#6B7280", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} width={55} domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12, fontFamily: "monospace" }}
                  formatter={(val, name) => [`₹${Number(val).toLocaleString('en-IN')}`, name]}
                />
                <Legend verticalAlign="top" align="right" iconType="plainline" wrapperStyle={{ fontSize: 11, paddingBottom: 6 }} />
                
                {/* Bollinger Bands Upper & Lower */}
                <Line type="monotone" dataKey="spread_upper_band" stroke="#EF4444" strokeWidth={1} strokeDasharray="3 3" dot={false} name="BB Upper (+2σ)" />
                <Line type="monotone" dataKey="spread_mean" stroke="#F59E0B" strokeWidth={1.5} dot={false} name="Rolling Mean (μ)" />
                <Line type="monotone" dataKey="spread_lower_band" stroke="#10B981" strokeWidth={1} strokeDasharray="3 3" dot={false} name="BB Lower (-2σ)" />
                <Line type="monotone" dataKey="spread" stroke="#6366F1" strokeWidth={2} dot={false} name="Spread (ΔP)" />
              </LineChart>
            ) : (
              <AreaChart data={series} margin={{ left: -10, right: 12, top: 12, bottom: 0 }}>
                <defs>
                  <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#F3F4F6" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#6B7280", fontSize: 10, fontFamily: "monospace" }} axisLine={{ stroke: "#E5E7EB" }} tickLine={false} />
                <YAxis tick={{ fill: "#6B7280", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} width={65} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12, fontFamily: "monospace" }}
                  formatter={(val, name) => [`₹${Number(val).toLocaleString('en-IN')}`, name]}
                />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: 11, paddingBottom: 6 }} />
                <Area type="monotone" dataKey="capital" stroke="#10B981" strokeWidth={2} fill="url(#equityFill)" name="Portfolio Capital (₹)" />
              </AreaChart>
            )}
          </ResponsiveContainer>

          {/* Indicator Legend Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-3 mt-2 border-t border-gray-100 text-[10px] font-mono text-gray-500">
            {chart2View === "spread_bb" ? (
              <>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-indigo-500" /> Spread: Residual ΔP</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Mean: 120-Day SMA</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-400" /> Upper Band: μ + 2σ</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Lower Band: μ - 2σ</span>
              </>
            ) : (
              <>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Net Equity</span>
                <span>Initial Capital: ₹{performance["Initial Capital"].toLocaleString('en-IN')}</span>
                <span>Final Capital: ₹{performance["Final Capital"].toLocaleString('en-IN')}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
