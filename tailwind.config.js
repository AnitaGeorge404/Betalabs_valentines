/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'soft-rose': '#FFB7C5',
        'blush-pink': '#FFD1DC',
        'deep-crimson': '#D00000',
        'creamy-white': '#FFF0F5',
        'lavender-mist': '#F3E5F5',
      },
      fontFamily: {
        'script': ['Dancing Script', 'Great Vibes', 'cursive'],
        'sans': ['Nunito', 'Poppins', 'Quicksand', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 2s',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bubble': 'bubble 4s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'gentle-pulse': 'gentle-pulse 3s ease-in-out infinite',
        'squish': 'squish 0.3s ease-out',
        'page-turn': 'page-turn 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        bubble: {
          '0%, 100%': { transform: 'translateY(0) scale(1)', opacity: '0.8' },
          '50%': { transform: 'translateY(-10px) scale(1.05)', opacity: '1' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
          '50%': { opacity: '0.3', transform: 'scale(1.2) rotate(180deg)' },
        },
        'gentle-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 183, 197, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 183, 197, 0.8)' },
        },
        squish: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        'page-turn': {
          '0%': { transform: 'rotateY(-15deg)', opacity: '0' },
          '100%': { transform: 'rotateY(0)', opacity: '1' },
        },
      },
      backgroundSize: {
        '200': '200% 200%',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
