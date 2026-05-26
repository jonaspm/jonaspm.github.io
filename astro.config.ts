import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

import mcp from 'astro-mcp'

// https://astro.build/config
export default defineConfig({
	site: 'https://jonasperusquia.com',
	i18n: {
		locales: ['en', 'es'],
		defaultLocale: 'en',
		routing: {
			prefixDefaultLocale: false,
		},
	},
	integrations: [mcp()],
	server: {
		host: true,
		port: 4321,
	},
	vite: {
		plugins: [tailwindcss()],
	},
})
