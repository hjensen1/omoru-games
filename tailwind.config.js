const colors = require("tailwindcss/colors")

module.exports = {
  content: ["./index.html", "./src/**/*.jsx"],
  theme: {
    fontFamily: {
      sans: ["IBM Plex Sans", "sans-serif"],
      mono: ["IBM Plex Mono", "monospace"],
      emoji: [
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "NotoColorEmoji",
        "Noto Color Emoji",
        "Segoe UI Symbol",
        "Android Emoji",
        "EmojiSymbols",
      ],
    },
    fontSize: {
      8: ["8px", { letterSpacing: "0.02em", lineHeight: "16px" }],
      10: ["10px", { letterSpacing: "0.02em", lineHeight: "16px" }],
      12: ["12px", { letterSpacing: "0.01em", lineHeight: "16px" }],
      14: ["14px", { letterSpacing: "0.01em", lineHeight: "20px" }],
      16: ["16px", { letterSpacing: "0em", lineHeight: "24px" }],
      20: ["20px", { letterSpacing: "-0.02em", lineHeight: "32px" }],
      24: ["24px", { letterSpacing: "-0.024em", lineHeight: "32px" }],
      32: ["32px", { letterSpacing: "-0.032em", lineHeight: "40px" }],
      40: ["40px", { letterSpacing: "-0.04em", lineHeight: "56px" }],
      48: ["48px", { letterSpacing: "-0.04em", lineHeight: "64px" }],
      56: ["56px", { letterSpacing: "-0.04em", lineHeight: "64px" }],
      64: ["64px", { letterSpacing: "-0.04em", lineHeight: "80px" }],
      72: ["72px", { letterSpacing: "-0.04em", lineHeight: "80px" }],
      80: ["80px", { letterSpacing: "-0.04em", lineHeight: "80px" }],
      96: ["96px", { letterSpacing: "-0.04em", lineHeight: "96px" }],
    },
    extend: {
      colors: {
        gray: colors.neutral,
        darkBlue: {
          100: "#203880",
          200: "#203776",
          300: "#21346B",
          400: "#213162",
          500: "#233059",
          600: "#242E4E",
          700: "#1D2B52",
          800: "#18213A",
          900: "#262831",
        },
        "gray-750": "#303030",
      },
    },
  },
  plugins: [],
}
