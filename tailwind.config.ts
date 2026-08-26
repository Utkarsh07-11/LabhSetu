import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./types/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: "#FFF8ED",
          100: "#FFEFD0",
          400: "#F59E0B",
          600: "#D97706",
          900: "#78350F"
        },
        india: {
          green: "#138808",
          navy: "#1E3A5F"
        },
        stone: {
          50: "#FAFAF9",
          100: "#F5F5F4",
          900: "#1C1917"
        }
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      boxShadow: {
        soft: "0 12px 40px rgba(28, 25, 23, 0.08)"
      },
      backgroundImage: {
        "radial-glow":
          "radial-gradient(circle at top left, rgba(245, 158, 11, 0.24), transparent 32%), radial-gradient(circle at bottom right, rgba(19, 136, 8, 0.14), transparent 28%)"
      }
    }
  },
  plugins: []
};

export default config;
