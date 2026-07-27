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
          DEFAULT: '#A48D78', // Desert Rock accent (10%)
          dark: '#8B7662',
          light: '#CBB9A4',
        },
        secondary: {
          DEFAULT: '#CBB9A4', // Soft Sandstone
          dark: '#B4A08A',
          light: '#E6DAC8',
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
          light: '#F4F1EA', // Dominant background (60%)
          dark: '#201C18',
        },
        cardBg: {
          light: '#FAF9F6', // Secondary structures (30%)
          dark: '#2B2621',
        },
        borderCol: {
          light: '#E6DAC8',
          dark: '#3A342E',
        }
      },
      borderRadius: {
        '2xl': '16px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(17, 24, 39, 0.05), 0 2px 6px -1px rgba(17, 24, 39, 0.03)',
        'soft-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.2), 0 2px 6px -1px rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
