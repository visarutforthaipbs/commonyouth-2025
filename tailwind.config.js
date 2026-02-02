/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./index.tsx"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Core Palette
          linen: '#FAF6E2',       // Background (was cream)
          obsidian: '#161716',    // Primary Text (was darkGreen)
          orange: '#EC6839',      // Burnt Orange - Accent (was salmon)
          bud: '#B5D340',         // Bud Green - Primary Brand (was green)
          amber: '#C06F2D',       // Amber Brown - Secondary
          // Topic Colors (Secondary Palette)
          forest: '#137B48',      // Nature/Environment
          ocean: '#172F56',       // Policy/Governance
          raspberry: '#E25072',   // Health/Wellbeing
          orchid: '#D15ECB',      // Arts/Culture
          morning: '#F1F98A',     // Light accent
          mist: '#CBEAF1',        // Light blue accent
          // Utility
          earth: '#6B6B6B',       // Secondary text
          gray: '#E5E5E5',        // Borders
        }
      },
      fontFamily: {
        sans: ['Anuphan', 'sans-serif'],
        mono: ['PT Mono', 'monospace'],
      },
      fontSize: {
        // Design System Typography Hierarchy
        // Main Heading base: text-4xl (36px)
        // Subheader: 65% of heading = 23.4px
        'subheader': ['1.463rem', { lineHeight: '1.4', fontWeight: '600' }], // 23.4px - Anuphan Semibold
        // Body: 42% of heading = 15.12px
        'body-ds': ['0.945rem', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '400' }], // ~15px - Anuphan Regular
        // Caption: 78.85% of body = 11.92px
        'caption-ds': ['0.745rem', { lineHeight: '1.3', fontWeight: '300' }], // ~12px - Anuphan Light
      },
      boxShadow: {
        'retro': '4px 4px 0px 0px rgba(22, 23, 22, 0.15)',
        'retro-sm': '2px 2px 0px 0px rgba(22, 23, 22, 0.15)',
      }
    }
  },
  plugins: [],
}
