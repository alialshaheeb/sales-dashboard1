import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#d9e6ff",
          200: "#b7cfff",
          300: "#8bb0ff",
          400: "#5b87ff",
          500: "#3763f5",
          600: "#2748d9",
          700: "#2138ad",
          800: "#1f3189",
          900: "#1e2d6d",
        },
      },
    },
  },
  plugins: [],
};

export default config;
