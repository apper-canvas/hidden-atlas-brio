/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D2691E',
        secondary: '#2F4F4F',
        accent: '#FF6B35',
        surface: '#FFF8F0',
        background: '#FAF6F2',
        success: '#228B22',
        warning: '#DAA520',
        error: '#DC143C',
        info: '#4682B4'
      },
      fontFamily: {
        display: ['Righteous', 'cursive'],
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui']
      },
      backgroundImage: {
        'topographic': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%23D2691E' fill-opacity='0.03'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm-30 0c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10z'/%3E%3C/g%3E%3C/svg%3E\")"
      }
    },
  },
  plugins: [],
}