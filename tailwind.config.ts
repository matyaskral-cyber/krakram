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
        pine: "#1F4A46",
        lime: "#B4D777",
        ink: "#1A1A18",
        "ink-soft": "#2E2E2C",
        "ink-muted": "#5A5A55",
        border: "#DDD9D0",
        "border-green": "#7DBDB6",
      },
      keyframes: {
        pas: { to: { transform: "translateX(-50%)" } },
        vyjed: { from: { transform: "translateY(115%)" }, to: { transform: "translateY(0)" } },
        zjev: { from: { opacity: "0", transform: "translateY(18px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        priblizit: { from: { transform: "scale(1.22)" }, to: { transform: "scale(1)" } },
        plneni: { from: { transform: "scaleX(0)" }, to: { transform: "scaleX(1)" } },
        vznaset: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
      },
      animation: {
        pas: "pas 38s linear infinite",
        vyjed: "vyjed 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) both",
        zjev: "zjev 0.8s ease-out both",
        priblizit: "priblizit 2.4s cubic-bezier(0.2, 0.8, 0.2, 1) both",
        plneni: "plneni 5.2s linear both",
        kruh: "spin 22s linear infinite",
        vznaset: "vznaset 7s ease-in-out infinite",
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
