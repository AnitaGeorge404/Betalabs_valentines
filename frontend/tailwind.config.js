/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'parchment': '#E2D5CA',
        'parchment-light': '#EDE5DC',
        'parchment-dark': '#D4C4B5',
        'wine': '#8D1038',
        'wine-light': '#B0124A',
        'crimson': '#D2184F',
        'crimson-light': '#E33B6C',
        'blush': '#F4B8CB',
        'blush-light': '#F9D9E5',
        'charcoal': '#2D2D2D',
        'charcoal-light': '#4A4A4A',
        'ink': '#3B2F2F',
        'rose-gold': '#CD738D',
        'cream': '#F5EDE6',
        // Legacy aliases
        'deep-crimson': '#620725',
        'soft-red': '#910D28',
        'light-pink': '#E2D5CA',
        'pink-shadow': '#B76E79',
      },
      fontFamily: {
        'script': ['"Dancing Script"', 'cursive'],
        'serif': ['"Playfair Display"', 'Georgia', 'serif'],
        'sans': ['"Montserrat"', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 2s',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(3deg)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'editorial': '0 4px 24px rgba(98, 7, 37, 0.08)',
        'editorial-lg': '0 8px 40px rgba(98, 7, 37, 0.12)',
        'editorial-hover': '0 12px 48px rgba(98, 7, 37, 0.16)',
        'card': '0 2px 12px rgba(98, 7, 37, 0.06)',
        'card-hover': '0 8px 32px rgba(98, 7, 37, 0.12)',
        'glass': '0 8px 32px rgba(98, 7, 37, 0.08), inset 0 0 0 1px rgba(255,255,255,0.1)',
        'elegant': '0 10px 40px rgba(98, 7, 37, 0.1)',
        'pink': '0 20px 50px rgba(98, 7, 37, 0.08)',
      },
      borderRadius: {
        'organic': '1.25rem',
        'organic-lg': '1.75rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
