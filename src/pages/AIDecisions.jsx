import { useEffect, useState } from "react";
import { STOCKS } from "../data/stocks";
import DecisionCard from "../components/DecisionCard";
import ExplainabilityChart from "../components/ExplainabilityChart";
import { LoadingState } from "../components/States";
import { getAIDecision } from "../services/api";

export default function AIDecisions() {
  const [symbol, setSymbol] = useState("RELIANCE");
  const [decision, setDecision] = useState(null);

  useEffect(() => {
    setDecision(null);
    getAIDecision(symbol).then(setDecision);
  }, [symbol]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-gray-900">AI Decision Intelligence</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">Decision-support output synthesizing technical momentum, FinBERT sentiment, and risk vectors.</p>
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

      {!decision ? (
        <LoadingState label="Running decision engine" />
      ) : (
        <>
          <DecisionCard recommendation={decision.recommendation} confidence={decision.confidence} />

          <div className="nsv-panel p-5 bg-white border border-gray-200 rounded-xl shadow-xs">
            <h3 className="font-display text-sm font-bold text-gray-900 mb-4">Decision Factors & Weights</h3>
            <ExplainabilityChart factors={decision.factors} />
          </div>

          <div className="nsv-panel p-5 bg-white border border-gray-200 rounded-xl shadow-xs">
            <h3 className="font-display text-sm font-bold text-gray-900 mb-2">Decision Narrative & Explanation</h3>
            <p className="text-xs text-gray-600 font-medium leading-relaxed">{decision.summary}</p>
          </div>
        </>
      )}
    </div>
  );
}
