/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: "#FFD6E0",
          peach: "#FFCBA4",
          yellow: "#FFF3B0",
          mint: "#C8F5E0",
          blue: "#C5E8FF",
          lavender: "#E2D4F0",
          brown: "#D4A574",
          "brown-dark": "#8B5E3C",
        },
        hedgehog: {
          bg: "#FFF8F0",
          card: "#FFFBF7",
          border: "#F0E4D4",
          text: "#5C3D2E",
          muted: "#9E7B6B",
          accent: "#FF8C69",
          "accent-dark": "#E8704A",
        },
      },
      fontFamily: {
        sans: ["var(--font-nunito)", "sans-serif"],
        display: ["var(--font-fredoka)", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        soft: "0 4px 24px rgba(92, 61, 46, 0.08)",
        "soft-lg": "0 8px 40px rgba(92, 61, 46, 0.12)",
        card: "0 2px 16px rgba(92, 61, 46, 0.06), 0 1px 4px rgba(92, 61, 46, 0.04)",
        glow: "0 0 20px rgba(255, 140, 105, 0.3)",
      },
      animation: {
        "bounce-soft": "bounce-soft 2s ease-in-out infinite",
        wiggle: "wiggle 0.5s ease-in-out",
        float: "float 3s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-5deg)" },
          "75%": { transform: "rotate(5deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "33%": { transform: "translateY(-6px) rotate(1deg)" },
          "66%": { transform: "translateY(-3px) rotate(-1deg)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [],
};
