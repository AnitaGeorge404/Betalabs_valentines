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
        'deep-crimson': '#8B0000',
        'creamy-white': '#FFF8F0',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'sparkle': 'sparkle 1s ease-in-out',
        'crack': 'crack 0.5s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        sparkle: {
          '0%': { opacity: '0', transform: 'scale(0)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
          '100%': { opacity: '0', transform: 'scale(0)' },
        },
        crack: {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '25%': { transform: 'scale(1.1) rotate(-5deg)' },
          '50%': { transform: 'scale(0.9) rotate(5deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '0.3' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
