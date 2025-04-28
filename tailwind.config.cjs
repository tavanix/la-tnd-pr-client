/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // corePlugins: { preflight: true },
  // important: '#root',
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: [
      {
        lamodaLight: {
          'base-100': '#FFFFFF',
          primary: '#F93C00',
          secondary: '#484848',
          accent: '#F93C00',

          // function colors
          neutral: '#919191',
          info: '#325FFF',
          success: '#45B738',
          warning: '#EE8100',
          error: '#FF4D3D',

          // colors
          brown: '#A5825F',
          green: '#A5D2A0',

          lightGray: '#EDEDED',
          lightGray1: '#FAFAFA',
          gray: '#C2C2C2',
          darkGray: '#484848',
          deepGray: '808080',

          red: '#F93C00',
          redLight: '#FFF9F9',
          redActive: '#C63304',
          redActive2: '#FF8058',
          redHover: '#E43A04',

          '--rounded-btn': '8px',
          // '--rounded-box': '8px',
          // '--rounded-badge': '8px',
        },
      },
    ],
  },
}
