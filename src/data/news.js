// Mock financial NLP output. In production this is produced by a FinBERT-based
// sentiment classifier on the backend via GET /api/sentiment/{symbol}.

export const NEWS = [
  {
    id: "N-1",
    symbol: "RELIANCE",
    headline: "Reliance Industries posts strong quarterly retail segment growth",
    source: "Economic Times",
    timestamp: "09:12 AM",
    sentiment: "Positive",
    confidence: 91,
    summary:
      "The company's retail arm reported double-digit revenue growth, with analysts citing store expansion and improved footfall as key drivers.",
  },
  {
    id: "N-2",
    symbol: "RELIANCE",
    headline: "Analysts split on Reliance's near-term capex outlook",
    source: "Mint",
    timestamp: "08:40 AM",
    sentiment: "Neutral",
    confidence: 67,
    summary:
      "Coverage notes diverging analyst views on planned capital expenditure, with no clear consensus on near-term earnings impact.",
  },
  {
    id: "N-3",
    symbol: "ADANIENT",
    headline: "Adani Enterprises shares slide amid regulatory scrutiny reports",
    source: "Business Standard",
    timestamp: "07:55 AM",
    sentiment: "Negative",
    confidence: 84,
    summary:
      "Reports of renewed regulatory scrutiny weighed on sentiment, with the stock among the session's largest decliners.",
  },
  {
    id: "N-4",
    symbol: "TCS",
    headline: "TCS wins multi-year digital transformation deal in Europe",
    source: "Livemint",
    timestamp: "07:20 AM",
    sentiment: "Positive",
    confidence: 88,
    summary:
      "The multi-year engagement adds to the company's European order book, reinforcing its position in enterprise digital services.",
  },
  {
    id: "N-5",
    symbol: "INFY",
    headline: "Infosys maintains full-year revenue guidance",
    source: "Reuters",
    timestamp: "06:58 AM",
    sentiment: "Neutral",
    confidence: 72,
    summary:
      "Management reiterated prior guidance, citing steady demand offset by continued caution in discretionary tech spending.",
  },
  {
    id: "N-6",
    symbol: "TATAMOTORS",
    headline: "Tata Motors EV sales accelerate ahead of festive season",
    source: "CNBC-TV18",
    timestamp: "06:30 AM",
    sentiment: "Positive",
    confidence: 79,
    summary:
      "Early festive-season bookings for the company's electric vehicle lineup came in ahead of internal estimates.",
  },
  {
    id: "N-7",
    symbol: "HDFCBANK",
    headline: "HDFC Bank net interest margin steady in latest quarter",
    source: "Financial Express",
    timestamp: "06:05 AM",
    sentiment: "Neutral",
    confidence: 61,
    summary:
      "Margins held broadly flat quarter-on-quarter, in line with analyst expectations amid a stable rate environment.",
  },
];

export function getSentimentSummary(symbol) {
  const items = NEWS.filter((n) => n.symbol === symbol);
  const total = items.length || 1;
  const positive = items.filter((n) => n.sentiment === "Positive").length;
  const neutral = items.filter((n) => n.sentiment === "Neutral").length;
  const negative = items.filter((n) => n.sentiment === "Negative").length;
  return {
    positive: Math.round((positive / total) * 100) || 72,
    neutral: Math.round((neutral / total) * 100) || 18,
    negative: Math.round((negative / total) * 100) || 10,
  };
}
