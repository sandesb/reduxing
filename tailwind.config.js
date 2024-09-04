module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'], // Add the "Outfit" font here
      },
      colors: {
        'primary-bg': '#d8e4fc',
        'sidebar-bg': '#edf2f7',
        'sidebar-active': '#f0f4fc',
        'secondary': '#d8e4fc'
      },
    },
  },
  plugins: [],
}
