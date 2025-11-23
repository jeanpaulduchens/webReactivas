/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1e3a8a",
        "primary-600": "#1f4aa6",
        muted: "#6b7280",
        bg: "#f5f6fa",
      },
      borderRadius: {
        card: "14px",
      },
      boxShadow: {
        card: "0 6px 18px rgba(16,24,40,.08)",
      },
    },
  },
  plugins: [],
};
