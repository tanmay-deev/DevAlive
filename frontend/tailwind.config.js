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
        "primary": "var(--color-primary)",
        "accent": "var(--color-accent)",
        "surface-container-lowest": "var(--color-surface-container-lowest)",
        "surface-container-low": "var(--color-surface-container-low)",
        "surface-container": "var(--color-surface-container)",
        "surface-container-high": "var(--color-surface-container-high)",
        "surface-container-highest": "var(--color-surface-container-highest)",
        "on-surface": "var(--color-on-surface)",
        "on-surface-variant": "var(--color-on-surface-variant)",
        "outline": "var(--color-outline)",
        "outline-variant": "var(--color-outline-variant)",
        "background": "var(--color-background)",
        "surface": "var(--color-surface)",
        "card": "var(--color-card)",
        "border": "var(--color-border)"
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
