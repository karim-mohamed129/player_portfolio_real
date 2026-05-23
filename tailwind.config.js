/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Tahoma", "Arial", "sans-serif"]
      },
      colors: {
        pitch: "#050807",
        pitch2: "#08140f",
        gold: "#f7c948",
        danger: "#d71920",
        grass: "#119b59"
      },
      boxShadow: {
        glass: "0 24px 70px rgba(0,0,0,.34)"
      }
    }
  },
  plugins: [require("@tailwindcss/forms")]
};
