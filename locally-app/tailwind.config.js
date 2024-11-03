/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          pBlue: "#003566"
        },
        secondary: {
          sBlue: "#39C3F2"
        },
      },
    },
  },
  plugins: [],
}
