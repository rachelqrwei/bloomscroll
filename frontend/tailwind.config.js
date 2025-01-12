/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'roboto-mono': ['RobotoMono-Regular', 'monospace'],
        'roboto-mono-bold': ['RobotoMono-SemiBold', 'monospace'],
        'aeonik-trial-bold': ['AeonikTRIAL-Bold', 'sans-serif'],
    },
  },
  plugins: [],
  
}
}