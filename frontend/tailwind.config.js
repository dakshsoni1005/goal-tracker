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
          DEFAULT: '#B2A999', // Muted Sand accent (10%)
          dark: '#9E9585',
          light: '#D8CCBB',
        },
        secondary: {
          DEFAULT: '#D8CCBB', // Soft Beige
          dark: '#C4B7A6',
          light: '#F3EEE6',
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
          light: '#F3EEE6', // Dominant background (60%) - Warm Ivory
          dark: '#F3EEE6',  // Forced same as light
        },
        cardBg: {
          light: '#FFFFFF', // Secondary structures (30%)
          dark: '#FFFFFF',  // Forced same as light
        },
        borderCol: {
          light: '#D8CCBB',
          dark: '#D8CCBB',
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
