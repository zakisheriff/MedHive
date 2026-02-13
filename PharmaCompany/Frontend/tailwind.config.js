/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#dca349',
          50: '#fef8ed',
          100: '#fcefd4',
          200: '#f8dca8',
          300: '#f4c571',
          400: '#efa951',
          500: '#dca349',
          600: '#b8873d',
          700: '#956d31',
          800: '#7a592d',
          900: '#674b27',
        },
        risk: {
          low: 'rgba(0, 0, 0, 0.06)',
          moderate: 'rgba(220, 163, 73, 0.15)',
          high: 'rgba(220, 163, 73, 0.25)',
          critical: 'rgba(184, 87, 61, 0.2)',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"Roboto"', '"Oxygen"', '"Ubuntu"', '"Cantarell"', 'sans-serif'],
      },
      borderRadius: {
        'sm': '12px',
        'md': '16px',
        'lg': '35px',
        'full': '50px',
      }
    },
  },
  plugins: [],
}
