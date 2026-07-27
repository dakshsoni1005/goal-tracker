/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4D403A', // Cacao accent (10%)
          dark: '#3B312C',
          light: '#A3968D',
        },
        secondary: {
          DEFAULT: '#A3968D', // Taupe
          dark: '#8E8178',
          light: '#DFDACF',
        },
        success: {
          DEFAULT: '#10B981',
          dark: '#059669',
          light: '#34D399',
        },
        warning: {
          DEFAULT: '#F59E0B',
          dark: '#D97706',
          light: '#FBBF24',
        },
        danger: {
          DEFAULT: '#EF4444',
          dark: '#DC2626',
          light: '#F87171',
        },
        slateBg: {
          light: '#FAF8F5', // Dominant background (60%) - Pearl
          dark: '#FAF8F5',  // Forced same as light
        },
        cardBg: {
          light: '#FFFFFF', // Secondary structures (30%) - White
          dark: '#FFFFFF',  // Forced same as light
        },
        borderCol: {
          light: '#DFDACF', // Khaki borders
          dark: '#DFDACF',
        }
      },
      borderRadius: {
        '2xl': '16px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(17, 24, 39, 0.05), 0 2px 6px -1px rgba(17, 24, 39, 0.03)',
        'soft-dark': '0 4px 20px -2px rgba(17, 24, 39, 0.05), 0 2px 6px -1px rgba(17, 24, 39, 0.03)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
