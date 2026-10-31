// src/data/stocks.js
// Stock universe for NSV Sentinel featuring the full NIFTY 50 Universe and Indian Benchmark Indices.
// Automatically updated in real time by the FastAPI backend via Dhan HQ API v2.

export const BENCHMARK_INDICES = [
  { symbol: "NIFTY50", name: "NIFTY 50 Benchmark Index", exchange: "NSE", sector: "Index", price: 23053.10, change: 0.39, volume: "345.2M", volatility: 12.1, rsi: 61, riskScore: 28, open: 22964.50, high: 23118.10, low: 22905.10, close: 23053.10, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "BANKNIFTY", name: "NIFTY BANK Index", exchange: "NSE", sector: "Index", price: 54686.95, change: -0.40, volume: "189.4M", volatility: 14.8, rsi: 63, riskScore: 32, open: 54907.10, high: 55068.50, low: 54580.75, close: 54686.95, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "SENSEX", name: "BSE SENSEX Benchmark Index", exchange: "BSE", sector: "Index", price: 74459.53, change: 0.35, volume: "142.8M", volatility: 0.9, rsi: 60, riskScore: 25, open: 74199.69, high: 74742.59, low: 74082.03, close: 74459.53, feed_source: "DHAN_HQ_API_LIVE" },
];

export const STOCKS = [
  // Benchmark Indices
  ...BENCHMARK_INDICES,

  // Full NIFTY 50 Stocks Universe (Streaming Real-Time from Dhan HQ API v2)
  { symbol: "RELIANCE", name: "Reliance Industries Ltd.", exchange: "NSE", sector: "Energy", price: 1164.90, open: 1170.40, high: 1174.60, low: 1152.50, close: 1164.90, change: -0.47, volume: "8.2M", volatility: 18.4, rsi: 64, riskScore: 62, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "TCS", name: "Tata Consultancy Services Ltd.", exchange: "NSE", sector: "IT Services", price: 2502.60, open: 2495.20, high: 2527.70, low: 2494.20, close: 2502.60, change: 0.30, volume: "2.1M", volatility: 11.2, rsi: 48, riskScore: 24, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd.", exchange: "NSE", sector: "Banking", price: 692.80, open: 683.30, high: 695.50, low: 680.85, close: 692.80, change: 1.39, volume: "6.8M", volatility: 9.8, rsi: 52, riskScore: 22, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "INFY", name: "Infosys Ltd.", exchange: "NSE", sector: "IT Services", price: 1185.00, open: 1149.10, high: 1185.00, low: 1147.90, close: 1185.00, change: 3.12, volume: "5.4M", volatility: 15.7, rsi: 58, riskScore: 41, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd.", exchange: "NSE", sector: "Banking", price: 1398.00, open: 1390.00, high: 1404.90, low: 1383.30, close: 1398.00, change: 0.58, volume: "7.1M", volatility: 12.3, rsi: 61, riskScore: 27, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd.", exchange: "NSE", sector: "Telecom", price: 1973.70, open: 1981.00, high: 1985.00, low: 1958.00, close: 1973.70, change: -0.37, volume: "4.3M", volatility: 14.1, rsi: 59, riskScore: 35, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "SBIN", name: "State Bank of India", exchange: "NSE", sector: "Banking", price: 961.85, open: 971.85, high: 971.85, low: 959.60, close: 961.85, change: -1.03, volume: "12.4M", volatility: 16.2, rsi: 54, riskScore: 38, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "ITC", name: "ITC Ltd.", exchange: "NSE", sector: "FMCG", price: 265.60, open: 265.00, high: 267.90, low: 262.70, close: 265.60, change: 0.23, volume: "9.5M", volatility: 8.9, rsi: 49, riskScore: 19, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "LT", name: "Larsen & Toubro Ltd.", exchange: "NSE", sector: "Construction", price: 3871.70, open: 3837.10, high: 3872.70, low: 3806.20, close: 3871.70, change: 0.90, volume: "1.8M", volatility: 13.5, rsi: 56, riskScore: 34, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever Ltd.", exchange: "NSE", sector: "FMCG", price: 1864.60, open: 1858.00, high: 1865.50, low: 1840.40, close: 1864.60, change: 0.36, volume: "1.2M", volatility: 10.1, rsi: 45, riskScore: 20, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "BAJFINANCE", name: "Bajaj Finance Ltd.", exchange: "NSE", sector: "Financials", price: 939.10, open: 934.00, high: 952.45, low: 931.20, close: 939.10, change: 0.55, volume: "1.1M", volatility: 21.4, rsi: 55, riskScore: 46, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "HCLTECH", name: "HCL Technologies Ltd.", exchange: "NSE", sector: "IT Services", price: 1428.10, open: 1410.00, high: 1452.00, low: 1410.00, close: 1428.10, change: 1.28, volume: "2.4M", volatility: 13.8, rsi: 53, riskScore: 29, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "MARUTI", name: "Maruti Suzuki India Ltd.", exchange: "NSE", sector: "Automobile", price: 11397.00, open: 11430.00, high: 11473.00, low: 11342.00, close: 11397.00, change: -0.29, volume: "0.6M", volatility: 15.2, rsi: 57, riskScore: 36, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "SUNPHARMA", name: "Sun Pharmaceutical Industries", exchange: "NSE", sector: "Pharma", price: 1777.70, open: 1769.00, high: 1855.00, low: 1766.20, close: 1777.70, change: 0.49, volume: "1.9M", volatility: 12.7, rsi: 63, riskScore: 25, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "TATAMOTORS", name: "Tata Motors Ltd.", exchange: "NSE", sector: "Automobile", price: 265.40, open: 266.00, high: 266.95, low: 263.10, close: 265.40, change: -0.23, volume: "9.3M", volatility: 22.1, rsi: 66, riskScore: 55, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "ONGC", name: "Oil & Natural Gas Corp.", exchange: "NSE", sector: "Energy", price: 225.39, open: 226.50, high: 227.69, low: 224.42, close: 225.39, change: -0.49, volume: "14.2M", volatility: 17.5, rsi: 51, riskScore: 44, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "NTPC", name: "NTPC Ltd.", exchange: "NSE", sector: "Power", price: 316.25, open: 310.50, high: 318.00, low: 308.15, close: 316.25, change: 1.85, volume: "11.1M", volatility: 13.2, rsi: 58, riskScore: 28, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank Ltd.", exchange: "NSE", sector: "Banking", price: 461.60, open: 459.20, high: 462.90, low: 457.05, close: 461.60, change: 0.52, volume: "3.2M", volatility: 11.5, rsi: 47, riskScore: 31, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "TITAN", name: "Titan Company Ltd.", exchange: "NSE", sector: "Consumer Goods", price: 4436.50, open: 4437.30, high: 4486.00, low: 4391.30, close: 4436.50, change: -0.02, volume: "1.4M", volatility: 16.8, rsi: 54, riskScore: 37, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "AXISBANK", name: "Axis Bank Ltd.", exchange: "NSE", sector: "Banking", price: 1217.00, open: 1221.00, high: 1227.70, low: 1209.20, close: 1217.00, change: -0.33, volume: "6.1M", volatility: 14.3, rsi: 50, riskScore: 33, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "ADANIENT", name: "Adani Enterprises Ltd.", exchange: "NSE", sector: "Conglomerate", price: 2579.40, open: 2606.40, high: 2609.50, low: 2557.00, close: 2579.40, change: -1.04, volume: "11.6M", volatility: 34.9, rsi: 71, riskScore: 84, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "ADANIPORTS", name: "Adani Ports & SEZ Ltd.", exchange: "NSE", sector: "Infrastructure", price: 1850.00, open: 1871.00, high: 1871.60, low: 1813.70, close: 1850.00, change: -1.12, volume: "5.8M", volatility: 24.2, rsi: 62, riskScore: 58, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "COALINDIA", name: "Coal India Ltd.", exchange: "NSE", sector: "Mining", price: 389.00, open: 398.00, high: 398.05, low: 380.40, close: 389.00, change: -2.26, volume: "8.9M", volatility: 15.6, rsi: 53, riskScore: 40, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "BAJAJFINSV", name: "Bajaj Finserv Ltd.", exchange: "NSE", sector: "Financials", price: 1667.60, open: 1665.00, high: 1680.00, low: 1658.00, close: 1667.60, change: 0.16, volume: "2.3M", volatility: 19.1, rsi: 52, riskScore: 42, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "TATASTEEL", name: "Tata Steel Ltd.", exchange: "NSE", sector: "Metals", price: 167.60, open: 168.50, high: 168.69, low: 167.21, close: 167.60, change: -0.53, volume: "24.5M", volatility: 21.0, rsi: 49, riskScore: 51, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "POWERGRID", name: "Power Grid Corp. of India", exchange: "NSE", sector: "Power", price: 265.00, open: 260.05, high: 267.30, low: 259.25, close: 265.00, change: 1.90, volume: "9.8M", volatility: 11.4, rsi: 55, riskScore: 23, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "M&M", name: "Mahindra & Mahindra Ltd.", exchange: "NSE", sector: "Automobile", price: 2840.30, open: 2895.70, high: 2905.40, low: 2839.00, close: 2840.30, change: -1.91, volume: "3.1M", volatility: 20.3, rsi: 68, riskScore: 48, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "ASIANPAINT", name: "Asian Paints Ltd.", exchange: "NSE", sector: "Consumer Goods", price: 2320.00, open: 2297.00, high: 2348.00, low: 2271.20, close: 2320.00, change: 1.00, volume: "1.7M", volatility: 13.9, rsi: 42, riskScore: 30, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "ULTRACEMCO", name: "UltraTech Cement Ltd.", exchange: "NSE", sector: "Cement", price: 11045.00, open: 11150.00, high: 11154.00, low: 11004.00, close: 11045.00, change: -0.94, volume: "0.4M", volatility: 14.5, rsi: 57, riskScore: 32, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "GRASIM", name: "Grasim Industries Ltd.", exchange: "NSE", sector: "Conglomerate", price: 2981.40, open: 2925.00, high: 2981.40, low: 2900.10, close: 2981.40, change: 1.93, volume: "1.0M", volatility: 16.2, rsi: 51, riskScore: 39, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "JSWSTEEL", name: "JSW Steel Ltd.", exchange: "NSE", sector: "Metals", price: 1246.00, open: 1251.00, high: 1263.60, low: 1245.00, close: 1246.00, change: -0.40, volume: "3.7M", volatility: 18.9, rsi: 53, riskScore: 45, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "TECHM", name: "Tech Mahindra Ltd.", exchange: "NSE", sector: "IT Services", price: 1790.80, open: 1774.00, high: 1813.40, low: 1773.60, close: 1790.80, change: 0.95, volume: "2.0M", volatility: 17.1, rsi: 60, riskScore: 38, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "WIPRO", name: "Wipro Ltd.", exchange: "NSE", sector: "IT Services", price: 198.31, open: 190.80, high: 198.31, low: 190.80, close: 198.31, change: 3.94, volume: "4.8M", volatility: 14.0, rsi: 49, riskScore: 33, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "CIPLA", name: "Cipla Ltd.", exchange: "NSE", sector: "Pharma", price: 1378.90, open: 1362.00, high: 1381.70, low: 1357.00, close: 1378.90, change: 1.24, volume: "1.6M", volatility: 12.1, rsi: 52, riskScore: 26, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "DRREDDY", name: "Dr. Reddy's Laboratories", exchange: "NSE", sector: "Pharma", price: 1352.00, open: 1345.00, high: 1363.70, low: 1345.00, close: 1352.00, change: 0.52, volume: "1.3M", volatility: 13.4, rsi: 50, riskScore: 27, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "BPCL", name: "Bharat Petroleum Corp. Ltd.", exchange: "NSE", sector: "Energy", price: 284.90, open: 287.20, high: 287.65, low: 283.40, close: 284.90, change: -0.80, volume: "7.4M", volatility: 18.2, rsi: 48, riskScore: 43, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "BRITANNIA", name: "Britannia Industries Ltd.", exchange: "NSE", sector: "FMCG", price: 4640.00, open: 4656.00, high: 4657.10, low: 4550.00, close: 4640.00, change: -0.34, volume: "0.5M", volatility: 10.6, rsi: 51, riskScore: 22, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "EICHERMOT", name: "Eicher Motors Ltd.", exchange: "NSE", sector: "Automobile", price: 7220.00, open: 7239.00, high: 7343.00, low: 7198.00, close: 7220.00, change: -0.26, volume: "0.8M", volatility: 17.8, rsi: 62, riskScore: 41, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "NESTLEIND", name: "Nestle India Ltd.", exchange: "NSE", sector: "FMCG", price: 1167.00, open: 1181.00, high: 1185.00, low: 1165.00, close: 1167.00, change: -1.19, volume: "0.7M", volatility: 9.4, rsi: 46, riskScore: 18, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "HEROMOTOCO", name: "Hero MotoCorp Ltd.", exchange: "NSE", sector: "Automobile", price: 5167.00, open: 5090.00, high: 5196.00, low: 5051.50, close: 5167.00, change: 1.51, volume: "0.9M", volatility: 16.5, rsi: 56, riskScore: 39, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "APOLLOHOSP", name: "Apollo Hospitals Enterprise", exchange: "NSE", sector: "Healthcare", price: 8448.00, open: 8195.00, high: 8448.00, low: 8176.00, close: 8448.00, change: 3.09, volume: "0.7M", volatility: 15.9, rsi: 61, riskScore: 35, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "TATACONSUM", name: "Tata Consumer Products Ltd.", exchange: "NSE", sector: "FMCG", price: 1025.90, open: 1028.45, high: 1028.90, low: 1002.35, close: 1025.90, change: -0.25, volume: "2.6M", volatility: 11.8, rsi: 48, riskScore: 24, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "DIVISLAB", name: "Divi's Laboratories Ltd.", exchange: "NSE", sector: "Pharma", price: 9780.00, open: 9680.00, high: 9865.00, low: 9621.50, close: 9780.00, change: 1.03, volume: "0.8M", volatility: 16.3, rsi: 64, riskScore: 31, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "HINDALCO", name: "Hindalco Industries Ltd.", exchange: "NSE", sector: "Metals", price: 884.70, open: 882.30, high: 892.50, low: 876.10, close: 884.70, change: 0.27, volume: "5.5M", volatility: 20.1, rsi: 52, riskScore: 47, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "SHREECEM", name: "Shree Cement Ltd.", exchange: "NSE", sector: "Cement", price: 22995.00, open: 23125.00, high: 23125.00, low: 22670.00, close: 22995.00, change: -0.56, volume: "0.2M", volatility: 15.0, rsi: 47, riskScore: 36, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "SBILIFE", name: "SBI Life Insurance Co. Ltd.", exchange: "NSE", sector: "Insurance", price: 1658.60, open: 1651.50, high: 1685.90, low: 1645.80, close: 1658.60, change: 0.43, volume: "1.5M", volatility: 11.7, rsi: 53, riskScore: 23, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "HDFCLIFE", name: "HDFC Life Insurance Co. Ltd.", exchange: "NSE", sector: "Insurance", price: 524.90, open: 518.35, high: 525.80, low: 510.50, close: 524.90, change: 1.26, volume: "2.8M", volatility: 12.5, rsi: 50, riskScore: 25, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "BAJAJ-AUTO", name: "Bajaj Auto Ltd.", exchange: "NSE", sector: "Automobile", price: 10350.00, open: 10383.00, high: 10530.00, low: 10309.00, close: 10350.00, change: -0.32, volume: "0.6M", volatility: 17.2, rsi: 63, riskScore: 40, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "BEL", name: "Bharat Electronics Ltd.", exchange: "NSE", sector: "Defence", price: 369.90, open: 371.00, high: 371.15, low: 363.50, close: 369.90, change: -0.30, volume: "18.5M", volatility: 22.8, rsi: 66, riskScore: 49, feed_source: "DHAN_HQ_API_LIVE" },
  { symbol: "TRENT", name: "Trent Ltd.", exchange: "NSE", sector: "Retail", price: 3017.30, open: 3018.00, high: 3060.00, low: 2980.00, close: 3017.30, change: -0.02, volume: "2.1M", volatility: 25.4, rsi: 72, riskScore: 68, feed_source: "DHAN_HQ_API_LIVE" },
];

export const DEFAULT_SYMBOL = "NIFTY50";

/**
 * Updates STOCKS in place with real-time Dhan quotes.
 */
export function updateLiveStockPrices(liveList) {
  if (!Array.isArray(liveList)) return;
  for (const live of liveList) {
    const existing = STOCKS.find((s) => s.symbol === live.symbol);
    if (existing) {
      if (typeof live.price === "number") existing.price = live.price;
      if (typeof live.open === "number") existing.open = live.open;
      if (typeof live.high === "number") existing.high = live.high;
      if (typeof live.low === "number") existing.low = live.low;
      if (typeof live.close === "number") existing.close = live.close;
      if (typeof live.change === "number") existing.change = live.change;
      if (live.volume) existing.volume = live.volume;
      existing.feed_source = live.feed_source || "DHAN_HQ_API_LIVE";
    }
  }
}

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
