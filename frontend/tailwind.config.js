/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#c0c1ff",
        "accent": "#6366F1",
        "surface-container-lowest": "#0e0e11",
        "surface-container-low": "#1b1b1e",
        "surface-container": "#222225",
        "surface-container-high": "#2a2a2d",
        "surface-container-highest": "#333336",
        "on-surface": "#e4e1e6",
        "on-surface-variant": "#c7c4d7",
        "outline": "#908fa0",
        "outline-variant": "#464554",
        "background": "#0a0a0a",
        "surface": "#131316",
        "card": "#18181B",
        "border": "#27272A"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "xxl": "1rem"
      },
      spacing: {
        "gutter": "24px",
        "md": "16px",
        "lg": "24px",
        "xl": "32px"
      },
      fontFamily: {
        "headline-lg": ["Geist", "sans-serif"],
        "headline-md": ["Geist", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "label-sm": ["JetBrains Mono", "monospace"]
      }
    },
  },
  plugins: [],
}
