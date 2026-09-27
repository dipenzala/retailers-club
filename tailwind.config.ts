import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#0A0A0A",
        muted: "#6B6B6B",
        cream: "#FAFAF9",
        border: "#E7E5E4",
        gold: "#B8894A",
        navy: "#0F172A",
      },
    },
  },
  plugins: [],
};
export default config;
