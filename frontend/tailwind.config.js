module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{html,js,ts}" // Ensure it includes TypeScript files for Angular
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#6359E9', // Light shade
          DEFAULT: '#1D1D41', // Main primary color (blue-500)
          dark: '#1e3a8a' // Dark shade
        }
      }
    },
  },
  plugins: [],
}
