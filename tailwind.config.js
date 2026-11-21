/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'rc-sand': '#F9F5EF',
        'rc-sand-warm': '#EBE3D7',
        'rc-sand-light': '#FDFBF7',
        'rc-terracotta': '#A5553F',
        'rc-terracotta-dark': '#8C4532',
        'rc-terracotta-muted': '#C47D68',
        'rc-forest': '#304F43',
        'rc-forest-dark': '#1E2B25',
        'rc-muted': '#5A655F',
        'rc-dusty': '#C5B5A3',
        'rc-dusty-dark': '#8E7B68',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: [
          '"Plus Jakarta Sans"',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      borderRadius: {
        arch: '50% 50% 0 0 / 12% 12% 0 0',
        'arch-lg': '50% 50% 0 0 / 18% 18% 0 0',
      },
    },
  },
  plugins: [],
};
