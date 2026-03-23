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
        brand: {
          base: 'var(--brand-base)',    
          card: 'var(--brand-card)',    
          accent: 'var(--brand-accent)',  
          accentHover: 'var(--brand-accent-hover)',
          text: 'var(--brand-text)',
          muted: 'var(--brand-muted)'
        }
      },
      fontFamily: {
        sans: ['Rajdhani', 'sans-serif'],
      }
    }
  },
  plugins: [],
}