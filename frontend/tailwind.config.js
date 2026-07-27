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
          DEFAULT: '#F7CBCA', // Pink accent (10%)
          dark: '#E3B4B3',
          light: '#FCE8E7',
        },
        secondary: {
          DEFAULT: '#B3D3D3', // Sage accent
          dark: '#8FBFBF',
          light: '#D5EBEB',
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
          light: '#F1F7F7', // Dominant background (60%)
          dark: '#1A2323',
        },
        cardBg: {
          light: '#FFFFFF', // Secondary structures (30%)
          dark: '#242E2E',
        },
        borderCol: {
          light: '#D5E5E5',
          dark: '#2E3B3B',
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
