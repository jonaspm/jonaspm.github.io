/** @type {import('tailwindcss').Config} */
// const colors = require("tailwindcss/colors")
const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    colors: {
      primary: "rgba(42, 0, 61, 1)",
      secondary: "rgba(255, 255, 255, 1)",
    },
    screens: {
      xs: '475px',
      ...defaultTheme.screens,
    },
    extend: {
      animation: {
        typewriter: "typewriter 8s steps(23) -6s infinite alternate both, blinkTextCursor 800ms infinite normal",
        "fade-in":
          "fadeIn 800ms calc(var(--delay-index) * 0.5s) ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: 0,
            transform: "translateY(-30px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0px)",
          },
        },
        typewriter: {
          "0%": { width: "0%" },
          "37.5%": { width: "0%" },
          "62.5%": { width: "100%" },
          "100%": { width: "100%" },
        },
        blinkTextCursor: {
          from: {
            borderRightColor: "rgba(42, 0, 61, 1)",
          },
          to: {
            borderRightColor: "transparent",
          },
        },
      },
    },
  },
  plugins: [],
};
