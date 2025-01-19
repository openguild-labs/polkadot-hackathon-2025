module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    boxShadow: {
      greenLight: '0px 0px 12px rgba(0, 255, 209, 0.6)',
      extendedShadow : '0px 0px 12px rgba(0, 255, 209, 0.6)'
    },
    screens: {
      sm: { min: '280px', max: '599.98px' },
      md: { min: '600px', max: '1024px' },
      lg: { min: '1025px' },
      xl: { min: '1200px' },
      '2xl': { min: '1536px' },
      '3xl': { min: '1792px' },
      'custom-md': { min: '1314px' }
    },    
    extend: {
      transitionProperty: {
        'height': 'height',
      },
      width: {
        'bridgewidth': '36rem',
        'bridgewidth-lg': '26rem',
      },
      animation: {
        tilt: 'tilt 10s infinite linear',
      },
      keyframes: {
        tilt: {
          '0%, 50%, 100%': {
            transform: 'rotate(0deg)',
          },
          '25%': {
            transform: 'rotate(0.5deg)',
          },
          '75%': {
            transform: 'rotate(-0.5deg)',
          },
        },
      },
      dropShadow: {
        lightWhite: '0px 0px 12px rgba(255, 255, 255, 0.6)'
      },
      screens: {
        s: { min: '280px', max: '1024px' },
        l: { min: '1024px' }
      },
      colors: {
        primary: '#00D6AF',
        secondary: '#F9FAFB',
        mobile: '#00C6A2',
        dark: '#001320',
        'card-bg' : '#1a1b1f',
        'dark-70': 'rgba(0, 19, 32, 0.7)',
        'dark-border': 'rgba(8, 97, 81, 0.39)',
        'dark-border': 'rgba(8, 97, 81, 0.39)',
        'green-dark': '#1AA189',
        'gray-text': '#73818B',
        globalBg: '#131419',
        roadmapBg: '#161e22',
        greenColor: '#3AFFF2',
        darkBorderColor: '#2e3f4d',
        warningColor: '#D73F75',
        growingColor: '#3BB73B',
        opacity80White: '#cccccc',
        hightGreenColor: '#00FFD1',
        blueColor: 'rgba(24, 48, 48, 0.7)',
        brightGreenColor: 'rgba(0, 94, 88, 0.8)',
        greenColor: '#1d4a46',
        shadowColor: 'rgba(14, 33, 33, 0.8)',
        shadowColorIcon: '0px 0px 12px rgba(0, 255, 209, 0.6)',
        footerHoverColor: '#00C6A2'
      },
      spacing: {
        '16%': '16%',
      },
      scale: {
        '65': '0.65',
      },
      fontSize: {
        '13': '13px',
        '26': '26px',
        '32': '32px',
        '42': '42px',
        '46': '46px',
      },
    },
    fontFamily: {
      lexend: ['"Lexend Deca"'],
      poppins: ['"Poppins"']
    },
  },
  variants: {
    extend: {
      justifySelf: ['first', 'last'],
      marginBottom: ['first', 'last'],
      filter: ['hover', 'focus'],
      dropShadow: ['hover'],
      scale: ['responsive'],
    }
    
  }
};
