/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#1a56db",
        secondary: "#1e429f",
        accent: "#d4e3ff",
        background: "#f3f4f6",
      },
    },
  },
  plugins: [],
};
