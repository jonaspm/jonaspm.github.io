# Agents Guide — jonasperusquia.com

Personal portfolio site. Astro 7 SSR deployed as a Cloudflare Worker, with content managed in EmDash CMS (D1 for content, R2 for media, KV for the object cache).

## Commands

```sh
bun run dev            # dev server at http://localhost:4321 (D1/R2/KV emulated under .wrangler/state)
bun run build          # production build to dist/
bun run preview        # preview production build
bun run deploy         # build + wrangler deploy
bun run cloudflare     # deploy pipeline: frozen install + build + wrangler deploy
bun run seed:validate  # validate seed/seed.json without touching a database
bun run db:export      # D1 backup to backups/ (gitignored)
```

## Stack

| Concern       | Tool                                                      |
| ------------- | --------------------------------------------------------- |
| Framework     | Astro 7 (SSR, `output: 'server'`)                         |
| CMS           | EmDash 1.2 (admin at `/_emdash/admin`)                    |
| Data          | Cloudflare D1 (content) + R2 (media) + KV (object cache)  |
| Hosting       | Cloudflare Workers (`src/worker.ts` entry)                |
| Styling       | Tailwind CSS v4 (Vite plugin)                             |
| Package mgr   | Bun (lockfile: `bun.lock`)                                |
| Lint & format | Biome (`biome.json`)                                      |
| Animations    | GSAP + ScrollTrigger                                      |
| Analytics     | Clarity + OneDollarStats                                  |
| Icons         | Material Symbols (rounded)                                |
| Docs          | `docs/SEO_MANAGER_DOCS.md`, `docs/EMDASH_MIGRATION.md`    |

## Architecture

- **Pages**: `src/pages/index.astro` (en, root) → `src/pages/es/index.astro` (es) → `src/pages/eo/index.astro` (eo); listings under `*/portfolio/index.astro`. Detail routes are thin wrappers that load one post via `getPost()` and render `src/components/PostDetail.astro`; missing slugs `Astro.rewrite('/404')` (the `/404` route supplies the 404 status).
- **Layout**: `src/layouts/Layout.astro` wraps all pages, includes Nav, SEO meta, Analytics, GSAP script, View Transitions.
- **Content**: EmDash-managed. The live collection `_emdash` is defined in `src/live.config.ts`; `src/utils/emdash-posts.ts` is the only module that knows EmDash data shapes (`listPosts`, `getPost`, view-model mappers, media extraction). Components consume `PostViewModel` / `ProjectViewModel` from `src/utils/i18n.ts`. Listing reads overlay the default locale so a missing es/eo translation still lists the en entry.
- **Content model**: collection `posts` — fields `title`, `url`, `image`, `sort_order`, `date`, `summary`, `body`, `skills`; classification uses EmDash's built-in `category` taxonomy (terms `project` / `article`), hydrated onto `entry.data.terms` and read via `categoryOf()` in `src/utils/emdash-posts.ts` (a post with no `category` term classifies as `article`, so it does not appear on the home page). Only `title`, `summary`, `body`, `skills` are translatable; the rest are shared across locales. `sort_order` is the old `order` field. UI labels still come from `src/utils/i18n.ts`.
- **Seed**: `seed/seed.json` defines the collection + 6 posts × en/es/eo (18 entries). It is applied by the setup wizard on first run only — edits live in D1 afterwards. `package.json#emdash.seed` points at it.
- **Worker entry**: `src/worker.ts` — Astro CF server handler + EmDash `scheduled()` sweep; cron trigger in `wrangler.jsonc`.
- **Media**: uploaded into R2; rendered through `emdash/ui`'s `Image`, wrapped by `src/components/PostImage.astro` so all call sites stay consistent.
- **Utils**: `src/utils/i18n.ts` (translations), `src/utils/seo.ts` (page SEO configs).
- **Static data**: `src/assets/data/` for `skills.json` and `social-networks.json`
  - `skills.json` is an array of category groups: `{ id, accent, icon, name: { en, es, eo }, skills: string[] }`. `accent` must be one of the keys in the `accents` map of `SkillsSection.astro` (Tailwind classes are looked up there, so dynamic class strings are not generated).
- **Scripts**: `src/scripts/gsap-animations.js` — animations bootstrapped via `astro:page-load` event

### i18n

Astro built-in i18n: `prefixDefaultLocale: false`. English at `/`, Spanish at `/es/`, Esperanto at `/eo/`.
UI strings live in `src/utils/i18n.ts` (type-safe `Translations` record). Post translations are separate EmDash rows joined by a translation group; EmDash's `i18n.fallback` config makes a missing es/eo entry serve the en entry.

## Gotchas

- **No ESLint / Prettier**. Biome handles both lint and format. Run via editor plugin or `bunx @biomejs/biome check`.
- **No `tailwind.config.js`**. Tailwind v4 config is CSS-first in `src/styles/global.css`. Custom colors `grayblue-*`, `gold-*`, custom breakpoint `xs` (475px) are defined there.
- **Path alias**: `@/*` → `src/*` (configured in `tsconfig.json`).
- **GSAP lifecycle**: Animations init on `astro:page-load` and cleanup on page unload. If adding animated elements, use classes `gsap-fade-up`, `gsap-fade-up-noreverse`, `gsap-hero-stagger`, or `skill-card`.
- **Dark mode**: class-based (`.dark` on `<html>`). FOUC prevention via inline `<script is:inline>` in Layout. Toggle component in `ThemeToggle.astro`.
- **View Transitions**: `ClientRouter` from `astro:transitions` is enabled in Layout. Navigation uses `transition:name` and `transition:persist` directives.
- **TypeScript**: extends `astro/tsconfigs/base`. `emdash-env.d.ts` is generated by `astro dev` when the schema changes and **is committed** — it types `getEmDashCollection('posts', …)`.
- **Local state**: `astro dev` emulates D1/R2/KV under `.wrangler/state`. Reset a broken local database by deleting that directory, then re-running the setup wizard.
- **Secrets**: local `EMDASH_ENCRYPTION_KEY` lives in `.env` (generate with `bunx emdash secrets generate --write .env`); production uses `wrangler secret put EMDASH_ENCRYPTION_KEY`.
- **Admin & setup**: `/_emdash/admin`. Passkeys bind to the hostname used at setup, so run the production wizard only on the final domain (`jonasperusquia.com`). Never re-run the setup wizard with `update` — it would re-resolve media.
- **Generated types**: `.astro/types.d.ts` is gitignored; run `bun run astro sync` if collection types are stale. `.emdash/migrations.json` is regenerated by every build and is gitignored (`.emdash/seed.json` stays trackable).
