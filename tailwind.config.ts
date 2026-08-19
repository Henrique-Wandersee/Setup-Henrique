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
        cyber: ["'Orbitron'", "'Rajdhani'", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
      },
      boxShadow: {
        "cyan-glow": "0 0 20px rgba(0, 243, 255, 0.4), 0 0 40px rgba(0, 243, 255, 0.2)",
        "magenta-glow": "0 0 20px rgba(255, 0, 127, 0.5), 0 0 40px rgba(255, 0, 127, 0.25)",
        "yellow-glow": "0 0 20px rgba(255, 218, 0, 0.4)",
        "neon-box": "0 0 15px rgba(0, 243, 255, 0.3), inset 0 0 15px rgba(0, 243, 255, 0.1)",
      },
      backgroundImage: {
        "cyber-grid": "linear-gradient(to right, rgba(0,243,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,243,255,0.05) 1px, transparent 1px)",
        "hexagon-pattern": "radial-gradient(circle at 50% 50%, rgba(0,243,255,0.15) 0%, transparent 80%)",
        "laser-scan": "linear-gradient(to bottom, transparent 0%, rgba(0, 243, 255, 0.8) 50%, transparent 100%)",
      },
      animation: {
        "pulse-glow": "pulseGlow 2s infinite alternate",
        "laser-move": "laserScan 2.5s infinite linear",
        "hologram-float": "hologramFloat 4s ease-in-out infinite",
        "glitch": "glitch 1s infinite alternate",
      },
      keyframes: {
        pulseGlow: {
          "0%": { boxShadow: "0 0 10px rgba(0, 243, 255, 0.2)" },
          "100%": { boxShadow: "0 0 25px rgba(0, 243, 255, 0.7), 0 0 50px rgba(255, 0, 127, 0.4)" },
        },
        laserScan: {
          "0%": { top: "0%" },
          "50%": { top: "95%" },
          "100%": { top: "0%" },
        },
        hologramFloat: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(0.5deg)" },
        },
        glitch: {
          "0%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
          "100%": { transform: "translate(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
