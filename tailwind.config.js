module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'progress-bar': 'progress-bar 1.5s ease-in-out infinite',
      },
      keyframes: {
        'progress-bar': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(300%)' },
        }
      },
      container: {
        center: true,
        // padding: '2rem'
      },
      screens: {
        'xs': '400px',
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
