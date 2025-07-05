/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#71C7E0',  // Color institucional
      },
      cyan: {
        300: '#67e8f9',
        500: '#06b6d4',
      },
    },
  },
  plugins: [],
}
