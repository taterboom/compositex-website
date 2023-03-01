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
          "0%": {
            "stroke-dashoffset": 0,
          },
          "100%": {
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
    themes: [
      {
        dark: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
          "base-100": "#0e0e0e",
          "base-200": "#161616",
          "base-300": "#212121",
          "base-content": "#fff",
          "--btn-text-case": "captialize",
        },
      },
    ],
  },
}
