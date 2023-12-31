/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      scale: {
        600: '6',
        700: '7',
        800: '8',
        1000: '10',
        2000: '20',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
