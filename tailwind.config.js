module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#d8e4fc',  // Adjust to match the lighter body layout color
        'sidebar-bg': '#edf2f7',  // Adjust for the sidebar and navbar background
        'sidebar-active': '#f0f4fc', // Sidebar active link color
      },
    },
  },
  plugins: [],
}
