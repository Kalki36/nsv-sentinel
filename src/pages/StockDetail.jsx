import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getStock } from "../data/stocks";
import MarketChart from "../components/MarketChart";
import MetricRow from "../components/MetricCard";
import AlertTable from "../components/AlertTable";
import AlertDetail from "../components/AlertDetail";
import SentimentCard from "../components/SentimentCard";
import NewsCard from "../components/NewsCard";
import DecisionCard from "../components/DecisionCard";
import ExplainabilityChart from "../components/ExplainabilityChart";
import FundamentalGauge from "../components/FundamentalGauge";
import { RiskGauge, RiskBars } from "../components/RiskGauge";
import { LoadingState } from "../components/States";
import { getSurveillanceAlerts, getSentiment, getAIDecision, getExplainability, getRiskAnalysis, getFundamentals } from "../services/api";

const TABS = ["Overview", "Fundamentals", "Analytics", "Surveillance", "Sentiment", "Risk", "AI Decision", "Explainability"];

export default function StockDetail() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("Overview");
  const stock = getStock(symbol);

  return (
    <div className="space-y-5">
      <button onClick={() => navigate(-1)} className="focus-ring inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 cursor-pointer">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
      </button>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-3">
            <h1 className="font-display text-2xl font-bold text-gray-900">{stock.symbol}</h1>
            <span className="text-sm font-medium text-gray-500">{stock.name}</span>
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="data-num text-xl font-bold text-gray-900">₹{stock.price.toLocaleString("en-IN")}</span>
            <span className={`data-num text-sm font-bold ${stock.change >= 0 ? "text-emerald-600" : "text-zerodha-red"}`}>
              {stock.change >= 0 ? "+" : ""}
              {stock.change}%
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 overflow-x-auto shadow-xs">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`focus-ring shrink-0 rounded-md px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
              tab === t ? "bg-zerodha-redsoft text-zerodha-red border border-zerodha-red/30" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && <OverviewTab stock={stock} />}
      {tab === "Fundamentals" && <FundamentalsTab symbol={stock.symbol} />}
      {tab === "Analytics" && <MarketChart symbol={stock.symbol} />}
      {tab === "Surveillance" && <SurveillanceTab symbol={stock.symbol} />}
      {tab === "Sentiment" && <SentimentTab symbol={stock.symbol} />}
      {tab === "Risk" && <RiskTab symbol={stock.symbol} />}
      {tab === "AI Decision" && <DecisionTab symbol={stock.symbol} />}
      {tab === "Explainability" && <ExplainTab symbol={stock.symbol} />}
    </div>
  );
}

function OverviewTab({ stock }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
      <MarketChart symbol={stock.symbol} />
      <div className="nsv-panel p-4 bg-white border border-gray-200 rounded-xl shadow-xs">
        <h3 className="font-display text-sm font-bold text-gray-900 mb-3">Key Metrics</h3>
        <MetricRow label="Price" value={`₹${stock.price.toLocaleString("en-IN")}`} />
        <MetricRow label="Change" value={`${stock.change >= 0 ? "+" : ""}${stock.change}%`} tone={stock.change >= 0 ? "buy" : "sell"} />
        <MetricRow label="Volume" value={stock.volume} />
        <MetricRow label="Volatility" value={`${stock.volatility}%`} />
        <MetricRow label="RSI" value={stock.rsi} />
        <MetricRow label="Risk Score" value={stock.riskScore} tone={stock.riskScore >= 60 ? "sell" : "buy"} />
        <MetricRow label="Sector" value={stock.sector} />
        <MetricRow label="Exchange" value={stock.exchange} />
      </div>
    </div>
  );
}

function FundamentalsTab({ symbol }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    setData(null);
    getFundamentals(symbol).then(setData);
  }, [symbol]);

  if (!data) return <LoadingState label="Loading fundamental metrics" />;
  return <FundamentalGauge fundamental={data} />;
}

function SurveillanceTab({ symbol }) {
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    getSurveillanceAlerts().then(setData);
  }, []);
  if (!data) return <LoadingState label="Loading alerts" />;
  const alerts = data.alerts.filter((a) => a.symbol === symbol);
  return (
    <div className="nsv-panel p-5 bg-white border border-gray-200 rounded-xl shadow-xs">
      <AlertTable alerts={alerts} onSelect={setSelected} />
      <AlertDetail alert={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function SentimentTab({ symbol }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    setData(null);
    getSentiment(symbol).then(setData);
  }, [symbol]);
  if (!data) return <LoadingState label="Analyzing sentiment" />;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <SentimentCard summary={data.summary} />
      <div className="nsv-panel p-4 space-y-3 bg-white border border-gray-200 rounded-xl shadow-xs">
        <h3 className="text-xs font-bold text-gray-500">Latest Coverage</h3>
        {data.articles.length ? data.articles.map((a) => <NewsCard key={a.id} article={a} />) : <p className="text-xs text-gray-400">No recent articles.</p>}
      </div>
    </div>
  );
}

function RiskTab({ symbol }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    setData(null);
    getRiskAnalysis(symbol).then(setData);
  }, [symbol]);
  if (!data) return <LoadingState label="Aggregating risk" />;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="nsv-panel p-6 flex items-center justify-center bg-white border border-gray-200 rounded-xl shadow-xs">
        <RiskGauge score={data.breakdown.overall} />
      </div>
      <div className="nsv-panel p-5 lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-xs">
        <RiskBars breakdown={data.breakdown} />
      </div>
    </div>
  );
}

function DecisionTab({ symbol }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    setData(null);
    getAIDecision(symbol).then(setData);
  }, [symbol]);
  if (!data) return <LoadingState label="Running decision engine" />;
  return (
    <div className="space-y-5">
      <DecisionCard recommendation={data.recommendation} confidence={data.confidence} />
      <div className="nsv-panel p-5 bg-white border border-gray-200 rounded-xl shadow-xs">
        <ExplainabilityChart factors={data.factors} />
      </div>
    </div>
  );
}

function ExplainTab({ symbol }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    setData(null);
    getExplainability(symbol).then(setData);
  }, [symbol]);
  if (!data) return <LoadingState label="Computing explanation" />;
  return (
    <div className="nsv-panel p-5 space-y-4 bg-white border border-gray-200 rounded-xl shadow-xs">
      <p className="text-xs font-medium text-gray-600 leading-relaxed">{data.explanation}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-bold text-emerald-600 mb-3">Positive Factors</p>
          <ExplainabilityChart factors={data.positiveFactors.length ? data.positiveFactors : [{ label: "None", value: 0 }]} />
        </div>
        <div>
          <p className="text-xs font-bold text-zerodha-red mb-3">Negative Factors</p>
          <ExplainabilityChart factors={data.negativeFactors.length ? data.negativeFactors : [{ label: "None", value: 0 }]} />
        </div>
      </div>
    </div>
  );
}
