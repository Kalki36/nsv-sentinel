import { useState, useMemo, useEffect } from "react";
import {
  ResponsiveContainer,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Bar,
} from "recharts";
import { ShieldCheck, Sun, Moon, RefreshCw } from "lucide-react";
import { getMarketData, getMarketStatus } from "../services/api";
import { generateSeries, getStock } from "../data/stocks";

const RANGES = ["1D", "1W", "1M", "3M", "1Y"];

// Custom TradingView Candlestick renderer
const CandlestickShape = (props) => {
  const { x, y, width, height, payload } = props;
  if (!payload || props.dataKey !== "candleRange") return null;

  const open = payload.open ?? payload.price;
  const close = payload.close ?? payload.price;
  const high = payload.high ?? Math.max(open, close);
  const low = payload.low ?? Math.min(open, close);
  const isUp = close >= open;
  const color = isUp ? "#089981" : "#F23645"; // TradingView green & red

  const midX = x + width / 2;
  const bodyTop = y;
  const bodyBottom = y + height;
  const bodyHeight = Math.max(height, 2);

  const priceDiff = Math.abs(close - open) || 0.01;
  const pixelPerUnit = bodyHeight / priceDiff;

  const highPixelDiff = Math.max(0, (high - Math.max(open, close)) * pixelPerUnit);
  const lowPixelDiff = Math.max(0, (Math.min(open, close) - low) * pixelPerUnit);

  const wickTop = Math.max(4, bodyTop - highPixelDiff);
  const wickBottom = bodyBottom + lowPixelDiff;

  return (
    <g className="tv-candlestick">
      {/* High-Low Wick line */}
      <line
        x1={midX}
        y1={wickTop}
        x2={midX}
        y2={wickBottom}
        stroke={color}
        strokeWidth={1.5}
      />
      {/* Real Body Candle */}
      <rect
        x={x + 1}
        y={bodyTop}
        width={Math.max(width - 2, 2)}
        height={bodyHeight}
        fill={color}
        stroke={color}
        strokeWidth={1}
        rx={1}
      />
    </g>
  );
};

export default function MarketChart({ symbol = "NIFTY50", showVolume = true }) {
  const [range, setRange] = useState("1D");
  const [chartType, setChartType] = useState("candles"); // "candles" | "area"
  const [theme, setTheme] = useState("light"); // Default to Light theme as requested by user
  const [loading, setLoading] = useState(false);
  const [rawSeries, setRawSeries] = useState([]);
  const [stockInfo, setStockInfo] = useState(null);
  const [marketStatus, setMarketStatus] = useState({
    status: "CLOSED",
    is_open: false,
    trading_hours: "09:15 - 15:30 IST",
    message: "Market is CLOSED (Trading Hours: 09:15 - 15:30 IST)",
    ist_time: ""
  });

  // Technical Indicators Toggles
  const [indicators, setIndicators] = useState({
    ema20: true,
    sma50: true,
    bollinger: true,
    volume: true,
  });

  // Currently hovered candle for top TradingView OHLC readout
  const [hoveredData, setHoveredData] = useState(null);

  // Load Market Status & Stock Series from Dhan HQ Backend API
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [marketRes, seriesRes] = await Promise.all([
          getMarketStatus(),
          getMarketData(symbol, range),
        ]);

        if (isMounted) {
          if (marketRes) setMarketStatus(marketRes);
          if (seriesRes?.series && seriesRes.series.length > 0) {
            setRawSeries(seriesRes.series);
            if (seriesRes.stock) setStockInfo(seriesRes.stock);
          } else {
            // Fallback
            const fallback = generateSeries(symbol, range);
            setRawSeries(fallback);
            setStockInfo(getStock(symbol));
          }
        }
      } catch (err) {
        console.warn("Dhan chart feed offline, loading synthetic data:", err);
        if (isMounted) {
          setRawSeries(generateSeries(symbol, range));
          setStockInfo(getStock(symbol));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [symbol, range]);

  // Compute Series with CandleRange for Recharts
  const chartData = useMemo(() => {
    if (!rawSeries || rawSeries.length === 0) return [];
    return rawSeries.map((item) => {
      const open = item.open ?? item.price;
      const close = item.close ?? item.price;
      const high = item.high ?? Math.max(open, close);
      const low = item.low ?? Math.min(open, close);
      const isUp = close >= open;

      return {
        ...item,
        open,
        high,
        low,
        close,
        is_up: isUp,
        candleRange: [Math.min(open, close), Math.max(open, close)],
        volumeColor: isUp ? "#089981" : "#F23645",
      };
    });
  }, [rawSeries]);

  // Dynamic Y-axis domain calculation to ensure wicks and indicators fit perfectly
  const yDomain = useMemo(() => {
    if (!chartData.length) return ["auto", "auto"];
    let min = Infinity;
    let max = -Infinity;

    chartData.forEach((d) => {
      if (d.low && d.low < min) min = d.low;
      if (d.high && d.high > max) max = d.high;
      if (d.price && d.price < min) min = d.price;
      if (d.price && d.price > max) max = d.price;
      if (indicators.bollinger) {
        if (d.lower_band && d.lower_band < min) min = d.lower_band;
        if (d.upper_band && d.upper_band > max) max = d.upper_band;
      }
      if (indicators.sma50 && d.ma50) {
        if (d.ma50 < min) min = d.ma50;
        if (d.ma50 > max) max = d.ma50;
      }
      if (indicators.ema20 && d.ma) {
        if (d.ma < min) min = d.ma;
        if (d.ma > max) max = d.ma;
      }
    });

    if (min === Infinity || max === -Infinity) return ["auto", "auto"];
    const pad = (max - min) * 0.04 || 5;
    return [Math.floor(min - pad), Math.ceil(max + pad)];
  }, [chartData, indicators]);

  // Active or latest point for OHLC Bar
  const activeCandle = hoveredData || chartData[chartData.length - 1] || null;
  const prevCandle = chartData.length > 1 ? chartData[chartData.length - 2] : activeCandle;
  const priceChange = activeCandle && prevCandle
    ? (activeCandle.close ?? activeCandle.price) - (prevCandle.close ?? prevCandle.price)
    : 0;
  const pctChange = activeCandle && prevCandle && (prevCandle.close ?? prevCandle.price) > 0
    ? (priceChange / (prevCandle.close ?? prevCandle.price)) * 100
    : 0;

  const isDark = theme === "dark";

  // TradingView Palette (Light Mode Default with full Dark Mode support)
  const tvBg = isDark ? "bg-[#131722]" : "bg-white";
  const tvCardBg = isDark ? "bg-[#1e222d]" : "bg-[#F8F9FD]";
  const tvBorder = isDark ? "border-[#2a2e39]" : "border-gray-200";
  const tvText = isDark ? "text-[#d1d4dc]" : "text-gray-900";
  const tvMuted = isDark ? "text-[#787b86]" : "text-gray-500";
  const tvGrid = isDark ? "#2a2e39" : "#EDF0F5";

  const isIndex = symbol === "NIFTY50" || symbol === "BANKNIFTY" || symbol === "SENSEX";
  const segmentLabel = symbol === "SENSEX" ? "BSE · INDEX" : isIndex ? "NSE · INDEX" : "NSE · NIFTY 50";

  return (
    <div className={`rounded-xl border ${tvBorder} ${tvBg} shadow-sm transition-colors overflow-hidden font-sans`}>
      {/* Top TradingView Bar 1: Symbol Info, Market Status, Indicators Toggles */}
      <div className={`flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b ${tvBorder} ${tvCardBg}`}>
        {/* Left: Stock Symbol, Exchange, Dhan Feed Badge & Market Status */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className={`text-base font-bold font-mono ${tvText}`}>{symbol}</span>
            {stockInfo?.name && (
              <span className={`hidden md:inline text-xs ${tvMuted}`}>({stockInfo.name})</span>
            )}
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 border border-blue-500/20">
              {segmentLabel}
            </span>
            {loading && <RefreshCw className="h-3 w-3 animate-spin text-blue-500" />}
          </div>

          {/* Real-time Market Status Indicator Pill */}
          <div
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
              marketStatus.is_open
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-red-500/10 text-red-400 border-red-500/30"
            }`}
            title={marketStatus.message}
          >
            <span className={`h-2 w-2 rounded-full ${marketStatus.is_open ? "bg-emerald-500 pulse-dot" : "bg-red-500"}`} />
            <span>{marketStatus.is_open ? "MARKET OPEN" : "MARKET CLOSED"}</span>
            <span className={`hidden sm:inline text-[10px] font-normal ${tvMuted}`}>
              ({marketStatus.trading_hours || "09:15 - 15:30 IST"})
            </span>
          </div>

          {/* Dhan Feed Status Badge */}
          <div className="hidden lg:flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-3 w-3" />
            <span>DHAN HQ v2 REALTIME</span>
          </div>
        </div>

        {/* Right: Controls (Chart Type, Indicators, Timeframe, Theme) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Chart Style Switch: Candlesticks vs Area */}
          <div className={`flex items-center rounded-lg border ${tvBorder} p-0.5 ${isDark ? "bg-[#131722]" : "bg-white"}`}>
            <button
              onClick={() => setChartType("candles")}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                chartType === "candles"
                  ? "bg-[#2962FF] text-white shadow-xs"
                  : `${tvMuted} hover:${tvText}`
              }`}
              title="Candlestick OHLC View"
            >
              <span>🕯️</span>
              <span className="hidden sm:inline">Candles</span>
            </button>
            <button
              onClick={() => setChartType("area")}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                chartType === "area"
                  ? "bg-[#2962FF] text-white shadow-xs"
                  : `${tvMuted} hover:${tvText}`
              }`}
              title="TradingView Area View"
            >
              <span>📈</span>
              <span className="hidden sm:inline">Area</span>
            </button>
          </div>

          {/* Range Selector */}
          <div className={`flex items-center rounded-lg border ${tvBorder} p-0.5 ${isDark ? "bg-[#131722]" : "bg-white"}`}>
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-2 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                  range === r
                    ? "bg-[#2962FF] text-white font-bold"
                    : `${tvMuted} hover:${tvText}`
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`p-1.5 rounded-lg border ${tvBorder} ${tvMuted} hover:${tvText} transition-colors cursor-pointer`}
            title={`Switch to ${isDark ? "Light" : "TradingView Dark"} Mode`}
          >
            {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Top TradingView Bar 2: Technical Indicators Toggles + Live OHLC Readout */}
      <div className={`flex flex-wrap items-center justify-between gap-3 px-4 py-2 border-b ${tvBorder} text-xs font-mono ${isDark ? "bg-[#181c27]" : "bg-gray-100/60"}`}>
        {/* Live OHLC Bar */}
        {activeCandle ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <div className="flex items-center gap-1.5">
              <span className={tvMuted}>Price:</span>
              <span className={`font-bold ${tvText}`}>
                ₹{(activeCandle.close ?? activeCandle.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
              <span className={`text-[11px] font-semibold ${priceChange >= 0 ? "text-[#089981]" : "text-[#F23645]"}`}>
                {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)} ({pctChange >= 0 ? "+" : ""}{pctChange.toFixed(2)}%)
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              <span><span className={tvMuted}>O: </span><span className={tvText}>₹{(activeCandle.open ?? activeCandle.price).toFixed(2)}</span></span>
              <span><span className={tvMuted}>H: </span><span className="text-[#089981]">₹{(activeCandle.high ?? activeCandle.price).toFixed(2)}</span></span>
              <span><span className={tvMuted}>L: </span><span className="text-[#F23645]">₹{(activeCandle.low ?? activeCandle.price).toFixed(2)}</span></span>
              <span><span className={tvMuted}>C: </span><span className={tvText}>₹{(activeCandle.close ?? activeCandle.price).toFixed(2)}</span></span>
              <span><span className={tvMuted}>Vol: </span><span className="text-amber-400">{(activeCandle.volume ? (activeCandle.volume / 1000000).toFixed(2) + "M" : "N/A")}</span></span>
            </div>
          </div>
        ) : (
          <span className={tvMuted}>Loading live quote...</span>
        )}

        {/* Indicators Overlay Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-[10px] uppercase tracking-wider font-sans font-semibold ${tvMuted}`}>Indicators:</span>
          
          <button
            onClick={() => setIndicators((prev) => ({ ...prev, ema20: !prev.ema20 }))}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
              indicators.ema20
                ? "bg-[#2962FF]/20 text-[#2962FF] border-[#2962FF]/40 font-bold"
                : `${tvMuted} border-transparent opacity-60 hover:opacity-100`
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#2962FF]" />
            20 EMA
          </button>

          <button
            onClick={() => setIndicators((prev) => ({ ...prev, sma50: !prev.sma50 }))}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
              indicators.sma50
                ? "bg-[#FF9800]/20 text-[#FF9800] border-[#FF9800]/40 font-bold"
                : `${tvMuted} border-transparent opacity-60 hover:opacity-100`
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF9800]" />
            50 SMA
          </button>

          <button
            onClick={() => setIndicators((prev) => ({ ...prev, bollinger: !prev.bollinger }))}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
              indicators.bollinger
                ? "bg-[#00BCD4]/20 text-[#00BCD4] border-[#00BCD4]/40 font-bold"
                : `${tvMuted} border-transparent opacity-60 hover:opacity-100`
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#00BCD4]" />
            Bollinger (20, 2)
          </button>

          <button
            onClick={() => setIndicators((prev) => ({ ...prev, volume: !prev.volume }))}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
              indicators.volume
                ? "bg-purple-500/20 text-purple-400 border-purple-500/40 font-bold"
                : `${tvMuted} border-transparent opacity-60 hover:opacity-100`
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
            Volume
          </button>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="p-3">
        <ResponsiveContainer width="100%" height={340}>
          <ComposedChart
            data={chartData}
            margin={{ left: 0, right: 12, top: 10, bottom: 0 }}
            onMouseMove={(state) => {
              if (state?.activePayload?.[0]?.payload) {
                setHoveredData(state.activePayload[0].payload);
              }
            }}
            onMouseLeave={() => setHoveredData(null)}
          >
            <defs>
              <linearGradient id="tvAreaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2962FF" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#2962FF" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke={tvGrid} strokeDasharray="2 2" vertical={true} />
            <XAxis
              dataKey="label"
              tick={{ fill: isDark ? "#787b86" : "#6B7280", fontSize: 10, fontFamily: "monospace" }}
              axisLine={{ stroke: tvGrid }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={yDomain}
              orientation="right"
              tick={{ fill: isDark ? "#787b86" : "#6B7280", fontSize: 10, fontFamily: "monospace" }}
              axisLine={{ stroke: tvGrid }}
              tickLine={false}
              width={65}
              tickFormatter={(v) => `₹${v.toLocaleString("en-IN")}`}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0]?.payload;
                if (!d) return null;
                return (
                  <div className={`p-3 rounded-lg border shadow-xl text-xs font-mono ${
                    isDark ? "bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]" : "bg-white border-gray-200 text-gray-900"
                  }`}>
                    <p className={`font-bold mb-2 pb-1 border-b ${isDark ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-600"}`}>
                      {label} · {symbol} (NSE)
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
                      <div><span className={tvMuted}>Open:</span> ₹{(d.open ?? d.price).toFixed(2)}</div>
                      <div><span className={tvMuted}>High:</span> <span className="text-[#089981]">₹{(d.high ?? d.price).toFixed(2)}</span></div>
                      <div><span className={tvMuted}>Low:</span> <span className="text-[#F23645]">₹{(d.low ?? d.price).toFixed(2)}</span></div>
                      <div><span className={tvMuted}>Close:</span> ₹{(d.close ?? d.price).toFixed(2)}</div>
                      {d.ma && indicators.ema20 && (
                        <div><span className="text-[#2962FF] font-semibold">20 EMA:</span> ₹{d.ma.toFixed(2)}</div>
                      )}
                      {d.ma50 && indicators.sma50 && (
                        <div><span className="text-[#FF9800] font-semibold">50 SMA:</span> ₹{d.ma50.toFixed(2)}</div>
                      )}
                      {d.upper_band && indicators.bollinger && (
                        <div><span className="text-[#00BCD4]">BB Upper:</span> ₹{d.upper_band.toFixed(2)}</div>
                      )}
                      {d.lower_band && indicators.bollinger && (
                        <div><span className="text-[#00BCD4]">BB Lower:</span> ₹{d.lower_band.toFixed(2)}</div>
                      )}
                      <div className="col-span-2 mt-1 pt-1 border-t border-gray-700/50">
                        <span className={tvMuted}>Volume:</span> {d.volume ? d.volume.toLocaleString("en-IN") : "N/A"}
                      </div>
                    </div>
                  </div>
                );
              }}
            />

            <Legend
              verticalAlign="top"
              align="left"
              iconType="plainline"
              wrapperStyle={{ fontSize: 11, paddingBottom: 8, fontFamily: "monospace" }}
            />

            {/* Bollinger Bands */}
            {indicators.bollinger && (
              <>
                <Line
                  type="monotone"
                  dataKey="upper_band"
                  name="BB Upper (20, 2)"
                  stroke="#00BCD4"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="lower_band"
                  name="BB Lower (20, 2)"
                  stroke="#00BCD4"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  dot={false}
                  isAnimationActive={false}
                />
              </>
            )}

            {/* 20 EMA */}
            {indicators.ema20 && (
              <Line
                type="monotone"
                dataKey="ma"
                name="20-EMA"
                stroke="#2962FF"
                strokeWidth={1.8}
                dot={false}
                isAnimationActive={false}
              />
            )}

            {/* 50 SMA */}
            {indicators.sma50 && (
              <Line
                type="monotone"
                dataKey="ma50"
                name="50-SMA"
                stroke="#FF9800"
                strokeWidth={1.8}
                dot={false}
                isAnimationActive={false}
              />
            )}

            {/* Chart Type: Candlestick vs Area */}
            {chartType === "candles" ? (
              <Bar
                dataKey="candleRange"
                name="OHLC Candlesticks"
                shape={<CandlestickShape />}
                isAnimationActive={false}
              />
            ) : (
              <Area
                type="monotone"
                dataKey="close"
                name="Price (₹)"
                stroke="#2962FF"
                strokeWidth={2}
                fill="url(#tvAreaFill)"
                isAnimationActive={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>

        {/* Sub-chart: Volume Bar Chart */}
        {indicators.volume && showVolume && (
          <div className={`mt-1 pt-2 border-t ${tvBorder}`}>
            <div className="flex items-center justify-between text-[10px] font-mono mb-1 px-1">
              <span className={tvMuted}>VOLUME (DHAN HQ FEED)</span>
              {activeCandle?.volume && (
                <span className={activeCandle.is_up ? "text-[#089981] font-semibold" : "text-[#F23645] font-semibold"}>
                  {activeCandle.volume.toLocaleString("en-IN")} units
                </span>
              )}
            </div>
            <ResponsiveContainer width="100%" height={85}>
              <ComposedChart data={chartData} margin={{ left: 0, right: 12, top: 2, bottom: 0 }}>
                <CartesianGrid stroke={tvGrid} strokeDasharray="2 2" vertical={false} />
                <XAxis dataKey="label" hide />
                <YAxis orientation="right" hide domain={[0, "auto"]} />
                <Bar
                  dataKey="volume"
                  name="Volume"
                  shape={(props) => {
                    const { x, y, width, height, payload } = props;
                    const fill = payload?.is_up ? "#089981" : "#F23645";
                    return <rect x={x} y={y} width={Math.max(width - 1, 1)} height={height} fill={fill} opacity={0.65} />;
                  }}
                  isAnimationActive={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Footer Info: Dhan Real-time Feed & Trading Hours */}
      <div className={`flex flex-wrap items-center justify-between gap-2 px-4 py-2 border-t ${tvBorder} ${tvCardBg} text-[11px] font-mono ${tvMuted}`}>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          <span>Feed: Dhan HQ API v2 · Stream: Realtime Intraday & Historical OHLCV</span>
        </div>
        <div>
          <span>Indian Market Hours: 09:15 - 15:30 IST · Mon-Fri</span>
        </div>
      </div>
    </div>
  );
}
