/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FFD700',
        'primary-hover': '#E6C200',
        background: '#000000',
        'card-bg': '#121212',
        text: '#FFFFFF',
        'text-secondary': '#B0B0B0',
        inactive: '#555555',
        success: '#4CAF50',
        error: '#F44336',
        warning: '#FF9800',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'heading': ['64px', { lineHeight: '1.1', fontWeight: '700' }],
        'subheading': ['20px', { lineHeight: '1.4', fontWeight: '400' }],
        'menu': ['16px', { lineHeight: '1.5', fontWeight: '500' }],
      },
      boxShadow: {
        'DEFAULT': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'lg': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'xl': '0 12px 32px rgba(0, 0, 0, 0.14)',
      },
    },
  },
  plugins: [],
};