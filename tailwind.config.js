/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        flow: {
          "0%, 100%": {
            "stroke-dashoffset": 0,
          },
          "50%": {
            "stroke-dashoffset": 5000,
          },
        },
      },
      animation: {
        flow: "flow 300s infinite linear ",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["dark"],
  },
}
