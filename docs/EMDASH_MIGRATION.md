# EmDash CMS migration — design doc

- **Status:** **deployed to production 2026-10-12** — `jonasperusquia.com` runs on the Worker (D1 + R2 + KV), setup wizard complete, public pages + cron verified. Resolved at approval: repo `jonaspm/jonasperusquia-site` is public → commit-pinned raw GitHub URLs seed the media; `www.jonasperusquia.com` → 301 redirect to apex; KV object cache, code-level SEO (Phase 1) and plain-text `body` adopted as recommended.
- **Target:** `jonasperusquia.com` (Astro 7 → EmDash 1.2 managed content, Cloudflare Pages → Workers SSR + D1 + R2)
- **Date:** 2026-10-12
- **Evidence base:** every API/behaviour claim below was verified against the *published packages* (`emdash@1.2.0`, `@emdash-cms/cloudflare@1.2.0`, `astro@7.3.8`, `@astrojs/cloudflare@14.3.4`, `@astrojs/react@7.0.1`) downloaded from the npm registry and read from disk, plus the docs index. Sources are named inline where it matters (e.g. `loader.ts:1700`).

---

## 1. Summary & architecture

### 1.1 Goal

Editors manage the 6 existing portfolio posts (18 localized entries = 6 posts × `en`/`es`/`eo`) in the EmDash admin at `/_emdash/admin`. The public site keeps its current URLs, markup, styling, dark mode, GSAP animations, analytics and SEO behaviour. Deployment moves from a static Cloudflare Pages site to a single Cloudflare Worker (SSR) with D1 (content) and R2 (media).

### 1.2 Verification gate (no blocker found)

| Check | Result |
| --- | --- |
| `emdash@1.2.0` peer deps | `astro >=6.0.0-beta.0` → **Astro 7.3.8 OK**; `@astrojs/react >=5.0.0-beta.0`; `react`/`react-dom >=18`; optional peer `@emdash-cms/auth-atproto` (not needed, passkey auth) |
| `@emdash-cms/cloudflare@1.2.0` peer deps | `@astrojs/cloudflare >=12.0.0` → **14.3.4 OK**; `astro >=6.0.0`; `wrangler >=4.99.0`; `kysely >=0.28.17`; optional peers `pg`, `@cloudflare/kumo`, `@phosphor-icons/react`, `react` |
| EmDash's own toolchain | `emdash@1.2.0` devDeps build against `astro ^7.3.2`, `@astrojs/react ^7.0.0`, `react 19.2.4`, and `@emdash-cms/cloudflare` devDeps against `@astrojs/cloudflare ^14.3.1` + `wrangler ^4.125.0` → this combination is the vendor's own CI matrix |
| Prerelease caveat | `emdash` declares prerelease-range peers (`>=6.0.0-beta.0`, `>=5.0.0-beta.0`). Bun installs fine; expect an informational peer-range note at most |
| Live content collections | Stable in Astro 7 (`defineLiveCollection` in `astro:content`, config file `src/live.config.ts`, no experimental flag; needs an adapter — we have one) |
| Version drift vs PRD | PRD said "EmDash v1.0 stable" → current stable is **1.2.0**. Use 1.2.0 (`^1.2.0` floats to 1.x patches only) |

### 1.3 Current vs target

```
CURRENT (Cloudflare Pages, static)
  build ──► dist/ (HTML + hashed assets) ──► Pages CDN
  content: src/content/posts/*.json  (glob loader, build-time collection)
  images : src/assets/images/*.png   (astro:assets, sharp at build time)

TARGET (Cloudflare Worker, SSR)
  request ──► Worker
                ├─ /_astro/*, /favicon*, /seed-media*  ──► ASSETS binding (edge, no Worker CPU)
                ├─ /_emdash/*                          ──► EmDash admin + REST API (auth)
                ├─ /_image                             ──► EmDash image endpoint
                │                                          media URL → R2 bytes → IMAGES binding
                └─ /, /es, /eo, /portfolio…            ──► Astro SSR pages
                                                            content → D1 (binding DB)
                                                            media   → R2 (binding MEDIA)
                                                            cached  → KV (binding CACHE)
  worker entry: src/worker.ts  (Astro server handler + scheduled() sweep)
  cron        : * * * * *      (scheduled publishing / maintenance)
```

### 1.4 Request → content flow (public page)

1. Request hits the Worker. Static assets (`/_astro/*`, `public/` files) are served by Cloudflare's asset layer first (`ASSETS` binding, assets-first default) — no Worker CPU for those.
2. Everything else reaches `src/worker.ts` → `@astrojs/cloudflare/entrypoints/server` → Astro SSR.
3. EmDash middleware (injected by `emdash/astro`) initialises the runtime on public paths: D1 binding → Kysely → migrations check; request context (locale from `Astro.currentLocale`, preview/edit mode flags) goes into AsyncLocalStorage.
4. The page calls `getEmDashCollection('posts', { locale, status: 'published', orderBy: { sort_order: 'asc' } })` (see `src/utils/emdash-posts.ts`). The loader queries the `ec_posts` table (`src/loader.ts:1700`), hydrates, folds duplicates within the request, and returns `{ entries, error, cacheHint }`.
5. KV object cache (`kvCache`) serves repeat reads without touching D1; writes bump a namespace epoch, so published edits appear immediately in the writing isolate and within the KV propagation window (~60s, isolate-local `revalidate` 1s) elsewhere.
6. `entry.data.slug/title/image/...` is mapped to the existing `PostViewModel` / `ProjectViewModel`; components render exactly as today.

### 1.5 Request → edit flow (admin)

1. Editor opens `https://jonasperusquia.com/_emdash/admin` → React admin SPA (hydrated via `client:only="react"`, hence the `@astrojs/react` requirement).
2. Login = passkey (WebAuthn), bound to the **hostname used at setup**. `siteUrl` is set explicitly and `www.` is added as an allowed origin.
3. Publishing writes to D1 and bumps the object-cache epoch + invalidates collection caches.
4. The next public request reads the new content (KV cache epoch bumped; worst case bounded by KV propagation).

---

## 2. Dependency changes

Bun installs from `package.json`; `bun.lock` must be committed (`cloudflare` script uses `--frozen-lockfile`).

### 2.1 Add

| Package | Range | Why |
| --- | --- | --- |
| `emdash` | `^1.2.0` | CMS core + `emdash/astro` integration + `emdash/runtime` loader + `emdash/ui` components |
| `@emdash-cms/cloudflare` | `^1.2.0` | `d1()`, `r2()`, `kvCache()` adapters, `@emdash-cms/cloudflare/worker` entrypoint, `image-endpoint` |
| `@astrojs/react` | `^7.0.1` | EmDash's admin SPA is React and hydrates via `client:only="react"`; without it the admin hangs on "Loading EmDash…" (hard-warned by the integration) |
| `react` | `^19.3.0` | peer of `@astrojs/react` + EmDash (built against 19.2.x; `>=18` accepted) |
| `react-dom` | `^19.3.0` | same |
| `@types/react` | `^19.3.0` | dev only |
| `@types/react-dom` | `^19.3.0` | dev only |
| `wrangler` | `^4.125.0` | **required**: `@astrojs/cloudflare@14` peer + `@emdash-cms/cloudflare` *imports* `wrangler` (`unstable_readConfig`) while `astro.config.ts` is evaluated |
| `kysely` | `^0.29.0` | peer of `@emdash-cms/cloudflare` declared explicitly so the peer resolves deterministically (EmDash itself depends on `^0.29.0`) |
| `@cloudflare/workers-types` | `^5.20261012.1` | peer of `@emdash-cms/cloudflare` (`>=4.0.0`); types for `ExportedHandler` in `src/worker.ts` |

Optional peers **not** added (all have `peerDependenciesMeta.optional`): `pg`, `@cloudflare/kumo`, `@phosphor-icons/react`, `@emdash-cms/auth-atproto`.

### 2.2 Not added (deliberately)

| Rejected | Why |
| --- | --- |
| Sandboxed/registry plugins, `sandbox()`, `LOADER` binding | Paid Dynamic Workers requirement, out of scope |
| `astro-portabletext` | Transitive dep of EmDash; only needed if we adopt `portableText` fields (we do not) |
| `@astrojs/sitemap` | We hand-write a 30-line `src/pages/sitemap.xml.ts` and keep EmDash's `/sitemap-{collection}.xml` for free |
| `@emdash-cms/auth-atproto`, GitHub/Google auth | Passkey auth is enough; avoids an optional peer + OAuth secrets |
| Workers Cache route rules | Phase 2 (see §1.3/§8.4); KV object cache already offloads D1 with correct publish semantics |

### 2.3 Unchanged

`astro@7.3.8`, `@astrojs/cloudflare@14.3.4`, `astro-mcp@^0.4.2` (dev-only vite plugin, no routes injected → safe under `output: 'server'`), `gsap`, `tailwindcss`, `@tailwindcss/vite`, Biome, `@types/bun`. The uncommitted bumps in the working tree are the base and stay as-is.

---

## 3. Configuration changes

### 3.1 `astro.config.ts` (full target)

```ts
import cloudflare from '@astrojs/cloudflare'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, envField } from 'astro/config'
import { d1, kvCache, r2 } from '@emdash-cms/cloudflare'
import emdash from 'emdash/astro'
import mcp from 'astro-mcp'

// https://astro.build/config
export default defineConfig({
	site: 'https://jonasperusquia.com',
	// EmDash content is read through live collections, which require on-demand
	// rendering (Astro docs: "Requires SSR mode or export const prerender = false").
	output: 'server',
	// `imageService: 'compile'` was REMOVED on purpose — see §4.3. With the
	// adapter's default (`cloudflare-binding`) the adapter sets
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
```

Notes

- The adapter always runs first, so EmDash observes the endpoint the adapter installed and may override it (`src/astro/integration/index.ts:243`). Keep `react()` and `emdash()` after `mcp()`; ordering between the three does not matter otherwise.
- `CLARITY_ID` env schema, `astro-mcp`, Tailwind vite plugin, `server.host/port` all stay.
- EmDash's optional auto-added bindings: `SESSION` (KV, auto-provisioned; unused — EmDash docs say keep EmDash sessions disabled) and `IMAGES` (auto-added because `imageService` is not `'compile'`). See §4.3.

### 3.2 `wrangler.jsonc` (new file, repo root)

```jsonc
{
	"$schema": "node_modules/wrangler/config-schema.json",
	"name": "jonasperusquia-com",
	// Custom entry: the Astro CF server handler + EmDash's scheduled() sweep.
	// The adapter's config customizer respects a user-supplied `main`
	// (`main: config.main ?? "@astrojs/cloudflare/entrypoints/server"`).
	"main": "./src/worker.ts",
	"compatibility_date": "2026-02-24",
	"compatibility_flags": ["nodejs_compat"],
	// D1 + R2 are auto-provisioned on first `wrangler deploy` (binding without id).
	// If the CLI/account refuses, run `wrangler d1 create` / `wrangler r2 bucket create`
	// and pin `database_id` / `bucket_name` here (see §8.5).
	"d1_databases": [{ "binding": "DB", "database_name": "jonasperusquia-com" }],
	"r2_buckets": [{ "binding": "MEDIA", "bucket_name": "jonasperusquia-media" }],
	"kv_namespaces": [{ "binding": "CACHE" }],
	// Scheduled publishing / maintenance sweep. * * * * * matches EmDash's
	// documented cadence (Node scheduler caps its poll at 60s for the same reason).
	"triggers": { "crons": ["* * * * *"] },
	// Optional: run the isolate near D1's region. Safe to omit.
	"placement": { "mode": "targeted" },
	"observability": { "enabled": true }
}
```

- Do **not** add `assets` (the adapter/vite plugin sets the `ASSETS` binding and client directory).
- Do **not** add `global_fetch_strictly_public`: it silently breaks D1 sessions (`@emdash-cms/cloudflare` D1Config docs).
- Do **not** add a `routes`/`workers_dev: false` entry before the custom domain exists (§8.3).

### 3.3 `src/worker.ts` (new)

```ts
// Cloudflare Worker entry. Wraps the Astro CF server handler with EmDash's
// scheduled() sweep so `triggers.crons` has something to call.
import handler, { createScheduledHandler } from '@emdash-cms/cloudflare/worker'

export default {
	...handler,
	scheduled: createScheduledHandler(),
} satisfies ExportedHandler
```

- `PluginBridge` is **not** re-exported: it is EmDash's sandboxed-plugin Durable Object, and we run no sandboxed plugins. The package default export already contains the Astro handler; skipping the re-export avoids registering an unused DO class.
- `createScheduledHandler()` with no `generalCron` accepts any cron expression (we only declare one).

### 3.4 `src/live.config.ts` (new)

```ts
import { defineLiveCollection } from 'astro:content'
import { emdashLoader } from 'emdash/runtime'

// The collection key MUST be `_emdash`: getEmDashCollection/getEmDashEntry
// resolve through getLiveCollection("_emdash", …) (src/query.ts:392).
export const collections = {
	_emdash: defineLiveCollection({ loader: emdashLoader() }),
}
```

### 3.5 `package.json` (diff)

```jsonc
{
	"scripts": {
		"dev": "astro dev",
		"build": "astro build",
		// was: "bun install --frozen-lockfile && bun run build" (Pages build command).
		// `wrangler deploy` picks up the generated config via .wrangler/deploy/config.json.
		"cloudflare": "bun install --frozen-lockfile && bun run build && wrangler deploy",
		"deploy": "bun run build && wrangler deploy",
		"preview": "astro preview",
		"seed:validate": "emdash seed seed/seed.json --validate",
		"db:export": "wrangler d1 export DB --remote --output=./backups/d1-export.sql",
		"astro": "astro"
	},
	// Seed discovery order is .emdash/seed.json → package.json#emdash.seed → seed/seed.json.
	// Be explicit so the path is greppable and survives the conventional-path branch changing.
	"emdash": { "seed": "seed/seed.json" }
}
```

`engines`/`packageManager`/`trustedDependencies` unchanged. `@parcel/watcher` and `sharp` stay in `trustedDependencies` (sharp is still used as a dev/build fallback for `<Image>` in other contexts; no harm).

### 3.6 `.env.example` (append)

```dotenv
# EmDash (generated locally with: bunx emdash secrets generate --write .env)
# Production: wrangler secret put EMDASH_ENCRYPTION_KEY
EMDASH_ENCRYPTION_KEY=

# Optional override; the integration config sets siteUrl explicitly, so this is
# only needed if the site is served from a different origin (e.g. preview host).
EMDASH_SITE_URL=
```

Also: remove the `pages` assumption from `README.md` (stack table + commands) — see §6.

### 3.7 Generated / no change

| File | Action |
| --- | --- |
| `emdash-env.d.ts` | **Generated** at project root by the integration during `astro dev` (and refreshed on schema change; see `astro/integration/dev-typegen.ts`). **Commit it** (CI has no dev server + DB to regenerate it). `tsconfig.json` needs no change: `include: ["**/*"]` already covers it |
| `tsconfig.json` | No change (`verbatimModuleSyntax`, `@/*` alias, React JSX config all stay) |
| `biome.json` | Add `"files": { "includes": ["**", "!**/emdash-env.d.ts", "!dist/**", "!**/.astro/**", "!**/.wrangler/**"] }` (Biome 2.x pattern list: positive patterns first, negations after) so Biome never reformats generated or build output |
| `.gitignore` | No change (`.env*`, `dist/`, `.wrangler/` already ignored). Add `backups/` if `db:export` is used |
| `src/env.d.ts` | No change |

---

## 4. Content model

### 4.1 Seed file `seed/seed.json`

EmDash seed v1 (`SeedFile` type, `src/seed/types.ts`). Collections/fields are applied always; content only with `includeContent` (the setup wizard sends it, and the CLI's `--content` defaults to true). Media in content uses `$media: { url, alt?, filename?, caption? }` — **URL-only** in 1.2.0 (the `mediaBasePath`/local-file option exists in the type but is not what `$media` parsing consumes).

```jsonc
{
	"version": "1",
	"defaultLocale": "en",
	"meta": {
		"name": "jonasperusquia.com",
		"description": "Portfolio posts (projects & articles) with en/es/eo translations"
	},
	"settings": {
		"title": "Jonas Perusquia Morales",
		"tagline": "Msc. Data Science & Software Engineer"
	},
	"collections": [
		{
			"slug": "posts",
			"label": "Posts",
			"labelSingular": "Post",
			"description": "Portfolio projects and articles",
			"icon": "article",
			// 'search' intentionally omitted (no FTS index needed for 6 entries);
			// 'seo' intentionally omitted in Phase 1 — see §4.5.
			"supports": ["drafts", "revisions", "preview", "scheduling"],
			"urlPattern": "/portfolio/{slug}",
			"routable": true,
			"titleField": "title",
			"dateField": "date",
			"admin": {
				"listColumns": ["category", "date", "sort_order"],
				"quickCreate": false
			},
			"fields": [
				{ "slug": "title", "label": "Title", "type": "string", "required": true, "translatable": true },
				{
					"slug": "category",
					"label": "Category",
					"type": "select",
					"required": true,
					"translatable": false,
					"indexed": true,
					"defaultValue": "project",
					"validation": { "options": ["project", "article"] }
				},
				{ "slug": "url", "label": "External URL", "type": "url", "required": false, "translatable": false },
				{ "slug": "image", "label": "Image", "type": "image", "required": false, "translatable": false },
				{
					"slug": "sort_order",
					"label": "Order",
					"type": "integer",
					"required": false,
					"translatable": false,
					"indexed": true,
					"defaultValue": 0
				},
				{ "slug": "date", "label": "Date", "type": "datetime", "required": false, "translatable": false },
				{ "slug": "summary", "label": "Summary", "type": "text", "required": true, "translatable": true, "widget": "textarea" },
				{ "slug": "body", "label": "Body", "type": "text", "required": true, "translatable": true, "widget": "textarea" },
				{ "slug": "skills", "label": "Skills", "type": "json", "required": false, "translatable": true }
			]
		}
	],
	"content": {
		"posts": [
			// 18 entries — en first, then es, then eo per post (translationOf must
			// reference an earlier entry's seed-local `id` in the same collection).
		]
	}
}
```

> **Update (2026-10-12):** the `category` select field was replaced by EmDash's built-in `category` taxonomy (declared in the seed with terms `project`/`article`). Content entries now assign `taxonomies: { "category": ["project"] }` instead of a `data.category` value, and `admin.listColumns` dropped `category` (now `["date", "sort_order"]`). Reads hydrate the assigned terms onto `entry.data.terms` (`Record<taxonomyName, TaxonomyTerm[]>`, locale-aware with default-locale fallback); classification lives in `categoryOf()` in `src/utils/emdash-posts.ts` (a post is a project only when it carries the `project` term; term slugs `project`/`article` must stay stable because classification matches slugs, and the es/eo term translations are seeded with the same slugs). The `category` row in the field table below describes the replaced design.

Field decisions

| Field | Type | translatable | indexed | Why |
| --- | --- | --- | --- | --- |
| `title` | `string` | ✅ | – | Powers `titleField`, the admin list Title column, the page `<h1>` and the `<title>` suffix |
| ~~`category`~~ *(removed 2026-10-12)* | ~~`select` (`project`/`article`)~~ | – | – | **No longer a collection field** — replaced by EmDash's built-in `category` taxonomy (see the Update note above); classification reads the hydrated terms (`entry.data.terms`) via `categoryOf()` |
| `url` | `url` | ❌ shared | – | External project link, same for all locales |
| `image` | `image` (MediaValue) | ❌ shared | – | One screenshot per post; language-neutral. Admin gets a media picker + upload |
| `sort_order` | `integer` | ❌ shared | ✅ | Order is presentation, must match across locales. **Renamed from `order`** because `ORDER` is a SQLite keyword — the seed is the only consumer of the name, and the project column can be quoted anyway; the rename removes the whole class of "is this quoted in every code path" questions. Mapped back to `order` in the view model |
| `date` | `datetime` | ❌ shared | – | `dateField` for the admin list; ISO-8601 `Z` strings are accepted by the `z.iso.datetime({ offset: true })` field schema |
| `summary` | `text` (+ `widget: textarea`) | ✅ | – | Listing excerpt + `<meta name="description">` on the detail page (today's behaviour) |
| `body` | `text` (+ `widget: textarea`) | ✅ | – | **Not `portableText`.** All 6 bodies are single sentences rendered as one `<p>` (`src/pages/portfolio/[slug].astro:116`); PortableText would force `<PortableText>` rendering and change the detail-page markup for zero editorial gain. `textarea` is **not** a valid seed `FieldType` (`FIELD_TYPE_TO_COLUMN`), so the type is `text` + widget hint; verify in the admin that it renders multi-line (§9.1) |
| `skills` | `json` (`string[]`) | ✅ | – | Exact shape of today's `skills: [{en,es,eo}]` after localization (`string[]`), zero schema risk, and the loader auto-parses JSON-looking strings into arrays (`src/loader.ts:mapRowToData`). **Not** `repeater` (sub-field seed shape unverified, and a JSON column is what a repeater serializes to anyway) and **not** a taxonomy (adds term tables, translations and counts for a per-post tag list that is never browsed). If a nicer list editor is wanted later: create the field in the admin, run `bunx emdash export-seed`, and replace the field definition |

### 4.2 Content entries — one post × 3 locales (complete example)

`enerlinq`, translated from `src/content/posts/enerlinq.json`. `id` is seed-local only; `translationOf` wires the translation group.

```jsonc
{ "id": "post:enerlinq:en", "slug": "enerlinq", "status": "published", "locale": "en",
  "taxonomies": { "category": ["project"] },
  "data": {
    "title": "Enerlinq",
    "url": "https://enerlinq.com",
    "image": { "$media": {
      "url": "https://raw.githubusercontent.com/jonaspm/jonasperusquia.com/COMMIT_SHA/src/assets/images/enerlinq.com.png",
      "alt": "Enerlinq",
      "filename": "enerlinq.com.png" } },
    "sort_order": 0,
    "date": "2025-01-15T00:00:00.000Z",
    "summary": "IT and digital transformation consulting company.",
    "body": "IT and digital transformation consulting company.",
    "skills": ["ERPNext", "ServiceNow", "Node.js", "Software development", "AI Agents", "Cloud Computing", "Project management"]
  } },

{ "id": "post:enerlinq:es", "slug": "enerlinq", "status": "published", "locale": "es",
  "translationOf": "post:enerlinq:en",
  "taxonomies": { "category": ["project"] },
  "data": {
    "title": "Enerlinq",
    "url": "https://enerlinq.com",
    "sort_order": 0,
    "date": "2025-01-15T00:00:00.000Z",
    "summary": "Consultora de TI y transformacion digital.",
    "body": "Consultora de TI y transformacion digital.",
    "skills": ["ERPNext", "ServiceNow", "Node.js", "Desarrollo de software", "Agentes de IA", "Computacion en la nube", "Gestion de proyectos"]
  } },

{ "id": "post:enerlinq:eo", "slug": "enerlinq", "status": "published", "locale": "eo",
  "translationOf": "post:enerlinq:en",
  "taxonomies": { "category": ["project"] },
  "data": {
    "title": "Enerlinq",
    "url": "https://enerlinq.com",
    "sort_order": 0,
    "date": "2025-01-15T00:00:00.000Z",
    "summary": "IT kaj cifereca transforma konsilanta firmao.",
    "body": "IT kaj cifereca transforma konsilanta firmao.",
    "skills": ["ERPNext", "ServiceNow", "Node.js", "Programara disvolvigo", "AI Agentoj", "Nuba komputado", "Projekta mastrumado"]
  } }
```

Translation rules for the other 5 posts (mechanical):

1. **`image` / `url` / `sort_order` / `date`** are `translatable: false` (shared). **Still write the identical values on all three entries** — the seed engine inserts rows directly, and relying on the save-time `syncNonTranslatableFields` path (which copies en → es/eo on *editor* saves) during seed apply would risk `NULL` shared columns in the es/eo rows and an empty `/es/portfolio` listing. Duplicating the values is idempotent and makes the seed correct on its own; the shared-field behaviour is then verified through the admin (§9.1#4), not through the seed. The same applies to the entry-level `taxonomies: { "category": ["project"] }` assignment: write it on every locale entry.
2. `title`, `summary`, `body` come from the matching locale of the source JSON; `skills` becomes an array of that locale's strings.
3. Per-post identity (from the current JSON files):

| slug | order | date | url | image |
| --- | --- | --- | --- | --- |
| `enerlinq` | 0 | 2025-01-15T00:00:00.000Z | https://enerlinq.com | enerlinq.com.png |
| `autosolutions` | 1 | 2025-02-01T00:00:00.000Z | https://autosolutions.mx | autosolutions.mx.png |
| `sorteos-click` | 2 | 2025-03-10T00:00:00.000Z | https://sorteos.click | sorteos.click.png |
| `gerardo-ancer` | 3 | 2025-04-05T00:00:00.000Z | https://gerardoancer.com | gerardoancer.com.png |
| `hackcuu-2017` | 4 | 2017-11-01T00:00:00.000Z | https://facebook.com/hackcuu2 | hackcuu.com.png |
| `petweby` | 5 | 2025-05-20T00:00:00.000Z | https://petweby.com | petweby.com.png |

All 6 carry the `project` category term (no `article` posts yet — the listing filter keeps its Articles button and empty state).

### 4.3 Media strategy — migrate the 6 PNGs into EmDash media (R2)

**Chosen: option (a), EmDash-managed media.** The `image` field is an EmDash `image` field; editors can swap a screenshot or upload one for a new post without a code change. Option (b) (keep the `imageMap` of static imports + a filename string field) was rejected because it leaves half the post unmanageable and requires a deploy per image change.

Why this is now safe:

- The adapter's default image service (`cloudflare-binding`, i.e. `imageService` key removed) makes the adapter install `image.endpoint = "@astrojs/cloudflare/image-transform-endpoint"`, which is in EmDash's `OVERRIDABLE_IMAGE_ENDPOINTS` set → EmDash replaces it with `@emdash-cms/cloudflare/image-endpoint`. That endpoint reads the source bytes **from the R2 binding** (no HTTP fetch, Access-safe) and transforms with the `IMAGES` binding; non-media images are delegated to the adapter's stock endpoint.
- The `IMAGES` binding is auto-added by the adapter. Cloudflare's free plan includes **5,000 unique transformations/month**; our 6 images × ~6 widths × 2 layouts is a few dozen unique transform URLs, and they are cached with `Cache-Control` + validators. Cost ≈ $0.
- Graceful degradation: if the binding is unavailable, the endpoint streams the original bytes and `emdash/ui`'s `Image` falls back to a plain `<img>` (its `buildResponsiveImage` only emits a srcset when the service actually rewrote the URL).
- EmDash also injects the media origin into `image.remotePatterns`, so `astro:assets` will optimize the `/_emdash/api/media/file/{key}` URL — no manual `image.remotePatterns` config.

Concrete upload path (identical locally and in production — the setup wizard runs the seed **inside the app**, so it uses the configured storage adapter):

| Environment | Command | Result |
| --- | --- | --- |
| Local | `bun run dev`, then open `http://localhost:4321/_emdash/admin`, complete the wizard with "include content" | `$media.url` downloaded → written to the local R2 (`.wrangler/state/v3/r2`), media rows in local D1 |
| Production | open `https://jonasperusquia.com/_emdash/admin` once on the final hostname, complete the wizard | downloaded → real R2 bucket `jonasperusquia-media`, media rows in production D1 |

`$media.url` must therefore be reachable **from both** the dev machine and the deployed Worker at setup time:

- **Preferred:** commit-pinned raw GitHub URLs, e.g. `https://raw.githubusercontent.com/<owner>/<repo>/<full-sha>/src/assets/images/enerlinq.com.png`. Works everywhere, no repo bloat, immutable. Requires the repo to be public (open question Q1).
- **Fallback (private repo):** copy the 6 PNGs to `public/seed-media/` **temporarily**, use `https://jonasperusquia.com/seed-media/<file>.png` (and `http://localhost:4321/seed-media/<file>.png` locally), then delete the directory after setup completes. Safe because re-applying the seed with `onConflict: "skip"` never re-downloads media for existing entries — never re-run the wizard with `update`.
- **Do not** use `emdash seed` (CLI) for media: the CLI writes media through `LocalStorage` into `./uploads`, while `astro dev` reads media from the **R2 binding** — the rows would point at keys the dev server cannot serve.

Component changes: replace the per-component `imageMap` + `astro:assets` `<Image>` with `Image` from `emdash/ui` (`EmDashImage`) wrapped in one local component (`src/components/PostImage.astro`) that keeps the current classes and `widths`-equivalent behaviour. Pass `placeholder={false}`: EmDash's LQIP blur-up background is visually new and we are keeping the design unchanged. `loading="lazy"` stays the default (EmDashImage lazy-loads unless `priority`).

`src/assets/images/*.png` stay in the repo for Phase 1 (rollback safety) and are deleted in a follow-up cleanup commit once production is verified.

### 4.4 URLs and locales

- Each translation is an independent row: `ec_posts` gets 18 rows (`slug` unique **per locale**).
- Public URLs are unchanged: `/portfolio/{slug}`, `/es/portfolio/{slug}`, `/eo/portfolio/{slug}`, `/`, `/es`, `/eo`, `/portfolio`, `/es/portfolio`, `/eo/portfolio`. File-based i18n routing is untouched (see §6.1), so this is guaranteed by construction.
- `urlPattern: "/portfolio/{slug}"` is single-valued and locale-agnostic, so it matches the `en` path. It powers EmDash's own previews/canonical/`/sitemap-posts.xml`; our own `src/pages/sitemap.xml.ts` emits the locale-correct URLs. Don't rely on EmDash's sitemap for localized URLs.
- Fallback: `i18n.fallback = { es: 'en', eo: 'en' }` feeds EmDash's `getFallbackChain()`; a missing `es`/`eo` entry serves the `en` entry and reports `fallbackLocale` on the result. Public routes exist for all locales regardless, so Astro's own SSG-style fallback generation never comes into play.

### 4.5 SEO

Phase 1 keeps SEO 100% in code — `src/utils/seo.ts` is unchanged, so `<title>`/description/keywords/OG/Twitter/hreflang alternates/`Person` JSON-LD are byte-identical to today. The detail page keeps `getPageSEO('portfolio', language)` + `title={entry title} - Portfolio` + `description={entry summary}` (`src/pages/portfolio/[slug].astro:59-65`).

- `supports: ['seo']` is **omitted** in Phase 1 so the admin does not offer an SEO panel we ignore.
- Phase 2 (documented, not implemented): add `"seo"` to `supports`, then read `getSeoMeta`/`getContentSeo` from `emdash/seo` in the detail page and merge into the existing `SEOConfig`.
- Sitemap/robots: today `public/sitemap.xml` (3 lines, homepage only) and `public/robots.txt` exist. EmDash injects `/sitemap.xml`, `/sitemap-[collection].xml` and `/robots.txt` **only when `src/pages/<name>` does not exist** (`astro/integration/routes.ts`), and Cloudflare serves `public/` assets before the Worker, so today's files would silently shadow EmDash's routes — a confusing half-state. Resolution: **delete both `public/` files and add `src/pages/sitemap.xml.ts` + `src/pages/robots.txt.ts`** (≈40 lines total). EmDash then skips its own injections (deterministic ownership), `/sitemap-posts.xml` stays available, and the sitemap can list all 9+ public URLs with `hreflang` alternates.

---

## 5. Migration plan

Run order matters: seed file → local verify → deploy → production wizard.

### 5.1 Prepare the seed (all values)

1. `mkdir seed` and write `seed/seed.json` (§4.1/4.2): `settings`, the `posts` collection + 9 fields, and 18 content entries (per-post table in §4.2). Include `translationOf` only on `es`/`eo` entries.
2. Resolve the 6 `$media.url` values (§4.3) and substitute them (no `COMMIT_SHA` placeholder left in the file).
3. Validate without touching a database:
   ```sh
   bun run seed:validate
   # → "Seed file is valid"
   ```
   Fix any `errors[]` (they name collection/field/content paths). Warnings are acceptable.

### 5.2 Local

```sh
# 1. Install (adds emdash + @emdash-cms/cloudflare from §2.1)
bun install

# 2. Encryption key for local dev (loaded from .env into process.env by the integration)
bunx emdash secrets generate --write .env

# 3. Start (bindings resolved from wrangler.jsonc; D1/R2 emulated under .wrangler/state)
bun run dev

# 4. First-run setup: open http://localhost:4321/_emdash/admin
#    - setup wizard → site title/tagline → "include content" → continue until it reports complete
#      (the wizard applies the seed in budgeted chunks: 500 queries / 5 media downloads per
#       request, so it may post several times; 6 $media downloads = at least 2 rounds)
#    - create the admin user (passkey registered for localhost)

# 5. Types appear at the repo root after the schema exists
ls emdash-env.d.ts     # commit this file
```

Empirical shortcut: run `bun run seed:validate` (step 3 of §5.1) *before* starting the dev
server — it catches collection/field/content typos without needing D1.

Local checks: §9.1.

### 5.3 Production

```sh
# 1. Secret (once per environment)
wrangler secret put EMDASH_ENCRYPTION_KEY     # paste the value from .env

# 2. Deploy (custom domain must already be attached — see §8.3, passkeys bind to hostname)
bun run cloudflare

# 3. Open https://jonasperusquia.com/_emdash/admin in a browser ON THAT HOSTNAME
#    → wizard (site title/tagline, include content) → passkey registration
#    → let the wizard post repeatedly until it reports setup complete
```

Do **not** run the wizard on a `*.workers.dev` or preview hostname: passkeys bind to the exact hostname, and `emdash:site_url` is written once.

### 5.4 Expected resulting state

| Object | Expected |
| --- | --- |
| `_emdash_collections` | 1 row (`posts`) |
| `_emdash_fields` | 9 rows for `posts` |
| `ec_posts` | **18 rows** — 6 slugs × 3 locales, `status = 'published'`, `published_at` set; 18 distinct ids, 6 distinct `translation_group` values (one per post, shared by its 3 rows) |
| Shared columns | `url`, `sort_order`, `date` identical across the 3 rows of each group; the `category` term assignment is identical on all 3 rows (taxonomy, not a column) |
| `_emdash_media` | 6 rows |
| R2 (`jonasperusquia-media`) | 6 objects (one per PNG) |
| `_emdash_options` | `emdash:setup_complete = true`, `emdash:site_url = https://jonasperusquia.com` |
| Public pages | identical HTML to today, except `<img src>` pointing at `/_emdash/api/media/file/{key}` via `/_image` |

Field-value mapping (source JSON → seed):

| Source | Seed | Transform |
| --- | --- | --- |
| `title` | `title` (per locale) | verbatim |
| `slug` | entry `slug` | verbatim, identical across the 3 locales |
| `category` | entry-level `taxonomies: { "category": ["project"] }` (all locales) | select-field value → taxonomy term slug assignment |
| `url` | `url` (en only) | verbatim |
| `image` | `image.$media` (en only) | filename → `$media.url` + `$media.filename` + `alt = title` |
| `order` | `sort_order` (en only) | verbatim integer |
| `date` | `date` (en only) | verbatim ISO-8601 `Z` |
| `summary.{locale}` | `summary` | verbatim (plain string) |
| `body.{locale}` | `body` | verbatim (plain string → `text` field; no PortableText conversion) |
| `skills[].{locale}` | `skills` | localized array of strings (`["Node.js", "ServiceNow", …]`) |

### 5.5 Idempotency

- `applySeed` matches content by **collection + slug + locale**; the wizard always uses `onConflict: "skip"`, so re-posting is safe and never duplicates or re-downloads media. Already-created items are skipped ("The wizard posts again; items already created are skipped").
- Collections/fields are upserted by slug; `skip` leaves existing definitions untouched.
- Re-running the **CLI** after content exists is a no-op; do **not** pass `--on-conflict update` while `$media` URLs are unpublished (it would re-resolve media).
- Phase-1 seed is applied once per environment; it is not a continuous-sync mechanism (edits live in D1 from then on).

---

## 6. Code changes, file by file

### 6.1 Route consolidation

Astro's `i18n` + `prefixDefaultLocale: false` maps `/es/...` to `src/pages/es/...` by **file path**; a single `[...lang]` rest-param route would work in SSR but breaks that contract and route priority. So consolidation is: **one shared component per page type + 3 two-line wrappers each** (the wrappers are locale constants, not logic).

| Path | Action | Purpose |
| --- | --- | --- |
| `src/pages/index.astro` | unchanged | `<PortfolioPage language="en" />` |
| `src/pages/es/index.astro` | unchanged | same, `es` |
| `src/pages/eo/index.astro` | unchanged | same, `eo` |
| `src/pages/portfolio/index.astro` | unchanged | `<PortfolioListing language="en" />` |
| `src/pages/es/portfolio/index.astro` | unchanged | same, `es` |
| `src/pages/eo/portfolio/index.astro` | unchanged | same, `eo` |
| `src/pages/portfolio/[slug].astro` | **rewrite (~10 lines)** | renders `<PostDetail language="en" />` |
| `src/pages/es/portfolio/[slug].astro` | **rewrite (~10 lines)** | `language="es"` |
| `src/pages/eo/portfolio/[slug].astro` | **rewrite (~10 lines)** | `language="eo"` |
| `src/components/PostDetail.astro` | **new** | The current 140-line detail page body, fed by `getPost(language, Astro.params.slug)`; 404 via `Astro.response.status = 404; return Astro.rewrite('/404')` when the entry is missing/unpublished or the slug is absent. Keeps `getRelativeLocaleUrl`, the category badge, `<time>`, body paragraph, external link button and skill pills verbatim |
| `src/pages/404.astro` | **new** | Minimal localized 404 (Layout + translated title + `backToHome` link). Required: today there is no 404 route, and `Astro.rewrite('/404')` needs a target |

### 6.2 Data layer

| Path | Action | Purpose |
| --- | --- | --- |
| `src/live.config.ts` | new | `_emdash` live collection (§3.4) |
| `src/utils/emdash-posts.ts` | **new** | The only module that knows EmDash's shapes. Exports `POST_SLUG = 'posts'`, `PostEntryData`, `listPosts(language)`, `getPost(language, slug)`, `toPostViewModel()`, `toProjectViewModel()`, `postMedia(entry)`. Wraps `getEmDashCollection<PostSlug, PostEntryData>('posts', { locale, status: 'published', orderBy: { sort_order: 'asc' }, limit: 100 })` and `getEmDashEntry<PostSlug, PostEntryData>('posts', slug, { locale })`; on `error` logs and returns `[]` / `null` so pages degrade to today's empty-state behaviour instead of throwing 500s |
| `src/utils/i18n.ts` | **edit** | `PostViewModel.image: string?` and `ProjectViewModel.image: string` → `media?: MediaValue \| null` (type-only change; all `Translations` copy stays untouched) |
| `src/content.config.ts` | **delete** | The build-time `posts` collection is superseded by the live collection |
| `src/content/posts/*.json` (6) | **delete** | Migrated into `seed/seed.json`; git history preserves them |
| `seed/seed.json` | new | Content model + content (§4) |

### 6.3 Components

| Path | Action | Purpose |
| --- | --- | --- |
| `src/components/PortfolioPage.astro` | edit | `listPosts(language)` → filter `category === 'project'` → `toProjectViewModel`; delete the local `localizeProject` + `getCollection` import |
| `src/components/PortfolioListing.astro` | edit | `listPosts(language)` → `toPostViewModel`; delete `imageMap`, `resolvedPosts` and the `astro:assets` import; **keep the filter markup + vanilla `<script>` exactly as-is** (`data-filter`, `data-category`, `data-portfolio-grid`, `data-portfolio-empty`, `astro:page-load` re-init) |
| `src/components/ProjectsSection.astro` | edit | Drop the `imageMap`; take `media` on `ProjectViewModel` and render via `PostImage`; keep the external `<a href={project.url}>` card markup and `gsap-fade-up` classes |
| `src/components/PostImage.astro` | **new** | Single place for image rendering: `import { Image } from 'emdash/ui'`, `placeholder={false}`, pass-through `class`/`alt`/`loading`. Keeps the 3 call sites identical |
| `src/components/*` (Nav, Skills, Contact, Home, Bio, ThemeToggle, SEOManager, Analytics) | unchanged | No content dependency |
| `src/layouts/Layout.astro` | unchanged | SEO meta, Clarity, GSAP script, ClientRouter, dark-mode bootstrap all stay |
| `src/scripts/gsap-animations.js` | unchanged | Still bootstrapped on `astro:page-load`; class hooks unchanged (verify §9.1) |
| `src/utils/seo.ts` | unchanged | Phase 1 code-level SEO |

### 6.4 Ops and docs

| Path | Action | Purpose |
| --- | --- | --- |
| `astro.config.ts` | edit | §3.1 |
| `wrangler.jsonc` | new | §3.2 |
| `src/worker.ts` | new | §3.3 |
| `package.json` | edit | Deps + scripts + `emdash.seed` (§2, §3.5) |
| `biome.json` | edit | Ignore generated/build output (§3.7) |
| `.env.example` | edit | `EMDASH_ENCRYPTION_KEY`, `EMDASH_SITE_URL` |
| `public/sitemap.xml` | **delete** | Replaced by `src/pages/sitemap.xml.ts` (§4.5) |
| `public/robots.txt` | **delete** | Replaced by `src/pages/robots.txt.ts` |
| `src/pages/sitemap.xml.ts` | new | All public URLs (3 homes, 3 listings, 3×N details) with `hreflang` alternates built from `getRelativeLocaleUrl`; `export const prerender = false` is implicit under `output: 'server'` |
| `src/pages/robots.txt.ts` | new | `User-agent: *` + `Sitemap:` absolute URL from `Astro.site` |
| `emdash-env.d.ts` | new (generated, commit) | Typed collection data for `getEmDashCollection` |
| `README.md` | edit | Stack table (Astro 7 SSR, EmDash, D1/R2, Workers), commands (add `deploy`, `seed:validate`), replace the Pages deployment section |

---

## 7. Local dev workflow

```sh
bun install
bunx emdash secrets generate --write .env   # once per clone
bun run dev                                 # http://localhost:4321
```

- `astro dev` runs the SSR bundle in workerd (Cloudflare vite plugin) with bindings taken from `wrangler.jsonc`: local D1 at `.wrangler/state/v3/d1`, local R2 at `.wrangler/state/v3/r2`, local KV under `.wrangler/state/v3/kv`. No `.dev.vars` needed (the integration loads `EMDASH_ENCRYPTION_KEY` from `.env` into `process.env` during `astro dev`; add it to `.dev.vars` only if that ever changes).
- First run: `http://localhost:4321/_emdash/admin` → setup wizard → **include content**. The wizard posts repeatedly (budget: 500 queries / 5 media downloads per request); keep clicking through until it reports complete. Passkey is registered for `localhost`.
- `emdash-env.d.ts` is written to the repo root once the schema exists and refreshed when the schema changes in dev; commit it.
- EmDash also logs the admin URL + MCP endpoint on startup; the EmDash MCP server lives at `/_emdash/api/mcp` (bearer-token auth, off unless you create an API token) and is unrelated to the existing `astro-mcp` dev integration, which stays.
- Local image transforms: the `IMAGES` binding is simulated locally with a subset of features and warns unless declared `remote: true`. Add `"images": { "binding": "IMAGES", "remote": true }` to `wrangler.jsonc` only if you need to debug real transformations locally.
- Reset a broken local state: `rm -rf .wrangler/state` (D1 + R2 + KV), restart, re-run the wizard.

Verify locally (full list in §9.1): admin loads and lists the 6 posts; the 18 rows exist with correct locales; all 9 routes render; images resolve; the category filter works; dark mode + GSAP intact; `bun run seed:validate` passes.

---

## 8. Deployment workflow

### 8.1 Commands

```sh
git add -A && git commit            # seed + config + code
bun run cloudflare                  # bun install --frozen-lockfile && astro build && wrangler deploy
```

`wrangler deploy` reads `.wrangler/deploy/config.json` (written by the build), which points at the generated `dist/client/wrangler.json` — that is the merged config (user `wrangler.jsonc` + adapter defaults). Nothing extra to pass.

### 8.2 Secrets and vars

```sh
wrangler secret put EMDASH_ENCRYPTION_KEY     # required; value from .env (never commit)
# EMDASH_SITE_URL is NOT needed: astro.config.ts sets siteUrl explicitly.
# CLARITY_ID stays an Astro env var (public, inlined at build time) — no Worker secret needed.
```

### 8.3 Custom domains (replaces the Pages domain)

Order matters: attach the domains **before** running the production setup wizard (passkeys bind to the hostname; `emdash:site_url` is written once).

1. Declare both hostnames in `wrangler.jsonc` `routes` with `custom_domain: true` (apex + `www`) and `bun run cloudflare`. Wrangler creates the proxied DNS records and claims the hostnames; once claimed, the Pages project stops serving them (its custom-domain entries become inert — remove them at leisure).
2. `www` exists only to redirect: `src/worker.ts` 301s `www.jonasperusquia.com` to the apex (path + query preserved) before the Astro handler runs — no zone redirect rule needed. `www` stays in `allowedOrigins` for passkey assertions.
3. With a `routes` entry present, `workers_dev` defaults to disabled; set `"workers_dev": true` only if a workers.dev address is wanted alongside the custom domains.

### 8.4 Cron

- `triggers.crons: ["* * * * *"]` + `scheduled: createScheduledHandler()` in `src/worker.ts` → the sweep runs the scheduled-publish pass, stale-lock recovery, system cleanup and cache-tag invalidation every minute.
- Verify: dashboard → Worker → Triggers/Cron → confirm the trigger exists, and `wrangler tail` while a scheduled entry comes due, expecting `[scheduled] Published N scheduled item(s)`.
- Even without the cron, scheduled entries become visible at query time (EmDash resolves `scheduled_at` in reads) — the sweep is what flips metadata and purges caches. With the KV object cache at `defaultTtl: 300`, worst-case visibility for a due entry is ~5 minutes on a cache hit. Lower `defaultTtl` if you want tighter scheduling.
- Optional Phase 2 (Workers Cache): add `cache: { provider: cacheCloudflare() }` (from `@astrojs/cloudflare/cache`) + `routeRules` for the **public routes only** (`'/'`, `'/es'`, `'/eo'`, `'/portfolio'`, `'/es/portfolio'`, `'/eo/portfolio'`, `'/portfolio/[...slug]'`, `'/es/portfolio/[...slug]'`, `'/eo/portfolio/[...slug]'` — never a catch-all, or `/_emdash/*` responses could be cached) and pass EmDash's `cacheHint` into `Astro.cache.set()`. Only do this after proving publish invalidation (`cache.purge` / `provider.invalidate({ tags })`) — with static route tags, a publish can otherwise serve stale HTML for `maxAge`.

### 8.5 Provisioning reality (learned on the first deploy)

- **D1 + KV auto-provision** on the first `wrangler deploy` (KV namespaces `jonasperusquia-com-session` / `jonasperusquia-com-cache`). Pin the printed IDs in `wrangler.jsonc` right after, so later deploys reconnect deterministically. Pinning a `SESSION` KV binding also makes the Astro adapter skip injecting its own.
- **R2 does not auto-provision.** The bucket must exist first. On an account where R2 was never enabled, enable it in the Cloudflare dashboard (a payment method is required even for the free tier), then:

```sh
wrangler r2 bucket create jonasperusquia-media
```

- EmDash core migrations apply on the Worker's first request (default `auto` mode). Debugging note: the D1 options table is `options` (columns `name` / `value`), not `_emdash_options`.

### 8.6 Backups and rollback

- Backups: EmDash admin → Settings → Backups (`/_emdash/api/settings/backups*`) and/or `bun run db:export` (`wrangler d1 export DB --remote`). Run one immediately after the production wizard.
- Rollback (fast): re-attach the custom domain to the **Pages** project (keep it deployed and untouched until the Worker is verified) → the old static site answers again; D1/R2 data is ignored by the static site, so nothing is lost.
- Rollback (clean): `git revert` the migration commit, `bun run deploy`. The Worker keeps running the previous Astro build; D1 data is additive and untouched. `src/content/posts/*.json` return with the revert.
- Media is the only non-git state: after a clean rollback the site uses the static `imageMap` again (that is why the PNGs stay in the repo in Phase 1).

---

## 9. Verification / test plan

### 9.1 Local

| # | Check | Command / action | Pass condition |
| --- | --- | --- | --- |
| 1 | Seed validity | `bun run seed:validate` | "Seed file is valid", 0 errors |
| 2 | Build/type health | `bun run build` (after setup), `npx @biomejs/biome check` | Build succeeds (no `[404]` route build errors), Biome clean |
| 3 | Admin loads | open `/_emdash/admin` | React SPA hydrates (not stuck on "Loading EmDash…"), 6 posts listed with Category/Order columns |
| 4 | Shared-field sync | admin → Posts → open `Enerlinq` → change a shared field (e.g. `url`) on the **en** entry only, publish; reload `/es/portfolio/enerlinq` | The `es`/`eo` variants show the new shared value (non-translatable field sync). *(Update 2026-10-12: `category` is a taxonomy now — terms are assigned per entry, so the shared-field check uses the remaining shared fields.)* |
| 5 | Edit round-trip | change the `es` summary, publish, reload `/es/portfolio/enerlinq` | New text appears; `/` unchanged |
| 6 | Routes (9) | `/`, `/es`, `/eo`, `/portfolio`, `/es/portfolio`, `/eo/portfolio`, `/portfolio/enerlinq`, `/es/portfolio/enerlinq`, `/eo/portfolio/enerlinq` | All 200, correct localized copy, `lang` attribute correct |
| 7 | 404 | `/portfolio/does-not-exist` | 404 status (`curl -o NUL -w "%{http_code}"`) + rendered 404 page |
| 8 | Fallback | temporarily unpublish the `eo` row, request `/eo/portfolio/enerlinq` | 200 with English body (EmDash fallback), no crash; restore it afterwards |
| 9 | Images | view source on `/portfolio` and a detail page | `<img>` src is `/_image?href=…` (or `/_emdash/api/media/file/…`), correct `alt`, aspect ratio intact, no 500s from `/_image` |
| 10 | Category filter | click All / Projects / Articles on `/portfolio` | Same behaviour as today (6 project cards, empty-state message on Articles) |
| 11 | Dark mode | toggle | No FOUC, classes applied, persistence across navigation |
| 12 | GSAP / View Transitions | navigate `/` → `/portfolio` → detail and back | `gsap-fade-up` / `scale-image` / `skill-card` animations replay; no double-init |
| 13 | Analytics | inspect `<head>` on `/` | Clarity + OneDollarStats tags present (CLARITY_ID still typed via `astro.config.ts`) |
| 14 | SEO meta | view source on a detail page | Title `<entry title> - Portfolio`, description = entry summary, OG/Twitter + hreflang alternates unchanged |
| 15 | Sitemap/robots | `/sitemap.xml`, `/robots.txt` | Sitemap lists all public URLs with alternates; robots points at the absolute sitemap; **not** EmDash's generated variants |
| 16 | Types | `bun run astro sync` / editor | `getEmDashCollection('posts', …)` returns `PostEntryData` (from the committed `emdash-env.d.ts`) |

### 9.2 Production

| # | Check | Action | Pass condition |
| --- | --- | --- | --- |
| 1 | Deploy config | after `bun run cloudflare`, inspect `dist/client/wrangler.json` | `main` = `./src/worker.ts`, `triggers.crons` present, D1/R2/KV bindings + auto-added `IMAGES`/`SESSION`, `assets.binding` set, `compatibility_flags` includes `nodejs_compat` |
| 2 | Wizard on the real hostname | `https://jonasperusquia.com/_emdash/admin` | Setup completes; passkey registered on the apex; wizard posts repeated until `seedComplete` |
| 3 | Data landed | admin → Posts (18 rows) + Media (6 items) | Counts match §5.4 |
| 4 | Public parity | compare `/`, `/portfolio`, one detail page against the Pages deployment | Identical layout/copy; only `<img>` URLs differ |
| 5 | Publish visibility | edit + publish a post, reload | Visible on the first reload (KV epoch bump); worst case ~60s from another region |
| 6 | Scheduled publish | schedule a post ~2 min out, watch `wrangler tail` and the page | Appears at query time; tail logs the sweep; verify the cron trigger exists in the dashboard |
| 7 | Image transform | request a post image, check `Content-Type`/`Cache-Control` | WebP (or original bytes if the `IMAGES` binding is unavailable), long-lived cache headers, no 500 |
| 8 | Admin security | fetch `/_emdash/admin` with `curl` (no session) | Redirects to login; `/` and `/portfolio*` never served from a cached admin response |
| 9 | Cron + 404 | `curl -o NUL -w "%{http_code}" https://jonasperusquia.com/portfolio/nope` | 404 |
| 10 | Backups | run an admin backup / `bun run db:export` | Artifact produced |

---

## 10. Risks & open questions

### 10.1 Risks (6)

| # | Risk | Mitigation |
| --- | --- | --- |
| R1 | **Wizard seed budget** — 6 `$media` downloads exceed the per-request budget (5), so setup needs ≥2 wizard rounds; a partially-applied seed can look "done" to a tired operator | Design accounts for it (§5.2/§5.3 step 3: keep going until "complete"); §5.4 gives the exact expected row counts to check; the seed is resumable and `skip`-safe |
| R2 | **`$media.url` unreachable at setup** (private repo / localhost) | Commit-pinned raw GitHub URLs, or the temporary `public/seed-media/` fallback (§4.3). Set up *before* deleting the fallback copies; never re-run the wizard with `update` |
| R3 | **Custom `main` ignored** → no `scheduled()` handler → cron is a no-op | Verified pattern: the adapter respects `config.main`. Check `main`/`triggers` in `dist/client/wrangler.json` after the build (§9.2#1). If it ever regresses, scheduled content still goes live at query time — only metadata/cache purge lag |
| R4 | **D1/R2 auto-provisioning refused** on first deploy | §8.5: create resources explicitly, pin ids, redeploy |
| R5 | **Image pipeline change** — dropping `imageService: 'compile'` moves all image work to runtime | EmDash's endpoint reads from R2 and uses the auto-added `IMAGES` binding (free plan includes 5,000 unique transformations/month); degrades to streaming the original bytes; re-verify LCP-ish behaviour in §9.2#7 |
| R6 | **Passkey/hostname lock-in** — setup on the wrong hostname locks the admin to it; losing the last passkey locks editors out | Run setup only on the final apex hostname; `allowedOrigins` includes `www`; keep the admin user in a password manager; recovery path = a second passkey per editor + EmDash's invite flow |

### 10.2 Open questions (recommendations in **bold**)

> **Resolved 2026-10-12:** Q1 → repo is public, use commit-pinned raw GitHub URLs. Q3 → apex canonical, 301 `www` → apex. Q2, Q4, Q5, Q6 → adopted as recommended. The table below is kept for rationale.

| # | Question | Recommendation |
| --- | --- | --- |
| Q1 | Is `jonaspm/jonasperusquia.com` **public** on GitHub? Every `$media.url` strategy depends on it | Public → **commit-pinned raw URLs**. Private → temporary `public/seed-media/` copies (§4.3). Confirm before writing the seed |
| Q2 | OK to remove `imageService: 'compile'` (runtime transforms via the Images binding instead of build-time sharp)? | **Yes** — build-time optimization cannot apply to R2-hosted media; the free 5,000 transformations/month cover this site with room to spare (§4.3) |
| Q3 | Should `www.jonasperusquia.com` keep serving, or redirect to the apex? | **Apex canonical, 301 `www` → apex.** `www` stays in `allowedOrigins` so passkeys keep working if anyone uses it |
| Q4 | Enable the KV object cache (adds a KV namespace; up to ~60s staleness for other isolates; bounds scheduled-publish visibility to `defaultTtl`) | **Yes, ship with `kvCache` + `defaultTtl: 300`.** D1 read pressure drops to near zero and invalidation is publish-aware; drop to ~60 if 5-minute scheduled-publish latency matters |
| Q5 | Add `supports: ['seo']` now and wire EmDash SEO fields into `Layout`, or keep code-level SEO? | **Keep code-level SEO for Phase 1** (byte-identical output, no unhonoured admin panel); add the panel + `getSeoMeta` wiring in Phase 2 if editors ask |
| Q6 | Bodies stay single-paragraph plain text, or upgrade to `portableText` now? | **Plain `text` (textarea) now** — today's content is one sentence rendered as one `<p>`; switching to PortableText changes the detail-page markup for no editorial benefit. Migrate the single field later if real long-form articles appear |
