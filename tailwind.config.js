/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'rc-dusty': '#936F55',
        'rc-dusty-light': '#B89982',
        'rc-dusty-dark': '#75553F',
        'rc-terracotta': '#E2576A',
        'rc-terracotta-dark': '#C54658',
        'rc-terracotta-muted': '#E67E8C',
        'rc-sand': '#FAE2E5',
        'rc-sand-warm': '#F3CFD3',
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
