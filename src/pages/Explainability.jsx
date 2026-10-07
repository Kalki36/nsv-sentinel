import { useEffect, useState } from "react";
import { HelpCircle } from "lucide-react";
import { STOCKS } from "../data/stocks";
import ExplainabilityChart from "../components/ExplainabilityChart";
import StatusBadge from "../components/StatusBadge";
import { LoadingState } from "../components/States";
import { getExplainability } from "../services/api";

const REC_TONE = { BUY: "buy", SELL: "sell", HOLD: "warn" };

export default function Explainability() {
  const [symbol, setSymbol] = useState("RELIANCE");
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(null);
    getExplainability(symbol).then(setData);
  }, [symbol]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink">AI Explainability</h1>
          <p className="text-xs text-ink-muted mt-1">
            Feature-contribution view of the decision engine's output. Not currently backed by SHAP/LIME.
          </p>
        </div>
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="focus-ring rounded-lg border border-panel-border bg-panel-alt px-3 py-2 text-sm text-ink"
        >
          {STOCKS.map((s) => (
            <option key={s.symbol} value={s.symbol}>
              {s.symbol}
            </option>
          ))}
        </select>
      </div>

      {!data ? (
        <LoadingState label="Computing explanation" />
      ) : (
        <>
          <div className="nsv-panel p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-ink-faint mb-1">Recommendation</p>
              <StatusBadge tone={REC_TONE[data.recommendation]} label={data.recommendation} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-ink-faint mb-1">Confidence</p>
              <p className="data-num font-display text-lg font-semibold text-ink">{data.confidence}%</p>
            </div>
          </div>

          <div className="nsv-panel p-5">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="h-4 w-4 text-signal-ai" strokeWidth={1.8} />
              <h3 className="font-display text-sm font-semibold text-ink">
                Why did the AI recommend {data.recommendation}?
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-signal-buy mb-3">Positive Factors</p>
                {data.positiveFactors.length ? (
                  <ExplainabilityChart factors={data.positiveFactors} />
                ) : (
                  <p className="text-xs text-ink-faint">No positive contributing factors identified.</p>
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-signal-sell mb-3">Negative Factors</p>
                {data.negativeFactors.length ? (
                  <ExplainabilityChart factors={data.negativeFactors} />
                ) : (
                  <p className="text-xs text-ink-faint">No negative contributing factors identified.</p>
                )}
              </div>
            </div>
          </div>

          <div className="nsv-panel p-5">
            <h3 className="font-display text-sm font-semibold text-ink mb-2">AI Explanation</h3>
            <p className="text-sm text-ink-muted leading-relaxed">{data.explanation}</p>
            <p className="text-[10px] text-ink-faint mt-3">
              Explanation generated from the decision engine's factor weights. A dedicated SHAP/LIME explainability
              module is planned for the backend but is not yet implemented in this prototype.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
