import StatusBadge from "./StatusBadge";
import { ExternalLink } from "lucide-react";

const TONE = { Positive: "buy", Neutral: "neutral", Negative: "sell" };

export default function NewsCard({ article, onSelect }) {
  return (
    <div
      onClick={() => onSelect?.(article)}
      className="focus-ring w-full text-left bg-white rounded-xl p-4 hover:border-gray-300 transition-all border border-gray-200 shadow-xs cursor-pointer flex flex-col justify-between gap-3 group"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <p className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
            {article.headline}
          </p>
          <StatusBadge tone={TONE[article.sentiment]} label={article.sentiment} />
        </div>

        {article.summary && (
          <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed mb-2 font-medium">
            {article.summary}
          </p>
        )}
      </div>

      <div className="space-y-2 pt-2 border-t border-gray-100">
        {article.drivers && article.drivers.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {article.drivers.map((d, i) => (
              <span key={i} className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600">
                {d}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium">
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-semibold text-gray-700 truncate">{article.source}</span>
            <span>·</span>
            <span>{article.timestamp}</span>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <span className="data-num text-gray-500 font-bold">Conf. {article.confidence}%</span>
            {article.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                title="Open live news link"
                className="text-gray-400 hover:text-blue-600 p-0.5 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
