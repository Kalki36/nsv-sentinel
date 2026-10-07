import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = { Positive: "#10B981", Neutral: "#F59E0B", Negative: "#EF4444" };

export default function SentimentCard({ summary }) {
  const data = [
    { name: "Positive", value: summary.positive },
    { name: "Neutral", value: summary.neutral },
    { name: "Negative", value: summary.negative },
  ];

  const netSentiment = summary.positive - summary.negative;
  const overallTone = netSentiment > 20 ? "Bullish" : netSentiment < -10 ? "Bearish" : "Neutral";
  const toneColor = netSentiment > 20 ? "text-emerald-700 bg-emerald-50 border border-emerald-200" : netSentiment < -10 ? "text-red-700 bg-red-50 border border-red-200" : "text-amber-700 bg-amber-50 border border-amber-200";

  return (
    <div className="nsv-panel p-5 flex flex-col gap-4 bg-white border border-gray-200 rounded-xl shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-400">FinBERT Outlook</p>
          <span className={`inline-block mt-1 px-2.5 py-0.5 rounded text-xs font-bold ${toneColor}`}>
            {overallTone} Net ({netSentiment >= 0 ? "+" : ""}{netSentiment}%)
          </span>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="w-28 h-28 shrink-0">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={34} outerRadius={52} paddingAngle={3} stroke="none">
                {data.map((d) => (
                  <Cell key={d.name} fill={COLORS[d.name]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-2">
          {data.map((d) => (
            <div key={d.name} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-medium text-gray-600">
                <span className="h-2 w-2 rounded-full" style={{ background: COLORS[d.name] }} />
                {d.name}
              </span>
              <span className="data-num text-xs font-bold text-gray-900">{d.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
