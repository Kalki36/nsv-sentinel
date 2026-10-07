import { useState } from "react";
import { MessageSquare, Send, X, Bot, Sparkles, User, RefreshCw } from "lucide-react";

const PRESET_QUESTIONS = [
  "How does FinBERT sentiment analysis work?",
  "What triggers an Anomaly Surveillance alert?",
  "How is the Composite Risk Score calculated?",
  "Tell me about RELIANCE stock fundamentals",
  "Is the Security Center reporting SECURE?"
];

export default function AIAssistant({ isOpen: externalOpen, onClose: externalClose }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const handleClose = externalClose || (() => setInternalOpen(false));

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hello! I am the NSV Sentinel AI Assistant. Ask me anything about market surveillance alerts, FinBERT sentiment, composite risk scores, fundamentals, or system security status."
    }
  ]);

  function handleSend(questionText) {
    const text = questionText || input;
    if (!text || !text.trim()) return;

    const userMsg = { id: Date.now(), sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInput("");

    setTimeout(() => {
      let aiText = "";
      const query = text.toLowerCase();

      if (query.includes("finbert") || query.includes("sentiment")) {
        aiText = "FinBERT is a financial domain-adapted BERT NLP model. It evaluates news headlines and extracts Positive (Green), Neutral (Yellow), and Negative (Red) probability vectors along with key drivers like 'Retail Revenue Expansion' or 'Regulatory Scrutiny'.";
      } else if (query.includes("anomaly") || query.includes("surveillance") || query.includes("alert")) {
        aiText = "Surveillance alerts are triggered when statistical Z-scores for volume or price movement exceed critical thresholds (|Z| > 3.0) or when Isolation Forest algorithms detect multivariate trading anomalies.";
      } else if (query.includes("risk") || query.includes("composite")) {
        aiText = "The Composite Risk Score is calculated dynamically as: 0.25 × Market Risk + 0.25 × Volatility + 0.20 × Surveillance Anomaly + 0.15 × News Sentiment + 0.15 × Security Integrity.";
      } else if (query.includes("reliance")) {
        aiText = "RELIANCE (Reliance Industries Ltd.) current quote: ₹1,425.60 (+2.34%). Net Sales: ₹8,91,311 Cr, Cash & Eq: ₹2,24,617 Cr, Health Score: 86.5/100 (Strong). FinBERT sentiment is 68% Positive.";
      } else if (query.includes("security") || query.includes("secure")) {
        aiText = "The Security Center monitors 4 validation layers: Cryptographic SHA-256 Data Integrity, Argon2id/JWT Source Authentication, OWASP API Security Headers & Rate Limits, and Adversarial Input Sanitization. Toggle mode between SECURE and UNSECURE to simulate threat cases.";
      } else if (query.includes("dhan") || query.includes("nifty")) {
        aiText = "NSV Sentinel integrates live quotes and historical OHLCV candle feeds via Dhan HQ API v2 for Indian stocks and benchmark indices (NIFTY 50 & BANK NIFTY).";
      } else {
        aiText = `Based on current market surveillance data for ${text}: All systems are operating normally under live NSE/Dhan feeds. Let me know if you would like specific stock fundamentals or risk breakdown details.`;
      }

      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "ai", text: aiText }]);
    }, 450);
  }

  return (
    <>
      {/* Floating Trigger Button if rendered standalone */}
      {externalOpen === undefined && !internalOpen && (
        <button
          onClick={() => setInternalOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-zerodha-red text-white font-semibold px-4 py-3 shadow-xl hover:brightness-110 transition cursor-pointer"
        >
          <Bot className="h-5 w-5" />
          <span className="text-sm">AI Assistant</span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white shadow-2xl flex flex-col h-[520px] border border-gray-300 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="p-3.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-zerodha-redsoft text-zerodha-red">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-display text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  NSV Sentinel AI Assistant
                  <Sparkles className="h-3 w-3 text-zerodha-red" />
                </h4>
                <p className="text-[10px] text-gray-500 font-medium">Surveillance Guidance & Stock Intelligence</p>
              </div>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-700 cursor-pointer p-1">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-gray-50/50">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                {m.sender === "ai" && (
                  <div className="h-6 w-6 rounded-full bg-zerodha-redsoft text-zerodha-red flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}
                <div className={`p-3 rounded-xl text-xs max-w-[82%] leading-relaxed ${
                  m.sender === "user" ? "bg-zerodha-red text-white font-medium" : "bg-white border border-gray-200 text-gray-800 shadow-xs font-medium"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Preset Questions Suggestions */}
          <div className="px-3 py-2 border-t border-gray-200 bg-gray-50 overflow-x-auto flex gap-1.5">
            {PRESET_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-[10px] font-semibold whitespace-nowrap px-2 py-1 rounded bg-white border border-gray-200 text-gray-600 hover:text-zerodha-red hover:border-zerodha-red transition shrink-0 cursor-pointer shadow-xs"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white border-t border-gray-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI Assistant..."
              className="focus-ring flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="focus-ring rounded-lg bg-zerodha-red text-white p-2 hover:brightness-110 disabled:opacity-50 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
