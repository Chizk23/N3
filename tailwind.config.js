/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', '"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        jp: ['"Zen Kaku Gothic New"', '"Noto Sans JP"', '"Hiragino Sans"', '"Yu Gothic"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        app: {
          DEFAULT: 'var(--color-bg)',
          surface: 'var(--color-surface)',
          border: 'var(--color-border)',
          text: 'var(--color-text)',
          muted: 'var(--color-muted)',
          accent: 'var(--color-accent)',
          'accent-subtle': 'var(--color-accent-subtle)',
          success: 'var(--color-success)',
          error: 'var(--color-error)',
        }
      }
    },
  },
  plugins: [],
}
