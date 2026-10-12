/**
 * EmDash data layer for the `posts` collection.
 *
 * This is the only module that knows EmDash's data shapes. Everything else in
 * the project talks in the `PostViewModel` / `ProjectViewModel` types from
 * `@/utils/i18n` and passes opaque `MediaValue` objects to `PostImage`.
 *
 * Reads go through EmDash's live collections (`src/live.config.ts`), which
 * require on-demand rendering (`output: 'server'`). Every query degrades
 * gracefully: an EmDash error is logged and turned into an empty result, so a
 * public page renders today's empty state instead of throwing a 500.
 */
import {
	type ContentEntry,
	getEmDashCollection,
	getEmDashEntry,
	type MediaValue,
	type TaxonomyTerm,
} from 'emdash'
import type { Language, PostViewModel, ProjectViewModel } from '@/utils/i18n'

/** EmDash collection slug; the collection is defined in `seed/seed.json`. */
export const POST_SLUG = 'posts'

/**
 * Shape of one `posts` entry's `data` after EmDash's loader hydrates it.
 *
 * Values are permissive on purpose: the loader returns whatever the column
 * held (`null` when unset), and a missing value must render the same empty
 * state the old build-time collection produced, never crash the page.
 */
export interface PostEntryData {
	title: string
	url?: string | null
	/** EmDash `image` field value. Strings only appear on hand-edited rows. */
	image?: MediaValue | string | null
	sort_order?: number | null
	date?: string | null
	summary?: string | null
	body?: string | null
	skills?: string[] | null
	/**
	 * Taxonomy terms the loader hydrates onto the entry, keyed by taxonomy
	 * name. `category` is EmDash's built-in taxonomy — see `categoryOf`.
	 */
	terms?: Record<string, TaxonomyTerm[]>
	// System columns the loader copies into `data` (EmDash `mapRowToData`).
	slug?: string
	locale?: string
	status?: string
}

/**
 * Published entries for one locale, sorted by the editor-controlled order.
 *
 * EmDash list reads are locale-strict while entry lookups follow the i18n
 * fallback chain: without an overlay, a post that only exists in `en` would
 * vanish from the `es`/`eo` listings even though its detail page falls back to
 * English. So for non-default locales the `en` list is overlaid too — entries
 * whose slug is missing from the localized result are appended (the localized
 * row always wins) and the merged set is re-sorted by `sort_order`, matching
 * EmDash's entry-fallback semantics. Returns `[]` on failure so listing pages
 * render their empty state.
 */
export async function listPosts(
	language: Language,
): Promise<ContentEntry<PostEntryData>[]> {
	const { entries, error } = await getEmDashCollection<
		typeof POST_SLUG,
		PostEntryData
	>(POST_SLUG, {
		locale: language,
		status: 'published',
		orderBy: { sort_order: 'asc' },
		limit: 100,
	})

	if (error) {
		console.error(
			`[emdash-posts] Failed to load "${POST_SLUG}" (${language}):`,
			error,
		)
		return []
	}

	if (language === 'en') return entries

	// Overlay the default locale so every post shows in every listing.
	const fallback = await getEmDashCollection<typeof POST_SLUG, PostEntryData>(
		POST_SLUG,
		{
			locale: 'en',
			status: 'published',
			orderBy: { sort_order: 'asc' },
			limit: 100,
		},
	)

	if (fallback.error) {
		// The localized read already succeeded; a failed overlay only means
		// fewer rows, never an empty listing.
		console.error(
			`[emdash-posts] Failed to load "${POST_SLUG}" (en overlay for ${language}):`,
			fallback.error,
		)
		return entries
	}

	const slugOf = (entry: ContentEntry<PostEntryData>) =>
		entry.data.slug ?? entry.id.split('/').pop()

	const localizedSlugs = new Set(entries.map(slugOf))
	const merged = [
		...entries,
		...fallback.entries.filter((entry) => !localizedSlugs.has(slugOf(entry))),
	]

	// Each read is ordered individually; re-sort the merged set by `sort_order`.
	merged.sort((a, b) => (a.data.sort_order ?? 0) - (b.data.sort_order ?? 0))

	return merged
}

/**
 * One published entry as a view model, or `null` for a missing/unpublished
 * slug (the detail-page wrappers turn that into a 404). EmDash's i18n fallback
 * chain decides whether the `es`/`eo` read serves the `en` entry.
 */
export async function getPost(
	language: Language,
	slug: string,
): Promise<PostViewModel | null> {
	const { entry, error } = await getEmDashEntry<
		typeof POST_SLUG,
		PostEntryData
	>(POST_SLUG, slug, { locale: language })

	if (error) {
		console.error(
			`[emdash-posts] Failed to load "${POST_SLUG}/${slug}" (${language}):`,
			error,
		)
		return null
	}

	return entry ? toPostViewModel(entry) : null
}

/**
 * Extract an entry's image as a `MediaValue` for `PostImage`/EmDash's `<Image>`.
 * Bare URL strings (legacy/hand-edited values) are promoted to a minimal media
 * value; `null`/`undefined` means "no image", same as today.
 */
export function postMedia(
	entry: ContentEntry<PostEntryData>,
): MediaValue | null {
	const raw = entry.data.image

	if (!raw) return null
	if (typeof raw === 'string') return { id: '', src: raw }

	return raw
}

/**
 * Classify an entry for the UI. `category` is EmDash's built-in taxonomy
 * (declared with terms `project` / `article` in `seed/seed.json`); the loader
 * hydrates the assigned terms onto `entry.data.terms`. A post counts as a
 * project only when it carries the `project` term — anything uncategorized
 * falls back to `article`, so the home page lists explicit projects only.
 */
export function categoryOf(
	entry: ContentEntry<PostEntryData>,
): 'project' | 'article' {
	const terms = entry.data.terms?.category
	if (!Array.isArray(terms)) return 'article'

	return terms.some((term) => term.slug === 'project') ? 'project' : 'article'
}

/**
 * Map one EmDash entry to the listing/detail view model. `summary`, `body` and
 * `skills` are already localized by the query's `locale` filter; the view model
 * is locale-agnostic data, so no `language` parameter is needed. The `category`
 * badge value is derived from the taxonomy terms (see `categoryOf`).
 */
export function toPostViewModel(
	entry: ContentEntry<PostEntryData>,
): PostViewModel {
	const { data } = entry

	return {
		// `data.slug` is the bare slug; `entry.id` may carry a locale prefix
		// (e.g. `es/enerlinq`) because i18n routing prefixes non-default locales.
		slug: data.slug ?? entry.id.split('/').pop() ?? entry.id,
		title: data.title,
		category: categoryOf(entry),
		url: data.url ?? undefined,
		media: postMedia(entry),
		date: data.date ?? undefined,
		summary: data.summary ?? '',
		body: data.body ?? '',
		skills: data.skills ?? [],
	}
}

/**
 * Map one EmDash entry to the home-page project card view model. `order` is
 * presentation-only, so it stays in the query (`orderBy`) and never surfaces
 * here.
 */
export function toProjectViewModel(
	entry: ContentEntry<PostEntryData>,
): ProjectViewModel {
	const { data } = entry

	return {
		name: data.title,
		url: data.url ?? '',
		media: postMedia(entry),
		description: data.summary ?? '',
		skills: data.skills ?? [],
	}
}
