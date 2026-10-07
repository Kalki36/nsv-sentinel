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
  ReferenceLine
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Zap,
  Activity,
  Sliders,
  HelpCircle,
  Hash,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  BarChart2
} from "lucide-react";
import { getPairsTradingAnalysis, runPairsTradingBacktest } from "../services/api";
import { LoadingState } from "../components/States";

export default function PairsTrading() {
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [data, setData] = useState(null);

  // Form Controls
  const [config, setConfig] = useState({
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
  });

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
    series,
    trades
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

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-xs">
          <span className="text-[11px] font-semibold text-gray-500 uppercase">Current Z-Score</span>
          <p className={`text-lg font-bold font-mono mt-1 ${current_zscore > 1.3 ? 'text-red-600' : current_zscore < -1.3 ? 'text-emerald-600' : 'text-gray-900'}`}>
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

      {/* Configuration & Controls Accordion/Card */}
      <form onSubmit={handleRunBacktest} className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-red-600" />
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Model Parameters & Backtest Configuration
            </h3>
          </div>
          <button
            type="submit"
            disabled={running}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${running ? "animate-spin" : ""}`} />
            {running ? "Running Backtest..." : "Recalculate Model"}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1">NIFTY Ticker</label>
            <input
              type="text"
              value={config.nifty}
              onChange={(e) => setConfig({ ...config, nifty: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 font-mono text-gray-900 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1">BANKNIFTY Ticker</label>
            <input
              type="text"
              value={config.banknifty}
              onChange={(e) => setConfig({ ...config, banknifty: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 font-mono text-gray-900 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1">Rolling Window</label>
            <input
              type="number"
              value={config.rolling_window}
              onChange={(e) => setConfig({ ...config, rolling_window: parseInt(e.target.value) || 120 })}
              className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 font-mono text-gray-900 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1">Entry Z-Threshold</label>
            <input
              type="number"
              step="0.1"
              value={config.entry_z}
              onChange={(e) => setConfig({ ...config, entry_z: parseFloat(e.target.value) || 1.3 })}
              className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 font-mono text-gray-900 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1">Exit Z-Threshold</label>
            <input
              type="number"
              step="0.1"
              value={config.exit_z}
              onChange={(e) => setConfig({ ...config, exit_z: parseFloat(e.target.value) || 0.4 })}
              className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 font-mono text-gray-900 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1">Stop Loss (%)</label>
            <input
              type="number"
              step="0.005"
              value={config.stop_loss_pct}
              onChange={(e) => setConfig({ ...config, stop_loss_pct: parseFloat(e.target.value) || 0.02 })}
              className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 font-mono text-gray-900 focus:border-red-500 focus:outline-none"
            />
          </div>
        </div>
      </form>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Rolling Z-Score with Signal Thresholds */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Rolling Z-Score Anomaly Deviation
              </h3>
              <p className="text-[11px] text-gray-500">Thresholds: Entry ±{config.entry_z}, Exit ±{config.exit_z}</p>
            </div>
            <Activity className="h-4 w-4 text-red-600" />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={series} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
              <CartesianGrid stroke="#F3F4F6" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={{ stroke: "#E5E7EB" }} tickLine={false} />
              <YAxis domain={[-3.5, 3.5]} tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12 }} />
              <ReferenceLine y={config.entry_z} stroke="#EF4444" strokeDasharray="3 3" label={{ value: `+${config.entry_z} Short`, fill: '#EF4444', fontSize: 10 }} />
              <ReferenceLine y={-config.entry_z} stroke="#10B981" strokeDasharray="3 3" label={{ value: `-${config.entry_z} Long`, fill: '#10B981', fontSize: 10 }} />
              <ReferenceLine y={0} stroke="#9CA3AF" strokeDasharray="1 1" />
              <Line type="monotone" dataKey="zscore" stroke="#E24A4A" strokeWidth={1.8} dot={false} name="Z-Score" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: Equity Curve */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Strategy Portfolio Equity Curve
              </h3>
              <p className="text-[11px] text-gray-500">Capital progression over backtest horizon</p>
            </div>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={series} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#F3F4F6" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={{ stroke: "#E5E7EB" }} tickLine={false} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={false} tickLine={false} width={60} />
              <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="capital" stroke="#10B981" strokeWidth={2} fill="url(#equityFill)" name="Portfolio Capital (₹)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trades Log Table */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-red-600" />
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Executed Pairs Trading Log ({trades.length} Trades)
            </h3>
          </div>
          <span className="text-xs text-gray-500 font-medium">Transaction Cost: {(config.transaction_cost * 100).toFixed(2)}% per leg</span>
        </div>

        {trades.length === 0 ? (
          <p className="text-xs text-gray-500 py-6 text-center">No trades triggered during selected backtest parameters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase border-b border-gray-200">
                <tr>
                  <th className="px-3 py-2.5">Entry Time</th>
                  <th className="px-3 py-2.5">Exit Time</th>
                  <th className="px-3 py-2.5">Side</th>
                  <th className="px-3 py-2.5">Entry Spread</th>
                  <th className="px-3 py-2.5">Exit Spread</th>
                  <th className="px-3 py-2.5">Net PnL (₹)</th>
                  <th className="px-3 py-2.5">Exit Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {trades.map((t, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2 text-gray-700">{t["Entry Time"]}</td>
                    <td className="px-3 py-2 text-gray-700">{t["Exit Time"]}</td>
                    <td className="px-3 py-2 font-bold">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] ${t.Side === 'LONG SPREAD' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                        {t.Side}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-900">{t["Entry Spread"]}</td>
                    <td className="px-3 py-2 text-gray-900">{t["Exit Spread"]}</td>
                    <td className={`px-3 py-2 font-bold ${t.PnL >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {t.PnL > 0 ? "+" : ""}{t.PnL.toLocaleString('en-IN')}
                    </td>
                    <td className="px-3 py-2 text-gray-500 text-[11px] font-sans">{t["Exit Reason"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
