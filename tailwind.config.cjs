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
          primary: '#f93c00',
          secondary: '#000',
          accent: '#0d9488',
          neutral: '#f5f5f5', // change this
          'base-100': 'white',
          // info: '#0e7490',
          // success: '#a5d2a0',
          // warning: '#ffd7d2',
          // error: '#f93c00',
          info: '#0e7490',
          success: '#15803d',
          warning: '#b91c1c',
          error: '#ff0000',

          dustPink: '#ffd7d2',
          gold: '#a5825f',
          mint: '#a5d2a0',
          dustBlue: '#cde6ff',
          darkBlue: '#3c5064',
          lightGray1: '#fafafa',
          lightGray2: '#ededed',
          gray: '#c2c2c2',
          darkGray: '#969696',
          deepGray: '808080',

          '--rounded-box': '3px',
          '--rounded-btn': '3px',
          '--rounded-badge': '1rem',
        },
      },
      {
        lamodaBlack: {
          ...require('daisyui/src/theming/themes')['black'],
          primary: '#f93c00',
          secondary: '#000',
          'base-100': '#1c1917',
          info: '#0e7490',
          success: '#15803d',
          warning: '#b91c1c',
          error: '#ff0000',

          '--rounded-box': '3px',
          '--rounded-btn': '3px',
          '--rounded-badge': '1rem',
        },
      },
    ],
  },
}
