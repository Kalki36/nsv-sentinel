import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { STOCKS } from "../data/stocks";
import { useNavigate } from "react-router-dom";

export default function StockSearch({ compact = false }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const results = query
    ? STOCKS.filter(
        (s) =>
          s.symbol.toLowerCase().includes(query.toLowerCase()) ||
          s.name.toLowerCase().includes(query.toLowerCase())
      )
    : STOCKS;

  function select(symbol) {
    setQuery("");
    setOpen(false);
    navigate(`/stock/${symbol}`);
  }

  return (
    <div ref={ref} className={`relative ${compact ? "w-full" : "w-72"}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" strokeWidth={1.8} />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search symbol eg: RELIANCE, NIFTY50..."
          className="focus-ring w-full rounded-lg border border-gray-300 bg-gray-50 py-1.5 pl-9 pr-3 text-xs text-gray-900 placeholder:text-gray-400"
        />
      </div>
      {open && (
        <div className="absolute z-30 mt-1.5 w-full max-h-72 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl py-1 divide-y divide-gray-50">
          {results.length === 0 && (
            <p className="px-3 py-2 text-xs text-gray-400">No matching symbols.</p>
          )}
          {results.map((s) => (
            <button
              key={s.symbol}
              onClick={() => select(s.symbol)}
              className="focus-ring w-full flex items-center justify-between gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900">{s.symbol}</p>
                <p className="text-[11px] text-gray-500 truncate">{s.name}</p>
              </div>
              <span className={`data-num text-xs font-semibold ${s.change >= 0 ? "text-signal-buy" : "text-signal-sell"}`}>
                {s.change >= 0 ? "+" : ""}
                {s.change}%
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
