import { useEffect, useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { X } from "lucide-react";
import { STOCKS } from "../data/stocks";
import SentimentCard from "../components/SentimentCard";
import NewsCard from "../components/NewsCard";
import { LoadingState, EmptyState } from "../components/States";
import StatusBadge from "../components/StatusBadge";
import { getSentiment } from "../services/api";

const RANGES = ["24H", "7D", "30D"];
const FILTERS = ["All", "Positive", "Neutral", "Negative"];
const TONE = { Positive: "buy", Neutral: "warn", Negative: "sell" };

export default function SentimentIntelligence() {
  const [symbol, setSymbol] = useState("RELIANCE");
  const [range, setRange] = useState("7D");
  const [filter, setFilter] = useState("All");
  const [data, setData] = useState(null);
  const [article, setArticle] = useState(null);

  useEffect(() => {
    setData(null);
    getSentiment(symbol, range).then(setData);
  }, [symbol, range]);

  const filteredArticles = data ? (filter === "All" ? data.articles : data.articles.filter((a) => a.sentiment === filter)) : [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-gray-900">Sentiment Intelligence</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">FinBERT NLP news sentiment analysis (Positive: Green, Neutral: Yellow, Negative: Red).</p>
        </div>
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="focus-ring rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-900 shadow-xs cursor-pointer"
        >
          {STOCKS.map((s) => (
            <option key={s.symbol} value={s.symbol}>
              {s.symbol}
            </option>
          ))}
        </select>
      </div>

      {!data ? (
        <LoadingState label="Analyzing sentiment" />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5">
            <SentimentCard summary={data.summary} />

            <div className="nsv-panel p-4 bg-white border border-gray-200 rounded-xl shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-gray-500">Sentiment Trend — {symbol}</h3>
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
              <ResponsiveContainer width="100%" height={190}>
                <AreaChart data={data.trend} margin={{ left: -20, right: 8, top: 4, bottom: 0 }}>
                  <defs>
                    <linearGradient id="posFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#F3F4F6" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={{ stroke: "#E5E7EB" }} tickLine={false} />
                  <YAxis tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={false} tickLine={false} width={36} />
                  <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }} />
                  <Area type="monotone" dataKey="positive" stroke="#10B981" strokeWidth={2} fill="url(#posFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="nsv-panel p-5 bg-white border border-gray-200 rounded-xl shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h3 className="font-display text-sm font-bold text-gray-900">Financial News Feed</h3>
              <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-0.5">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`focus-ring rounded-md px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                      filter === f ? "bg-white text-zerodha-red shadow-xs font-bold" : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {filteredArticles.length === 0 ? (
              <EmptyState label="No articles for this filter" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredArticles.map((a) => (
                  <NewsCard key={a.id} article={a} onSelect={setArticle} />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {article && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" onClick={() => setArticle(null)} />
          <div className="relative w-full max-w-lg bg-white border border-gray-200 rounded-xl p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="font-display text-base font-bold text-gray-900 leading-snug">{article.headline}</h3>
              <button onClick={() => setArticle(null)} className="focus-ring rounded-lg p-1.5 text-gray-400 hover:text-gray-700 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <StatusBadge tone={TONE[article.sentiment]} label={article.sentiment} />
              <span className="data-num text-xs font-bold text-gray-500">Confidence {article.confidence}%</span>
            </div>
            <p className="text-sm font-medium text-gray-600 leading-relaxed mb-3">{article.summary}</p>
            <p className="text-[11px] font-medium text-gray-400">
              {article.source} · {article.timestamp}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
