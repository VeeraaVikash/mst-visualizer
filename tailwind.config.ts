/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: 'var(--bg-base)',
        panel: 'var(--bg-panel)',
        canvas: 'var(--bg-canvas)',
        elevated: 'var(--bg-elevated)',
        'theme-border': 'var(--border)',
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
        active: 'var(--accent-active)',
        accept: 'var(--accent-accept)',
        reject: 'var(--accent-reject)',
        candidate: 'var(--accent-candidate)',
        'accent-default': 'var(--accent-default)',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
