/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        teal: {
          DEFAULT: "#2BA8A2",
          light: "#3CC4BD",
          dark: "#1E8C86",
          ink: "#187A75",
          deep: "#0F4C49",
          bg: "#E8F6F5",
        },
        gold: {
          DEFAULT: "#FFD23F",
          light: "#FFE47A",
          dark: "#E6B800",
        },
        coral: {
          DEFAULT: "#EF6C4A",
          light: "#FF8A6A",
          dark: "#D45233",
          ink: "#C24A2E",
        },
        cream: "#FFF8E7",
        sky: "#5DADE2",
        surface: {
          base: "#EFF8F7",
          card: "#FFFFFF",
        },
        ink: "#2C3E50",
        muted: "#5C6875",
        success: "#27AE60",
        error: {
          DEFAULT: "#E74C3C",
          ink: "#B03A2E",
        },
      },
      borderRadius: {
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        pill: "999px",
      },
      boxShadow: {
        card: "0 4px 20px rgba(43, 168, 162, 0.10)",
        "teal-glow": "0 4px 20px rgba(43, 168, 162, 0.30)",
        "accent-glow": "0 4px 20px rgba(255, 210, 63, 0.40)",
        "coral-glow": "0 4px 20px rgba(239, 108, 74, 0.35)",
        "sky-glow": "0 4px 16px rgba(93, 173, 226, 0.30)",
        focus: "0 0 0 4px rgba(43, 168, 162, 0.15)",
      },
      keyframes: {
        "pop-in": {
          "0%": { transform: "scale(0.92)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "confetti-fall": {
          "0%": { transform: "translate3d(0, -8px, 0) rotate(0deg)", opacity: "1" },
          "100%": {
            transform: "translate3d(var(--drift, 0px), 130px, 0) rotate(520deg)",
            opacity: "0",
          },
        },
      },
      animation: {
        "pop-in": "pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "confetti-fall": "confetti-fall 0.95s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
