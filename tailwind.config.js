module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'light-primary': '#EADCF5',
        'light-secondary': '#E3C3FC'
      }
    },
    fontFamily: {
      sans: "'Poppins', sans-serif",
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar-hide')
  ],
}
