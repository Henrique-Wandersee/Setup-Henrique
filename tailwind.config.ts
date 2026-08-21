import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rockstar: {
          yellow: "#fdb813",
          black: "#0a0a0e",
          card: "#121218",
          panel: "#181822",
          border: "#282836",
        },
        vice: {
          magenta: "#ff007f",
          purple: "#8a00d4",
          sunset: "#ff5e00",
          cyan: "#00f3ff",
          dark: "#08080c",
        },
        cyber: {
          cyan: "#00f3ff",
          magenta: "#ff007f",
          yellow: "#ffda00",
          purple: "#9d00ff",
          dark: "#0b0e17",
          void: "#040508",
          card: "#111625",
          panel: "#161b2e",
          border: "#1e2942",
          dim: "#475569",
        },
      },
      fontFamily: {
        rockstar: ["'Pricedown'", "'Impact'", "'Orbitron'", "sans-serif"],
        vice: ["'Rajdhani'", "'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
      },
      boxShadow: {
        "rockstar-glow": "0 0 25px rgba(253, 184, 19, 0.4)",
        "vice-glow": "0 0 30px rgba(255, 0, 127, 0.5), 0 0 50px rgba(138, 0, 212, 0.3)",
        "cyan-glow": "0 0 20px rgba(0, 243, 255, 0.4)",
        "magenta-glow": "0 0 20px rgba(255, 0, 127, 0.5)",
      },
      backgroundImage: {
        "vice-gradient": "linear-gradient(135deg, #ff007f 0%, #8a00d4 50%, #ff5e00 100%)",
        "rockstar-gradient": "linear-gradient(to right, #fdb813, #ff5e00)",
        "vice-sunset-overlay": "linear-gradient(to bottom, rgba(8, 8, 12, 0.3) 0%, rgba(8, 8, 12, 0.85) 75%, #08080c 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
