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
				glitch: 'glitch 3s infinite',
				typing: 'typing 10s steps(60, end) infinite',
			},
			keyframes: {
				glitch: {
					'0%, 100%': { transform: 'translate(0)' },
					'20%': { transform: 'translate(-2px, 2px)' },
					'40%': { transform: 'translate(-2px, -2px)' },
					'60%': { transform: 'translate(2px, 2px)' },
					'80%': { transform: 'translate(2px, -2px)' },
				},
				typing: {
					'0%': { transform: 'translateY(0)' },
					'20%': { transform: 'translateY(0)' },
					'25%': { transform: 'translateY(-24px)' },
					'45%': { transform: 'translateY(-24px)' },
					'50%': { transform: 'translateY(-48px)' },
					'70%': { transform: 'translateY(-48px)' },
					'75%': { transform: 'translateY(-72px)' },
					'95%': { transform: 'translateY(-72px)' },
					'100%': { transform: 'translateY(-96px)' },
				},
			},
		},
	},
	plugins: [],
};

export default config;
