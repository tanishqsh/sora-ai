import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-geist-sans)'],
				mono: ['var(--font-geist-mono)'],
				arabic: ['var(--font-noto-sans-arabic)'],
			},
			colors: {
				// You can define your custom colors here
			},
			animation: {
				scroll: 'scroll 20s linear infinite',
				'spin-slow': 'spin-slow 5s linear infinite',
				progress: 'progress 5s linear forwards',
			},
			keyframes: {
				scroll: {
					'0%': { transform: 'translateY(0)' },
					'100%': { transform: 'translateY(-100%)' },
				},
				'spin-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
				progress: {
					'0%': { strokeDashoffset: '100.53' },
					'100%': { strokeDashoffset: '0' },
				},
			},
		},
	},
	plugins: [],
};

export default config;
