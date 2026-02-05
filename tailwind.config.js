/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hot-pink': '#FF4D6D',
        'soft-crimson': '#D00000',
        'blush': '#FFF0F5',
        'rose-pink': '#FFD1DC',
        'soft-pink': '#FFC2D1',
        'rose-gold': '#FFD700',
      },
      fontFamily: {
        'script': ['Great Vibes', 'cursive'],
        'sans': ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 2s',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-fade-in': 'slide-fade-in 0.6s ease-out',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        'slide-fade-in': {
          '0%': { transform: 'translateX(100%) scale(0.95)', opacity: '0' },
          '100%': { transform: 'translateX(0) scale(1)', opacity: '1' },
        },
        'glow-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(255, 77, 109, 0.3), 0 0 40px rgba(255, 193, 209, 0.2)' 
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(255, 77, 109, 0.5), 0 0 60px rgba(255, 193, 209, 0.3)' 
          },
        },
      },
      boxShadow: {
        'rose': '0 10px 30px -10px rgba(255, 77, 109, 0.3)',
        'rose-lg': '0 20px 50px -15px rgba(255, 77, 109, 0.4)',
        'blush': '0 10px 30px -10px rgba(255, 193, 209, 0.4)',
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
