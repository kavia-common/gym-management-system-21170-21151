/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/design-system/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Map Tailwind color shortcuts to CSS variables provided by Design Things globals.
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        success: "var(--success)",
        error: "var(--error)",
        bg: "var(--background)",
        surface: "var(--surface)",
        text: "var(--text)",
        muted: "var(--muted)",
        border: "var(--border)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      borderRadius: {
        card: "var(--card-radius)",
      },
    },
  },
  // If you have the official Design Things Tailwind preset, add `presets: [require('design-things/tailwind-preset')]`
  plugins: [],
};
