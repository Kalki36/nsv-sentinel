import { useState, useRef, useEffect } from "react";
import { Search, TrendingUp, Layers } from "lucide-react";
import { STOCKS } from "../data/stocks";
import { useNavigate } from "react-router-dom";

export default function StockSearch({ compact = false, onSelect = null, placeholder = "Search NIFTY 50 stock or index (e.g. RELIANCE, NIFTY50, SENSEX)..." }) {
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

  const filtered = query.trim()
    ? STOCKS.filter(
        (s) =>
          s.symbol.toLowerCase().includes(query.toLowerCase()) ||
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          (s.sector && s.sector.toLowerCase().includes(query.toLowerCase()))
      )
    : STOCKS;

  const indices = filtered.filter((s) => s.sector === "Index");
  const equities = filtered.filter((s) => s.sector !== "Index");

  function handleSelect(symbol) {
    setQuery("");
    setOpen(false);
    if (onSelect) {
      onSelect(symbol);
    } else {
      navigate(`/stock/${symbol}`);
    }
  }

  return (
    <div ref={ref} className={`relative ${compact ? "w-full" : "w-80 md:w-96"}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" strokeWidth={1.8} />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="focus-ring w-full rounded-lg border border-gray-300 bg-gray-50 py-1.5 pl-9 pr-3 text-xs text-gray-900 placeholder:text-gray-400 font-medium"
        />
      </div>

      {open && (
        <div className="absolute z-40 mt-1.5 w-full max-h-80 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-2xl py-1 divide-y divide-gray-100 animate-fade-in text-xs font-sans">
          {filtered.length === 0 ? (
            <p className="px-4 py-3 text-xs text-gray-400 text-center">No matching NIFTY 50 stocks found.</p>
          ) : (
            <>
              {/* Benchmark Indices Category */}
              {indices.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 bg-gray-50/80 text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="h-3 w-3 text-indigo-600" />
                    Benchmark Indices ({indices.length})
                  </div>
                  {indices.map((s) => (
                    <button
                      key={s.symbol}
                      onClick={() => handleSelect(s.symbol)}
                      className="w-full flex items-center justify-between gap-3 px-3 py-2 text-left hover:bg-indigo-50/50 transition-colors cursor-pointer border-b border-gray-50 last:border-b-0"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-gray-900">{s.symbol}</span>
                          <span className="text-[10px] px-1 py-0.2 rounded bg-indigo-100 text-indigo-700 font-semibold">{s.exchange}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 truncate">{s.name}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-mono font-bold text-gray-900">₹{s.price.toLocaleString("en-IN")}</p>
                        <span className={`text-[11px] font-semibold ${s.change >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                          {s.change >= 0 ? "+" : ""}{s.change}%
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* NIFTY 50 Constituent Stocks Category */}
              {equities.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 bg-gray-50/80 text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="h-3 w-3 text-blue-600" />
                    NIFTY 50 Stocks ({equities.length})
                  </div>
                  {equities.map((s) => (
                    <button
                      key={s.symbol}
                      onClick={() => handleSelect(s.symbol)}
                      className="w-full flex items-center justify-between gap-3 px-3 py-2 text-left hover:bg-blue-50/40 transition-colors cursor-pointer"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-gray-900">{s.symbol}</span>
                          {s.sector && (
                            <span className="text-[10px] text-gray-400 font-normal">({s.sector})</span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 truncate">{s.name}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-mono font-bold text-gray-900">₹{s.price.toLocaleString("en-IN")}</p>
                        <span className={`text-[11px] font-semibold ${s.change >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                          {s.change >= 0 ? "+" : ""}{s.change}%
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
