/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#F9FAFB",
          alt: "#FFFFFF",
        },
        panel: {
          DEFAULT: "#FFFFFF",
          alt: "#F3F4F6",
          border: "#E5E7EB",
        },
        zerodha: {
          red: "#E24A4A",
          redsoft: "#FEF2F2",
          orange: "#F0592B",
          blue: "#4184F3",
        },
        ink: {
          DEFAULT: "#111827",
          muted: "#4B5563",
          faint: "#9CA3AF",
        },
        signal: {
          buy: "#10B981",     // Clean Positive Green
          buysoft: "#ECFDF5",
          sell: "#EF4444",    // Clean Negative Red
          sellsoft: "#FEF2F2",
          warn: "#F59E0B",    // Clean Neutral Yellow / Amber
          warnsoft: "#FFFBEB",
          ai: "#E24A4A",      // Primary Zerodha Red
          aisoft: "#FEF2F2",
        },
      },
      fontFamily: {
        display: ["'Inter'", "'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      boxShadow: {
        panel: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "28px 28px",
      },
    },
  },
  plugins: [],
}
