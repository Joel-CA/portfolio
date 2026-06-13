/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f3fc',
          100: '#f1e7f9',
          200: '#e5d5f5',
          300: '#d4bbf0',
          400: '#bc95e8',
          500: '#a06fe2',
          600: '#8550d4',
          700: '#6f42c1',
          800: '#5d3ba8',
          900: '#4d328f',
        },
        accent: {
          red: '#ef3724',
          blue: '#2960f7',
          green: '#8cc63f',
          orange: '#fd7e14',
        }
      },
      fontFamily: {
        sans: ['Quicksand', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-in': 'slideIn 0.6s ease-in-out',
        'zoom-in': 'zoomIn 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        zoomIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
