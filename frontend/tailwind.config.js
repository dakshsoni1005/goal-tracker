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
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
          light: '#60A5FA',
        },
        secondary: {
          DEFAULT: '#6366F1',
          dark: '#4F46E5',
          light: '#818CF8',
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
          light: '#F8FAFC',
          dark: '#0F172A',
        },
        cardBg: {
          light: '#FFFFFF',
          dark: '#1E293B',
        },
        borderCol: {
          light: '#E2E8F0',
          dark: '#334155',
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
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
