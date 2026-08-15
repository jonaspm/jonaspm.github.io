import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import studioCMS from 'studiocms'
import markdownRemark from '@studiocms/markdown-remark'
import mcp from 'astro-mcp'
import cloudflare from '@astrojs/cloudflare'

// https://astro.build/config
export default defineConfig({
  site: 'https://jonasperusquia.com',
	adapter: cloudflare({ prerenderEnvironment: 'node' }),
	i18n: {
		locales: ['en', 'es', 'eo'],
		defaultLocale: 'en',
		routing: {
			prefixDefaultLocale: false,
		},
  },
	integrations: [mcp(), studioCMS(), markdownRemark({ injectCSS: false })],
	server: {
		host: true,
		port: 4321,
	},
	vite: {
		plugins: [tailwindcss()],
		optimizeDeps: {
			disabled: 'build',
		},
		build: {
			cssMinify: false,
			minify: false,
		},
	},
})
