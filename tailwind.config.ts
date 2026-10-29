import { defineConfig } from 'vite';
import defaultTheme from 'tailwindcss/defaultTheme';

export default defineConfig({
  darkMode: 'class', // toggle with a button that adds/removes 'dark' class on <html>
  content: ['./index.html', './src/**/*.{tsx,ts,jsx,js}'],
  theme: {
    extend: {
      colors: {
        primary: '#39FF14',
        secondary: '#2E7D32',
        accent: '#66BB6A',
      },
      fontFamily: {
        kufam: ['Kufam', 'sans-serif'],
        changa: ['Changa', 'sans-serif'],
        ...defaultTheme.fontFamily,
      },
    },
  },
  plugins: [],
});
