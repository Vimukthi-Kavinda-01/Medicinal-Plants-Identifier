/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Natural herbal green palette (no neon)
        herb: {
          50: '#f2fbf6',
          100: '#e0f5ea',
          200: '#b5e8cc',
          300: '#6fcf97',
          400: '#3fa66a',
          500: '#2b8a52',
          600: '#207041',
          700: '#1a5c35',
          800: '#144729',
          900: '#0e311c',
        },
        // Muted clinical blue accent (no neon)
        accent: {
          50: '#f0f6fc',
          100: '#e1ecf8',
          200: '#c3dbf2',
          300: '#94c0ea',
          400: '#5e9fde',
          500: '#387ec7',
          600: '#2664aa',
          700: '#204f89',
          800: '#1d4371',
          900: '#1c395e',
        },
      },
      fontFamily: {
        sans: [
          'DM Sans',
          'sans-serif',
        ],
      },
      boxShadow: {
        soft: '0 2px 10px rgba(0, 0, 0, 0.05)',
        card: '0 4px 20px rgba(14, 49, 28, 0.08)',
        float: '0 8px 30px rgba(14, 49, 28, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

