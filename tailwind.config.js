/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors")

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    colors: {
      red: "#BF0000",
      backdropGray: "#202020",
      textGray: "#6C6C6C",
      borderGray: "#383838",
      bgGray: "#121212",
      marginalOrange: {
        300: "#FFB794",
        500: "#FF6B26",
        600: "#C35420",
        800: "#4C2D1E",
      },
      marginalGray: {
        100: "#F6F6F6",
        200: "#BEBEBE",
        400: "#9E9E9E",
        600: "#7A7A7A",
        800: "#3A3A3A",
        850: "#2A2A2A",
        900: "#2C2C2C",
        950: "#222222",
      },
      marginalBlack: "#1A1A1A",
      success: {
        300: "#DFF8E8",
        500: "#3FC66E",
        800: "#1E3426",
      },
      warning: {
        300: "#F9ECCA",
        500: "#FFC121",
        800: "#3F361F",
      },
      error: {
        300: "#F3B9B9",
        500: "#DA3434",
        800: "#392222",
      },
      ...colors,
    },
    extend: {
      animation: {
        "spin-slow": "spin 2s linear infinite",
      },
      letterSpacing: {
        thin: "0.01em",
      },
      fontSize: {
        xxs: "0.60rem",
        "2xs": "10px",
      },
      fontFamily: {
        sans: ["Inter", "helvetica", "optima", "sans-serif"],
        mono: ["PP Fraktion Mono", "monaco", "monospace"],
        monument: ["Monument", "monaco", "sans-serif"],
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        innerBlack: "inset 0 1px 4px 0 rgba(0, 0, 0, 0.25)",
        innerWhite: "inset 0 0 4px 0 rgba(152, 161, 192, 0.5)",
        outerBlack: "0 4px 40px 0 rgba(26, 26, 26, 1)",
        outerBlue: "0 1px 2px 0 rgba(31, 42, 55, 0.4)",
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
        "max-height": "max-height",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("tailwind-scrollbar-hide"),
    require("tailwindcss-border-gradient-radius"),
  ],
}
