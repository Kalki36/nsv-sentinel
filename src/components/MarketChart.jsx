import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ComposedChart,
  Bar,
} from "recharts";
import { generateSeries } from "../data/stocks";

const RANGES = ["1D", "1W", "1M", "3M", "1Y"];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="text-gray-500 font-medium mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="data-num flex items-center gap-2 font-bold" style={{ color: p.color }}>
          <span className="capitalize text-gray-600 font-normal">{p.dataKey}:</span> {p.value.toLocaleString("en-IN")}
        </p>
      ))}
    </div>
  );
}

export default function MarketChart({ symbol, showVolume = true }) {
  const [range, setRange] = useState("1D");
  const [metric, setMetric] = useState("price");

  const series = useMemo(() => generateSeries(symbol, range), [symbol, range]);

  return (
    <div className="nsv-panel p-4 md:p-5 bg-white border border-gray-200 rounded-xl shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          {["price", "volatility"].map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`focus-ring rounded-md px-3 py-1 text-xs font-semibold capitalize transition-colors cursor-pointer ${
                metric === m ? "bg-zerodha-redsoft text-zerodha-red border border-zerodha-red/30" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {m === "price" ? "Price Chart" : "Volatility"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-0.5">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`focus-ring rounded-md px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                range === r ? "bg-white text-zerodha-red shadow-xs font-bold" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={showVolume ? 320 : 260}>
        <ComposedChart data={series} margin={{ left: -12, right: 8, top: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4184F3" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#4184F3" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#F3F4F6" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={{ stroke: "#E5E7EB" }} tickLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} width={56} domain={["auto", "auto"]} />
          <Tooltip content={<ChartTooltip />} />
          {metric === "price" ? (
            <>
              <Area type="monotone" dataKey="price" stroke="#4184F3" strokeWidth={2} fill="url(#priceFill)" />
              <Line type="monotone" dataKey="ma" stroke="#F59E0B" strokeWidth={1.5} dot={false} strokeDasharray="4 3" />
            </>
          ) : (
            <Bar dataKey="volatility" fill="#F59E0B" radius={[3, 3, 0, 0]} maxBarSize={18} />
          )}
        </ComposedChart>
      </ResponsiveContainer>

      {showVolume && metric === "price" && (
        <ResponsiveContainer width="100%" height={70}>
          <ComposedChart data={series} margin={{ left: -12, right: 8, top: 0, bottom: 0 }}>
            <XAxis dataKey="label" hide />
            <YAxis hide />
            <Bar dataKey="volume" fill="#E5E7EB" radius={[2, 2, 0, 0]} maxBarSize={14} />
          </ComposedChart>
        </ResponsiveContainer>
      )}
      <p className="text-[10px] text-gray-400 mt-2 font-medium">Volume (OHLCV Dhan Feed)</p>
    </div>
  );
}
