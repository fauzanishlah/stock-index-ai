import type { Config } from 'tailwindcss';

const config: Config = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'flow': 'gradient-flow 3s ease-in-out infinite',
        // 'gradient-shift': 'gradient-shift 3s ease infinite',
        'spin-slow': 'spin 3s linear infinite'
      },
      keyframes: {
        'gradient-flow': {
          '0%': { 'background-position': '0% 50%' },
          '100%': { 'background-position': '200% 50%' },
        },
        'gradient-shift': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
      }
    },
  },
  plugins: [],
};

export default config;

