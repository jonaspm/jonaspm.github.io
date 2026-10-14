/**
 * Shared types + helpers for the static resume data in `src/assets/data/`
 * (`experience.json`, `credentials.json`, `skills.json`).
 *
 * Pattern: user-visible resume content lives in JSON with per-locale fields;
 * `@/utils/i18n` keeps only UI-chrome strings. Within JSON a
 * `LocalizedString` carries all three locales, while a plain `string` means
 * "same in every locale" (proper nouns, brand names, technical terms such as
 * `React` or `Chihuahua, Mexico`).
 */
import type { Language } from '@/utils/i18n'

/** A string that differs per locale. */
export type LocalizedString = { en: string; es: string; eo: string }

/** Either a locale-independent string or a per-locale record. */
export type Text = string | LocalizedString

/**
 * Resolve a `Text` for one locale. Plain strings pass through untouched;
 * localized records fall back to `en` if a key were ever missing.
 */
export function pick(text: Text, language: Language): string {
	if (typeof text === 'string') return text
	return text[language] ?? text.en
}

/** One role in the experience timeline (`src/assets/data/experience.json`). */
export interface ExperienceEntry {
	/** Stable slug-like id (e.g. `blueway-group`); used as the list key. */
	id: string
	/** Proper noun — always a plain string. */
	company: string
	title: LocalizedString
	/** `YYYY-MM` precision. */
	start: string
	/** `YYYY-MM` precision; `null` means "still here". */
	end: string | null
	location: Text
	/** Parenthetical line, e.g. "acquired by Concentrix". */
	note?: LocalizedString | null
	/** 2–3 condensed bullets taken from the resume. */
	bullets: LocalizedString[]
}

/** One entry in a credentials card (`src/assets/data/credentials.json`). */
export interface CredentialItem {
	/** Stable slug-like id; used as the list key. */
	id: string
	/** Degree / cert name / honor / language. */
	label: LocalizedString
	/** Institution, issuer… Plain string for proper nouns. */
	detail?: Text
	/** e.g. "Coursework complete · exam pending". */
	status?: LocalizedString | null
	/** `YYYY-MM` or `YYYY` precision. */
	start?: string
	/** `YYYY-MM` or `YYYY`; `null` means "still current" (only when `start` is set). */
	end?: string | null
	/** Vendor-issued credential id, e.g. "22440226" (ServiceNow CSA). */
	credentialId?: string
	/** NEVER guessed — `null` when the URL is unverified. */
	url?: string | null
}

/** Shape of `src/assets/data/credentials.json`. */
export interface CredentialsData {
	certifications: CredentialItem[]
	education: CredentialItem[]
	honors: CredentialItem[]
	languages: CredentialItem[]
	community: CredentialItem[]
}

/** BCP-47 locale used for `Intl` date formatting (mirrors `PostDetail.astro`). */
export function dateLocaleOf(language: Language): string {
	return language === 'en' ? 'en-US' : language === 'es' ? 'es-MX' : 'eo'
}

/**
 * Format one `start`/`end` value from the JSON data.
 *
 * Accepts `YYYY-MM` (renders "Jun 2026") or bare `YYYY` (renders "2018").
 * The date is constructed with `Date.UTC` and formatted in the UTC timezone
 * on purpose: `new Date('2026-06')` is UTC midnight, so formatting it in a
 * negative-offset zone (like Mexico) would show May. Pinning `timeZone`
 * keeps month labels stable everywhere the Worker renders.
 */
export function formatDate(value: string, language: Language): string {
	const [year, month] = value.split('-')
	if (!month) return year

	const date = new Date(Date.UTC(Number(year), Number(month) - 1, 1))
	return new Intl.DateTimeFormat(dateLocaleOf(language), {
		month: 'short',
		year: 'numeric',
		timeZone: 'UTC',
	}).format(date)
}

/**
 * Render a `start`–`end` range ("Jun 2026 – Present"). `end: null` renders
 * the caller-supplied `presentLabel` (it is UI chrome, so it comes from
 * `i18n.ts`, not from the JSON data).
 */
export function formatDateRange(
	start: string,
	end: string | null,
	language: Language,
	presentLabel: string,
): string {
	const from = formatDate(start, language)
	const to = end ? formatDate(end, language) : presentLabel
	return `${from} – ${to}`
}
