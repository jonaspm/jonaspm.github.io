/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		colors: {
			'primary': 'rgba(42, 0, 61, 1)',
			'secondary': 'rgba(255, 255, 255, 1)'
		},
		extend: {
			animation: {
				'typewriter': 'typewriter 5s steps(23) 0s infinite alternate both',
				'blinking': 'blinkTextCursor 800ms infinite normal',
				'fade-in': 'fadeIn 800ms calc(var(--delay-index) * 0.5s) ease-out forwards',
			},
			keyframes: {
				fadeIn: {
					'0%': {
						opacity: 0,
						transform: 'translateY(-30px)'
					},
					'100%': {
						opacity: 1,
						transform: 'translateY(0px)'
					}
				},
				typewriter: {
					'0%': { width: '0' },
					'20%': { width: '0' },
					'80%': { width: '100%' },
					'100%': { width: '100%' }
				},
				blinkTextCursor: {
					from: {
						borderRightColor: 'rgba(42, 0, 61, 1)',
					},
					to: {
						borderRightColor: 'transparent',
					}
				}
			}
		},
	},
	plugins: [],
}
