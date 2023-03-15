

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '1/9': '11.11%'
      },
      maxWidth: {
        'ch-5': '5ch',
        'ch-1': '1ch',
        'ch-11': '11ch',
        '250px': '250px',
        '150px': '150px',
    },
    },
  },
  plugins: [],

}