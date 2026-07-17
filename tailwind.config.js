/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'rc-dusty': '#C4A09A',
        'rc-dusty-light': '#D9C4BF',
        'rc-dusty-dark': '#A8857E',
        'rc-terracotta': '#9C5B4E',
        'rc-terracotta-dark': '#7A4539',
        'rc-terracotta-muted': '#A67B6B',
        'rc-sand': '#F5F0EB',
        'rc-sand-warm': '#EDE6DC',
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: [
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      borderRadius: {
        arch: '50% 50% 0 0 / 12% 12% 0 0',
        'arch-lg': '50% 50% 0 0 / 18% 18% 0 0',
      },
      animation: {
        'scroll-cards': 'scrollCards 18s linear infinite',
      },
      keyframes: {
        scrollCards: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
