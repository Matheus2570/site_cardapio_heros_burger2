/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    fontFamily:{
      'sans': ['Roboto', 'sans']
    },
    extend: {
      backgroundImage: {
        "home": "url('/assets/bg.png')"
      },
      keyframes: {
        fundomechendo: {
          '0%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
          '100%': { backgroundPosition: '0% 0%' },
        }
      },
      animation: {
        fundomechendo: 'fundomechendo 100s infinite ease-in-out'
      }
    },
  },
  plugins: [],
}
