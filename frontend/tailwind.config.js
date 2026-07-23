/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#DC2626", // Crimson Red
          hover: "#B91C1C",
          glow: "#EF4444",
        },
        gold: {
          DEFAULT: "#F59E0B", // Metallic Gold
          light: "#FBBF24",
          dark: "#D97706",
          glow: "#FDE047",
        },
        darkbg: {
          DEFAULT: "#0F0709", // Deep obsidian dark background
          card: "#180C0F",
          border: "#33161C",
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
}
