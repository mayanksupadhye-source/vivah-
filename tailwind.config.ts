/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vivah: {
          maroon: {
            50: '#fdf2f4',
            100: '#fbe8ec',
            200: '#f7d2db',
            300: '#f1adbd',
            400: '#e77b96',
            500: '#d94f73',
            600: '#c33156',
            700: '#9f1d3e',
            800: '#841a34',
            900: '#4c0519',
            950: '#2b020c',
          },
          gold: {
            50: '#fbf8eb',
            100: '#f6efcc',
            200: '#eedf99',
            300: '#e3c75f',
            400: '#d9b031',
            500: '#c2961d',
            600: '#a37415',
            700: '#7e5314',
            800: '#694317',
            900: '#5a3819',
            950: '#341d0a',
          },
          ivory: '#FFFDF9',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
      },
      boxShadow: {
        'wedding': '0 10px 25px -5px rgba(136, 19, 55, 0.1), 0 8px 10px -6px rgba(217, 119, 6, 0.08)',
        'gold-glow': '0 0 20px -3px rgba(217, 119, 6, 0.35)',
      },
    },
  },
  plugins: [],
};
