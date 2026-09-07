import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const localizedString = z.object({
	en: z.string(),
	es: z.string(),
	eo: z.string(),
})

export const postCategories = ['project', 'article'] as const
export type PostCategory = (typeof postCategories)[number]

const posts = defineCollection({
	loader: glob({
		base: './src/content/posts',
		pattern: '**/*.json',
	}),
	schema: z.object({
		title: z.string(),
		slug: z.string().optional(),
		category: z.enum(postCategories),
		url: z.string().optional(),
		image: z.string().optional(),
		order: z.number().int().nonnegative().default(0),
		date: z.iso.datetime().optional(),
		// Localized summary/excerpt shown on the listing.
		summary: localizedString,
		// Localized rich body for the detail page.
		body: localizedString,
		skills: z.array(localizedString).default([]),
	}),
})

export const collections = { posts }
