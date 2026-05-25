import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050816",
        surface: "#0d1328",
        panel: "#101938",
        border: "rgba(148, 163, 184, 0.16)",
        foreground: "#f8fafc",
        muted: "#94a3b8",
        bullish: "#22c55e",
        neutral: "#f59e0b",
        bearish: "#ef4444",
        accent: "#38bdf8",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(56, 189, 248, 0.14), 0 18px 50px rgba(15, 23, 42, 0.45)",
      },
      backgroundImage: {
        "dashboard-grid": "linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.32)" },
          "50%": { opacity: ".7", boxShadow: "0 0 0 8px rgba(34, 197, 94, 0)" },
        },
      },
      animation: {
        pulseGlow: "pulseGlow 2s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
