import type { APIRoute } from 'astro'

/**
 * Hand-written robots file. Owned by the project (not EmDash) because
 * `public/robots.txt` was deleted — EmDash only injects its own when
 * `src/pages/robots.txt.ts` does not exist. Output matches the previous
 * static file: allow everything, point at the absolute sitemap.
 */
export const GET: APIRoute = ({ site }) => {
	const sitemapUrl = new URL(
		'sitemap.xml',
		site ?? 'https://jonasperusquia.com',
	).href

	return new Response(`User-agent: *\nDisallow:\n\nSitemap: ${sitemapUrl}\n`, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	})
}
