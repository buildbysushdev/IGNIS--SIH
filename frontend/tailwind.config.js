/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surveillance: {
          primary: "#dc2626",      // Fire Red
          secondary: "#f97316",    // Ember Orange
          bg: "#0f172a",           // Dark Slate
          card: "#1e293b",         // Lighter Slate
          border: "#334155",       // Slate Border
          text: "#f8fafc",         // Near White
          muted: "#94a3b8",        // Muted Slate
          accent: "#fbbf24",       // Flame Yellow
          emerald: "#10b981",      // Forest Green
          darker: "#020617",       // Deep Black Slate
        },
      },
      fontFamily: {
        mono: ["Consolas", "Monaco", "Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};
