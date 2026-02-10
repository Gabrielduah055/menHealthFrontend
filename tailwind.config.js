/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7F56D9', // Vibrant Purple (Design match)
          dark: '#6941C6',    // Darker Purple for hover
          light: '#F4EBFF',   // Very light purple for backgrounds
        },
        secondary: '#64748B', // Slate 500
        accent: '#F59E0B',    // Amber 500
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
