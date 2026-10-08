/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0a0d14',
          surface: '#111726',
          panel: '#161f36',
          border: '#202d4a',
          accent: '#06b6d4',
          neonGreen: '#10b981',
          neonRed: '#f43f5e',
          neonAmber: '#f59e0b',
          neonPurple: '#a855f7'
        }
      }
    },
  },
  plugins: [],
}
