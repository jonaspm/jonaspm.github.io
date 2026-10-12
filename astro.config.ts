import cloudflare from '@astrojs/cloudflare'
import react from '@astrojs/react'
import { d1, kvCache, r2 } from '@emdash-cms/cloudflare'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, envField } from 'astro/config'
import mcp from 'astro-mcp'
import emdash from 'emdash/astro'

// https://astro.build/config
export default defineConfig({
	site: 'https://jonasperusquia.com',
	// EmDash content is read through live collections, which require on-demand
	// rendering (Astro docs: "Requires SSR mode or export const prerender = false").
	output: 'server',
	// `imageService: 'compile'` was REMOVED on purpose — see docs/EMDASH_MIGRATION.md §4.3.
	// With the adapter's default (`cloudflare-binding`) the adapter sets
	// image.endpoint = "@astrojs/cloudflare/image-transform-endpoint", which is in
	// EmDash's OVERRIDABLE set, so EmDash installs its own R2-aware endpoint.
	adapter: cloudflare(),
	env: {
		schema: {
			CLARITY_ID: envField.string({ context: 'client', access: 'public' }),
		},
	},
	i18n: {
		locales: ['en', 'es', 'eo'],
		defaultLocale: 'en',
		// Informs EmDash's fallback chain (getI18nConfig() reads this from Astro).
		// The public routes still exist for every locale; this only means "a
		// missing es/eo translation serves the en entry" at query time.
		fallback: { es: 'en', eo: 'en' },
		routing: {
			prefixDefaultLocale: false, // keep: do NOT enable
		},
	},
	integrations: [
		mcp(),
		react(),
		emdash({
			database: d1({ binding: 'DB' }),
			storage: r2({ binding: 'MEDIA' }),
			// Offloads content reads from D1; publish-aware (epoch bump).
			// defaultTtl also bounds the visibility latency of *scheduled* posts,
			// which EmDash resolves at query time (no write event fires).
			objectCache: kvCache({ binding: 'CACHE', defaultTtl: 300 }),
			// Canonical origin: passkey rpId, canonical URLs, media remotePatterns.
			siteUrl: 'https://jonasperusquia.com',
			allowedOrigins: ['https://www.jonasperusquia.com'],
			// No `plugins`, no `sandboxed`, no `sandboxRunner`, no `registry`.
			// Passkey auth (default) — no `auth` adapter.
		}),
	],
	server: {
		host: true,
		port: 4321,
	},
	vite: {
		plugins: [tailwindcss()],
	},
})
