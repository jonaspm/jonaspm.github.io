/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			animation: {
				'typewriter': 'typewriter 5s steps(23) 0s infinite alternate both',
				'blinking': 'blinkTextCursor 800ms infinite normal'
			},
			keyframes: {
				typewriter: {
					'0%': { width: '0' },
					'20%': { width: '0' },
					'80%': { width: '100%' },
					'100%': { width: '100%' }
				},
				blinkTextCursor: {
					from: {
						borderRightColor: 'rgba(255,255,255,0.8)',
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
