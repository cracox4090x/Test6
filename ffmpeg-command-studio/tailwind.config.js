/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-darkest': '#080810',
        'bg-dark': '#0c0c18',
        'bg-medium': '#12122a',
        'bg-light': '#1a1a3e',
        'bg-lighter': '#242455',
        'bg-hover': '#2a2a50',
        'accent': '#00d9ff',
        'accent-light': '#33e1ff',
        'accent-dark': '#00a0c0',
        'accent-bg': 'rgba(0,217,255,0.1)',
        'accent-border': 'rgba(0,217,255,0.3)',
        'text-primary': '#e8e8f0',
        'text-secondary': '#a0a0c0',
        'text-muted': '#606080',
        'success': '#00ff88',
        'success-bg': 'rgba(0,255,136,0.1)',
        'warning': '#ffaa00',
        'warning-bg': 'rgba(255,170,0,0.1)',
        'error': '#ff4466',
        'error-bg': 'rgba(255,68,102,0.1)',
        'info': '#6699ff',
        'info-bg': 'rgba(102,153,255,0.1)',
        'border-default': '#252550',
        'border-hover': '#353570',
        'border-subtle': '#1a1a35',
      },
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Arial', 'sans-serif'],
        mono: ['Consolas', 'Monaco', 'Courier New', 'monospace'],
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '400ms',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0,217,255,0.2)',
      },
    },
  },
  plugins: [],
}
