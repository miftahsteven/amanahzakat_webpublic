import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FBFAF7",
        surface: "#FFFFFF",
        primary: {
          DEFAULT: "#14509C",
          dark: "#0E3B74",
          light: "#2B6F9E",
          soft: "#EEF3FB",
          border: "#BCD3EE",
        },
        navy: {
          DEFAULT: "#0B1F3D",
          light: "#162E52",
          dark: "#061326",
        },
        text: {
          DEFAULT: "#1A1613",
          muted: "#6D645B",
          subtle: "#9A9086",
        },
        border: {
          DEFAULT: "#EAE5DC",
          strong: "#DDD7CD",
        },
        brandGreen: {
          DEFAULT: "#2E7D4F",
          light: "#E6F6EF",
          dark: "#1E5736",
        },
        brandRed: {
          DEFAULT: "#B5342B",
          light: "#FDECEB",
        },
        brandGold: {
          DEFAULT: "#C8933A",
          warning: "#A06A12",
          light: "#FDF3E0",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
      },
      boxShadow: {
        subtle: "0 2px 8px rgba(20, 15, 8, 0.04)",
        card: "0 6px 20px rgba(20, 15, 8, 0.06)",
        dropdown: "0 10px 30px rgba(20, 15, 8, 0.10)",
        modal: "0 20px 50px rgba(11, 31, 61, 0.18)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-out forwards",
        pulseSubtle: "pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
