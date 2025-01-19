import type { Config } from 'tailwindcss'
import { THEME } from './styles/theme'

const config: Config = {
  // mode: 'jit',
  // purge: [
  //   './public/**/*.html',
  //   './**/*.{js,jsx,ts,tsx,vue}',
  // ],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './styles/**/*.{js,ts,jsx,tsx,mdx}',
    './utils/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'nav-curve': 'url("../public/images/curve-nav.svg")'
      },
      colors: {
        primary: THEME.PRIMARY_COLOR,
        "light-primary": THEME.LIGHT_PRIMARY_COLOR,
        secondary: THEME.SECONDARY_COLOR,
        'light-secondary': THEME.LIGHT_SECONDARY_COLOR,
        "royal-gray": THEME.ROYAL_GRAY_COLOR,
        'danger': THEME.DANGER_COLOR,
        'text-primary': THEME.TEXT_COLOR,
        'text-hover': THEME.TEXT_HOVER_COLOR,
        'muted': THEME.TEXT_MUTED_COLOR,
        'inherit': 'inherit'
      },
      fontSize: {
        'fs-inherit': 'inherit'
      },
      keyframes: {
        blink: {
          '0%': {
            opacity: '0'
          },
          '50%': {
            opacity: '1'
          },
          '100%': {
            opacity: '0'
          }
        }
      },
      animation: {
        blink: 'blink 1s linear 2'
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
  variants: {
      scrollbar: ['rounded']
  }
}
export default config
