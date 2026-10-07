import { useState, useMemo, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";
import { STOCKS, getStock, generateSeries } from "../data/stocks";
import MarketChart from "../components/MarketChart";
import FundamentalGauge from "../components/FundamentalGauge";
import { getFundamentals } from "../services/api";

const PERIODS = ["1D", "1W", "1M", "3M", "1Y"];
const METRICS = ["Price Trend", "Trading Volume", "Volatility", "Returns", "Moving Average", "Sentiment Trend"];

function MiniChart({ title, data, dataKey, color, type = "line" }) {
  return (
    <div className="nsv-panel p-4 bg-white border border-gray-200 rounded-xl shadow-xs">
      <h4 className="text-xs font-semibold text-gray-500 mb-3">{title}</h4>
      <ResponsiveContainer width="100%" height={180}>
        {type === "line" ? (
          <LineChart data={data} margin={{ left: -20, right: 8, top: 4, bottom: 0 }}>
            <CartesianGrid stroke="#F3F4F6" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={{ stroke: "#E5E7EB" }} tickLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={false} tickLine={false} width={44} />
            <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }} />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
          </LineChart>
        ) : (
          <BarChart data={data} margin={{ left: -20, right: 8, top: 4, bottom: 0 }}>
            <CartesianGrid stroke="#F3F4F6" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={{ stroke: "#E5E7EB" }} tickLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={false} tickLine={false} width={44} />
            <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }} />
            <Bar dataKey={dataKey} fill={color} radius={[3, 3, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

export default function MarketAnalytics() {
  const [symbol, setSymbol] = useState("RELIANCE");
  const [period, setPeriod] = useState("1M");
  const [market, setMarket] = useState("NSE");
  const [metric, setMetric] = useState("Price Trend");
  const [fundamental, setFundamental] = useState(null);

  const stock = getStock(symbol);
  const series = useMemo(() => generateSeries(symbol, period), [symbol, period]);

  useEffect(() => {
    getFundamentals(symbol).then(setFundamental);
  }, [symbol]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-xl font-bold text-gray-900">Market Analytics & Fundamental Intelligence</h1>
        <p className="text-xs text-gray-500 font-medium mt-1">Data analytics layer — statistical views, time series, and fundamental financial metrics.</p>
      </div>

      <div className="nsv-panel p-4 grid grid-cols-2 md:grid-cols-4 gap-3 bg-white border border-gray-200 rounded-xl shadow-xs">
        <Select label="Select Symbol" value={symbol} onChange={setSymbol} options={STOCKS.map((s) => s.symbol)} />
        <Select label="Time Period" value={period} onChange={setPeriod} options={PERIODS} />
        <Select label="Exchange" value={market} onChange={setMarket} options={["NSE", "BSE"]} />
        <Select label="Metric View" value={metric} onChange={setMetric} options={METRICS} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <SummaryCard label="Current Price" value={`₹${stock.price.toLocaleString("en-IN")}`} />
        <SummaryCard label="Daily Return" value={`${stock.change >= 0 ? "+" : ""}${stock.change}%`} tone={stock.change >= 0 ? "buy" : "sell"} />
        <SummaryCard label="Volatility" value={`${stock.volatility}%`} />
        <SummaryCard label="Avg. Volume" value={stock.volume} />
        <SummaryCard label="Risk Score" value={stock.riskScore} tone={stock.riskScore >= 60 ? "sell" : "buy"} />
      </div>

      {/* Fundamental Hemispherical Meter Indicator */}
      {fundamental && <FundamentalGauge fundamental={fundamental} />}

      <MarketChart symbol={symbol} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MiniChart title="Trading Volume" data={series} dataKey="volume" color="#4184F3" type="bar" />
        <MiniChart title="Volatility" data={series} dataKey="volatility" color="#F59E0B" type="line" />
        <MiniChart title="Returns" data={series} dataKey="returns" color="#10B981" type="bar" />
        <MiniChart title="Moving Average" data={series} dataKey="ma" color="#9CA3AF" type="line" />
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="focus-ring w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-900 cursor-pointer"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function SummaryCard({ label, value, tone }) {
  const toneCls = tone === "buy" ? "text-emerald-600 font-bold" : tone === "sell" ? "text-zerodha-red font-bold" : "text-gray-900 font-bold";
  return (
    <div className="nsv-panel p-4 bg-white border border-gray-200 rounded-xl shadow-xs">
      <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5">{label}</p>
      <p className={`data-num font-display text-lg ${toneCls}`}>{value}</p>
    </div>
  );
}
