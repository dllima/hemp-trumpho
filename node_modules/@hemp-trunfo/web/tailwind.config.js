/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        hemp: {
          50: '#f3f8ec',
          100: '#e3efd2',
          200: '#c9e0a9',
          300: '#a6cb75',
          400: '#86b34c',
          500: '#69962f',
          600: '#517722',
          700: '#3f5c1d',
          800: '#34491c',
          900: '#2c3e1b',
          950: '#15220a',
        },
      },
      fontFamily: {
        display: ['"Bungee"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
