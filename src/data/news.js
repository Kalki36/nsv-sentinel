// Financial NLP news feed for NSV Sentinel.
// In production, live news is fetched from NewsAPI v2 spanning a 15-day window
// and classified via FinBERT inference on the FastAPI backend.

export const NEWS = [
  {
    id: "N-1",
    symbol: "RELIANCE",
    headline: "Reliance Industries posts strong quarterly retail segment growth",
    source: "Economic Times",
    timestamp: "Today, 09:12 AM",
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
    timestamp: "2d ago (24 Oct)",
    sentiment: "Neutral",
    confidence: 67,
    summary:
      "Coverage notes diverging analyst views on planned capital expenditure, with no clear consensus on near-term earnings impact.",
  },
  {
    id: "N-2B",
    symbol: "RELIANCE",
    headline: "Reliance Jio expands 5G infrastructure with strategic telecom partnerships",
    source: "Financial Express",
    timestamp: "5d ago (21 Oct)",
    sentiment: "Positive",
    confidence: 88,
    summary:
      "Jio subscriber additions rose by 3.2 million while ARPU sustained upward momentum following enterprise cloud offerings.",
  },
  {
    id: "N-2C",
    symbol: "RELIANCE",
    headline: "Global brokerage reiterates Overweight on Reliance Industries with revised target",
    source: "Bloomberg Intelligence",
    timestamp: "9d ago (17 Oct)",
    sentiment: "Positive",
    confidence: 84,
    summary:
      "Analyst consensus expects downstream petrochemical margin recovery and strong renewable energy capex execution.",
  },
  {
    id: "N-2D",
    symbol: "RELIANCE",
    headline: "Oil-to-chemicals export margins navigate international benchmark volatility",
    source: "Reuters Business",
    timestamp: "12d ago (14 Oct)",
    sentiment: "Neutral",
    confidence: 62,
    summary:
      "Crude inventory adjustments and European refining spreads softened slightly, though domestic integrated margins remain resilient.",
  },
  {
    id: "N-2E",
    symbol: "RELIANCE",
    headline: "Institutional investors increase allocation in Reliance on energy transition roadmap",
    source: "CNBC-TV18",
    timestamp: "15d ago (11 Oct)",
    sentiment: "Positive",
    confidence: 79,
    summary:
      "Foreign institutional investor filings confirm cumulative net purchases of 2.1 million shares across the early October cycle.",
  },
  {
    id: "N-3",
    symbol: "ADANIENT",
    headline: "Adani Enterprises shares slide amid regulatory scrutiny reports",
    source: "Business Standard",
    timestamp: "Today, 07:55 AM",
    sentiment: "Negative",
    confidence: 84,
    summary:
      "Reports of renewed regulatory scrutiny weighed on sentiment, with the stock among the session's largest decliners.",
  },
  {
    id: "N-3B",
    symbol: "ADANIENT",
    headline: "Adani Enterprises commissions green hydrogen manufacturing facility phase",
    source: "Livemint",
    timestamp: "6d ago (20 Oct)",
    sentiment: "Positive",
    confidence: 76,
    summary:
      "Management confirmed trial production commenced at the integrated renewable facility with commercial shipments scheduled for Q4.",
  },
  {
    id: "N-3C",
    symbol: "ADANIENT",
    headline: "Credit agency reviews debt servicing metrics for airport concessions",
    source: "Crisil Rating Bulletin",
    timestamp: "14d ago (12 Oct)",
    sentiment: "Neutral",
    confidence: 68,
    summary:
      "Passenger traffic metrics across key international hubs grew 14% year-on-year, supporting debt service coverage stability.",
  },
  {
    id: "N-4",
    symbol: "TCS",
    headline: "TCS wins multi-year digital transformation deal in Europe",
    source: "Livemint",
    timestamp: "Today, 07:20 AM",
    sentiment: "Positive",
    confidence: 88,
    summary:
      "The multi-year engagement adds to the company's European order book, reinforcing its position in enterprise digital services.",
  },
  {
    id: "N-4B",
    symbol: "TCS",
    headline: "TCS reports operating margins expand to 26% on AI client deployments",
    source: "Economic Times",
    timestamp: "7d ago (19 Oct)",
    sentiment: "Positive",
    confidence: 90,
    summary:
      "Chief Financial Officer noted generative AI advisory pipelines doubled in deal volume during the current quarterly window.",
  },
  {
    id: "N-4C",
    symbol: "TCS",
    headline: "Brokerage survey highlights enterprise IT vendor consolidation favoring tier-1 leaders",
    source: "Morgan Stanley Research",
    timestamp: "15d ago (11 Oct)",
    sentiment: "Positive",
    confidence: 82,
    summary:
      "Large BFSI and healthcare institutions continue to consolidate tech spend with top Indian service integrators.",
  },
  {
    id: "N-5",
    symbol: "INFY",
    headline: "Infosys maintains full-year revenue guidance amid enterprise AI rollout",
    source: "Reuters",
    timestamp: "Today, 06:58 AM",
    sentiment: "Neutral",
    confidence: 72,
    summary:
      "Management reiterated prior guidance, citing steady demand offset by continued caution in discretionary tech spending.",
  },
  {
    id: "N-5B",
    symbol: "INFY",
    headline: "Infosys Topaz platform secures 3 marquee automotive AI contracts",
    source: "NDTV Profit",
    timestamp: "8d ago (18 Oct)",
    sentiment: "Positive",
    confidence: 86,
    summary:
      "Global automotive manufacturers selected Infosys Topaz for autonomous engineering simulation and smart plant optimization.",
  },
  {
    id: "N-6",
    symbol: "TATAMOTORS",
    headline: "Tata Motors EV sales accelerate ahead of festive season",
    source: "CNBC-TV18",
    timestamp: "Today, 06:30 AM",
    sentiment: "Positive",
    confidence: 79,
    summary:
      "Early festive-season bookings for the company's electric vehicle lineup came in ahead of internal estimates.",
  },
  {
    id: "N-6B",
    symbol: "TATAMOTORS",
    headline: "JLR order book remains strong at 148,000 units with premium SUV demand",
    source: "Autocar Professional",
    timestamp: "10d ago (16 Oct)",
    sentiment: "Positive",
    confidence: 85,
    summary:
      "Wholesale shipments of Range Rover and Defender models supported record operating margins in the UK and European operations.",
  },
  {
    id: "N-7",
    symbol: "HDFCBANK",
    headline: "HDFC Bank net interest margin steady in latest quarter",
    source: "Financial Express",
    timestamp: "Today, 06:05 AM",
    sentiment: "Neutral",
    confidence: 61,
    summary:
      "Margins held broadly flat quarter-on-quarter, in line with analyst expectations amid a stable rate environment.",
  },
  {
    id: "N-7B",
    symbol: "HDFCBANK",
    headline: "Deposit franchise expands with 15.1% loan growth across retail and commercial",
    source: "Business Line",
    timestamp: "11d ago (15 Oct)",
    sentiment: "Positive",
    confidence: 82,
    summary:
      "Branch expansion and digital savings mobilization led to healthy liquidity coverage ratios across the post-merger institution.",
  },
  {
    id: "N-8",
    symbol: "NIFTY50",
    headline: "Nifty 50 benchmarks consolidate around record territory on institutional liquidity",
    source: "NSE Market Wire",
    timestamp: "Today, 09:30 AM",
    sentiment: "Positive",
    confidence: 86,
    summary:
      "Broad-based buying in banking, auto, and IT segments helped benchmark indices sustain momentum across Indian trading sessions.",
  },
  {
    id: "N-8B",
    symbol: "NIFTY50",
    headline: "Foreign portfolio inflows exceed ₹18,400 crore across first fortnight of October",
    source: "Economic Times",
    timestamp: "14d ago (12 Oct)",
    sentiment: "Positive",
    confidence: 89,
    summary:
      "Macroeconomic stability, robust tax collection data, and domestic mutual fund SIPs supported systemic liquidity across Dalal Street.",
  },
  {
    id: "N-9",
    symbol: "BANKNIFTY",
    headline: "Banking index outperforms on resilient credit growth and asset quality stability",
    source: "Mint Banking",
    timestamp: "Today, 08:45 AM",
    sentiment: "Positive",
    confidence: 83,
    summary:
      "Gross non-performing asset ratios among private and PSU lenders reached historic lows while retail advances grew at 16% annualized.",
  },
  {
    id: "N-10",
    symbol: "SENSEX",
    headline: "BSE Sensex gains 320 points led by blue-chip heavyweights",
    source: "BSE Live Updates",
    timestamp: "Today, 09:40 AM",
    sentiment: "Positive",
    confidence: 81,
    summary:
      "Positive global cues and easing commodity prices supported benchmark index performance across the morning session.",
  }
];

export function getSentimentSummary(symbol) {
  const clean = symbol?.trim().toUpperCase();
  const items = NEWS.filter((n) => n.symbol === clean);
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
