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
          morning: '#F1F98A',     // Light accent (was yellow)
          mist: '#CBEAF1',        // Light blue accent
          // Utility
          earth: '#6B6B6B',       // Secondary text
          gray: '#E5E5E5',        // Borders
          // Legacy aliases for compatibility
          cream: '#FAF6E2',
          green: '#B5D340',
          darkGreen: '#161716',
          salmon: '#EC6839',
          yellow: '#F1F98A',
          blue: '#172F56'
        }
      },
      fontFamily: {
        sans: ['Anuphan', 'sans-serif'],
        mono: ['PT Mono', 'monospace'],
      },
      boxShadow: {
        'retro': '4px 4px 0px 0px rgba(22, 23, 22, 0.15)',
        'retro-sm': '2px 2px 0px 0px rgba(22, 23, 22, 0.15)',
      }
    }
  },
  plugins: [],
}
