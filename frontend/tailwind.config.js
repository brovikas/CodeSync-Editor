/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0d0f0e",
        panel: "#14171a",
        paper: "#1c211e",
        line: "#2a2f2b",
        ash: "#e8ece6",
        dim: "#8b958c",
        moss: {
          DEFAULT: "#6fae5f",
          dim: "#4d7a42",
        },
        blade: {
          DEFAULT: "#c44545",
          dim: "#8f3434",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        serif: ["Sawarabi Mincho", "serif"],
      },
    },
  },
  plugins: [],
};
