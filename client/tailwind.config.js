/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0B0F19',
          card: '#0F1524',
          border: '#111827',
          text: '#E5E7EB',
        },
        emergency: {
          green: '#10B981',
          yellow: '#FBBF24',
          orange: '#F97316',
          red: '#EF4444',
          cyan: '#06B6D4',
        }
      },
      fontFamily: {
        mono: ['Courier New', 'monospace'],
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        glow: 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { textShadow: '0 0 20px rgba(16, 185, 129, 0.5)' },
          '50%': { textShadow: '0 0 40px rgba(16, 185, 129, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
