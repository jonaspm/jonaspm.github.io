/**
 * SEO configuration utility for different page types
 */

import { getRelativeLocaleUrl } from 'astro:i18n'
import { getTranslations, type Language } from '@/utils/i18n'

export interface SEOConfig {
	title?: string
	description?: string
	keywords?: string[]
	image?: string
	imageAlt?: string
	type?: 'website' | 'article' | 'profile'
	author?: string
	publishedTime?: string
	modifiedTime?: string
	section?: string
	tags?: string[]
	twitterHandle?: string
	robots?: string
	canonical?: string
	siteName?: string
	locale?: string
	structuredData?: Record<string, any>
	alternates?: Array<{
		hrefLang: string
		href: string
	}>
}

function getDefaultSEO(language: Language): SEOConfig {
	const translations = getTranslations(language)

	return {
		title: 'Jonas Perusquia Morales - Msc. Data Science & Software Engineer',
		description: translations.seo.home.description,
		keywords: translations.seo.home.keywords,
		image: '/profile.png',
		imageAlt: 'Jonas Perusquia Morales - Professional Profile',
		type: 'website',
		author: 'Jonas Perusquia Morales',
		twitterHandle: '@jonaspm',
		robots: 'index, follow',
		siteName: 'Jonas Perusquia Morales',
		locale: translations.locale,
		alternates: [
			{ hrefLang: 'en', href: getRelativeLocaleUrl('en', '') },
			{ hrefLang: 'es', href: getRelativeLocaleUrl('es', '') },
			{ hrefLang: 'x-default', href: getRelativeLocaleUrl('en', '') },
		],
	}
}

function getPageConfig(page: 'home', language: Language): Partial<SEOConfig> {
	const translations = getTranslations(language)

	if (page === 'home') {
		return {
			title: translations.seo.home.title,
			description: translations.seo.home.description,
			keywords: translations.seo.home.keywords,
			type: 'profile',
			locale: translations.locale,
			canonical: getRelativeLocaleUrl(language, ''),
			structuredData: {
				'@context': 'https://schema.org',
				'@type': 'Person',
				name: 'Jonas Perusquia Morales',
				jobTitle: 'Msc. Data Science & Software Engineer',
				description: translations.seo.home.structuredDescription,
				url: 'https://jonasperusquia.com',
				image: '/profile.png',
				sameAs: [
					'https://linkedin.com/in/jonaspm',
					'https://github.com/jonaspm',
					'https://twitter.com/jonaspm',
				],
				worksFor: {
					'@type': 'Organization',
					name: 'Technology Companies',
				},
				knowsAbout: [
					'Software Engineering',
					'Web Development',
					'Cloud Architecture',
					'Team Leadership',
					'Full Stack Development',
					'JavaScript',
					'TypeScript',
					'React',
					'Node.js',
				],
				address: {
					'@type': 'PostalAddress',
					addressLocality: 'Chihuahua',
					addressCountry: 'Mexico',
				},
			},
		}
	}

	return {}
}

/**
 * Merge default SEO config with page-specific config
 */
export function mergeSEOConfig(
	language: Language,
	pageConfig: Partial<SEOConfig> = {},
): SEOConfig {
	const defaultSEO = getDefaultSEO(language)

	return {
		...defaultSEO,
		...pageConfig,
		keywords: pageConfig.keywords || defaultSEO.keywords,
		alternates: pageConfig.alternates || defaultSEO.alternates,
	}
}

/**
 * Get SEO config for a specific page
 */
export function getPageSEO(page: 'home', language: Language): SEOConfig {
	return mergeSEOConfig(language, getPageConfig(page, language))
}
