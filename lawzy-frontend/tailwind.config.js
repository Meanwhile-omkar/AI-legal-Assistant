/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite', // slower spin
      },
      colors: {
        lawzy: {
          gold: '#D4AF37',
          dark: '#1a1a1a',
          slate: '#2d2d2d'
        }
      }
    },
  },
  plugins: [],
}