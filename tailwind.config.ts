import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F7F4EF",
        "cream-dark": "#EDE9E1",
        "green-bg": "#B8DDD8",
        "green-bg-dark": "#8FCBC4",
        "green-solid": "#4A8B80",
        "green-deep": "#2D6B62",
        forest: "#4A8B80",
        "forest-light": "#5AA89D",
        "forest-muted": "#8BBFB8",
        "forest-dark": "#2D6B62",
        ink: "#1A1A18",
        "ink-soft": "#2E2E2C",
        "ink-muted": "#5A5A55",
        border: "#DDD9D0",
        "border-green": "#7DBDB6",
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
