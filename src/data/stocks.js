// Stock universe for NSV Sentinel featuring the full NIFTY 50 Universe and Indian Benchmark Indices.
// Automatically updated in real time by the FastAPI backend via Dhan HQ API v2.

export const BENCHMARK_INDICES = [
  { symbol: "NIFTY50", name: "NIFTY 50 Benchmark Index", exchange: "NSE", sector: "Index", price: 24850.40, change: 0.85, volume: "345.2M", volatility: 12.1, rsi: 61, riskScore: 28, open: 24680.10, high: 24890.30, low: 24640.20 },
  { symbol: "BANKNIFTY", name: "NIFTY BANK Index", exchange: "NSE", sector: "Index", price: 52140.75, change: 1.14, volume: "189.4M", volatility: 14.8, rsi: 63, riskScore: 32, open: 51800.50, high: 52280.00, low: 51690.00 },
  { symbol: "SENSEX", name: "BSE SENSEX Benchmark Index", exchange: "BSE", sector: "Index", price: 79402.30, change: 0.42, volume: "142.8M", volatility: 10.9, rsi: 60, riskScore: 25, open: 79150.00, high: 79540.80, low: 79020.10 },
];

export const STOCKS = [
  // Benchmark Indices
  ...BENCHMARK_INDICES,

  // Full NIFTY 50 Stocks Universe
  { symbol: "RELIANCE", name: "Reliance Industries Ltd.", exchange: "NSE", sector: "Energy", price: 1425.60, change: 2.34, volume: "8.2M", volatility: 18.4, rsi: 64, riskScore: 62 },
  { symbol: "TCS", name: "Tata Consultancy Services Ltd.", exchange: "NSE", sector: "IT Services", price: 3812.15, change: -0.58, volume: "2.1M", volatility: 11.2, rsi: 48, riskScore: 24 },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd.", exchange: "NSE", sector: "Banking", price: 1689.90, change: 0.24, volume: "6.8M", volatility: 9.8, rsi: 52, riskScore: 22 },
  { symbol: "INFY", name: "Infosys Ltd.", exchange: "NSE", sector: "IT Services", price: 1542.30, change: 1.12, volume: "5.4M", volatility: 15.7, rsi: 58, riskScore: 41 },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd.", exchange: "NSE", sector: "Banking", price: 1248.50, change: 1.05, volume: "7.1M", volatility: 12.3, rsi: 61, riskScore: 27 },
  { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd.", exchange: "NSE", sector: "Telecom", price: 1675.20, change: 1.45, volume: "4.3M", volatility: 14.1, rsi: 59, riskScore: 35 },
  { symbol: "SBIN", name: "State Bank of India", exchange: "NSE", sector: "Banking", price: 812.40, change: 0.88, volume: "12.4M", volatility: 16.2, rsi: 54, riskScore: 38 },
  { symbol: "ITC", name: "ITC Ltd.", exchange: "NSE", sector: "FMCG", price: 472.30, change: -0.32, volume: "9.5M", volatility: 8.9, rsi: 49, riskScore: 19 },
  { symbol: "LT", name: "Larsen & Toubro Ltd.", exchange: "NSE", sector: "Construction", price: 3580.00, change: 1.22, volume: "1.8M", volatility: 13.5, rsi: 56, riskScore: 34 },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever Ltd.", exchange: "NSE", sector: "FMCG", price: 2360.00, change: -0.45, volume: "1.2M", volatility: 10.1, rsi: 45, riskScore: 20 },
  { symbol: "BAJFINANCE", name: "Bajaj Finance Ltd.", exchange: "NSE", sector: "Financials", price: 6850.00, change: 1.85, volume: "1.1M", volatility: 21.4, rsi: 55, riskScore: 46 },
  { symbol: "HCLTECH", name: "HCL Technologies Ltd.", exchange: "NSE", sector: "IT Services", price: 1820.00, change: 0.65, volume: "2.4M", volatility: 13.8, rsi: 53, riskScore: 29 },
  { symbol: "MARUTI", name: "Maruti Suzuki India Ltd.", exchange: "NSE", sector: "Automobile", price: 11400.00, change: 0.95, volume: "0.6M", volatility: 15.2, rsi: 57, riskScore: 36 },
  { symbol: "SUNPHARMA", name: "Sun Pharmaceutical Industries", exchange: "NSE", sector: "Pharma", price: 1890.00, change: 1.35, volume: "1.9M", volatility: 12.7, rsi: 63, riskScore: 25 },
  { symbol: "TATAMOTORS", name: "Tata Motors Ltd.", exchange: "NSE", sector: "Automobile", price: 987.25, change: 3.05, volume: "9.3M", volatility: 22.1, rsi: 66, riskScore: 55 },
  { symbol: "ONGC", name: "Oil & Natural Gas Corp.", exchange: "NSE", sector: "Energy", price: 255.40, change: -0.75, volume: "14.2M", volatility: 17.5, rsi: 51, riskScore: 44 },
  { symbol: "NTPC", name: "NTPC Ltd.", exchange: "NSE", sector: "Power", price: 382.10, change: 1.15, volume: "11.1M", volatility: 13.2, rsi: 58, riskScore: 28 },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank Ltd.", exchange: "NSE", sector: "Banking", price: 1740.00, change: -0.25, volume: "3.2M", volatility: 11.5, rsi: 47, riskScore: 31 },
  { symbol: "TITAN", name: "Titan Company Ltd.", exchange: "NSE", sector: "Consumer Goods", price: 3320.00, change: 0.55, volume: "1.4M", volatility: 16.8, rsi: 54, riskScore: 37 },
  { symbol: "AXISBANK", name: "Axis Bank Ltd.", exchange: "NSE", sector: "Banking", price: 1160.00, change: 0.45, volume: "6.1M", volatility: 14.3, rsi: 50, riskScore: 33 },
  { symbol: "ADANIENT", name: "Adani Enterprises Ltd.", exchange: "NSE", sector: "Conglomerate", price: 2984.40, change: -4.12, volume: "11.6M", volatility: 34.9, rsi: 71, riskScore: 84 },
  { symbol: "ADANIPORTS", name: "Adani Ports & SEZ Ltd.", exchange: "NSE", sector: "Infrastructure", price: 1340.00, change: -1.25, volume: "5.8M", volatility: 24.2, rsi: 62, riskScore: 58 },
  { symbol: "COALINDIA", name: "Coal India Ltd.", exchange: "NSE", sector: "Mining", price: 440.00, change: 0.35, volume: "8.9M", volatility: 15.6, rsi: 53, riskScore: 40 },
  { symbol: "BAJAJFINSV", name: "Bajaj Finserv Ltd.", exchange: "NSE", sector: "Financials", price: 1780.00, change: 1.45, volume: "2.3M", volatility: 19.1, rsi: 52, riskScore: 42 },
  { symbol: "TATASTEEL", name: "Tata Steel Ltd.", exchange: "NSE", sector: "Metals", price: 148.00, change: -0.95, volume: "24.5M", volatility: 21.0, rsi: 49, riskScore: 51 },
  { symbol: "POWERGRID", name: "Power Grid Corp. of India", exchange: "NSE", sector: "Power", price: 315.00, change: 0.75, volume: "9.8M", volatility: 11.4, rsi: 55, riskScore: 23 },
  { symbol: "M&M", name: "Mahindra & Mahindra Ltd.", exchange: "NSE", sector: "Automobile", price: 2850.00, change: 2.15, volume: "3.1M", volatility: 20.3, rsi: 68, riskScore: 48 },
  { symbol: "ASIANPAINT", name: "Asian Paints Ltd.", exchange: "NSE", sector: "Consumer Goods", price: 2420.00, change: -1.45, volume: "1.7M", volatility: 13.9, rsi: 42, riskScore: 30 },
  { symbol: "ULTRACEMCO", name: "UltraTech Cement Ltd.", exchange: "NSE", sector: "Cement", price: 11100.00, change: 0.85, volume: "0.4M", volatility: 14.5, rsi: 57, riskScore: 32 },
  { symbol: "GRASIM", name: "Grasim Industries Ltd.", exchange: "NSE", sector: "Conglomerate", price: 2560.00, change: 0.45, volume: "1.0M", volatility: 16.2, rsi: 51, riskScore: 39 },
  { symbol: "JSWSTEEL", name: "JSW Steel Ltd.", exchange: "NSE", sector: "Metals", price: 965.00, change: -0.65, volume: "3.7M", volatility: 18.9, rsi: 53, riskScore: 45 },
  { symbol: "TECHM", name: "Tech Mahindra Ltd.", exchange: "NSE", sector: "IT Services", price: 1690.00, change: 1.35, volume: "2.0M", volatility: 17.1, rsi: 60, riskScore: 38 },
  { symbol: "WIPRO", name: "Wipro Ltd.", exchange: "NSE", sector: "IT Services", price: 540.00, change: 0.25, volume: "4.8M", volatility: 14.0, rsi: 49, riskScore: 33 },
  { symbol: "CIPLA", name: "Cipla Ltd.", exchange: "NSE", sector: "Pharma", price: 1520.00, change: 0.85, volume: "1.6M", volatility: 12.1, rsi: 52, riskScore: 26 },
  { symbol: "DRREDDY", name: "Dr. Reddy's Laboratories", exchange: "NSE", sector: "Pharma", price: 1280.00, change: 0.45, volume: "1.3M", volatility: 13.4, rsi: 50, riskScore: 27 },
  { symbol: "BPCL", name: "Bharat Petroleum Corp. Ltd.", exchange: "NSE", sector: "Energy", price: 310.00, change: -1.15, volume: "7.4M", volatility: 18.2, rsi: 48, riskScore: 43 },
  { symbol: "BRITANNIA", name: "Britannia Industries Ltd.", exchange: "NSE", sector: "FMCG", price: 5150.00, change: 0.35, volume: "0.5M", volatility: 10.6, rsi: 51, riskScore: 22 },
  { symbol: "EICHERMOT", name: "Eicher Motors Ltd.", exchange: "NSE", sector: "Automobile", price: 4850.00, change: 1.65, volume: "0.8M", volatility: 17.8, rsi: 62, riskScore: 41 },
  { symbol: "NESTLEIND", name: "Nestle India Ltd.", exchange: "NSE", sector: "FMCG", price: 2280.00, change: -0.55, volume: "0.7M", volatility: 9.4, rsi: 46, riskScore: 18 },
  { symbol: "HEROMOTOCO", name: "Hero MotoCorp Ltd.", exchange: "NSE", sector: "Automobile", price: 4920.00, change: 1.05, volume: "0.9M", volatility: 16.5, rsi: 56, riskScore: 39 },
  { symbol: "APOLLOHOSP", name: "Apollo Hospitals Enterprise", exchange: "NSE", sector: "Healthcare", price: 6950.00, change: 1.75, volume: "0.7M", volatility: 15.9, rsi: 61, riskScore: 35 },
  { symbol: "TATACONSUM", name: "Tata Consumer Products Ltd.", exchange: "NSE", sector: "FMCG", price: 980.00, change: 0.15, volume: "2.6M", volatility: 11.8, rsi: 48, riskScore: 24 },
  { symbol: "DIVISLAB", name: "Divi's Laboratories Ltd.", exchange: "NSE", sector: "Pharma", price: 5850.00, change: 2.45, volume: "0.8M", volatility: 16.3, rsi: 64, riskScore: 31 },
  { symbol: "HINDALCO", name: "Hindalco Industries Ltd.", exchange: "NSE", sector: "Metals", price: 665.00, change: -0.85, volume: "5.5M", volatility: 20.1, rsi: 52, riskScore: 47 },
  { symbol: "SHREECEM", name: "Shree Cement Ltd.", exchange: "NSE", sector: "Cement", price: 24500.00, change: 0.25, volume: "0.2M", volatility: 15.0, rsi: 47, riskScore: 36 },
  { symbol: "SBILIFE", name: "SBI Life Insurance Co. Ltd.", exchange: "NSE", sector: "Insurance", price: 1580.00, change: 0.65, volume: "1.5M", volatility: 11.7, rsi: 53, riskScore: 23 },
  { symbol: "HDFCLIFE", name: "HDFC Life Insurance Co. Ltd.", exchange: "NSE", sector: "Insurance", price: 685.00, change: 0.45, volume: "2.8M", volatility: 12.5, rsi: 50, riskScore: 25 },
  { symbol: "BAJAJ-AUTO", name: "Bajaj Auto Ltd.", exchange: "NSE", sector: "Automobile", price: 9850.00, change: 1.55, volume: "0.6M", volatility: 17.2, rsi: 63, riskScore: 40 },
  { symbol: "BEL", name: "Bharat Electronics Ltd.", exchange: "NSE", sector: "Defence", price: 295.00, change: 2.85, volume: "18.5M", volatility: 22.8, rsi: 66, riskScore: 49 },
  { symbol: "TRENT", name: "Trent Ltd.", exchange: "NSE", sector: "Retail", price: 6450.00, change: 3.45, volume: "2.1M", volatility: 25.4, rsi: 72, riskScore: 68 },
];

export const DEFAULT_SYMBOL = "NIFTY50";

export function getStock(symbol) {
  const clean = symbol?.trim().toUpperCase();
  return STOCKS.find((s) => s.symbol === clean) || STOCKS[0];
}

// Deterministic pseudo-random generator so fallback charts are stable per symbol/range.
function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h) || 1;
}

const RANGE_POINTS = { "1D": 26, "1W": 7, "1M": 30, "3M": 90, "1Y": 52 };
const RANGE_LABELS = {
  "1D": (i) => `${9 + Math.floor(i / 4)}:${(i % 4) * 15 === 0 ? "00" : (i % 4) * 15}`,
  "1W": (i) => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i % 7],
  "1M": (i) => `Day ${i + 1}`,
  "3M": (i) => `Day ${i + 1}`,
  "1Y": (i) => `Wk ${i + 1}`,
};

export function generateSeries(symbol, range = "1D") {
  const points = RANGE_POINTS[range] || 30;
  const rand = seededRandom(hashSeed(symbol + range));
  const base = getStock(symbol).price;
  let price = base * (0.98 + rand() * 0.04);
  const series = [];
  for (let i = 0; i < points; i++) {
    const drift = (rand() - 0.48) * (base * 0.008);
    const open = Number(price.toFixed(2));
    price = Math.max(price + drift, base * 0.7);
    const close = Number(price.toFixed(2));
    const high = Number((Math.max(open, close) + Math.abs(drift) * 0.8 + rand() * (base * 0.002)).toFixed(2));
    const low = Number((Math.min(open, close) - Math.abs(drift) * 0.8 - rand() * (base * 0.002)).toFixed(2));
    const volume = Math.round(1_000_000 + rand() * 9_000_000);
    const volatility = 8 + rand() * 30;
    const ma = Number((price * (0.99 + rand() * 0.02)).toFixed(2));
    const ma50 = Number((ma * 0.995).toFixed(2));
    const upper_band = Number((ma * 1.018).toFixed(2));
    const lower_band = Number((ma * 0.982).toFixed(2));

    series.push({
      label: RANGE_LABELS[range](i),
      price: close,
      open,
      high,
      low,
      close,
      is_up: close >= open,
      ma,
      ma50,
      upper_band,
      lower_band,
      volume,
      volatility: Number(volatility.toFixed(1)),
      returns: Number(((drift / base) * 100).toFixed(2)),
    });
  }
  return series;
}

export function generateSentimentTrend(symbol, range = "7D") {
  const points = { "24H": 12, "7D": 7, "30D": 30 }[range] || 7;
  const rand = seededRandom(hashSeed(symbol + "sent" + range));
  const out = [];
  for (let i = 0; i < points; i++) {
    const positive = 45 + rand() * 35;
    const negative = 5 + rand() * 25;
    const neutral = Math.max(0, 100 - positive - negative);
    out.push({
      label: range === "24H" ? `${i * 2}:00` : `D${i + 1}`,
      positive: Number(positive.toFixed(1)),
      neutral: Number(neutral.toFixed(1)),
      negative: Number(negative.toFixed(1)),
    });
  }
  return out;
}

export function generateRiskHistory(symbol) {
  const rand = seededRandom(hashSeed(symbol + "risk"));
  const out = [];
  let val = 40 + rand() * 20;
  for (let i = 0; i < 14; i++) {
    val = Math.min(95, Math.max(10, val + (rand() - 0.5) * 14));
    out.push({ label: `D-${14 - i}`, risk: Math.round(val) });
  }
  return out;
}
