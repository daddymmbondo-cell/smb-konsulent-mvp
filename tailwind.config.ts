import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Designretning: mørk blå = tillit, grønn = vekst/lønnsomhet
        brand: {
          dark: "#0F2A43",
          DEFAULT: "#16406B",
          light: "#3E7CB1",
        },
        growth: {
          DEFAULT: "#1E8A5F",
          light: "#3FBE8B",
        },
        surface: "#F7F9FB",
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
