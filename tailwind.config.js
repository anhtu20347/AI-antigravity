/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ink: "#2D2A4A",
        lav: "#D9C9FF",
        mint: "#BFF1DC",
        peach: "#FFD2D0",
        butter: "#FFF1B8",
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      boxShadow: {
        retro: "0 4px 0 #2D2A4A",
        "retro-lg": "0 6px 0 #2D2A4A",
      }
    },
  },
  plugins: [],
};
