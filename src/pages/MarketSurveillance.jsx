import { useEffect, useState } from "react";
import { Radar, TriangleAlert, Gauge, CheckCircle2 } from "lucide-react";
import KpiCard from "../components/KpiCard";
import AlertTable from "../components/AlertTable";
import AlertDetail from "../components/AlertDetail";
import { LoadingState } from "../components/States";
import { getSurveillanceAlerts } from "../services/api";

export default function MarketSurveillance() {
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    getSurveillanceAlerts().then(setData);
  }, []);

  if (!data) return <LoadingState label="Loading surveillance feed" />;

  const filtered = filter === "All" ? data.alerts : data.alerts.filter((a) => a.risk === filter);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-xl font-bold text-gray-900">Market Surveillance Engine</h1>
        <p className="text-xs text-gray-500 font-medium mt-1">AI-driven anomaly detection across monitored Indian equities and benchmark indices.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={Radar} label="Total Alerts" value={data.summary.total} tone="ai" />
        <KpiCard icon={TriangleAlert} label="Critical Alerts" value={data.summary.critical} tone="sell" />
        <KpiCard icon={Gauge} label="Medium Risk" value={data.summary.medium} tone="warn" />
        <KpiCard icon={CheckCircle2} label="Normal" value={data.summary.normal} tone="buy" />
      </div>

      <div className="nsv-panel p-5 bg-white border border-gray-200 rounded-xl shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="font-display text-sm font-bold text-gray-900">Surveillance Feed Alerts</h3>
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-0.5">
            {["All", "High", "Medium", "Low"].map((f) => (
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
        <AlertTable alerts={filtered} onSelect={setSelected} />
      </div>

      <AlertDetail alert={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
