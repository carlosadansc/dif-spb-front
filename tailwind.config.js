const { default: daisyui } = require('daisyui');

// tailwind.config.js
module.exports = {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    media: false, // or 'media' or 'class'
    future: {
      disableColorOpacityUtilities: true,
    },
    experimental: {
      optimizeUniversalDefaults: true,
    },
    theme: {
      extend: {
        // colors: {
        //   //primary
        //   'dark-blue-color': '#0D479F',
        //   'data-blue-color': '#2668FD',
        //   'space-orange-color': '#FE8E4D',
        //   'land-green-color': '#1EC47C',
        //   'carpet-purple-color': '#A542D6',
        //   //complementary
        //   'gray-s1-color': '#454545',
        //   'gray-l1-color': '#8E8E8E',
        //   'gray-l2-color': '#E8E8E8',
        //   'gray-s2-color': '#1E1E1E',
        //   'gray-l3-color': '#FCFCFC',
        // },
      },
    },
    variants: {
      extend: {},
    },
    plugins: [
      require('daisyui'),
    ],
    corePlugins: {
      textOpacity: false,
      backgroundOpacity: false,
      borderOpacity: false
    },
    daisyui: {
      themes: ['light'],
    }
  }