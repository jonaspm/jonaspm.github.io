/** @type {import('tailwindcss').Config} */
// const colors = require("tailwindcss/colors")
import defaultTheme from "tailwindcss/defaultTheme"

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    colors: defaultTheme.colors,
    screens: {
      xs: '475px',
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        grayblue: {
          // Generate a color palette with gray and blue colors
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        gray: { 
          100: '#f3f4f6', // Lightest text color
          200: '#e5e7eb', // Lighter text color
          300: '#d1d5db', // Light text color
          400: '#9ca3af', // Muted text color
          800: '#1e1e1e', // Slightly lighter background for cards
          900: '#121212', // Dark background
        },
        emerald: {
          300: '#6ee7b7', // Lighter accent color
          400: '#34d399', // Main accent color
        },
        blue: {
          300: '#60a5fa', // Lighter primary color
          400: '#3b82f6', // Primary color
          500: '#2563eb', // Darker primary color
        },
        red: {
          200: '#fbbf24', // Warning color
          300: '#f87171', // Lighter error color
          400: '#ef4444', // Error color
          500: '#dc2626', // Darker error color
        },
        gold: {
          400: '#f59e0b', // Main accent color
          300: '#f9c74f', // Lighter accent color
          200: '#f9fafb', // Lightest accent color
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        typewriter: "typewriter 8s steps(23) -6s infinite alternate both, blinkTextCursor 800ms infinite normal",
        "fade-in":
          "fadeIn 800ms calc(var(--delay-index) * 0.5s) ease-out forwards",
        'bounce-slow': 'bounce 3s infinite',
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
