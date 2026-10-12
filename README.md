# jonasperusquia.com

Personal portfolio site built with [Astro](https://astro.build) and Tailwind CSS, with content managed in [EmDash](https://emdash.cms) and deployed as a Cloudflare Worker.

## Tech Stack

- **Framework**: Astro 7 (SSR, on-demand rendering)
- **CMS**: EmDash 1.2 (admin at `/_emdash/admin`, passkey auth)
- **Data**: Cloudflare D1 (content) + R2 (media) + KV (object cache)
- **Styling**: Tailwind CSS v4
- **Animations**: GSAP + ScrollTrigger
- **Lint & Format**: Biome
- **Package Manager**: Bun
- **Analytics**: Clarity + OneDollarStats
- **Hosting**: Cloudflare Workers

## Getting Started

```sh
# Install dependencies
bun install

# Generate the local EmDash encryption key into .env (once per clone)
bunx emdash secrets generate --write .env

# Validate the seed file (schema + content)
bun run seed:validate

# Start dev server (http://localhost:4321)
bun run dev

# Production build
bun run build

# Preview production build
bun run preview
```

First run: open `http://localhost:4321/_emdash/admin` and complete the setup wizard
with "include content" so `seed/seed.json` is applied to the local D1/R2 state
under `.wrangler/state`. Local bindings come from `wrangler.jsonc`.

## Project Structure

```
seed/
└── seed.json          # EmDash collection schema + 18 localized posts
src/
├── assets/
│   ├── data/          # skills.json, social-networks.json
│   └── images/        # legacy screenshots (kept for rollback; media now lives in R2)
├── components/        # Astro components (sections, PostDetail, PostImage, nav, SEO)
├── layouts/
│   └── Layout.astro   # base layout (meta, nav, footer, analytics)
├── pages/
│   ├── index.astro    # English (default locale, no prefix)
│   ├── 404.astro      # localized not-found page
│   ├── sitemap.xml.ts # public sitemap with hreflang alternates
│   └── es/, eo/       # Spanish / Esperanto routes
├── scripts/
│   └── gsap-animations.js
├── styles/
│   └── global.css     # Tailwind v4 config + custom theme
├── utils/
│   ├── emdash-posts.ts # EmDash reads + view-model mapping
│   ├── i18n.ts        # translations (en + es + eo)
│   └── seo.ts         # per-page SEO configuration
├── live.config.ts     # Astro live collection backed by EmDash
└── worker.ts          # Cloudflare Worker entry (Astro handler + cron sweep)
```

## Localization

English at `/`, Spanish at `/es/`, Esperanto at `/eo/`. UI strings live in
`src/utils/i18n.ts`; post translations are separate EmDash entries (one per
locale, joined by a translation group) managed in the admin.

## Deployment

```sh
# One-time: store the encryption key as a Worker secret
wrangler secret put EMDASH_ENCRYPTION_KEY

# Deploy (frozen install + build + wrangler deploy)
bun run cloudflare
```

Requirements:

1. The custom domain (`jonasperusquia.com`) is attached to the Worker **before**
   the production setup wizard runs — passkeys bind to the hostname.
2. D1 (`DB`) and R2 (`MEDIA`) bindings are auto-provisioned on first deploy; if
   the account refuses, create them with `wrangler d1 create` /
   `wrangler r2 bucket create` and pin the ids in `wrangler.jsonc`.
3. `bun run db:export` writes a D1 backup to `backups/` (gitignored).

## License

Source code available under the [MIT License](LICENSE).
