// tailwind.config.js
export default {
  darkMode: 'class', // enables class-based dark mode
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lightBlueStart: '#c2e9fb',
        lightBlueEnd: '#a1c4fd',
        darkPurpleStart: '#1f1c2c',
        darkPurpleEnd: '#928dab',
      },
      backgroundImage: {
        'light-gradient': 'linear-gradient(to right, #c2e9fb, #a1c4fd)',
        'dark-gradient': 'linear-gradient(to right, #1f1c2c, #928dab)',
      },
    },
  },
  plugins: [],
}

