// Mock stock universe for NSV Sentinel.
// In production this is replaced by a FastAPI endpoint backed by a live market data feed.

export const STOCKS = [
  { symbol: "NIFTY50", name: "NIFTY 50 Benchmark Index", exchange: "NSE", sector: "Index", price: 24850.40, change: 0.85, volume: "345.2M", volatility: 12.1, rsi: 61, riskScore: 28 },
  { symbol: "BANKNIFTY", name: "NIFTY BANK Index", exchange: "NSE", sector: "Index", price: 52140.75, change: 1.14, volume: "189.4M", volatility: 14.8, rsi: 63, riskScore: 32 },
  { symbol: "RELIANCE", name: "Reliance Industries Ltd.", exchange: "NSE", sector: "Energy", price: 1425.6, change: 2.34, volume: "8.2M", volatility: 18.4, rsi: 64, riskScore: 62 },
  { symbol: "TCS", name: "Tata Consultancy Services", exchange: "NSE", sector: "IT Services", price: 3812.15, change: -0.58, volume: "2.1M", volatility: 11.2, rsi: 48, riskScore: 24 },
  { symbol: "INFY", name: "Infosys Ltd.", exchange: "NSE", sector: "IT Services", price: 1542.3, change: 1.12, volume: "5.4M", volatility: 15.7, rsi: 58, riskScore: 41 },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd.", exchange: "NSE", sector: "Banking", price: 1689.9, change: 0.24, volume: "6.8M", volatility: 9.8, rsi: 52, riskScore: 22 },
  { symbol: "ADANIENT", name: "Adani Enterprises Ltd.", exchange: "NSE", sector: "Conglomerate", price: 2984.4, change: -4.12, volume: "11.6M", volatility: 34.9, rsi: 71, riskScore: 84 },
  { symbol: "TATAMOTORS", name: "Tata Motors Ltd.", exchange: "NSE", sector: "Automobile", price: 987.25, change: 3.05, volume: "9.3M", volatility: 22.1, rsi: 66, riskScore: 55 },
];

export const DEFAULT_SYMBOL = "RELIANCE";

export function getStock(symbol) {
  return STOCKS.find((s) => s.symbol === symbol) || STOCKS[0];
}

// Deterministic pseudo-random generator so charts are stable across renders per symbol/seed.
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

/**
 * Generates a deterministic OHLCV-style time series for a symbol + range.
 * Later this will be replaced by services/api.js -> getMarketData(symbol, range)
 * fetching real candles from the FastAPI backend.
 */
export function generateSeries(symbol, range = "1D") {
  const points = RANGE_POINTS[range] || 30;
  const rand = seededRandom(hashSeed(symbol + range));
  const base = getStock(symbol).price;
  let price = base * (0.9 + rand() * 0.1);
  const series = [];
  for (let i = 0; i < points; i++) {
    const drift = (rand() - 0.48) * (base * 0.012);
    price = Math.max(price + drift, base * 0.6);
    const volume = Math.round(1_000_000 + rand() * 9_000_000);
    const volatility = 8 + rand() * 30;
    const ma = price * (0.985 + rand() * 0.03);
    series.push({
      label: RANGE_LABELS[range](i),
      price: Number(price.toFixed(2)),
      ma: Number(ma.toFixed(2)),
      volume,
      volatility: Number(volatility.toFixed(1)),
      returns: Number((drift / base * 100).toFixed(2)),
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
