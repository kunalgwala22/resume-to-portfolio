import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary:   'rgb(var(--color-primary))',
        secondary: 'rgb(var(--color-secondary))',
        success:   'rgb(var(--color-success))',
        danger:    'rgb(var(--color-danger))',
        dark:      'rgb(var(--color-bg))',
        surface:   'rgb(var(--color-surface))',
        border:    'rgb(var(--color-border))',
        gray: {
          50:  'rgb(var(--gray-50))',
          100: 'rgb(var(--gray-100))',
          200: 'rgb(var(--gray-200))',
          300: 'rgb(var(--gray-300))',
          400: 'rgb(var(--gray-400))',
          500: 'rgb(var(--gray-500))',
          600: 'rgb(var(--gray-600))',
          750: 'rgb(var(--gray-650))',
          700: 'rgb(var(--gray-700))',
          800: 'rgb(var(--gray-800))',
          900: 'rgb(var(--gray-900))',
          950: 'rgb(var(--gray-950))',
        }
      },
      fontFamily: {
        display: ['Clash Display', 'sans-serif'],
        sans:    ['Satoshi', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        aurora: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        slideUp: {
          from: { transform: 'translateY(12px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' }
        },
        spotlight: {
          "0%": {
            opacity: "0",
            transform: "matrix(-0.822377, -0.568943, -0.568943, 0.822377, 3631.88, 2291.09) scale(0.87)",
          },
          "100%": {
            opacity: "1",
            transform: "matrix(-0.822377, -0.568943, -0.568943, 0.822377, 3631.88, 2291.09) scale(1)",
          },
        },
      },
      animation: {
        aurora:     'aurora 12s ease-in-out infinite alternate',
        shimmer:    'shimmer 2.5s infinite',
        fadeIn:     'fadeIn 0.3s ease-out',
        slideUp:    'slideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        spotlight:  'spotlight 2s ease .75s 1 normal forwards',
      },
    },
  },
  plugins: [],
} satisfies Config;
