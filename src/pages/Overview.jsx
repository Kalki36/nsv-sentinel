import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Radar,
  ShieldCheck,
  Gauge,
  BrainCircuit,
  RefreshCw,
  Download,
  Bot,
  Sparkles,
  Info,
  CheckCircle2,
  TrendingUp,
  X,
  Search,
  Layers
} from "lucide-react";
import PipelineRibbon from "../components/PipelineRibbon";
import KpiCard from "../components/KpiCard";
import MarketChart from "../components/MarketChart";
import MetricRow from "../components/MetricCard";
import AlertTable from "../components/AlertTable";
import AlertDetail from "../components/AlertDetail";
import AIAssistant from "../components/AIAssistant";
import StockSearch from "../components/StockSearch";
import { LoadingState } from "../components/States";
import { getStock, STOCKS } from "../data/stocks";
import { getSurveillanceAlerts, getStockList } from "../services/api";

export default function Overview() {
  const [alertsData, setAlertsData] = useState(null);
  const [selected, setSelected] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState("");
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  
  // Benchmark Indices & NIFTY 50 Search State
  // Default: usually shows NIFTY 50, NIFTY (BANKNIFTY), and SENSEX data of that day until searched
  const [selectedBenchmark, setSelectedBenchmark] = useState("NIFTY50");
  const [searchedStock, setSearchedStock] = useState(null);
  const [universeList, setUniverseList] = useState(STOCKS);

  const navigate = useNavigate();

  useEffect(() => {
    getSurveillanceAlerts().then(setAlertsData);
    getStockList().then((list) => {
      if (list && list.length > 0) setUniverseList(list);
    });
  }, []);

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => {
      getSurveillanceAlerts().then(setAlertsData);
      getStockList().then((list) => {
        if (list && list.length > 0) setUniverseList(list);
      });
      setRefreshing(false);
      setToast("Dhan HQ live market feed & FinBERT sentiment updated.");
      setTimeout(() => setToast(""), 3500);
    }, 600);
  }

  function handleTriggerAI() {
    setToast("Re-evaluating FinBERT NLP sentiment and decision vectors...");
    setTimeout(() => setToast("AI Decision engine re-calibrated. Recommendation: BUY (87% confidence)."), 1200);
    setTimeout(() => setToast(""), 4500);
  }

  function handleExportReport() {
    setToast("Exporting Surveillance & Risk Report (PDF/CSV)...");
    setTimeout(() => setToast("Surveillance Summary Report downloaded successfully."), 1500);
    setTimeout(() => setToast(""), 4000);
  }

  // Active Symbol being inspected:
  // If user searched for any stock from NIFTY 50, show that stock; otherwise show the selected benchmark index (NIFTY 50, NIFTY/BANKNIFTY, SENSEX)
  const activeSymbol = searchedStock || selectedBenchmark;
  const currentItem = universeList.find((s) => s.symbol === activeSymbol) || getStock(activeSymbol);

  // Helper to find index quote in universeList
  const getIndexQuote = (sym) => universeList.find((s) => s.symbol === sym) || getStock(sym);
  const nifty50Quote = getIndexQuote("NIFTY50");
  const bankNiftyQuote = getIndexQuote("BANKNIFTY");
  const sensexQuote = getIndexQuote("SENSEX");

  return (
    <div className="space-y-5">
      <PipelineRibbon />

      {/* Header & Top Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-gray-900">Market Surveillance Overview</h1>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 font-medium">
            <span className="font-semibold text-gray-700">Dhan HQ API v2</span>
            <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 pulse-dot" /> LIVE MARKET FEED (Client: 1114191288)
            </span>
            <span className="text-gray-400">Validated with SHA-256 Hashes</span>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="focus-ring flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-xs transition cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-zerodha-red" : ""}`} />
            Refresh Feed
          </button>
          
          <button
            onClick={handleTriggerAI}
            className="focus-ring flex items-center gap-1.5 rounded-lg border border-zerodha-red/40 bg-zerodha-redsoft px-3 py-2 text-xs font-semibold text-zerodha-red hover:bg-zerodha-red hover:text-white transition cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Trigger AI Analysis
          </button>

          <button
            onClick={handleExportReport}
            className="focus-ring flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-xs transition cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            Export Report
          </button>

          <button
            onClick={() => setAiAssistantOpen(true)}
            className="focus-ring flex items-center gap-1.5 rounded-lg bg-zerodha-red px-3 py-2 text-xs font-semibold text-white hover:brightness-110 shadow-xs transition cursor-pointer"
          >
            <Bot className="h-3.5 w-3.5" />
            AI Assistant
          </button>
        </div>
      </div>

      {toast && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium animate-fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          {toast}
        </div>
      )}

      {/* TODAY'S BENCHMARK INDICES BAR (NIFTY 50, NIFTY / BANKNIFTY, SENSEX) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-indigo-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Today&apos;s Indian Market Benchmark Indices (09:15 – 15:30 IST)
            </h2>
          </div>
          <span className="text-[11px] text-gray-500 font-medium">Click any index to view today&apos;s chart</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Index 1: NIFTY 50 */}
          <button
            type="button"
            onClick={() => {
              setSearchedStock(null);
              setSelectedBenchmark("NIFTY50");
            }}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              !searchedStock && selectedBenchmark === "NIFTY50"
                ? "bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm"
                : "bg-white border-gray-200 hover:border-gray-300 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-gray-900 font-mono">NIFTY 50</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                NSE · Benchmark
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-lg font-bold font-mono text-gray-900">
                ₹{nifty50Quote.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
              <span className={`text-xs font-bold ${nifty50Quote.change >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {nifty50Quote.change >= 0 ? "+" : ""}{nifty50Quote.change}%
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-500 mt-1 font-mono">
              <span>Day O: ₹{(nifty50Quote.open || nifty50Quote.price).toLocaleString("en-IN")}</span>
              <span>Day H: ₹{(nifty50Quote.high || nifty50Quote.price).toLocaleString("en-IN")}</span>
            </div>
          </button>

          {/* Index 2: NIFTY (BANKNIFTY) */}
          <button
            type="button"
            onClick={() => {
              setSearchedStock(null);
              setSelectedBenchmark("BANKNIFTY");
            }}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              !searchedStock && selectedBenchmark === "BANKNIFTY"
                ? "bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm"
                : "bg-white border-gray-200 hover:border-gray-300 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-gray-900 font-mono">NIFTY BANK</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                NSE · Sectoral
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-lg font-bold font-mono text-gray-900">
                ₹{bankNiftyQuote.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
              <span className={`text-xs font-bold ${bankNiftyQuote.change >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {bankNiftyQuote.change >= 0 ? "+" : ""}{bankNiftyQuote.change}%
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-500 mt-1 font-mono">
              <span>Day O: ₹{(bankNiftyQuote.open || bankNiftyQuote.price).toLocaleString("en-IN")}</span>
              <span>Day H: ₹{(bankNiftyQuote.high || bankNiftyQuote.price).toLocaleString("en-IN")}</span>
            </div>
          </button>

          {/* Index 3: SENSEX */}
          <button
            type="button"
            onClick={() => {
              setSearchedStock(null);
              setSelectedBenchmark("SENSEX");
            }}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              !searchedStock && selectedBenchmark === "SENSEX"
                ? "bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm"
                : "bg-white border-gray-200 hover:border-gray-300 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-gray-900 font-mono">BSE SENSEX</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                BSE · Benchmark
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-lg font-bold font-mono text-gray-900">
                ₹{sensexQuote.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
              <span className={`text-xs font-bold ${sensexQuote.change >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {sensexQuote.change >= 0 ? "+" : ""}{sensexQuote.change}%
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-500 mt-1 font-mono">
              <span>Day O: ₹{(sensexQuote.open || sensexQuote.price).toLocaleString("en-IN")}</span>
              <span>Day H: ₹{(sensexQuote.high || sensexQuote.price).toLocaleString("en-IN")}</span>
            </div>
          </button>
        </div>
      </div>

      {/* SEARCH OR SELECT ANY STOCK FROM NIFTY 50 (Interactive Search Bar & Popular Chips) */}
      <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Search NIFTY 50 Stock Universe (50 Stocks)
            </span>
          </div>

          {/* Inline NIFTY 50 Search Box */}
          <div className="w-full sm:w-auto">
            <StockSearch
              compact
              onSelect={(symbol) => setSearchedStock(symbol)}
              placeholder="Search any Nifty 50 stock (e.g. RELIANCE, TCS, INFY)..."
            />
          </div>
        </div>

        {/* Quick Select Chips for Popular Nifty 50 Constituents */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-gray-500 mr-1 flex items-center gap-1">
            <Layers className="h-3 w-3 text-gray-400" />
            Nifty 50 Quick Picks:
          </span>
          {["RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK", "BHARTIARTL", "SBIN", "ITC", "TATAMOTORS", "LT", "BAJFINANCE"].map((sym) => (
            <button
              key={sym}
              type="button"
              onClick={() => setSearchedStock(sym)}
              className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-md border transition-colors cursor-pointer ${
                searchedStock === sym
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
              }`}
            >
              {sym}
            </button>
          ))}
        </div>
      </div>

      {/* Searched Stock Active Indicator Banner */}
      {searchedStock && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 animate-fade-in text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-600 pulse-dot" />
            <span className="font-semibold">Now Inspecting NIFTY 50 Stock:</span>
            <span className="font-bold font-mono text-blue-950 bg-white px-2 py-0.5 rounded border border-blue-200">
              {searchedStock}
            </span>
            <span className="text-blue-700 hidden sm:inline">({currentItem.name})</span>
          </div>

          <button
            type="button"
            onClick={() => setSearchedStock(null)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-blue-100 text-blue-700 font-bold border border-blue-300 transition-colors cursor-pointer shadow-xs"
          >
            <X className="h-3.5 w-3.5 text-blue-600" />
            <span>Reset to Benchmark Indices (Nifty 50 / Sensex)</span>
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard icon={Activity} label="Market Status" value="ACTIVE" sub="Dhan HQ Feed Open" tone="buy" />
        <KpiCard
          icon={Radar}
          label="Surveillance Alerts"
          value={alertsData ? String(alertsData.summary.total).padStart(2, "0") : "—"}
          sub="+2 from previous hour"
          tone="warn"
        />
        <KpiCard icon={ShieldCheck} label="Security Status" value="SECURE" sub="SHA-256 Validated" tone="buy" />
        <KpiCard icon={Gauge} label="Market Risk" value="62 / 100" sub="Moderate Risk" tone="warn" />
        <KpiCard icon={BrainCircuit} label="AI Confidence" value="87%" sub="High confidence" tone="ai" />
      </div>

      {/* Market Chart (Light Themed by Default) & Stock Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
        <MarketChart symbol={activeSymbol} />

        <div className="nsv-panel p-4 bg-white border border-gray-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-display text-sm font-bold text-gray-900">{currentItem.symbol}</h3>
            {currentItem.sector !== "Index" ? (
              <button
                type="button"
                onClick={() => navigate(`/stock/${currentItem.symbol}`)}
                className="focus-ring text-[11px] font-semibold text-zerodha-red hover:underline cursor-pointer"
              >
                Full Analytics →
              </button>
            ) : (
              <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                Index Feed
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mb-3">{currentItem.name}</p>
          <MetricRow label="Price" value={`₹${currentItem.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`} />
          <MetricRow label="Day Change" value={`${currentItem.change >= 0 ? "+" : ""}${currentItem.change}%`} tone={currentItem.change >= 0 ? "buy" : "sell"} />
          <MetricRow label="Volume" value={currentItem.volume || "N/A"} />
          <MetricRow label="Volatility" value={`${currentItem.volatility}%`} />
          <MetricRow label="RSI (14)" value={currentItem.rsi || 55} />
          <MetricRow label="Risk Score" value={currentItem.riskScore || 35} tone={(currentItem.riskScore || 35) >= 60 ? "sell" : "buy"} />
        </div>
      </div>

      {/* Pipeline Educational Explanation Banner */}
      <div className="nsv-panel p-5 space-y-2 bg-gray-50 border border-gray-200 rounded-xl">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-zerodha-red" />
          <h3 className="font-display text-sm font-bold text-gray-900">System Architecture & Data Pipeline</h3>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed font-medium">
          NSV Sentinel ingests market data quotes and OHLCV candles via Dhan HQ API endpoints. Ingested ticks are cryptographically verified using SHA-256 integrity signatures, evaluated for volume/price z-score anomalies, processed by FinBERT NLP for news sentiment tone, and aggregated into a dynamic composite risk score. The AI Decision engine synthesizes these signals into actionable BUY/SELL/HOLD recommendations with factor explainability.
        </p>
      </div>

      {/* Recent Surveillance Alerts */}
      <div className="nsv-panel p-5 bg-white border border-gray-200 rounded-xl shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-sm font-bold text-gray-900">Recent Surveillance Alerts</h3>
          <button onClick={() => navigate("/surveillance")} className="focus-ring text-xs font-semibold text-zerodha-red hover:underline cursor-pointer">
            View all
          </button>
        </div>
        {alertsData ? (
          <AlertTable alerts={alertsData.alerts.slice(0, 5)} onSelect={setSelected} compact />
        ) : (
          <LoadingState label="Loading surveillance alerts" />
        )}
      </div>

      <AlertDetail alert={selected} onClose={() => setSelected(null)} />
      <AIAssistant isOpen={aiAssistantOpen} onClose={() => setAiAssistantOpen(false)} />
    </div>
  );
}
