# Agents Guide — jonasperusquia.com

Personal portfolio site. Static Astro site deployed to Cloudflare Pages.

## Commands

```sh
bun run dev        # dev server at http://localhost:4321
bun run build      # production build to dist/
bun run preview    # preview production build
bun run cloudflare # CI build: frozen install + build
```

## Stack

| Concern       | Tool                       |
| ------------- | -------------------------- |
| Framework     | Astro 6 (SSG)              |
| Styling       | Tailwind CSS v4 (Vite plugin) |
| Package mgr   | Bun (lockfile: `bun.lock`) |
| Lint & format | Biome (`biome.json`)       |
| Animations    | GSAP + ScrollTrigger       |
| Analytics     | Clarity + OneDollarStats   |
| Icons         | Material Symbols (rounded) |
| Docs          | `docs/SEO_MANAGER_DOCS.md` |

## Architecture

- **Pages**: `src/pages/index.astro` (en, root) → `src/pages/es/index.astro` (es)
- **Layout**: `src/layouts/Layout.astro` wraps all pages, includes Nav, SEO meta, Analytics, GSAP script, View Transitions
- **Components**: `src/components/` — section-level `.astro` components, no framework components
- **Content**: Astro content collections (`src/content.config.ts`). Only collection is `projects` — glob-loaded JSON files in `src/content/projects/`
- **Utils**: `src/utils/i18n.ts` (translations), `src/utils/seo.ts` (page SEO configs)
- **Static data**: `src/assets/data/` for `skills.json` and `social-networks.json`
- **Scripts**: `src/scripts/gsap-animations.js` — animations bootstrapped via `astro:page-load` event

### i18n

Astro built-in i18n: `prefixDefaultLocale: false`. English at `/`, Spanish at `/es/`.
All user-facing strings in `src/utils/i18n.ts` (type-safe `Translations` record, keyed by `"en" | "es"`).

### Content collections: projects

JSON files in `src/content/projects/`. Schema defined in `src/content.config.ts`. The `description` and `skills` fields are localized objects:

```json
{
  "name": "...",
  "url": "...",
  "image": "...",
  "order": 0,
  "description": { "en": "...", "es": "..." },
  "skills": [{ "en": "...", "es": "..." }]
}
```

Projects are sorted by `order` field, then `description` and `skills` localized to current language in `PortfolioPage.astro`.

## Gotchas

- **No ESLint / Prettier**. Biome handles both lint and format. Run via editor plugin or `npx @biomejs/biome check`.
- **No `tailwind.config.js`**. Tailwind v4 config is CSS-first in `src/styles/global.css`. Custom colors `grayblue-*`, `gold-*`, custom breakpoint `xs` (475px) are defined there.
- **Path alias**: `@/*` → `src/*` (configured in `tsconfig.json`).
- **GSAP lifecycle**: Animations init on `astro:page-load` and cleanup on page unload. If adding animated elements, use classes `gsap-fade-up`, `gsap-fade-up-noreverse`, `gsap-hero-stagger`, or `skill-card`.
- **Dark mode**: class-based (`.dark` on `<html>`). FOUC prevention via inline `<script is:inline>` in Layout. Toggle component in `ThemeToggle.astro`.
- **View Transitions**: `ClientRouter` from `astro:transitions` is enabled in Layout. Navigation uses `transition:name` and `transition:persist` directives.
- **TypeScript**: extends `astro/tsconfigs/base`. JSX configured for React but project uses no React components — only `.astro` files.
- **Cloudflare CI**: The `cloudflare` script does `bun install --frozen-lockfile && bun run build`. This is the deploy command; `bun.lock` must be committed.
- **Generated types**: `.astro/types.d.ts` is gitignored; run `bun run astro sync` if content collection types are stale.
