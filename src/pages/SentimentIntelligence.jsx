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
} from "recharts";
import {
  Search,
  RefreshCw,
  Key,
  Globe,
  ExternalLink,
  X,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import SentimentCard from "../components/SentimentCard";
import NewsCard from "../components/NewsCard";
import { LoadingState, EmptyState } from "../components/States";
import StatusBadge from "../components/StatusBadge";
import { getSentiment } from "../services/api";

const RANGES = ["24H", "7D", "15D", "30D"];
const FILTERS = ["All", "Positive", "Neutral", "Negative"];
const TONE = { Positive: "buy", Neutral: "warn", Negative: "sell" };

const POPULAR_TICKERS = [
  "RELIANCE",
  "TCS",
  "INFY",
  "HDFCBANK",
  "ICICIBANK",
  "TATAMOTORS",
  "ADANIENT",
  "NIFTY50",
  "BANKNIFTY",
  "SENSEX"
];

export default function SentimentIntelligence() {
  const [symbol, setSymbol] = useState("RELIANCE");
  const [searchInput, setSearchInput] = useState("RELIANCE");
  const [range, setRange] = useState("15D"); // Default to 15-day news window
  const [filter, setFilter] = useState("All");
  const [data, setData] = useState(null);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(localStorage.getItem("nsv_news_api_key") || "");
  const [keySavedMsg, setKeySavedMsg] = useState("");

  const loadData = async (targetSymbol = symbol, targetRange = range) => {
    setLoading(true);
    try {
      const res = await getSentiment(targetSymbol, targetRange);
      setData(res);
    } catch (err) {
      console.error("Failed to load sentiment data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(symbol, range);
  }, [symbol, range]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const clean = searchInput.trim().toUpperCase();
    if (clean) {
      setSymbol(clean);
    }
  };

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    const trimmed = apiKeyInput.trim();
    if (trimmed) {
      localStorage.setItem("nsv_news_api_key", trimmed);
      setKeySavedMsg("NewsAPI Key configured! Refreshing live news feed...");
    } else {
      localStorage.removeItem("nsv_news_api_key");
      setKeySavedMsg("NewsAPI Key removed. Reverting to curated intelligence.");
    }
    setTimeout(() => {
      setKeySavedMsg("");
      setShowKeyModal(false);
      loadData(symbol, range);
    }, 1200);
  };

  const filteredArticles = data
    ? filter === "All"
      ? data.articles
      : data.articles.filter((a) => a.sentiment === filter)
    : [];

  const isLiveFeed = data?.feed_source?.includes("NewsAPI");

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-gray-900">
              Sentiment Intelligence
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
              <Sparkles className="h-3 w-3" /> FinBERT NLP
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Real-time NewsAPI feed linked with Hugging Face FinBERT NLP sentiment classification (Positive: Green, Neutral: Yellow, Negative: Red).
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Feed Source Indicator Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
              isLiveFeed
                ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                : "bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            <Globe className={`h-3.5 w-3.5 ${isLiveFeed ? "text-emerald-600 animate-pulse" : "text-gray-500"}`} />
            <span>{data?.feed_source || "Curated Intelligence"}</span>
          </div>

          {/* Configure NewsAPI Key Button */}
          <button
            onClick={() => setShowKeyModal(true)}
            className="focus-ring flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 shadow-xs transition-colors cursor-pointer"
            title="Configure your NewsAPI Key for live search feeds"
          >
            <Key className="h-3.5 w-3.5 text-amber-500" />
            <span>API Key</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={() => loadData(symbol, range)}
            disabled={loading}
            className="focus-ring flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Feed</span>
          </button>
        </div>
      </div>

      {/* Stock Search Bar & Quick Ticker Selector */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search any stock ticker or company (e.g. RELIANCE, TCS, INFY, TATAMOTORS, AAPL, NVDA)..."
              className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-9 pr-3 text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="focus-ring rounded-lg bg-gray-900 hover:bg-black px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
          >
            Analyze Sentiment
          </button>
        </form>

        {/* Quick Stock Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">Quick Tickers:</span>
          {POPULAR_TICKERS.map((t) => (
            <button
              key={t}
              onClick={() => {
                setSymbol(t);
                setSearchInput(t);
              }}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                symbol === t
                  ? "bg-red-100 text-red-700 border border-red-300"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading && !data ? (
        <LoadingState label={`Ingesting live news & applying FinBERT sentiment on ${symbol}...`} />
      ) : data ? (
        <>
          {/* Sentiment Summary Donut & Trend Area Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5">
            {/* FinBERT Sentiment Donut with Legend */}
            <SentimentCard summary={data.summary} />

            {/* Sentiment Trend Area Chart with Full Multi-Class Legends */}
            <div className="nsv-panel p-5 bg-white border border-gray-200 rounded-xl shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    FinBERT Sentiment Trajectory — {symbol}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Distribution of Positive, Neutral, and Negative signals over {range}
                  </p>
                </div>

                <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-0.5">
                  {RANGES.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRange(r)}
                      className={`focus-ring rounded-md px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                        range === r
                          ? "bg-white text-zerodha-red shadow-xs font-bold"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={data.trend} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="posFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="neuFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.20} />
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="negFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EF4444" stopOpacity={0.22} />
                      <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#F3F4F6" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={{ stroke: "#E5E7EB" }} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={false} tickLine={false} width={34} />
                  <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ fontSize: 11, paddingBottom: 6 }}
                  />
                  <Area type="monotone" dataKey="positive" name="Positive Sentiment (%)" stroke="#10B981" strokeWidth={2} fill="url(#posFill)" />
                  <Area type="monotone" dataKey="neutral" name="Neutral Sentiment (%)" stroke="#F59E0B" strokeWidth={1.5} fill="url(#neuFill)" />
                  <Area type="monotone" dataKey="negative" name="Negative Sentiment (%)" stroke="#EF4444" strokeWidth={1.5} fill="url(#negFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* News Feed Section */}
          <div className="nsv-panel p-5 bg-white border border-gray-200 rounded-xl shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-display text-sm font-bold text-gray-900">
                  Live Stock Financial News Feed ({filteredArticles.length} Articles)
                </h3>
                <p className="text-[11px] text-gray-500 font-medium">
                  Each news item is evaluated through FinBERT NLP to determine Positive, Neutral, or Negative sentiment tone.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-0.5">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`focus-ring rounded-md px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                      filter === f
                        ? "bg-white text-zerodha-red shadow-xs font-bold"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {filteredArticles.length === 0 ? (
              <EmptyState label={`No news articles matching filter '${filter}' for ${symbol}`} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredArticles.map((a) => (
                  <NewsCard key={a.id} article={a} onSelect={setArticle} />
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}

      {/* Article Detail Modal with FinBERT Breakdown */}
      {article && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" onClick={() => setArticle(null)} />
          <div className="relative w-full max-w-xl bg-white border border-gray-200 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-base font-bold text-gray-900 leading-snug">
                {article.headline}
              </h3>
              <button
                onClick={() => setArticle(null)}
                className="focus-ring rounded-lg p-1.5 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* FinBERT Vector Banner */}
            <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-700">FinBERT Classification:</span>
                  <StatusBadge tone={TONE[article.sentiment]} label={article.sentiment} />
                </div>
                <span className="text-xs font-mono font-bold text-gray-600">
                  Confidence: {article.confidence}%
                </span>
              </div>

              {/* Probability distribution bars */}
              {(article.positive_prob !== undefined || article.neutral_prob !== undefined) && (
                <div className="space-y-1.5 pt-1 border-t border-gray-200">
                  <div className="flex items-center justify-between text-[11px] font-mono text-gray-600">
                    <span className="text-emerald-700 font-semibold">
                      Positive: {Math.round((article.positive_prob || 0) * 100)}%
                    </span>
                    <span className="text-amber-700 font-semibold">
                      Neutral: {Math.round((article.neutral_prob || 0) * 100)}%
                    </span>
                    <span className="text-red-700 font-semibold">
                      Negative: {Math.round((article.negative_prob || 0) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden flex">
                    <div
                      style={{ width: `${(article.positive_prob || 0) * 100}%` }}
                      className="h-full bg-emerald-500"
                      title="Positive"
                    />
                    <div
                      style={{ width: `${(article.neutral_prob || 0) * 100}%` }}
                      className="h-full bg-amber-400"
                      title="Neutral"
                    />
                    <div
                      style={{ width: `${(article.negative_prob || 0) * 100}%` }}
                      className="h-full bg-red-500"
                      title="Negative"
                    />
                  </div>
                </div>
              )}

              {/* Drivers */}
              {article.drivers && article.drivers.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Drivers:</span>
                  {article.drivers.map((d, i) => (
                    <span key={i} className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-white border border-gray-200 text-gray-700">
                      {d}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <p className="text-sm font-medium text-gray-700 leading-relaxed">
              {article.summary}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
              <span>{article.source} · {article.timestamp}</span>

              {article.url && (
                <a
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
                >
                  <span>Open Full Article</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NewsAPI Key Configuration Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" onClick={() => setShowKeyModal(false)} />
          <form
            onSubmit={handleSaveApiKey}
            className="relative w-full max-w-md bg-white border border-gray-200 rounded-xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-amber-500" />
                <h3 className="font-display text-sm font-bold text-gray-900">
                  NewsAPI Live Integration
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Enter your personal API key from <a href="https://newsapi.org" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">newsapi.org</a> to stream real-time financial market news for any searched stock symbol.
            </p>

            {keySavedMsg && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs border border-emerald-200">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{keySavedMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                NewsAPI Secret Key
              </label>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="e.g. 7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-mono text-gray-900 focus:border-red-500 focus:outline-none"
              />
              <span className="block text-[10px] text-gray-400 mt-1">
                Saved securely in local browser storage. If empty, the system uses backend server configuration or curated market news.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setApiKeyInput("");
                  localStorage.removeItem("nsv_news_api_key");
                  setKeySavedMsg("Cleared local key.");
                  setTimeout(() => {
                    setKeySavedMsg("");
                    setShowKeyModal(false);
                    loadData(symbol, range);
                  }, 800);
                }}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
              >
                Clear Key
              </button>
              <button
                type="submit"
                className="rounded-lg bg-red-600 hover:bg-red-700 px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
              >
                Save & Apply
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
