module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {

      },
      colors: {
        "builderz-green": "#14f195",
        "builderz-blue": "#00ffd5",
        "brand-main": "#931403",
        "brand-secondary": "#e93d26", 
        "brand-bg": "#141414",
      },
      animation: {

      },
      screens: {

      },
        backgroundImage: {
        'mesh': "radial-gradient(circle at 47.0% 96.0%, #151b40 0%, transparent 50%), radial-gradient(circle at 61.0% 15.0%, #09162b 0%, transparent 50%), radial-gradient(circle at 8.0% 16.0%, #0f1930 0%, transparent 50%), radial-gradient(circle at 85.0% 28.0%, #110c3d 0%, transparent 50%), radial-gradient(circle at 81.0% 66.0%, #060d1f 0%, transparent 50%)",
        'light-mesh': "radial-gradient(circle at 47.0% 96.0%, #a8abbd 0%, transparent 50%), radial-gradient(circle at 61.0% 15.0%, #d5dde8 0%, transparent 50%), radial-gradient(circle at 8.0% 16.0%, #c3ccde 0%, transparent 50%), radial-gradient(circle at 85.0% 28.0%, #b2abeb 0%, transparent 50%), radial-gradient(circle at 81.0% 66.0%, #ccd2e0 0%, transparent 50%)",
        'borderBg': 'radial-gradient(circle at 50% 50%, #EDEBEB 0%, rgba(237, 235, 235, 0) 57.5%)',
      },
      backgroundColor: {
        'mesh': '#0a0924',
        'light-mesh': '#e6e6f0'
      }
    },
  },
  plugins: [
    require("daisyui"), 
    require("@tailwindcss/forms")
  ],
};