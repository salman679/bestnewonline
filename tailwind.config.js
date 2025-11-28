/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        bangla: ["Hind Siliguri", "sans-serif"],
        sans: [
          "Montserrat",
          "Hind Siliguri",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      colors: {
        primary: {
          DEFAULT: "#016737",
          hover: "#034425",
        },
      },
    },
  },
  plugins: [],
};
