import { useState } from "react";
import { HelpCircle, ChevronDown, Bot, Sparkles, Shield, Cpu, Activity, Search } from "lucide-react";
import AIAssistant from "../components/AIAssistant";

const FAQ_ITEMS = [
  {
    category: "General Platform",
    question: "What is NSV SENTINEL?",
    answer: "NSV SENTINEL is a Financial Market Surveillance and Decision Support Platform designed for institutional compliance and market intelligence. It combines FinBERT NLP news sentiment analysis, statistical Z-score anomaly surveillance, composite risk scoring, and OWASP-aligned cybersecurity protection."
  },
  {
    category: "AI & Sentiment",
    question: "How does FinBERT sentiment analysis work?",
    answer: "FinBERT is a financial domain-adapted BERT model. NSV Sentinel runs text classification on incoming financial news headlines to output Positive (Green), Neutral (Yellow), and Negative (Red) probability distributions, along with key sentiment drivers like 'Retail Revenue Expansion' or 'Regulatory Scrutiny'."
  },
  {
    category: "Surveillance",
    question: "What triggers an Anomaly Surveillance alert?",
    answer: "Surveillance alerts trigger when intraday volume or price movement exceeds statistical Z-score thresholds (|Z| > 3.0 above 30-day baseline) or when Isolation Forest algorithms detect multivariate trading anomalies."
  },
  {
    category: "Risk Analysis",
    question: "How is the Composite Risk Score calculated?",
    answer: "The composite risk score is evaluated dynamically: 25% Market Trend Risk + 25% Volatility Deviation + 20% Surveillance Anomaly Z-Score + 15% FinBERT News Sentiment + 15% Security & Integrity Risk."
  },
  {
    category: "Data Integration",
    question: "How does Dhan API market data integration work?",
    answer: "NSV Sentinel interfaces with Dhan HQ API v2 to stream live quotes and historical OHLCV candle charts for Indian equities and benchmark indices (NIFTY 50 & BANK NIFTY), enforcing cryptographic SHA-256 integrity verification."
  },
  {
    category: "Security",
    question: "What security controls protect the platform?",
    answer: "The platform implements Argon2id password hashing, signed JWT tokens, AES-256-GCM application encryption, SHA-256 data integrity signatures, OWASP security headers (nosniff, DENY, CSP), and rate limiting."
  },
  {
    category: "Fundamentals",
    question: "What metrics are displayed in the Fundamental Hemispherical Meter?",
    answer: "The Hemispherical Gauge displays a 0-100 Fundamental Health Score along with 7 core financial metrics: Net Sales, Cash & Cash Equivalents, PBDIT, Operating Profit to Net Sales (%), PBT Less Other Income, PAT, and EPS."
  }
];

export default function FAQ() {
  const [query, setQuery] = useState("");
  const [openIdx, setOpenIdx] = useState(0);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  const filtered = query
    ? FAQ_ITEMS.filter(item => 
        item.question.toLowerCase().includes(query.toLowerCase()) || 
        item.answer.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      )
    : FAQ_ITEMS;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-gray-900">Frequently Asked Questions & Support</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Comprehensive guide to NSV Sentinel's market surveillance engines, FinBERT sentiment, and security architecture.
          </p>
        </div>

        <button
          onClick={() => setAiAssistantOpen(true)}
          className="focus-ring flex items-center gap-2 rounded-lg bg-zerodha-red text-white font-semibold px-4 py-2 text-xs hover:brightness-110 cursor-pointer shadow-xs"
        >
          <Bot className="h-4 w-4" />
          Ask AI Assistant
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search FAQ questions..."
          className="focus-ring w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-xs text-gray-900 placeholder:text-gray-400"
        />
      </div>

      {/* FAQ Accordion List */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs divide-y divide-gray-100">
        {filtered.length === 0 ? (
          <p className="p-6 text-xs text-gray-400">No matching questions found.</p>
        ) : (
          filtered.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="p-4">
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full flex items-center justify-between text-left gap-3 focus-ring rounded-lg cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-zerodha-red border border-gray-200">
                      {item.category}
                    </span>
                    <h3 className="font-display text-sm font-bold text-gray-900">{item.question}</h3>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-400 shrink-0 transition-transform ${isOpen ? "rotate-180 text-zerodha-red" : ""}`} />
                </button>
                {isOpen && (
                  <p className="mt-3 text-xs font-medium text-gray-600 leading-relaxed pl-3 border-l-2 border-zerodha-red/60">
                    {item.answer}
                  </p>
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
