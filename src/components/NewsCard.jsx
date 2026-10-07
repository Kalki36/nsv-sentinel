import StatusBadge from "./StatusBadge";

const TONE = { Positive: "buy", Neutral: "neutral", Negative: "sell" };

export default function NewsCard({ article, onSelect }) {
  return (
    <button
      onClick={() => onSelect?.(article)}
      className="focus-ring w-full text-left nsv-panel-alt rounded-lg p-4 hover:border-signal-ai/30 transition-colors border"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="text-sm font-medium text-ink leading-snug">{article.headline}</p>
        <StatusBadge tone={TONE[article.sentiment]} label={article.sentiment} />
      </div>
      <div className="flex items-center gap-2 text-xs text-ink-faint">
        <span>{article.source}</span>
        <span>·</span>
        <span>{article.timestamp}</span>
        <span>·</span>
        <span className="data-num">Confidence {article.confidence}%</span>
      </div>
    </button>
  );
}
