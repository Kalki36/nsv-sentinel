import { useState, useMemo } from "react";
import {
  HelpCircle,
  ChevronDown,
  Bot,
  Sparkles,
  Shield,
  Cpu,
  Activity,
  Search,
  LineChart,
  Lock,
  Layers,
  BarChart3,
  TrendingUp,
  Sliders,
  CheckCircle2,
  FileText
} from "lucide-react";
import AIAssistant from "../components/AIAssistant";

const FAQ_CATEGORIES = [
  "All",
  "Market Data & Dhan HQ",
  "Authentication & 2FA",
  "Quantitative Pairs Trading",
  "FinBERT AI Sentiment",
  "Surveillance & Risk Engine",
  "Financial Fundamentals"
];

const FAQ_ITEMS = [
  // --- Category: Market Data & Dhan HQ ---
  {
    category: "Market Data & Dhan HQ",
    icon: LineChart,
    question: "How does NSV Sentinel interface with Dhan HQ API v2 for market feeds?",
    answer: "NSV Sentinel interfaces directly with Dhan HQ API v2 via authenticated REST endpoints (/v2/marketfeed/ohlc and /v2/charts/historical). It streams real-time quotes, Last Traded Price (LTP), and high-resolution intraday/historical OHLCV candle charts for the entire NIFTY 50 universe and benchmark indices (NIFTY 50, BANK NIFTY, SENSEX). Inbound ticks are cached dynamically with 6-second rate limiting and verified using cryptographic SHA-256 signatures to guarantee data authenticity."
  },
  {
    category: "Market Data & Dhan HQ",
    icon: TrendingUp,
    question: "How are Indian trading sessions and market hours determined?",
    answer: "The platform tracks official NSE/BSE trading sessions: Monday through Friday from 09:15 AM to 03:30 PM IST. During market hours, the system indicates 'LIVE TRADING SESSION' with active green telemetry. Outside these hours, on weekends, or during national exchange holidays, the platform transitions to 'MARKET CLOSED / POST-MARKET SESSION', displaying the latest closing prices and enabling off-market analysis, model re-calibration, and backtesting."
  },
  {
    category: "Market Data & Dhan HQ",
    icon: BarChart3,
    question: "How are TradingView technical indicators (EMA, SMA, Bollinger Bands) computed?",
    answer: "Historical and intraday candles fetched from Dhan API are fed through rolling mathematical transforms to compute technical overlays: 20-period Exponential Moving Average (EMA-20), 50-period Simple Moving Average (SMA-50), and Bollinger Bands (20-day SMA ± 2 standard deviations). In addition, volume profiles, relative strength index (RSI), and percentage return trajectories are plotted synchronously."
  },

  // --- Category: Authentication & 2FA ---
  {
    category: "Authentication & 2FA",
    icon: Lock,
    question: "How does Google OAuth 2.0 ('Continue with Google') authentication work?",
    answer: "Users can sign in or register with 1-click using Google OAuth 2.0 OpenID Connect. The client authenticates with Google's secure OAuth consent service, and passes the authorization token to the backend endpoint (/api/v1/auth/google). The server cryptographically validates the token with Google public keys, provisions or matches the user account, and issues an institutional JWT Bearer access token."
  },
  {
    category: "Authentication & 2FA",
    icon: Shield,
    question: "How does Two-Factor Authentication (2FA) OTP verification operate?",
    answer: "When logging in via email and password, NSV Sentinel enforces two-factor authentication. A cryptographically random, time-sensitive 6-digit OTP code is generated (with a strict 5-minute time-to-live). It is dispatched to your registered Gmail address via TLS-encrypted SMTP. Verifying the correct OTP completes the 2FA handshake and activates your authenticated session."
  },
  {
    category: "Authentication & 2FA",
    icon: FileText,
    question: "What is the Forgot Password and Reset workflow?",
    answer: "If you forget your password, click 'Forgot Password?' on the login screen and enter your registered email. The backend issues a single-use signed reset token and dispatches a 6-digit PIN. You can securely set a new password, which is immediately salted and hashed with Argon2id using memory-hard parameters to prevent brute-force attacks."
  },
  {
    category: "Authentication & 2FA",
    icon: Shield,
    question: "What cryptographic security controls protect the platform?",
    answer: "NSV Sentinel implements institutional OWASP-aligned controls: Argon2id password hashing, HS256/Ed25519 JWT Bearer session tokens, AES-256-GCM encryption for stored secrets, SHA-256 cryptographic signatures on all incoming market ticks, CORS origin enforcement, and HTTP security headers (nosniff, DENY, Content-Security-Policy)."
  },

  // --- Category: Quantitative Pairs Trading ---
  {
    category: "Quantitative Pairs Trading",
    icon: Sliders,
    question: "What is the NIFTY 50 vs. BANK NIFTY Pairs Trading statistical arbitrage strategy?",
    answer: "The Pairs Trading engine exploits long-term cointegration between the NIFTY 50 and BANK NIFTY indices. Because banking stocks comprise ~35% of the NIFTY 50 index weight, temporary pricing divergences between the two series exhibit strong mean-reversion tendencies that can be captured with market-neutral long/short statistical arbitrage."
  },
  {
    category: "Quantitative Pairs Trading",
    icon: Cpu,
    question: "How is cointegration evaluated using OLS regression and the ADF test?",
    answer: "We use the Engle-Granger two-step method: First, an Ordinary Least Squares (OLS) regression models BANKNIFTY = alpha + beta * NIFTY + error. Second, an Augmented Dickey-Fuller (ADF) test evaluates whether the residuals (spread) are stationary. If the ADF test statistic is below the 5% critical threshold (p < 0.05), cointegration is statistically established."
  },
  {
    category: "Quantitative Pairs Trading",
    icon: Activity,
    question: "What are the Z-score trade entry, exit, and stop-loss rules?",
    answer: "The price spread is normalized using a rolling 30-day mean and standard deviation into a dimensionless Z-Score. When Z <= -2.0 (BANK NIFTY undervalued vs NIFTY), the engine triggers a Long Spread trade. When Z >= +2.0, it triggers a Short Spread trade. Positions are closed at |Z| <= 0.5 (mean reversion), and a strict stop-loss is enforced at |Z| >= 3.5 to protect against cointegration breakdown."
  },
  {
    category: "Quantitative Pairs Trading",
    icon: LineChart,
    question: "What quantitative performance metrics are generated by the backtest engine?",
    answer: "The backtesting engine calculates Cumulative Strategy Return (%), Annualized Sharpe Ratio, Maximum Drawdown (MDD), Win Rate (%), Total Executed Trades, and renders an interactive equity curve comparing the pairs arbitrage strategy against a passive buy-and-hold benchmark."
  },

  // --- Category: FinBERT AI Sentiment ---
  {
    category: "FinBERT AI Sentiment",
    icon: Sparkles,
    question: "What is FinBERT and how does financial domain-adapted NLP work?",
    answer: "FinBERT is a financial domain-adapted BERT model pre-trained on corporate filings, earnings call transcripts, analyst research, and financial journalism. Unlike generic NLP models that misclassify financial terms, FinBERT accurately categorizes complex market nuances (such as 'rate hike expectations', 'margin contraction', or 'EBITDA expansion')."
  },
  {
    category: "FinBERT AI Sentiment",
    icon: Bot,
    question: "How are financial news headlines processed and classified?",
    answer: "Financial news headlines covering the monitored equities are collected over a rolling 15-day window. FinBERT performs deep sequence classification to generate a calibrated probability distribution across Positive (Green), Neutral (Yellow), and Negative (Red) sentiments, along with a classification confidence score (0-100%)."
  },
  {
    category: "FinBERT AI Sentiment",
    icon: TrendingUp,
    question: "How does FinBERT sentiment factor into investment decisions?",
    answer: "The net sentiment score (Positive % minus Negative %) and confidence level feed directly into our multi-factor decision engine as a 35% weighted factor, actively modifying directional confidence and 7-day target price projections."
  },

  // --- Category: Surveillance & Risk Engine ---
  {
    category: "Surveillance & Risk Engine",
    icon: Activity,
    question: "What triggers a Market Surveillance Alert (e.g., NSV-1042)?",
    answer: "Surveillance alerts trigger when intraday volume or price movement exceeds statistical Z-score thresholds (|Z| > 3.0 above 30-day baseline) or when Isolation Forest algorithms detect multivariate trading anomalies. Each alert flags the deviation percentage, current vs. historical volume, volatility spikes, and compliance risk level (Alert, Review, or Normal)."
  },
  {
    category: "Surveillance & Risk Engine",
    icon: Shield,
    question: "How is the 5-Factor Composite Risk Score calculated?",
    answer: "The Composite Risk Score (0-100) is evaluated dynamically across 5 weighted vectors: 25% Market Trend Deviation Risk + 25% Volatility Risk + 20% Surveillance Anomaly Z-Score Risk + 15% FinBERT News Sentiment Risk + 15% Cryptographic Integrity & Security Risk. Scores above 65 trigger an automated high-risk compliance flag."
  },
  {
    category: "Surveillance & Risk Engine",
    icon: Cpu,
    question: "How does the AI Decision Projection calculate 7-day target prices?",
    answer: "Target price projections are synthesized using a multi-factor weighted equation: Projected Return = (35% Pairs Trading Arbitrage Drift) + (35% FinBERT News Sentiment Score) + (30% Market Trend Momentum). This generates the projected 7-day price, expected percentage change, and actionable BUY / SELL / HOLD recommendation."
  },

  // --- Category: Financial Fundamentals ---
  {
    category: "Financial Fundamentals",
    icon: BarChart3,
    question: "What is the Fundamental Hemispherical Meter?",
    answer: "The Hemispherical Gauge is a visual health assessment instrument that rates companies from 0 to 100 ('Weak', 'Moderate', 'Strong') based on balance sheet stability, debt coverage, and earnings quality."
  },
  {
    category: "Financial Fundamentals",
    icon: FileText,
    question: "Which 7 core fundamental indicators are monitored?",
    answer: "The platform tracks 7 core audited metrics: Net Sales (Revenue in ₹ Cr), Cash & Cash Equivalents, Profit Before Depreciation, Interest and Taxes (PBDIT), Operating Profit to Net Sales (%), Profit Before Tax less Other Income, Profit After Tax (PAT), and Earnings Per Share (EPS)."
  }
];

export default function FAQ() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [openIdx, setOpenIdx] = useState(0);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  const filtered = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const q = query.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, query]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-gray-900">
            Frequently Asked Questions & Support
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Comprehensive guide to NSV Sentinel&apos;s Dhan HQ API v2 feeds, Google OAuth & 2FA, Pairs Trading, FinBERT sentiment, and surveillance engines.
          </p>
        </div>

        <button
          onClick={() => setAiAssistantOpen(true)}
          className="focus-ring flex items-center gap-2 rounded-lg bg-zerodha-red text-white font-semibold px-4 py-2 text-xs hover:brightness-110 cursor-pointer shadow-xs transition"
        >
          <Bot className="h-4 w-4" />
          Ask AI Assistant
        </button>
      </div>

      {/* Search Input & Category Pills */}
      <div className="space-y-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpenIdx(0);
            }}
            placeholder="Search questions across Dhan API, 2FA, Pairs Trading, FinBERT..."
            className="focus-ring w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-xs text-gray-900 placeholder:text-gray-400 shadow-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {FAQ_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setOpenIdx(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  isSelected
                    ? "bg-zerodha-red text-white shadow-xs"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count Summary */}
      <div className="flex items-center justify-between text-xs text-gray-500 font-medium px-1">
        <span>Showing {filtered.length} {filtered.length === 1 ? "question" : "questions"}</span>
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-zerodha-red hover:underline text-xs font-semibold cursor-pointer"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* FAQ Accordion List */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs divide-y divide-gray-100">
        {filtered.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <HelpCircle className="h-8 w-8 text-gray-300 mx-auto" />
            <p className="text-sm font-semibold text-gray-700">No matching questions found</p>
            <p className="text-xs text-gray-400">
              Try adjusting your search query or select another category above.
            </p>
          </div>
        ) : (
          filtered.map((item, idx) => {
            const isOpen = openIdx === idx;
            const ItemIcon = item.icon || HelpCircle;
            return (
              <div key={idx} className="p-4 transition hover:bg-gray-50/50">
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full flex items-center justify-between text-left gap-3 focus-ring rounded-lg cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-1.5 rounded-lg bg-red-50 border border-red-100 text-zerodha-red shrink-0">
                      <ItemIcon className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="font-display text-sm font-bold text-gray-900 leading-snug">
                        {item.question}
                      </h3>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 shrink-0 transition-transform ${
                      isOpen ? "rotate-180 text-zerodha-red" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="mt-3 text-xs font-medium text-gray-600 leading-relaxed pl-10 border-l-2 border-zerodha-red/60 ml-2 animate-fade-in">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Interactive AI Assistant Modal */}
      <AIAssistant isOpen={aiAssistantOpen} onClose={() => setAiAssistantOpen(false)} />
    </div>
  );
}
