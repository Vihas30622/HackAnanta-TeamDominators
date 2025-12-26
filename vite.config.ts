import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  fontFamily: {
    display: ["Plus Jakarta Sans", "sans-serif"],
    body: ["Noto Sans", "sans-serif"],
  },
  colors: {
    border: "hsl(var(--border))",
    input: "hsl(var(--input))",
    ring: "hsl(var(--ring))",
    background: "white", // User requested white background
    foreground: "hsl(var(--foreground))",
    primary: {
      DEFAULT: "#3674B5",
      foreground: "white",
    },
    secondary: {
      DEFAULT: "#578FCA",
      foreground: "white",
    },
    accent: {
      DEFAULT: "#A1E3F9",
      foreground: "#101419",
    },
    destructive: {
      DEFAULT: "hsl(var(--destructive))",
      foreground: "hsl(var(--destructive-foreground))",
    },
    muted: {
      DEFAULT: "#94a3b8", // slate-400
      foreground: "#64748b", // slate-500
    },
    popover: {
      DEFAULT: "white",
      foreground: "#101419",
    },
    card: {
      DEFAULT: "white",
      foreground: "#101419",
    },
  },
  borderRadius: {
    lg: "var(--radius)",
    md: "calc(var(--radius) - 2px)",
    sm: "calc(var(--radius) - 4px)",
    xl: "1rem",
    "2xl": "1.5rem",
    "3xl": "2rem",
  },
  keyframes: {
    "accordion-down": {
      from: { height: "0" },
      to: { height: "var(--radix-accordion-content-height)" },
    },
    "accordion-up": {
      from: { height: "var(--radix-accordion-content-height)" },
      to: { height: "0" },
    },
    float: {
      "0%, 100%": { transform: "translate(0, 0) scale(1)" },
      "33%": { transform: "translate(30px, -50px) scale(1.1)" },
      "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
    },
    pulse: {
      "0%, 100%": { opacity: "1" },
      "50%": { opacity: "0.5" },
    },
    ripple: {
      "0%": { transform: "scale(1)", opacity: "0.6", boxShadow: "0 0 0 0 rgba(54, 116, 181, 0.3)" },
      "70%": { transform: "scale(1.1)", opacity: "0", boxShadow: "0 0 0 30px rgba(54, 116, 181, 0)" },
      "100%": { transform: "scale(1)", opacity: "0" },
    }
  },
  animation: {
    "accordion-down": "accordion-down 0.2s ease-out",
    "accordion-up": "accordion-up 0.2s ease-out",
    float: "float 10s infinite ease-in-out",
    "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    ripple: "ripple 2.5s infinite",
  },
