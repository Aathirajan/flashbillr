export default {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {
      flexbox: 'no-2009',
      grid: 'no-autoplace', 
      overrideBrowserslist: [
        '>1%',
        'last 4 versions',
        'Firefox ESR',
        'not ie < 9'
      ]
    },
  },
};
