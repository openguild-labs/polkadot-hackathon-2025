import type { Config } from "tailwindcss";
import colors from "./src/colors";

const config = {
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader',
				],
			},
		],
	},
	content: [
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	future: {
		hoverOnlyWhenSupported: true
	},
	theme: {
		container: {
			center: true,
			screens: {
				"2xl": "1440px",
			},
		},
		extend: {
			colors,
			backgroundImage: {
				'onboard': "url('/assets/images/home/bg_onboard.png')",
				'footer-texture': "url('/img/footer-texture.png')",
			},
			flex: {
				"2": "2 2 0%",
				"1.5": "1.5 1.5 0%",
			},
			transitionDuration: {
				"2000": "2000ms",
			},
			fontFamily: {
				saira: ["var(--font-saira)"],
				determination: ["var(--font-determination)"],
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				// if you are using drawer variant bottom
				"drawer-bottom-up": {
					"0%": { bottom: "-500px" },
					"100%": { bottom: "0" },
				},
				"drawer-bottom-down": {
					"0%": { bottom: "0" },
					"100%": { bottom: "-500px" },
				},
			},
			boxShadow: {
				fixed: "0px 0px 5px rgba(9, 30, 66, 0.15)",
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"drawer-bottom-up": "drawer-bottom-up 0.6s ease-out",
				"drawer-bottom-down": "drawer-bottom-down 0.6s ease-out",
			},
			spacing: {
				15: '60px',
				"full-screen": "calc(100vw - 32px)",
				"fit-screen-desktop": "calc(100dvh - 65px)",
				"fit-screen-mobile": "calc(100dvh - 57px - 32px)",
			},
			fontSize: {
				"3xl": "28px",
			},
			borderRadius: {
				md: "4px",
			},
			maxWidth: {
				'1/4': "25%"
			}
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
