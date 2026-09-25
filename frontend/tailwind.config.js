/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy-bg': '#0b1121',
        'navy-panel': '#131c31',
        'navy-panel-hover': '#1e293b',
        'navy-border': '#1e293b',
        'status-green': '#10b981',
        'status-amber': '#f59e0b',
        'status-red': '#ef4444',
        'status-grey': '#64748b',
        'text-primary': '#f8fafc',
        'text-secondary': '#94a3b8',
        'text-muted': '#64748b'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flash': 'flash 1s ease-out 1',
      },
      keyframes: {
        flash: {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
        }
      }
    },
  },
  plugins: [],
}
