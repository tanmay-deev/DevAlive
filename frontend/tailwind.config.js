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
        "primary": "rgb(var(--color-primary) / <alpha-value>)",
        "accent": "rgb(var(--color-accent) / <alpha-value>)",
        "surface-container-lowest": "rgb(var(--color-surface-container-lowest) / <alpha-value>)",
        "surface-container-low": "rgb(var(--color-surface-container-low) / <alpha-value>)",
        "surface-container": "rgb(var(--color-surface-container) / <alpha-value>)",
        "surface-container-high": "rgb(var(--color-surface-container-high) / <alpha-value>)",
        "surface-container-highest": "rgb(var(--color-surface-container-highest) / <alpha-value>)",
        "on-surface": "rgb(var(--color-on-surface) / <alpha-value>)",
        "on-surface-variant": "rgb(var(--color-on-surface-variant) / <alpha-value>)",
        "outline": "rgb(var(--color-outline) / <alpha-value>)",
        "outline-variant": "rgb(var(--color-outline-variant) / <alpha-value>)",
        "background": "rgb(var(--color-background) / <alpha-value>)",
        "surface": "rgb(var(--color-surface) / <alpha-value>)",
        "card": "rgb(var(--color-card) / <alpha-value>)",
        "border": "rgb(var(--color-border) / <alpha-value>)"
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
