/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Navy / dark blue accent
        navy: {
          500: '#1f2a44',
          600: '#19233a',
          700: '#131b2c',
          800: '#0d1420',
          900: '#070a10',
        },
      },
      borderRadius: {
        xl: '16px',
      },
    },
  },
  plugins: [],
}


