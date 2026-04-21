/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0f0f0f',
          card: '#1a1a1a',
          elevated: '#242424',
        },
        yt: {
          red: '#FF0000',
          pink: '#FF4B6E',
          orange: '#FF8A3D',
        },
      },
      boxShadow: {
        glow: '0 0 24px rgba(255, 0, 0, 0.15)',
        'glow-lg': '0 0 48px rgba(255, 0, 0, 0.25)',
      },
      backgroundImage: {
        'grad-yt': 'linear-gradient(135deg, #FF0000 0%, #FF4B6E 50%, #FF8A3D 100%)',
        'grad-dark': 'linear-gradient(180deg, #0f0f0f 0%, #1a0a0a 100%)',
      },
    },
  },
  plugins: [],
}
