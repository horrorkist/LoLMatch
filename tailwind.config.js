/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      transitionDelay: {
        0: "0ms",
      },
      transitionDuration: {
        0: "0ms",
      },
      divideWidth: {
        1: "1px",
      },
    },
  },
  plugins: [],
};
