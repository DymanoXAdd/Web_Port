/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Concept A "Query" (picked 2026-11-12). Contrast on ink: fg 15:1, muted 7.3:1, brand-text 8.7:1.
      // brand (#00880C) is only for fills with white text (4.6:1); never small text on ink (4.2:1 fails AA).
      colors: {
        ink: "#0E1116",
        panel: "#131820",
        "panel-2": "#1B2230",
        line: "#222A35",
        "line-2": "#3A4554",
        fg: "#E6EDF3",
        soft: "#C9D3DD",
        muted: "#9BA7B4",
        brand: { DEFAULT: "#00880C", hover: "#007309", text: "#34C94A" },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
  ],
};
