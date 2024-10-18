/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        azulclaro: '#3259B5',
        azuloscuro: '#222A59',
        amarillo: '#C3C840',
        morado: '#C0217E',
      },
      fontFamily:{
        'neue': ['NEUE', 'light']
      }
    },
  },
  plugins: [],
}