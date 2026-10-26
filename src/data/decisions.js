// Mock AI decision-support output. In production this is produced by the backend
// decision engine (Scikit-learn/TensorFlow ensemble + FinBERT sentiment input) via
// GET /api/ai/decision/{symbol}, and explanations via GET /api/ai/explain/{symbol}
// (later backed by SHAP/LIME — not yet implemented in this prototype).

export const AI_DECISIONS = {
  RELIANCE: {
    recommendation: "BUY",
    confidence: 84,
    factors: [
      { label: "Market Trend", value: 24, tone: "buy" },
      { label: "Positive Sentiment", value: 18, tone: "buy" },
      { label: "Volume Trend", value: 12, tone: "buy" },
      { label: "Volatility", value: -8, tone: "sell" },
      { label: "Risk Score", value: -6, tone: "sell" },
    ],
    summary:
      "The current recommendation is primarily influenced by positive market momentum and financial sentiment, while elevated volatility reduces confidence.",
  },
  TCS: {
    recommendation: "HOLD",
    confidence: 58,
    factors: [
      { label: "Market Trend", value: 4, tone: "buy" },
      { label: "Positive Sentiment", value: 9, tone: "buy" },
      { label: "Volume Trend", value: -3, tone: "sell" },
      { label: "Volatility", value: -2, tone: "sell" },
      { label: "Risk Score", value: -5, tone: "sell" },
    ],
    summary:
      "Signals are mixed: modest positive sentiment is offset by soft volume trends, leaving confidence too low for a directional call.",
  },
  INFY: {
    recommendation: "HOLD",
    confidence: 55,
    factors: [
      { label: "Market Trend", value: 6, tone: "buy" },
      { label: "Positive Sentiment", value: 5, tone: "buy" },
      { label: "Volume Trend", value: 7, tone: "buy" },
      { label: "Volatility", value: -9, tone: "sell" },
      { label: "Risk Score", value: -11, tone: "sell" },
    ],
    summary:
      "Moderate anomaly activity and risk score elevation offset otherwise stable trend and sentiment signals.",
  },
  HDFCBANK: {
    recommendation: "BUY",
    confidence: 76,
    factors: [
      { label: "Market Trend", value: 14, tone: "buy" },
      { label: "Positive Sentiment", value: 6, tone: "buy" },
      { label: "Volume Trend", value: 9, tone: "buy" },
      { label: "Volatility", value: -3, tone: "sell" },
      { label: "Risk Score", value: -2, tone: "sell" },
    ],
    summary:
      "Stable margins and low volatility support a constructive view, with limited downside factors weighing on confidence.",
  },
  ADANIENT: {
    recommendation: "SELL",
    confidence: 71,
    factors: [
      { label: "Negative Sentiment", value: -22, tone: "sell" },
      { label: "Volatility Spike", value: -19, tone: "sell" },
      { label: "Manipulation Risk", value: -15, tone: "sell" },
      { label: "Market Trend", value: 6, tone: "buy" },
      { label: "Volume Trend", value: 4, tone: "buy" },
    ],
    summary:
      "Elevated volatility, regulatory-linked negative sentiment, and surveillance risk flags dominate the signal, driving a cautious recommendation.",
  },
  TATAMOTORS: {
    recommendation: "BUY",
    confidence: 68,
    factors: [
      { label: "Positive Sentiment", value: 15, tone: "buy" },
      { label: "Market Trend", value: 11, tone: "buy" },
      { label: "Volume Trend", value: 8, tone: "buy" },
      { label: "Volatility", value: -12, tone: "sell" },
      { label: "Risk Score", value: -7, tone: "sell" },
    ],
    summary:
      "Strong seasonal demand signals and positive sentiment outweigh moderate volatility, supporting an upward lean.",
  },
};

export function getDecision(symbol) {
  return AI_DECISIONS[symbol] || AI_DECISIONS.RELIANCE;
}

export const RISK_BREAKDOWN = {
  RELIANCE: { overall: 62, market: 68, volatility: 54, manipulation: 71, sentiment: 42, security: 18 },
  TCS: { overall: 24, market: 22, volatility: 18, manipulation: 12, sentiment: 20, security: 8 },
  INFY: { overall: 41, market: 38, volatility: 33, manipulation: 29, sentiment: 35, security: 10 },
  HDFCBANK: { overall: 22, market: 20, volatility: 15, manipulation: 10, sentiment: 18, security: 6 },
  ADANIENT: { overall: 84, market: 79, volatility: 88, manipulation: 82, sentiment: 74, security: 21 },
  TATAMOTORS: { overall: 55, market: 51, volatility: 58, manipulation: 44, sentiment: 39, security: 14 },
};

export function getRisk(symbol) {
  return RISK_BREAKDOWN[symbol] || RISK_BREAKDOWN.RELIANCE;
}

export const AUDIT_LOGS = [
  { id: "A-901", timestamp: "10:42:31", actor: "System", event: "Data received", module: "Ingestion", status: "Success" },
  { id: "A-902", timestamp: "10:42:32", actor: "System", event: "Integrity validated", module: "Security", status: "Success" },
  { id: "A-903", timestamp: "10:42:33", actor: "System", event: "Data preprocessing completed", module: "Analytics", status: "Success" },
  { id: "A-904", timestamp: "10:42:34", actor: "System", event: "AI analysis completed", module: "AI Engine", status: "Success" },
  { id: "A-905", timestamp: "10:42:35", actor: "System", event: "Recommendation generated", module: "Decision Engine", status: "Success" },
  { id: "A-906", timestamp: "10:38:02", actor: "analyst.n", event: "Alert NSV-1042 reviewed", module: "Surveillance", status: "Success" },
  { id: "A-907", timestamp: "10:31:02", actor: "System", event: "Input anomaly quarantined", module: "Security", status: "Warning" },
  { id: "A-908", timestamp: "10:15:47", actor: "analyst.s", event: "Session login", module: "Auth", status: "Success" },
  { id: "A-909", timestamp: "09:58:20", actor: "System", event: "Malformed payload rejected", module: "Security", status: "Error" },
  { id: "A-910", timestamp: "09:42:35", actor: "System", event: "Sentiment batch processed", module: "AI Engine", status: "Success" },
];
