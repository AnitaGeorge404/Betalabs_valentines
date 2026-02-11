/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-crimson': '#800000',
        'soft-red': '#DC143C',
        'light-pink': '#FFF5F7',
        'pink-shadow': '#FFB6C1',
        'charcoal': '#2D2D2D',
        'rose-gold': '#B76E79',
        'neo-white': '#ffffff',
        'neo-shadow-dark': 'rgba(163, 177, 198, 0.6)',
        'neo-shadow-light': 'rgba(255, 255, 255, 0.9)',
      },
      fontFamily: {
        'script': ['Dancing Script', 'cursive'],
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
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
        'pink': '0 20px 50px rgba(255, 182, 193, 0.3)',
        'pink-lg': '0 25px 60px rgba(255, 182, 193, 0.4)',
        'elegant': '0 10px 40px rgba(183, 110, 121, 0.15)',
        'neo-flat': '5px 5px 10px rgba(163, 177, 198, 0.6), -5px -5px 10px rgba(255, 255, 255, 0.9)',
        'neo-pressed': 'inset 2px 2px 5px rgba(163, 177, 198, 0.6), inset -2px -2px 5px rgba(255, 255, 255, 0.9)',
        'neo-btn': '5px 5px 10px rgba(163, 177, 198, 0.6), -5px -5px 10px rgba(255, 255, 255, 0.9)',
        'neo-btn-hover': '6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9)',
        'neo-red': '5px 5px 10px rgba(220, 20, 60, 0.4), -3px -3px 6px rgba(255, 107, 129, 0.8)',
        'neo-red-hover': '6px 6px 12px rgba(220, 20, 60, 0.5), -4px -4px 8px rgba(255, 107, 129, 0.9)',
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
