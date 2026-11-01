import daisyui from "daisyui";
import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        midnight: {
          primary: "#8b5cf6",
          "primary-content": "#ffffff",
          secondary: "#22d3ee",
          "secondary-content": "#05222a",
          accent: "#f472b6",
          neutral: "#1f2330",
          "base-100": "#13151c",
          "base-200": "#0b0c11",
          "base-300": "#1d2029",
          "base-content": "#e7e9f0",
          info: "#38bdf8",
          success: "#34d399",
          warning: "#fbbf24",
          error: "#f87171",
          "--rounded-box": "1rem",
          "--rounded-btn": "0.75rem",
        },
      },
      {
        daylight: {
          primary: "#7c3aed",
          "primary-content": "#ffffff",
          secondary: "#0891b2",
          "secondary-content": "#ffffff",
          accent: "#db2777",
          neutral: "#1f2330",
          "base-100": "#ffffff",
          "base-200": "#f4f5f9",
          "base-300": "#e6e8ef",
          "base-content": "#171923",
          info: "#0284c7",
          success: "#059669",
          warning: "#d97706",
          error: "#dc2626",
          "--rounded-box": "1rem",
          "--rounded-btn": "0.75rem",
        },
      },
      "pastel",
      "retro",
      "coffee",
      "forest",
      "cyberpunk",
      "synthwave",
      "luxury",
      "autumn",
      "valentine",
      "aqua",
      "business",
      "night",
      "dracula",
    ],
  },
};
