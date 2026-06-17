import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary:   '#7C3AED',
        secondary: '#06B6D4',
        success:   '#10B981',
        danger:    '#EF4444',
        dark:      '#0A0A0A',
        surface:   '#111827',
        border:    '#1F2937',
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
        }
      },
      animation: {
        aurora:     'aurora 12s ease-in-out infinite alternate',
        shimmer:    'shimmer 2.5s infinite',
        fadeIn:     'fadeIn 0.3s ease-out',
        slideUp:    'slideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
