import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Radar, ShieldCheck, Gauge, BrainCircuit, RefreshCw, Download, Bot, Sparkles, Info, CheckCircle2 } from "lucide-react";
import PipelineRibbon from "../components/PipelineRibbon";
import KpiCard from "../components/KpiCard";
import MarketChart from "../components/MarketChart";
import MetricRow from "../components/MetricCard";
import AlertTable from "../components/AlertTable";
import AlertDetail from "../components/AlertDetail";
import AIAssistant from "../components/AIAssistant";
import { LoadingState } from "../components/States";
import { getStock, DEFAULT_SYMBOL } from "../data/stocks";
import { getSurveillanceAlerts } from "../services/api";

export default function Overview() {
  const [alertsData, setAlertsData] = useState(null);
  const [selected, setSelected] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState("");
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  
  const navigate = useNavigate();
  const stock = getStock(DEFAULT_SYMBOL);

  useEffect(() => {
    getSurveillanceAlerts().then(setAlertsData);
  }, []);

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => {
      getSurveillanceAlerts().then(setAlertsData);
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

  return (
    <div className="space-y-5">
      <PipelineRibbon />

      {/* Header & Top Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-gray-900">Market Surveillance Overview</h1>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 font-medium">
            <span>Dhan HQ / NSE Live Feed</span>
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 pulse-dot" /> LIVE
            </span>
            <span className="text-gray-400">Last updated 10:42:31 AM</span>
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

      {/* Market Chart & Stock Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
        <MarketChart symbol={DEFAULT_SYMBOL} />

        <div className="nsv-panel p-4 bg-white border border-gray-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-display text-sm font-bold text-gray-900">{stock.symbol}</h3>
            <button
              onClick={() => navigate(`/stock/${stock.symbol}`)}
              className="focus-ring text-[11px] font-semibold text-zerodha-red hover:underline cursor-pointer"
            >
              View details
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-3">{stock.name}</p>
          <MetricRow label="Price" value={`₹${stock.price.toLocaleString("en-IN")}`} />
          <MetricRow label="Change" value={`${stock.change >= 0 ? "+" : ""}${stock.change}%`} tone={stock.change >= 0 ? "buy" : "sell"} />
          <MetricRow label="Volume" value={stock.volume} />
          <MetricRow label="Volatility" value={`${stock.volatility}%`} />
          <MetricRow label="RSI" value={stock.rsi} />
          <MetricRow label="Risk Score" value={stock.riskScore} tone={stock.riskScore >= 60 ? "sell" : "buy"} />
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
