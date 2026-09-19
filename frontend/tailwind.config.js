/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1C2230",
          light: "#2A3242",
        },
        paper: "#F6F5F1",
        line: "#E1DFD8",
        brand: {
          DEFAULT: "#2E6E62",
          dark: "#255A50",
          light: "#E8F0EE",
        },
        status: {
          open: "#B4801E",
          openBg: "#FBF2DE",
          progress: "#3B6FA0",
          progressBg: "#E7F0F8",
          closed: "#4B8264",
          closedBg: "#E9F3EC",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        sans: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      backgroundImage: {
        perforation:
          "repeating-linear-gradient(to bottom, #E1DFD8 0, #E1DFD8 6px, transparent 6px, transparent 14px)",
      },
    },
  },
  plugins: [],
};
