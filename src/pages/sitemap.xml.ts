import { getRelativeLocaleUrl } from 'astro:i18n'
import type { APIRoute } from 'astro'
import { listPosts } from '@/utils/emdash-posts'
import type { Language } from '@/utils/i18n'

/**
 * Hand-written sitemap. Owned by the project (not EmDash) so it can list the
 * locale-correct URLs; EmDash's own `/sitemap-posts.xml` stays available for
 * its single-locale view. `public/sitemap.xml` was deleted so this route wins.
 */
const languages: Language[] = ['en', 'es', 'eo']

/** Minimal XML escaping for URL text nodes. */
const escapeXml = (value: string) =>
	value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')

/**
 * Locale-relative detail path. `getRelativeLocaleUrl` appends a trailing slash
 * (directory build format), so strip it before joining the slug — otherwise the
 * URL and its hreflang alternates would contain `//`.
 */
const detailPath = (language: Language, slug: string) =>
	`${getRelativeLocaleUrl(language, 'portfolio').replace(/\/$/, '')}/${slug}`

interface SitemapUrl {
	/** Locale-relative path (from `getRelativeLocaleUrl`). */
	path: string
	/** ISO date (YYYY-MM-DD) when known. */
	lastmod?: string
	/** Locale-relative alternates for this same page, by hreflang. */
	alternates: Array<{ hrefLang: string; path: string }>
}

export const GET: APIRoute = async ({ site }) => {
	const origin = (site ?? new URL('https://jonasperusquia.com')).origin

	// Published posts are read from EmDash; `[]` on error keeps the sitemap
	// valid (static routes only) instead of failing the request.
	const posts = await listPosts('en')

	// One locale set per static page type, then one per published post.
	const pages: Array<{ paths: Record<Language, string>; lastmod?: string }> = [
		{
			paths: {
				en: getRelativeLocaleUrl('en', ''),
				es: getRelativeLocaleUrl('es', ''),
				eo: getRelativeLocaleUrl('eo', ''),
			},
		},
		{
			paths: {
				en: getRelativeLocaleUrl('en', 'portfolio'),
				es: getRelativeLocaleUrl('es', 'portfolio'),
				eo: getRelativeLocaleUrl('eo', 'portfolio'),
			},
		},
	]

	for (const entry of posts) {
		// `data.slug` is the bare slug shared by every locale translation.
		const slug = entry.data.slug
		if (!slug) continue

		const date = entry.data.date
		pages.push({
			paths: {
				en: detailPath('en', slug),
				es: detailPath('es', slug),
				eo: detailPath('eo', slug),
			},
			lastmod: date ? new Date(date).toISOString().slice(0, 10) : undefined,
		})
	}

	const urls: SitemapUrl[] = []

	for (const page of pages) {
		for (const language of languages) {
			urls.push({
				path: page.paths[language],
				lastmod: page.lastmod,
				alternates: [
					...languages.map((alternate) => ({
						hrefLang: alternate,
						path: page.paths[alternate],
					})),
					{ hrefLang: 'x-default', path: page.paths.en },
				],
			})
		}
	}

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
	.map(
		(url) => `	<url>
		<loc>${escapeXml(`${origin}${url.path}`)}</loc>
${url.lastmod ? `		<lastmod>${url.lastmod}</lastmod>\n` : ''}${url.alternates
	.map(
		(alternate) =>
			`		<xhtml:link rel="alternate" hreflang="${alternate.hrefLang}" href="${escapeXml(`${origin}${alternate.path}`)}"/>`,
	)
	.join('\n')}
	</url>`,
	)
	.join('\n')}
</urlset>
`

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' },
	})
}
