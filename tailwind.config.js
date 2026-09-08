export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#050609",
          soft: "#080A0F",
          raised: "#0D1017",
        },
        accent: {
          blue: "#4C7CF3",
          violet: "#8B7CF6",
          cyan: "#4CD9F3",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
}
