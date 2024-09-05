module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lato: ['Lato', 'sans-serif'],

      },
      colors: {
        'primary-bg': '#d8e4fc',  // Your primary background color
        'sidebar-bg': '#edf2f7',
        'sidebar-active': '#f0f4fc',
        'secondary': '#d8e4fc',
      },
      boxShadow: {
        'primary': '0 4px 8px 0 rgba(216, 228, 252, 0.5)',  // Custom shadow using primary-bg color with transparency
      },
    },
  },
  plugins: [],
}
